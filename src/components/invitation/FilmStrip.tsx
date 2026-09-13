import { useEffect, useState } from 'react';

const frames = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=720&q=82',
    alt: 'Pareja caminando entre árboles',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=720&q=82',
    alt: 'Manos de una pareja con anillos',
  },
  {
    src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=720&q=82',
    alt: 'Ramo de flores claras sobre una mesa',
  },
];

export default function FilmStrip() {
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % frames.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="film-section reveal" aria-labelledby="film-title">
      <div className="film-caption">
        <span className="section-index">01 / recuerdos</span>
        <h2 id="film-title">Un día para volver a mirar</h2>
      </div>
      <div className="film-strip">
        <div className="film-holes film-holes--top" aria-hidden="true" />
        <div className="film-frames" style={{ transform: `translateX(-${activeFrame * 100}%)` }}>
          {frames.map((frame) => (
            <figure className="film-frame" key={frame.src} aria-hidden={activeFrame !== frames.indexOf(frame)}>
              <img src={frame.src} alt={frame.alt} loading="lazy" />
            </figure>
          ))}
        </div>
        <div className="film-holes film-holes--bottom" aria-hidden="true" />
      </div>
    </section>
  );
}
