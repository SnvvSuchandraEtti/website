// Secure proxy to Cartesia TTS with multi-voice fallback chain.
// Tries voice slots 1 → 4 in order; on credit / quota exhaustion or rate-limit
// the slot is cooled-down and the next one is attempted. When all four slots
// are unavailable the function returns 503 so the client can fall back to
// browser speechSynthesis.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Expose-Headers': 'X-TTS-Slot',
};

const MAX_TEXT = 1500;

// Best-effort per-IP rate limit on this proxy (per warm instance).
const RL_WINDOW_MS = 60_000;
const RL_MAX = 20;
const hits = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RL_MAX;
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

interface Slot {
  index: number;
  envKey: string;
  voiceId: string;
}

// Ordered fallback chain. Voice IDs are not secret — only API keys are.
const SLOT_DEFS: Slot[] = [
  { index: 1, envKey: 'CARTESIA_API_KEY',   voiceId: '624a4e9f-e98f-4476-bcc0-e61df4a13667' },
  { index: 2, envKey: 'CARTESIA_API_KEY_2', voiceId: '78c5f916-837e-4a95-9f4c-0d78859cbd34' },
  { index: 3, envKey: 'CARTESIA_API_KEY_3', voiceId: 'ff0601d1-af36-48c8-9234-b8deb4803733' },
  { index: 4, envKey: 'CARTESIA_API_KEY_4', voiceId: 'a2764064-de76-407f-b571-bf21f2888f06' },
];

// Per-warm-instance exhaustion tracking. Best-effort only.
const cooldownUntil = new Map<number, number>(); // slot index -> epoch ms

const COOLDOWN_CREDITS_MS = 6 * 60 * 60 * 1000; // 6h for quota / 402 / 403
const COOLDOWN_RATELIMIT_MS = 60 * 1000;        // 1m for 429

function isExhausted(idx: number): boolean {
  const until = cooldownUntil.get(idx);
  return !!until && until > Date.now();
}

function markExhausted(idx: number, ms: number, reason: string) {
  cooldownUntil.set(idx, Date.now() + ms);
  console.warn(`[tts-cartesia] slot ${idx} exhausted for ${Math.round(ms / 1000)}s (${reason})`);
}

async function callCartesia(slot: Slot, apiKey: string, text: string) {
  return await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Cartesia-Version': '2024-11-13',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'sonic-2',
      transcript: text,
      voice: { mode: 'id', id: slot.voiceId },
      output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 },
      language: 'en',
    }),
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonError(405, 'method not allowed');

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimit(ip)) return jsonError(429, 'Too many requests — try again in a minute.');

  let body: { text?: unknown };
  try { body = await req.json(); } catch { return jsonError(400, 'invalid JSON'); }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return jsonError(400, 'text is required');
  const safeText = text.slice(0, MAX_TEXT);

  let lastStatus = 0;
  let lastDetail = '';

  for (const slot of SLOT_DEFS) {
    const apiKey = Deno.env.get(slot.envKey);
    if (!apiKey) {
      console.warn(`[tts-cartesia] slot ${slot.index}: ${slot.envKey} not configured, skipping`);
      continue;
    }
    if (isExhausted(slot.index)) {
      console.log(`[tts-cartesia] slot ${slot.index} on cooldown, skipping`);
      continue;
    }

    try {
      const upstream = await callCartesia(slot, apiKey, safeText);

      if (upstream.ok && upstream.body) {
        console.log(`[tts-cartesia] slot ${slot.index} OK`);
        return new Response(upstream.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-store',
            'X-TTS-Slot': String(slot.index),
          },
        });
      }

      const detail = await upstream.text().catch(() => '');
      lastStatus = upstream.status;
      lastDetail = detail.slice(0, 300);
      console.warn(`[tts-cartesia] slot ${slot.index} failed ${upstream.status}: ${lastDetail}`);

      const looksQuota = /insufficient|quota|credit|exhaust|payment/i.test(detail);
      if (upstream.status === 402 || upstream.status === 403 || looksQuota) {
        markExhausted(slot.index, COOLDOWN_CREDITS_MS, `http ${upstream.status} quota-like`);
        continue;
      }
      if (upstream.status === 429) {
        markExhausted(slot.index, COOLDOWN_RATELIMIT_MS, 'http 429');
        continue;
      }
      // 4xx (auth / bad request) — also try the next slot but don't long-cooldown.
      if (upstream.status === 401) {
        markExhausted(slot.index, COOLDOWN_CREDITS_MS, 'http 401 auth');
      }
      // 5xx or other: try next slot without marking exhausted.
      continue;
    } catch (e) {
      lastDetail = e instanceof Error ? e.message : 'network error';
      console.warn(`[tts-cartesia] slot ${slot.index} network error: ${lastDetail}`);
      // transient: try next slot
      continue;
    }
  }

  console.error(`[tts-cartesia] all slots failed (last ${lastStatus}: ${lastDetail})`);
  return new Response(
    JSON.stringify({ error: 'tts_exhausted', detail: lastDetail || `last status ${lastStatus}` }),
    { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
