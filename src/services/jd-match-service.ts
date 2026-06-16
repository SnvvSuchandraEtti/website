// JD → Tailored Pitch client.
// Calls the `jd-match` Supabase Edge Function and returns a structured pitch
// the recruiter UI can render directly.

export interface SkillMatch {
  skill: string;
  reason: string;
}

export interface JdMatchResult {
  pitch: string[];
  projectIds: string[];
  skillMatches: SkillMatch[];
  gaps: string[];
  roleFit: string;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jd-match`;
const AUTH = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export async function matchJobDescription(jd: string, signal?: AbortSignal): Promise<JdMatchResult> {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH}`,
      apikey: AUTH,
    },
    body: JSON.stringify({ jd }),
    signal,
  });

  if (!r.ok) {
    let msg = `Request failed (${r.status})`;
    try {
      const data = await r.json();
      if (data?.error) msg = String(data.error);
    } catch { /* noop */ }
    throw new Error(msg);
  }

  return (await r.json()) as JdMatchResult;
}
