import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectInput {
  projectId: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  metrics?: string[];
}

function buildPrompt(p: ProjectInput): string {
  return `Write a punchy 2-sentence visitor-facing summary for this portfolio project. Highlight real impact + key tech. No marketing fluff, no emojis, no preamble — just the summary.

Project: ${p.title}
Description: ${p.description}
${p.longDescription ? `Details: ${p.longDescription}\n` : ''}Tech: ${p.technologies.join(', ')}
${p.metrics?.length ? `Metrics: ${p.metrics.join('; ')}` : ''}`;
}

async function lovableGen(prompt: string, model: string, apiKey: string): Promise<string> {
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 140,
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    const err: Error & { status?: number } = new Error(`Lovable AI ${r.status}: ${text}`);
    err.status = r.status;
    throw err;
  }
  const data = await r.json();
  return (data.choices?.[0]?.message?.content ?? '').trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const raw = (await req.json()) as Partial<ProjectInput> & { force?: unknown };

    // Allowlist of known project IDs — prevents arbitrary writes to project_summaries.
    const ALLOWED_PROJECT_IDS = new Set([
      'hoot-edtech', 'aclub-management', 's-track', 'ai-bg-remover',
      'viggiemart-marketplace', 'shopnest-ecommerce', 'leez-marketplace',
      // legacy ids previously cached
      'hoot',
    ]);

    if (!raw.projectId || typeof raw.projectId !== 'string' || !ALLOWED_PROJECT_IDS.has(raw.projectId)) {
      return new Response(JSON.stringify({ error: 'unknown projectId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!raw.title || typeof raw.title !== 'string') {
      return new Response(JSON.stringify({ error: 'title required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const clamp = (v: unknown, n: number) => typeof v === 'string' ? v.slice(0, n) : '';
    const clampArr = (v: unknown, max: number, perItem: number) =>
      Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, max).map((x) => (x as string).slice(0, perItem)) : [];

    const input: ProjectInput = {
      projectId: raw.projectId,
      title: clamp(raw.title, 120),
      description: clamp(raw.description, 600),
      longDescription: clamp(raw.longDescription, 2000),
      technologies: clampArr(raw.technologies, 30, 40),
      metrics: clampArr(raw.metrics, 20, 120),
    };
    // `force` is ignored from public callers to prevent cache-busting / overwrite abuse.
    const force = false;


    const supaUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supaUrl, serviceKey);

    if (!force) {
      const { data: cached } = await supabase
        .from('project_summaries')
        .select('summary, model')
        .eq('project_id', input.projectId)
        .maybeSingle();
      if (cached?.summary) {
        return new Response(
          JSON.stringify({ summary: cached.summary, model: cached.model, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const LOVABLE = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE) throw new Error('LOVABLE_API_KEY not configured');

    const prompt = buildPrompt(input);
    const attempts = [
      { name: 'lovable/openai/gpt-5-mini', fn: () => lovableGen(prompt, 'openai/gpt-5-mini', LOVABLE) },
      { name: 'lovable/google/gemini-2.5-flash', fn: () => lovableGen(prompt, 'google/gemini-2.5-flash', LOVABLE) },
    ];

    let summary = '';
    let model = '';
    let lastErr: (Error & { status?: number }) | null = null;
    for (const a of attempts) {
      try {
        summary = await a.fn();
        model = a.name;
        break;
      } catch (e) {
        lastErr = e as Error & { status?: number };
        console.warn(`${a.name} failed:`, lastErr.message);
        if (lastErr.status === 402) break;
      }
    }
    if (!summary) {
      const status = lastErr?.status ?? 500;
      return new Response(JSON.stringify({ error: lastErr?.message ?? 'All providers failed' }), {
        status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('project_summaries').upsert({
      project_id: input.projectId,
      summary,
      model,
      updated_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ summary, model, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('project-summary error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
