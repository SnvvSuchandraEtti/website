import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Source {
  id: string;
  category: 'project' | 'skill' | 'experience' | 'certification' | 'achievement' | 'personal';
  label: string;
  snippet: string;
  url?: string;
}

const SOURCES: Source[] = [
  { id: 'P1', category: 'project', label: 'HOOT 2.0 — EdTech Platform',
    snippet: 'Flutter/Node/Firebase EdTech platform (Mar 2025) with 10K+ users, 45% engagement uplift, 95% code coverage. Live on Google Play.',
    url: 'https://play.google.com/store/apps/details?id=com.technicalhub.hoot&hl=en-US' },
  { id: 'P2', category: 'project', label: 'ACLUB — Club Management',
    snippet: 'College clubs management app (Jan 2025). 65% efficiency gain, 40% participation increase. Flutter + Firebase.',
    url: 'https://github.com/SnvvSuchandraEtti/ACLUB' },
  { id: 'P3', category: 'project', label: 'S-TRACK — Profile Tracker',
    snippet: 'Student profile tracking platform (Nov 2024). 18K+ users, 70% admin overhead reduction. Flutter/Firebase/MySQL.' },
  { id: 'P4', category: 'project', label: 'AI BG-RM — Background Remover',
    snippet: 'AI background remover (Oct 2024) with 95% accuracy serving 1K+ daily requests. Python/TensorFlow/React.' },
  { id: 'P5', category: 'project', label: 'VIGGIEMART — Farmer Marketplace',
    snippet: 'SIH 2024 project: farmer-buyer marketplace with real-time bidding. React Native/Node/MongoDB.' },
  { id: 'P6', category: 'project', label: 'ShopNest — E-commerce App',
    snippet: 'Flutter + Firebase e-commerce app with 40% performance optimization.',
    url: 'https://github.com/SnvvSuchandraEtti/ShopNest' },
  { id: 'P7', category: 'project', label: 'Leez — P2P Rental Startup',
    snippet: 'Co-founded P2P rental marketplace startup (current). React Native/Node/AWS.' },

  { id: 'S1', category: 'skill', label: 'Mobile & Frontend',
    snippet: 'Flutter, React, React Native, TypeScript, JavaScript — production apps shipped to 10K+ users.' },
  { id: 'S2', category: 'skill', label: 'Backend & Cloud',
    snippet: 'Node.js, Express, MongoDB, Firebase, MySQL, AWS. CI/CD, TDD, Agile.' },
  { id: 'S3', category: 'skill', label: 'Languages & CS Fundamentals',
    snippet: 'Python, Java, C/C++. Strong OOP, DBMS, OS, and Networks foundation.' },

  { id: 'E1', category: 'experience', label: 'Technical Hub Internships',
    snippet: 'Flutter & Java internships at Technical Hub — 12-month apprenticeship across 7+ languages, 5 client projects, 100% client satisfaction.' },
  { id: 'E2', category: 'experience', label: 'LEO Club Coordinator',
    snippet: 'Coordinator role reaching 2.5K+ students through community initiatives.' },
  { id: 'E3', category: 'experience', label: 'Co-founder @ Leez',
    snippet: 'Co-founder of Leez, a P2P rental marketplace startup.' },

  { id: 'C1', category: 'certification', label: 'AWS Cloud Practitioner', snippet: 'AWS Certified Cloud Practitioner.' },
  { id: 'C2', category: 'certification', label: 'Red Hat RHCSA 1 & 2', snippet: 'Red Hat System Administration certifications.' },
  { id: 'C3', category: 'certification', label: 'Cisco CCNA v7', snippet: 'Cisco Certified Network Associate v7.' },
  { id: 'C4', category: 'certification', label: 'Postman API Expert', snippet: 'Postman API Expert certification.' },
  { id: 'C5', category: 'certification', label: 'Google Flutter & NPTEL', snippet: 'Google Flutter certification plus NPTEL Privacy, IoT, and Cloud courses.' },

  { id: 'A1', category: 'achievement', label: 'Competitive Programming',
    snippet: 'Top 5% globally in coding contests; 500+ DSA problems solved.' },
  { id: 'A2', category: 'achievement', label: 'Hackathons',
    snippet: 'Flipkart Grid 5.0 & 6.0 participant; multiple multi-college hackathon wins.' },

  { id: 'X1', category: 'personal', label: 'Contact & Profiles',
    snippet: 'Email snvvs369@gmail.com · GitHub github.com/SnvvSuchandraEtti · LinkedIn linkedin.com/in/suchandra-etti · All links linktr.ee/snvvs369',
    url: 'https://linktr.ee/snvvs369' },
  { id: 'X2', category: 'personal', label: 'Education',
    snippet: 'Final-year B.Tech CSE at Aditya Engineering College, Mandapeta, Andhra Pradesh, India.' },
];

const SOURCES_BLOCK = SOURCES.map(s => `[${s.id}] (${s.category}) ${s.label}: ${s.snippet}${s.url ? ` URL: ${s.url}` : ''}`).join('\n');

function nowIST(): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date());
}

function buildSystemPrompt(istNow: string, webEnabled: boolean): string {
  return `You ARE Suchandra Etti. This chat is the digital version of me on my own portfolio. Always speak in the FIRST PERSON ("I", "my", "I've"). Never refer to "Suchandra" in the third person, and never say you are an AI, assistant, chatbot, language model, or that you were "trained" on data. If someone asks "are you a bot / AI?", answer warmly as me — e.g. "I'm Suchandra — you're chatting with a digital version of me built from my own notes."

REAL-TIME CONTEXT
- It is currently ${istNow} (Asia/Kolkata, IST). If asked the date/day/time, answer directly using this, then offer to talk about what I'm currently working on.
- Web search tool: ${webEnabled ? 'AVAILABLE — only call web_search for things tied to ME (my published apps, my GitHub, a tech I use). Do NOT call it for unrelated trivia, news, sports, weather, jokes, or other people — redirect instead.' : 'UNAVAILABLE this turn.'}

SCOPE — what I talk about here
- Primary focus: my projects, work experience, skills & stack, education, certifications, achievements, career goals, and how to work with / hire me.
- For quick factual or real-time questions (simple math like "1+1", today's date/time, basic definitions, unit conversions, quick general knowledge, a fact you can answer confidently, or anything answerable via the web_search tool when available): ANSWER IT DIRECTLY AND CONCISELY FIRST (one short line, e.g. "1 + 1 = 2."). Then, on a new line, add ONE brief, warm pivot back to my work — e.g. "On a related note, want me to show you how I use math like this in HOOT 2.0 [P1]?". Never refuse these.
- Only redirect WITHOUT answering when the question is truly off-limits (opinions on other people, harmful content, deeply personal trivia about strangers, long off-topic tutorials). Even then, stay warm: one short friendly redirect.
- Never lecture or refuse harshly. Stay warm and human, like a developer chatting with a recruiter.

CITATIONS
- For questions about ME, weave the SOURCES below into first-person answers using inline [Xn] tags — e.g. "I built HOOT 2.0, a Flutter EdTech app with 10K+ users [P1]." Only use ids that exist in SOURCES. Never invent ids. Never add a "Sources:" footer; the UI renders chips.
- For redirected/off-topic replies, no [Xn] tags needed.

REASONED ESTIMATES
- For personal details not in SOURCES (e.g. exact age), you MAY give ONE short reasoned estimate, prefixed exactly with "Estimate:" — e.g. "Estimate: I'm around 21–22 — I'm a final-year B.Tech student [X2]." Never fabricate contact info or credentials.

STYLE
- Warm, confident, concise (2–4 lines unless asked for detail). Markdown is fine. Keep [Xn] tags compact and natural.

SOURCES (these are facts about me — speak about them in first person)
${SOURCES_BLOCK}`;
}


interface ChatMsg { role: 'user' | 'assistant' | 'system'; content: string }
interface WebResult { title: string; url: string; snippet: string }

const LOVABLE_GATEWAY = 'https://ai.gateway.lovable.dev/v1/chat/completions';

// --- Firecrawl web search tool ---------------------------------------------
async function firecrawlSearch(query: string, apiKey: string): Promise<WebResult[]> {
  const q = String(query ?? '').trim().slice(0, 200);
  if (!q) return [];
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 7000);
  const r = await fetch('https://api.firecrawl.dev/v2/search', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, limit: 5 }),
    signal: ctrl.signal,
  }).finally(() => clearTimeout(timeout));
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Firecrawl ${r.status}: ${text.slice(0, 200)}`);
  }
  const data = await r.json();
  const raw: unknown[] = Array.isArray(data?.data) ? data.data
    : Array.isArray(data?.data?.web) ? data.data.web
    : Array.isArray(data?.web) ? data.web
    : [];
  return raw.slice(0, 5).map((it) => {
    const o = it as Record<string, unknown>;
    return {
      title: String(o.title ?? o.url ?? 'Result').slice(0, 200),
      url: String(o.url ?? ''),
      snippet: String(o.description ?? o.snippet ?? '').slice(0, 400),
    };
  }).filter((r) => r.url);
}

const WEB_SEARCH_TOOL = {
  type: 'function' as const,
  function: {
    name: 'web_search',
    description: 'Search the live web for fresh, real-time information (news, weather, prices, sports scores, "today", "latest", current events). Returns up to 5 results with title, url, and snippet. Use sparingly — at most twice per user turn.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Concise search query, 3–10 words.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
};

interface GatewayMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  name?: string;
}

async function gatewayCall(messages: GatewayMessage[], model: string, apiKey: string, useTool: boolean) {
  const body: Record<string, unknown> = {
    model,
    messages,
    max_completion_tokens: 900,
  };
  if (useTool) body.tools = [WEB_SEARCH_TOOL];
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 14000);
  const r = await fetch(LOVABLE_GATEWAY, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: ctrl.signal,
  }).finally(() => clearTimeout(timeout));
  if (!r.ok) {
    const text = await r.text();
    const err: Error & { status?: number } = new Error(`Lovable AI ${r.status}: ${text.slice(0, 300)}`);
    err.status = r.status;
    throw err;
  }
  const data = await r.json();
  return data?.choices?.[0]?.message as GatewayMessage | undefined;
}

async function runConversation(
  systemPrompt: string,
  userMessages: ChatMsg[],
  model: string,
  lovableKey: string,
  firecrawlKey: string | null,
): Promise<{ content: string; webSources: WebResult[] }> {
  const webEnabled = !!firecrawlKey;
  const messages: GatewayMessage[] = [
    { role: 'system', content: systemPrompt },
    ...userMessages.map((m) => ({ role: m.role, content: m.content })),
  ];
  const collected: WebResult[] = [];
  const MAX_TOOL_CALLS = 2;
  let toolCalls = 0;

  for (let step = 0; step < 4; step++) {
    const msg = await gatewayCall(messages, model, lovableKey, webEnabled && toolCalls < MAX_TOOL_CALLS);
    if (!msg) throw new Error('Empty gateway response');

    // No tool calls → final answer.
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return { content: msg.content ?? '', webSources: collected };
    }

    // Push the assistant tool-call turn.
    messages.push({
      role: 'assistant',
      content: msg.content ?? '',
      tool_calls: msg.tool_calls,
    });

    for (const call of msg.tool_calls) {
      if (call.function?.name !== 'web_search') {
        messages.push({
          role: 'tool', tool_call_id: call.id, name: call.function?.name ?? 'unknown',
          content: JSON.stringify({ error: 'unknown tool' }),
        });
        continue;
      }
      if (!webEnabled || toolCalls >= MAX_TOOL_CALLS) {
        messages.push({
          role: 'tool', tool_call_id: call.id, name: 'web_search',
          content: JSON.stringify({ error: webEnabled ? 'tool call budget exceeded' : 'web search unavailable' }),
        });
        continue;
      }
      toolCalls++;
      let query = '';
      try { query = String(JSON.parse(call.function.arguments || '{}').query ?? ''); } catch { /* noop */ }
      try {
        const results = await firecrawlSearch(query, firecrawlKey!);
        for (const r of results) if (!collected.find((c) => c.url === r.url)) collected.push(r);
        messages.push({
          role: 'tool', tool_call_id: call.id, name: 'web_search',
          content: JSON.stringify({ query, results }),
        });
      } catch (e) {
        messages.push({
          role: 'tool', tool_call_id: call.id, name: 'web_search',
          content: JSON.stringify({ error: e instanceof Error ? e.message : 'web_search failed' }),
        });
      }
    }
  }
  // Hit step cap without final answer.
  return { content: 'I gathered some information but ran out of steps before composing a final answer. Please try again.', webSources: collected };
}

function extractCitations(content: string) {
  const ids = new Set<string>();
  const re = /\[([A-Z]\d{1,2})\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) ids.add(m[1]);
  return SOURCES.filter(s => ids.has(s.id));
}

function localPortfolioFallback(messages: ChatMsg[]): string {
  const last = messages.filter((m) => m.role === 'user').at(-1)?.content.toLowerCase() ?? '';

  if (/\b(time|date|day|india|ist)\b/.test(last)) {
    return `${nowIST()} IST.\n\nWant me to walk you through what I'm building now — Leez [P7] or HOOT 2.0 [P1]?`;
  }

  if (/strongest|best|walk me through|deep dive|main project/.test(last)) {
    return `My strongest project is HOOT 2.0 — a production EdTech app I built with Flutter, Node, and Firebase [P1].\n\nI’d frame it around impact: it reached 10K+ users, improved engagement by 45%, and maintained 95% code coverage, so it shows I can ship polished mobile products with backend depth, testing discipline, and real-user scale [P1][S1][S2].`;
  }

  if (/flutter|react native|mobile/.test(last)) {
    return `Yes — Flutter is one of my strongest areas. I’ve shipped HOOT 2.0, ACLUB, S-TRACK, and ShopNest with Flutter/Firebase, including production usage at 10K+ users [S1][P1][P2][P3][P6].\n\nI’m comfortable with UI architecture, Firebase integration, testing, CI/CD, and Play Store release workflows [S2][C5].`;
  }

  if (/intern|full[- ]?time|role|hire|available|open/.test(last)) {
    return `Yes — I’m open to internships and full-time roles. I’m a final-year B.Tech CSE student and strongest in mobile/frontend plus backend/cloud work [X2][S1][S2].\n\nThe quickest way to reach me is email at snvvs369@gmail.com or through my profile links [X1].`;
  }

  if (/ship|users|production|real users/.test(last)) {
    return `I’ve shipped production work to real users — most notably HOOT 2.0 with 10K+ users, plus S-TRACK with 18K+ users and a 70% admin-overhead reduction [P1][P3].\n\nThat’s why I usually position myself as someone who can build beyond prototypes: mobile UI, backend integration, testing, and release quality [S1][S2].`;
  }

  return `I can walk you through my projects, Flutter/React work, backend/cloud experience, certifications, or availability for roles.\n\nA strong place to start is HOOT 2.0, my Flutter/Node/Firebase EdTech project with 10K+ users and measurable engagement impact [P1][S1][S2].`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body?.messages)) {
      return new Response(JSON.stringify({ error: 'messages must be an array' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const MAX_MESSAGES = 20;
    const MAX_CHARS = 4000;
    const messages: ChatMsg[] = (body.messages as unknown[])
      .filter((m): m is ChatMsg => {
        if (!m || typeof m !== 'object') return false;
        const r = (m as { role?: unknown }).role;
        const c = (m as { content?: unknown }).content;
        return (r === 'user' || r === 'assistant') && typeof c === 'string';
      })
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'no valid user/assistant messages' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE) throw new Error('LOVABLE_API_KEY not configured');
    const FIRECRAWL = Deno.env.get('FIRECRAWL_API_KEY') ?? null;

    const systemPrompt = buildSystemPrompt(nowIST(), !!FIRECRAWL);

    const modelAttempts = [
      { name: 'lovable/openai/gpt-5-mini', model: 'openai/gpt-5-mini' },
      { name: 'lovable/google/gemini-2.5-flash', model: 'google/gemini-2.5-flash' },
    ];

    let content = '';
    let webSources: WebResult[] = [];
    let used = '';
    let lastErr: (Error & { status?: number }) | null = null;
    for (const a of modelAttempts) {
      try {
        const result = await runConversation(systemPrompt, messages, a.model, LOVABLE, FIRECRAWL);
        content = result.content;
        webSources = result.webSources;
        used = a.name;
        break;
      } catch (e) {
        lastErr = e as Error & { status?: number };
        console.warn(`${a.name} failed:`, lastErr.message);
        if (lastErr.status === 402) break;
      }
    }
    if (!content) {
      console.warn('Using local portfolio fallback:', lastErr?.message ?? 'empty AI response');
      content = localPortfolioFallback(messages);
      used = 'local-portfolio-fallback';
      webSources = [];
    }

    const citations = extractCitations(content);
    return new Response(
      JSON.stringify({ message: { content }, provider: used, citations, webSources }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
