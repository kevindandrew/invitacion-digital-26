import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido.' }), { status: 400 });
  }

  const { token, confirmed } = (body ?? {}) as { token?: unknown; confirmed?: unknown };

  if (typeof token !== 'string' || typeof confirmed !== 'boolean') {
    return new Response(JSON.stringify({ error: 'Datos inválidos.' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('guests')
    .update({ confirmed, confirmed_at: new Date().toISOString() })
    .eq('token', token)
    .select('confirmed, confirmed_at')
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'No encontramos esa invitación.' }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};
