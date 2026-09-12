import { useState } from 'react';
import type { FormEvent } from 'react';
import { GENRE_GROUPS } from '../../data/genres';

const OTHER_GENRE = '__other__';

interface Song {
  id: string;
  song_title: string;
  artist: string | null;
  genre: string | null;
}

interface SongRequestFormProps {
  token: string;
  initialSongs: Song[];
  maxSongs: number;
}

export default function SongRequestForm({ token, initialSongs, maxSongs }: SongRequestFormProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = maxSongs - songs.length;
  const atLimit = remaining <= 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Escribe el nombre de la canción.');
      return;
    }
    if (!genre) {
      setError('Elige un género para la canción.');
      return;
    }

    const finalGenre = genre === OTHER_GENRE ? customGenre.trim() : genre;
    if (!finalGenre) {
      setError('Escribe el género de la canción.');
      return;
    }

    if (atLimit) {
      setError(`Ya alcanzaste el máximo de ${maxSongs} canciones.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          song_title: trimmedTitle,
          artist: artist.trim() || undefined,
          genre: finalGenre,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'No pudimos agregar la canción. Inténtalo de nuevo.');
        return;
      }

      const created: Song = await res.json();
      setSongs((prev) => [...prev, created]);
      setTitle('');
      setArtist('');
      setGenre('');
      setCustomGenre('');
    } catch {
      setError('No pudimos agregar la canción. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="song-section">
      <p className="section-title">Pide tu canción</p>
      <p className="rsvp-message">¿Qué no puede faltar en la fiesta?</p>
      <p className="song-limit">
        {atLimit
          ? `Ya agregaste el máximo de ${maxSongs} canciones. ¡Gracias!`
          : `Puedes agregar hasta ${maxSongs} canciones (${remaining} restante${remaining === 1 ? '' : 's'}).`}
      </p>

      {!atLimit && (
        <form className="song-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="song-input"
            placeholder="Título de la canción"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Título de la canción"
            disabled={submitting}
          />
          <input
            type="text"
            className="song-input"
            placeholder="Artista (opcional)"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            aria-label="Artista"
            disabled={submitting}
          />
          <select
            className="song-input song-genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Género"
            disabled={submitting}
          >
            <option value="" disabled>
              Elige un género
            </option>
            {GENRE_GROUPS.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={OTHER_GENRE}>Otro (especifica)</option>
          </select>
          {genre === OTHER_GENRE && (
            <input
              type="text"
              className="song-input"
              placeholder="¿Qué género es?"
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              aria-label="Especifica el género"
              disabled={submitting}
            />
          )}
          <button type="submit" className="song-submit" disabled={submitting}>
            {submitting ? 'Agregando…' : 'Agregar canción'}
          </button>
        </form>
      )}

      {error && <p className="rsvp-error">{error}</p>}

      {songs.length > 0 && (
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song.id}>
              {song.song_title}
              {song.artist && <span> — {song.artist}</span>}
              {song.genre && <span className="song-genre-tag">{song.genre}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
