# Chatbot — Cartesia Voice + Lovable AI

The chatbot uses Lovable AI (text) and Cartesia (voice). All API keys live as
server-side secrets on the Supabase Edge Functions; the browser never sees them.

## Secrets (Supabase Edge Function env)

| Name | Used by | Notes |
| --- | --- | --- |
| `LOVABLE_API_KEY` | `chat` | Auto-provisioned by Lovable. Do not edit. |
| `CARTESIA_API_KEY` | `tts-cartesia` | Voice slot 1 (primary). |
| `CARTESIA_API_KEY_2` | `tts-cartesia` | Voice slot 2 (fallback). |
| `CARTESIA_API_KEY_3` | `tts-cartesia` | Voice slot 3 (fallback). |
| `CARTESIA_API_KEY_4` | `tts-cartesia` | Voice slot 4 (fallback). |
| `FIRECRAWL_API_KEY` | `chat` | Optional, enables live web search. |

Rotate any Cartesia key from the Cartesia dashboard if it was ever shared
in plain text (e.g. in chat) and re-add it via the Lovable secret prompt.

## Voice configuration & fallback chain

The `tts-cartesia` function walks an ordered list of (key, voice id) slots
until one succeeds. When a slot returns `402` / `403` / `401` or a body
that looks like a credit/quota error, it is cooled-down for 6 hours; `429`
cools down for 1 minute. The response header `X-TTS-Slot` reports which
slot served the audio.

| Slot | Secret | Voice ID |
| --- | --- | --- |
| 1 | `CARTESIA_API_KEY`   | `624a4e9f-e98f-4476-bcc0-e61df4a13667` |
| 2 | `CARTESIA_API_KEY_2` | `78c5f916-837e-4a95-9f4c-0d78859cbd34` |
| 3 | `CARTESIA_API_KEY_3` | `ff0601d1-af36-48c8-9234-b8deb4803733` |
| 4 | `CARTESIA_API_KEY_4` | `a2764064-de76-407f-b571-bf21f2888f06` |

If every Cartesia slot is unavailable, the function returns `503
tts_exhausted` and the chatbot transparently switches to the browser's
built-in `speechSynthesis` (status bar shows "backup voice").

## Frontend env

Already present in `.env`. Do not change names — Vite injects these at build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The TTS endpoint is built as `${VITE_SUPABASE_URL}/functions/v1/tts-cartesia`.

## Deployment

### Lovable
Edge functions deploy automatically with each change. Frontend changes go live
when you click **Publish → Update** in the editor.

### GitHub export → Vercel
1. Push the repo to GitHub.
2. Import the project on Vercel.
3. In Vercel **Project Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy. The frontend will continue calling the Supabase-hosted edge
   functions, so `CARTESIA_API_KEY` and `LOVABLE_API_KEY` stay in Supabase —
   you do **not** add them to Vercel.

## Rate limiting

`tts-cartesia` enforces a best-effort in-memory limit of 20 requests / 60 s
per IP per warm instance. For stronger guarantees, move to a Redis/Upstash
counter. (No persistent rate-limit primitive ships with this backend yet.)

## Failure behaviour

If every Cartesia slot fails, the chatbot:
- transparently falls back to the browser's `speechSynthesis` voice,
- still shows the text reply unchanged,
- shows a small "(backup voice)" hint in the status bar,
- only shows "Voice is unavailable" if even browser TTS isn't supported,
- never throws or blocks the conversation.
