import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AddGuestForm, { type NewGuest } from './AddGuestForm';
import QrCodeModal from './QrCodeModal';
import SongsModal from './SongsModal';

interface Song {
  id: string;
  song_title: string;
  artist: string | null;
  genre: string | null;
}

interface GuestRow {
  id: string;
  token: string;
  name_1: string;
  name_2: string | null;
  invite_type: 'single' | 'double';
  confirmed: boolean | null;
  confirmed_at: string | null;
  song_requests: { count: number }[];
}

export default function GuestsTable() {
  const [guests, setGuests] = useState<GuestRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [qrGuest, setQrGuest] = useState<GuestRow | null>(null);
  const [songsGuestName, setSongsGuestName] = useState<string | null>(null);
  const [songsList, setSongsList] = useState<Song[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGuests() {
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('id, token, name_1, name_2, invite_type, confirmed, confirmed_at, song_requests(count)')
        .order('created_at', { ascending: false })
        .returns<GuestRow[]>();

      if (cancelled) return;

      if (fetchError) {
        setError('No se pudo cargar la lista de invitados.');
        return;
      }

      setGuests(data ?? []);
    }

    loadGuests();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!guests) return [];
    const query = search.trim().toLowerCase();
    if (!query) return guests;
    return guests.filter((guest) =>
      [guest.name_1, guest.name_2].filter(Boolean).join(' ').toLowerCase().includes(query)
    );
  }, [guests, search]);

  const stats = useMemo(() => {
    if (!guests) return null;
    const confirmed = guests.filter((g) => g.confirmed === true);
    const pending = guests.filter((g) => g.confirmed !== true);
    const attendees = confirmed.reduce((sum, g) => sum + (g.invite_type === 'double' ? 2 : 1), 0);
    return { total: guests.length, confirmed: confirmed.length, pending: pending.length, attendees };
  }, [guests]);

  function handleGuestCreated(guest: NewGuest) {
    setGuests((prev) => [{ ...guest, song_requests: [{ count: 0 }] }, ...(prev ?? [])]);
    setShowAddForm(false);
  }

  async function handleDelete(guest: GuestRow) {
    const label = [guest.name_1, guest.name_2].filter(Boolean).join(' y ');
    if (!window.confirm(`¿Eliminar la invitación de ${label}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleteError(null);
    setDeletingId(guest.id);

    const { error: songsError } = await supabase.from('song_requests').delete().eq('guest_id', guest.id);
    if (songsError) {
      setDeleteError(`No se pudo eliminar (${songsError.message}).`);
      setDeletingId(null);
      return;
    }

    const { error: guestError } = await supabase.from('guests').delete().eq('id', guest.id);
    if (guestError) {
      setDeleteError(`No se pudo eliminar (${guestError.message}).`);
      setDeletingId(null);
      return;
    }

    setGuests((prev) => (prev ? prev.filter((g) => g.id !== guest.id) : prev));
    setDeletingId(null);
  }

  async function openSongs(guest: GuestRow) {
    setSongsGuestName([guest.name_1, guest.name_2].filter(Boolean).join(' y '));
    setSongsList(null);

    const { data } = await supabase
      .from('song_requests')
      .select('id, song_title, artist, genre')
      .eq('guest_id', guest.id)
      .order('created_at', { ascending: true })
      .returns<Song[]>();

    setSongsList(data ?? []);
  }

  async function copyInviteLink(token: string) {
    const url = `${window.location.origin}/invitacion/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((current) => (current === token ? null : current)), 1500);
  }

  if (error) {
    return <p className="admin-status is-error">{error}</p>;
  }

  if (!guests) {
    return <p className="admin-status">Cargando invitados…</p>;
  }

  return (
    <>
      {stats && (
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-value">{stats.total}</div>
            <div className="admin-stat-label">Invitados</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{stats.confirmed}</div>
            <div className="admin-stat-label">Confirmados</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{stats.pending}</div>
            <div className="admin-stat-label">Pendientes</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value">{stats.attendees}</div>
            <div className="admin-stat-label">Personas</div>
          </div>
        </div>
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Buscar invitado…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="admin-login-submit" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cerrar' : '+ Agregar invitado'}
        </button>
      </div>

      {showAddForm && <AddGuestForm onCreated={handleGuestCreated} onCancel={() => setShowAddForm(false)} />}
      {deleteError && <p className="admin-status is-error">{deleteError}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Invitado</th>
              <th>Tipo</th>
              <th>Confirmado</th>
              <th>Canciones</th>
              <th>Invitación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((guest) => (
              <tr key={guest.id}>
                <td>
                  <div className="admin-guest-name">
                    {guest.name_1}
                    {guest.name_2 && <span>{guest.name_2}</span>}
                  </div>
                </td>
                <td>{guest.invite_type === 'double' ? 'Doble' : 'Individual'}</td>
                <td>
                  {guest.confirmed === true ? (
                    <span className="admin-pill yes">Sí</span>
                  ) : guest.confirmed === false ? (
                    <span className="admin-pill no">No</span>
                  ) : (
                    <span className="admin-pill no">Pendiente</span>
                  )}
                </td>
                <td>
                  {guest.song_requests?.[0]?.count ? (
                    <button type="button" className="admin-copy" onClick={() => openSongs(guest)}>
                      Ver ({guest.song_requests[0].count})
                    </button>
                  ) : (
                    0
                  )}
                </td>
                <td>
                  <div className="admin-invite-actions">
                    <button type="button" className="admin-copy" onClick={() => copyInviteLink(guest.token)}>
                      {copiedToken === guest.token ? 'Copiado' : 'Copiar link'}
                    </button>
                    <button type="button" className="admin-copy" onClick={() => setQrGuest(guest)}>
                      Ver QR
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => handleDelete(guest)}
                    disabled={deletingId === guest.id}
                  >
                    {deletingId === guest.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-status">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {qrGuest && (
        <QrCodeModal
          url={`${window.location.origin}/invitacion/${qrGuest.token}`}
          guestName={[qrGuest.name_1, qrGuest.name_2].filter(Boolean).join(' y ')}
          onClose={() => setQrGuest(null)}
        />
      )}

      {songsGuestName && (
        <SongsModal guestName={songsGuestName} songs={songsList} onClose={() => setSongsGuestName(null)} />
      )}
    </>
  );
}
