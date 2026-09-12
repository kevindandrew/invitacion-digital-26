import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const prerender = false;

async function getGuestByToken(
  token: string
): Promise<{ id: string; invite_type: 'single' | 'double' } | null> {
  const { data } = await supabaseAdmin.from('guests').select('id, invite_type').eq('token', token).single();
  return data ?? null;
}

function maxSongsFor(inviteType: 'single' | 'double'): number {
  return inviteType === 'double' ? 4 : 2;
}

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Falta el token.' }), { status: 400 });
  }

  const guest = await getGuestByToken(token);
  if (!guest) {
    return new Response(JSON.stringify({ error: 'No encontramos esa invitación.' }), { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('song_requests')
    .select('id, song_title, artist, genre, created_at')
    .eq('guest_id', guest.id)
    .order('created_at', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: 'No se pudieron cargar las canciones.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ songs: data ?? [] }), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido.' }), { status: 400 });
  }

  const { token, song_title, artist, genre } = (body ?? {}) as {
    token?: unknown;
    song_title?: unknown;
    artist?: unknown;
    genre?: unknown;
  };

  if (typeof token !== 'string' || typeof song_title !== 'string' || !song_title.trim()) {
    return new Response(JSON.stringify({ error: 'Datos inválidos.' }), { status: 400 });
  }

  const trimmedGenre = typeof genre === 'string' ? genre.trim() : '';
  if (!trimmedGenre || trimmedGenre.length > 60) {
    return new Response(JSON.stringify({ error: 'Ingresá un género válido.' }), { status: 400 });
  }

  const guest = await getGuestByToken(token);
  if (!guest) {
    return new Response(JSON.stringify({ error: 'No encontramos esa invitación.' }), { status: 404 });
  }

  const { count } = await supabaseAdmin
    .from('song_requests')
    .select('id', { count: 'exact', head: true })
    .eq('guest_id', guest.id);

  const max = maxSongsFor(guest.invite_type);
  if ((count ?? 0) >= max) {
    return new Response(
      JSON.stringify({ error: `Ya alcanzaste el máximo de ${max} canciones permitidas.` }),
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('song_requests')
    .insert({
      guest_id: guest.id,
      song_title: song_title.trim(),
      artist: typeof artist === 'string' && artist.trim() ? artist.trim() : null,
      genre: trimmedGenre,
    })
    .select('id, song_title, artist, genre, created_at')
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'No se pudo agregar la canción.' }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
