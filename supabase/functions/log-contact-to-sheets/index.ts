import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY')!;
const GATEWAY = 'https://connector-gateway.lovable.dev/google_sheets/v4';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const gatewayHeaders = {
  Authorization: `Bearer ${LOVABLE_API_KEY}`,
  'X-Connection-Api-Key': SHEETS_API_KEY,
  'Content-Type': 'application/json',
};

async function getOrCreateSheetId(): Promise<string> {
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'contact_sheet_id')
    .maybeSingle();
  if (data?.value) return data.value;

  // Create new spreadsheet with header row
  const createRes = await fetch(`${GATEWAY}/spreadsheets`, {
    method: 'POST',
    headers: gatewayHeaders,
    body: JSON.stringify({
      properties: { title: 'Portfolio Contact Form' },
      sheets: [{ properties: { title: 'Sheet1' } }],
    }),
  });
  if (!createRes.ok) {
    throw new Error(`create sheet failed: ${createRes.status} ${await createRes.text()}`);
  }
  const created = await createRes.json();
  const sheetId = created.spreadsheetId as string;

  // Write header row
  await fetch(`${GATEWAY}/spreadsheets/${sheetId}/values/Sheet1!A1:D1?valueInputOption=RAW`, {
    method: 'PUT',
    headers: gatewayHeaders,
    body: JSON.stringify({ values: [['Timestamp', 'Name', 'Email', 'Message']] }),
  });

  await supabase.from('app_config').upsert({ key: 'contact_sheet_id', value: sheetId });
  return sheetId;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sheetId = await getOrCreateSheetId();
    const appendRes = await fetch(
      `${GATEWAY}/spreadsheets/${sheetId}/values/Sheet1!A:D:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: gatewayHeaders,
        body: JSON.stringify({
          values: [[new Date().toISOString(), name, email, message]],
        }),
      },
    );
    if (!appendRes.ok) {
      throw new Error(`append failed: ${appendRes.status} ${await appendRes.text()}`);
    }

    return new Response(JSON.stringify({ ok: true, sheetId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('log-contact-to-sheets error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
