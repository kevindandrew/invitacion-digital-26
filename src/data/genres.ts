export const GENRE_GROUPS = [
  {
    label: 'Baladas',
    options: ['Baladas actuales', 'Baladas clásicas'],
  },
  {
    label: 'Clásicos',
    options: ["Clásicos 70's - 80's", "Clásicos 90's - 2000"],
  },
  {
    label: 'Cumbia',
    options: [
      'Cumbia actual',
      'Cumbia clásica',
      'Cumbia pop',
      'Cumbia chocolate',
      'Cumbia sureña (Chicha)',
      'Cumbia tropical',
    ],
  },
  {
    label: 'Reguetón',
    options: ['Reguetón clásico', 'Reguetón actual'],
  },
  {
    label: 'Latino',
    options: ['Salsa', 'Merengue', 'Bachata', 'Brasilera (Axé)', 'Latino', 'Villeras'],
  },
  {
    label: 'Otros',
    options: ['Folklore', 'Rock', 'Electrónica', 'Ska - Reggae'],
  },
] as const;

export const ALL_GENRES: string[] = GENRE_GROUPS.flatMap((group) => [...group.options]);
