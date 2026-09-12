interface Song {
  id: string;
  song_title: string;
  artist: string | null;
  genre: string | null;
}

interface SongsModalProps {
  guestName: string;
  songs: Song[] | null;
  onClose: () => void;
}

export default function SongsModal({ guestName, songs, onClose }: SongsModalProps) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <p className="admin-modal-title">Canciones de {guestName}</p>

        {songs === null ? (
          <p className="admin-status">Cargando…</p>
        ) : songs.length === 0 ? (
          <p className="admin-status">Todavía no pidió canciones.</p>
        ) : (
          <ul className="admin-songs-list">
            {songs.map((song) => (
              <li key={song.id}>
                <span className="admin-songs-title">
                  {song.song_title}
                  {song.artist && <span className="admin-songs-artist"> — {song.artist}</span>}
                </span>
                {song.genre && <span className="admin-songs-genre">{song.genre}</span>}
              </li>
            ))}
          </ul>
        )}

        <div className="admin-modal-actions">
          <button type="button" className="admin-signout" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
