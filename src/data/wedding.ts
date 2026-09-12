export const wedding = {
  monogram: 'K&B',
  groom: 'Kevin',
  bride: 'Belén',
  quote: [
    'Te daré la mitad de mi vida,',
    'si tú me das la mitad de la tuya.',
  ],
  quoteFooter: 'Un anillo para unirnos para siempre.',
  announcement: '¡Nos casamos!',
  parents: {
    title: 'Nuestros padres',
    columns: [
      ['Guadalupe Calderón Cuellar', 'Ramiro Rodríguez Maldonado'],
      ['Ana María Ramos López', 'Eddy Martín Segales Salvador'],
    ],
  },
  invitationLine: 'Tenemos la alegría de invitarles a nuestra unión',
  rsvpDeadlineIso: '2026-09-19T23:59:59-04:00',
  date: {
    iso: '2026-09-26T16:00:00-04:00',
    year: '2026',
    month: 'Sept',
    weekday: 'Sábado',
    day: '26',
    time: '16:00',
  },
  reception: {
    venue: 'Jardines Ashic',
    address: 'Villa Armonia, Av. Juan XXIII 219',
  },
  schedule: [
    { icon: 'rings', label: 'Ceremonia civil', time: '17:00' },
    { icon: 'toast', label: 'Vals y brindis', time: '18:00' },
    { icon: 'dance', label: 'Baile', time: '19:00' },
    { icon: 'dinner', label: 'Cena', time: '20:30' },
    { icon: 'cake', label: 'Torta', time: '19:00' },
  ],
  venueNotice: {
    eyebrow: 'Para cuidar nuestro jardín',
    messages: [
      'Nuestro salón es un jardín, así que les pedimos con cariño: si quieren lanzarnos algo a la salida, que sean pétalos de flores. El papel picado, el confeti, el azúcar y la canela son hermosos, pero muy difíciles de limpiar del pasto.',
      'Además, por reglamento del lugar no se permite el ingreso de cerveza.',
    ],
  },
  padrinos: [
    { label: 'Padrinos boda', names: ['Eloy Eduardo Ramos López', 'Lourdes Mancachi Copa'] },
    { label: 'Madrina torta', names: ['Monica Rodríguez Maldonado'] },
  ],
  city: 'La Paz, Bolivia',
  gift: {
    eyebrow: 'Un detalle, si así lo deseas',
    message:
      'Tu cariño y tu presencia ya son el regalo más lindo que nos puedes dar. Pero si deseas ayudarnos a construir nuestro nuevo hogar, con este código puedes hacernos llegar tu cariño.',
    qrImage: '/qr-regalo.png',
  },
} as const;

export type Wedding = typeof wedding;
