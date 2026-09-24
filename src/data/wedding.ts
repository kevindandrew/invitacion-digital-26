export const wedding = {
  monogram: "K&B",
  groom: "Kevin",
  bride: "Belen",
  quote: ["Te daré la mitad de mi vida,", "si tú me das la mitad de la tuya."],
  quoteFooter: "Un anillo para unirnos para siempre.",
  announcement: "¡Nos casamos!",
  parents: {
    title: "Nuestros padres",
    groups: [
      {
        title: "Padres de la novia",
        names: ["Eddy Martín Segales Salvador", "Ana María Ramos López"],
      },
      {
        title: "Padres del novio",
        names: ["Ramiro Rodríguez Maldonado", "Guadalupe Calderón Cuellar"],
      },
    ],
  },
  invitationLine: "Tenemos la alegría de invitarles a nuestra unión",
  calendarNote:
    "Guardá este día en tu corazón: será el comienzo de nuestra historia juntos.",
  date: {
    iso: "2026-09-26T16:00:00-04:00",
    year: "2026",
    month: "Sept",
    weekday: "Sábado",
    day: "26",
    time: "16:00",
  },
  reception: {
    venue: "Jardines Ashic",
    address: "Villa Armonia, Av. Juan XXIII 150",
  },
  schedule: [
    { icon: "rings", label: "Ceremonia civil", time: "17:00" },
    { icon: "toast", label: "Vals y brindis", time: "18:00" },
    { icon: "dance", label: "Baile", time: "19:00" },
    { icon: "dinner", label: "Cena", time: "20:30" },
    { icon: "cake", label: "Torta", time: "22:30" },
  ],
  venueNotice: {
    eyebrow: "Para cuidar nuestro jardín",
    messages: [
      "Nuestro salón es un jardín, así que les pedimos con cariño: si quieren lanzarnos algo a la salida, que sean pétalos de flores. El papel picado, el confeti, el azúcar y la canela son hermosos, pero muy difíciles de limpiar del pasto.",
    ],
  },
  padrinos: [
    {
      label: "Padrinos boda",
      names: ["Eloy Eduardo Ramos López", "Lourdes Mancachi Copa"],
    },
    { label: "Madrina torta", names: ["Monica Rodríguez Maldonado"] },
  ],
  dressCode: "Formal / Elegante",
  city: "La Paz, Bolivia",
  gift: {
    eyebrow: "Mesa de Regalos",
    message:
      "El mejor regalo es tu compañía, cualquier detalle será recibido con mucho cariño.",
    cardImage: "/tarjeta-01.png",
    qrImage: "/qr-regalo.png",
    bank: {
      name: "BNB",
      account: "1502504874",
    },
  },
} as const;

export type Wedding = typeof wedding;
