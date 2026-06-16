// JD → Tailored Pitch
// Recruiter pastes a job description; we return a structured pitch grounded in
// real projects/skills/experience. Single-shot, JSON response, no streaming.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Condensed canonical context — mirror of src/data/* but trimmed for prompt budget.
const PROJECTS = [
  { id: "hoot-edtech", title: "HOOT 2.0 — EdTech Platform", stack: ["Flutter","Node.js","Express","Firebase","REST","CI/CD"], summary: "EdTech app, 10K+ users, +45% engagement, 95% code coverage." },
  { id: "aclub-management", title: "ACLUB — College Clubs", stack: ["Flutter","Firebase","Material Design","Cloud Functions"], summary: "Clubs mgmt; +65% workflow efficiency, +40% participation." },
  { id: "s-track", title: "S-TRACK — Profile Tracker", stack: ["Flutter","Firebase","MySQL"], summary: "Student tracker, 18K+ users, −70% admin overhead." },
  { id: "ai-bg-remover", title: "AI BG-RM — Background Remover", stack: ["Python","TensorFlow","React"], summary: "AI bg remover, 95% accuracy, 1K+ daily requests." },
  { id: "viggiemart-marketplace", title: "VIGGIEMART — Farmer Marketplace", stack: ["React Native","Node.js","MongoDB"], summary: "SIH 2024 marketplace with real-time bidding." },
  { id: "shopnest-ecommerce", title: "ShopNest — E-commerce App", stack: ["Flutter","Firebase"], summary: "E-com app, +40% perf optimization." },
  { id: "leez-marketplace", title: "Leez — P2P Rentals (Co-founder)", stack: ["React Native","Node.js","AWS"], summary: "Co-founded P2P rental marketplace startup." },
];

const SKILLS = [
  "Flutter","React","React Native","TypeScript","JavaScript","Node.js","Express",
  "Python","Java","C","C++","Firebase","MongoDB","MySQL","AWS","Git","CI/CD",
  "REST APIs","TensorFlow","Material Design","Figma","Agile","TDD",
];

const EXPERIENCE =
  "Technical Hub Flutter & Java internships (12mo apprenticeship, 7+ languages, 5 client projects, 100% client satisfaction). LEO Club coordinator (2.5K+ students reached). Co-founder @ Leez.";

const CERTS =
  "AWS Cloud Practitioner; Red Hat RHCSA 1 & 2; Cisco CCNA v7; Postman API Expert; Google Flutter; NPTEL Privacy/IoT/Cloud.";

const SYSTEM = `You are an assistant that writes a recruiter-grade pitch for Suchandra Etti, a final-year B.Tech CSE student and full-stack/mobile engineer based in Andhra Pradesh, India. He has shipped Flutter & React apps to 28,000+ users.

You will be given a job description (JD). Return STRICT JSON matching this TypeScript type:

{
  "pitch": [string, string, string],            // exactly 3 short bullets, first-person ("I ..."), each 1–2 sentences, grounded in the data below
  "projectIds": string[],                       // 1–3 project ids from the PROJECTS list, most relevant first
  "skillMatches": { "skill": string, "reason": string }[],  // up to 6, skills MUST come from the SKILLS list, reason ≤ 100 chars
  "gaps": string[],                             // 1–2 honest gaps vs the JD + how I'd close them, ≤ 140 chars each
  "roleFit": string                             // one short line on overall fit, ≤ 120 chars
}

Rules:
- ONLY use project ids that exist in PROJECTS.
- ONLY use skill names that exist in SKILLS (exact strings).
- Speak as Suchandra in first person in "pitch" and "gaps".
- Be specific. Reference real metrics from PROJECTS when relevant.
- No markdown, no prose outside the JSON. No backticks. No code fences.
- If the JD is unrelated/empty/spam, still return valid JSON with a polite roleFit and best-effort matches.

PROJECTS:
${PROJECTS.map(p => `- ${p.id} | ${p.title} | stack: ${p.stack.join(", ")} | ${p.summary}`).join("\n")}

SKILLS: ${SKILLS.join(", ")}

EXPERIENCE: ${EXPERIENCE}

CERTIFICATIONS: ${CERTS}`;

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface PitchResult {
  pitch: string[];
  projectIds: string[];
  skillMatches: { skill: string; reason: string }[];
  gaps: string[];
  roleFit: string;
}

function tryParseJSON(text: string): PitchResult | null {
  try {
    return JSON.parse(text) as PitchResult;
  } catch {
    // Try to recover JSON from a fenced/wrapped response.
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]) as PitchResult; } catch { /* noop */ }
    }
    return null;
  }
}

function sanitize(result: PitchResult): PitchResult {
  const validIds = new Set(PROJECTS.map(p => p.id));
  const validSkills = new Set(SKILLS.map(s => s.toLowerCase()));
  return {
    pitch: (result.pitch ?? []).filter(s => typeof s === "string").slice(0, 3),
    projectIds: (result.projectIds ?? []).filter(id => validIds.has(id)).slice(0, 3),
    skillMatches: (result.skillMatches ?? [])
      .filter(m => m && typeof m.skill === "string" && validSkills.has(m.skill.toLowerCase()))
      .map(m => ({ skill: m.skill, reason: String(m.reason ?? "").slice(0, 140) }))
      .slice(0, 6),
    gaps: (result.gaps ?? []).filter(s => typeof s === "string").map(s => s.slice(0, 200)).slice(0, 2),
    roleFit: String(result.roleFit ?? "").slice(0, 200),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const jd = String(body?.jd ?? "").trim();
    if (jd.length < 20) {
      return new Response(JSON.stringify({ error: "Paste a longer job description (at least 20 characters)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const trimmed = jd.slice(0, 6000);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        max_completion_tokens: 1100,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `JOB DESCRIPTION:\n\n${trimmed}\n\nReturn the JSON object now.` },
        ],
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      const status = r.status === 429 ? 429 : r.status === 402 ? 402 : 502;
      const msg =
        status === 429 ? "Too many requests — try again in a moment."
        : status === 402 ? "AI credits exhausted on this site."
        : "AI gateway error.";
      console.error("jd-match gateway error", r.status, text.slice(0, 300));
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = tryParseJSON(content);
    if (!parsed) {
      return new Response(JSON.stringify({ error: "Bad response from AI. Try again." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clean = sanitize(parsed);
    return new Response(JSON.stringify(clean), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("jd-match error", err);
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
