import { ALL_GENRES } from '../data/genres';

export interface SongInput {
  song_title: string;
  artist: string | null;
  genre: string | null;
}

export interface GenreGroup {
  genre: string;
  items: { title: string; artist: string | null; count: number }[];
}

export function buildGenreGroups(songs: SongInput[]): GenreGroup[] {
  const byGenre = new Map<string, SongInput[]>();
  for (const song of songs) {
    const genre = song.genre?.trim() || 'Sin género';
    const list = byGenre.get(genre) ?? [];
    list.push(song);
    byGenre.set(genre, list);
  }

  const knownOrder = ALL_GENRES.filter((g) => byGenre.has(g));
  const customOrder = [...byGenre.keys()]
    .filter((g) => !ALL_GENRES.includes(g) && g !== 'Sin género')
    .sort((a, b) => a.localeCompare(b, 'es'));
  const orderedGenres = [...knownOrder, ...customOrder, ...(byGenre.has('Sin género') ? ['Sin género'] : [])];

  return orderedGenres.map((genre) => {
    const aggregated = new Map<string, { title: string; artist: string | null; count: number }>();
    for (const song of byGenre.get(genre) ?? []) {
      const key = `${song.song_title.trim().toLowerCase()}|${(song.artist ?? '').trim().toLowerCase()}`;
      const existing = aggregated.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        aggregated.set(key, { title: song.song_title, artist: song.artist, count: 1 });
      }
    }
    return { genre, items: [...aggregated.values()] };
  });
}
