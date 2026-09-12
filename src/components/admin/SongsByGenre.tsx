import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { buildGenreGroups } from '../../lib/groupSongsByGenre';
import { wedding } from '../../data/wedding';
import '../../styles/admin.css';

interface SongRow {
  id: string;
  song_title: string;
  artist: string | null;
  genre: string | null;
}

export default function SongsByGenre() {
  const [songs, setSongs] = useState<SongRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('song_requests')
      .select('id, song_title, artist, genre')
      .order('created_at', { ascending: true })
      .returns<SongRow[]>()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError('No se pudieron cargar las canciones.');
          return;
        }
        setSongs(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => (songs ? buildGenreGroups(songs) : []), [songs]);
  const totalSongs = songs?.length ?? 0;

  async function handleDownloadPdf() {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Canciones — ${wedding.groom} & ${wedding.bride}`, pageWidth / 2, 18, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text(`${totalSongs} canciones pedidas · generado el ${new Date().toLocaleDateString('es-BO')}`, pageWidth / 2, 25, {
      align: 'center',
    });
    doc.setTextColor(0, 0, 0);

    let cursorY = 34;

    for (const group of groups) {
      const remainingHeight = doc.internal.pageSize.getHeight() - cursorY;
      if (remainingHeight < 30) {
        doc.addPage();
        cursorY = 18;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${group.genre} (${group.items.length})`, 14, cursorY);

      autoTable(doc, {
        startY: cursorY + 4,
        head: [['Canción', 'Artista', 'Veces pedida']],
        body: group.items.map((item) => [item.title, item.artist ?? '—', item.count > 1 ? `×${item.count}` : '']),
        theme: 'grid',
        headStyles: { fillColor: [143, 160, 68] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });

      cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
    }

    doc.save(`canciones-${wedding.groom.toLowerCase()}-${wedding.bride.toLowerCase()}.pdf`);
  }

  if (error) {
    return <p className="admin-status is-error">{error}</p>;
  }

  return (
    <>
      <div className="admin-toolbar">
        <p className="admin-songs-summary">{totalSongs} canciones pedidas en total</p>
        <button type="button" className="admin-login-submit" onClick={handleDownloadPdf} disabled={!songs}>
          Descargar PDF
        </button>
      </div>

      {!songs ? (
        <p className="admin-status">Cargando canciones…</p>
      ) : totalSongs === 0 ? (
        <p className="admin-status">Todavía no hay canciones pedidas.</p>
      ) : (
        <div className="admin-genre-groups">
          {groups.map((group) => (
            <section className="admin-genre-group" key={group.genre}>
              <h2 className="admin-genre-title">
                {group.genre} <span>({group.items.length})</span>
              </h2>
              <ul className="admin-genre-list">
                {group.items.map((item) => (
                  <li key={`${item.title}|${item.artist}`}>
                    <span className="admin-genre-song">
                      {item.title}
                      {item.artist && <span className="admin-genre-artist"> — {item.artist}</span>}
                    </span>
                    {item.count > 1 && <span className="admin-genre-count">×{item.count}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
