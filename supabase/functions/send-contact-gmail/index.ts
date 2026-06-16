import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const GMAIL_API_KEY = Deno.env.get('GOOGLE_MAIL_API_KEY')!;
const GATEWAY = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';
const RECIPIENT = 'snvvs369@gmail.com';

const Body = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(2000),
  subject: z.string().trim().max(200).optional(),
});

function encodeRFC2822(to: string, subject: string, body: string) {
  const msg = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body,
  ].join('\r\n');
  // base64url encode
  const bytes = new TextEncoder().encode(msg);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const { name, email, message, subject } = parsed.data;
    const ts = new Date().toISOString();
    const body = `New portfolio contact submission

Name: ${name}
Email: ${email}
Subject: ${subject || '(none)'}
Timestamp: ${ts}

Message:
${message}
`;
    const raw = encodeRFC2822(RECIPIENT, `Portfolio Contact: ${name}`, body);

    const res = await fetch(`${GATEWAY}/users/me/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GMAIL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('gmail send failed', res.status, txt);
      return new Response(JSON.stringify({ error: txt }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-contact-gmail error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
