import { useEffect, useRef, useState, type CSSProperties, type TransitionEvent } from 'react';

const imageModules = import.meta.glob<unknown>(
  '../../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const fallbackPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82',
    alt: 'Pareja caminando entre árboles',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=82',
    alt: 'Manos de una pareja con anillos',
  },
  {
    src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=82',
    alt: 'Ramo de flores claras sobre una mesa',
  },
];

function resolveSrc(mod: unknown): string {
  const value = (mod as { default?: unknown } | undefined)?.default ?? mod;
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'src' in value) {
    return (value as { src: string }).src;
  }
  return '';
}

const localPhotos = Object.keys(imageModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path, index) => ({
    src: resolveSrc(imageModules[path]),
    alt: `Recuerdo de la boda ${index + 1}`,
  }))
  .filter((photo) => photo.src);

const photos = localPhotos.length > 0 ? localPhotos : fallbackPhotos;

const frames = [
  { rotate: '-3deg', dwell: 8 }, { rotate: '2deg', dwell: 10 }, { rotate: '-2deg', dwell: 7 },
  { rotate: '3deg', dwell: 11 }, { rotate: '-1deg', dwell: 9 }, { rotate: '2deg', dwell: 6.5 },
  { rotate: '-3deg', dwell: 10.5 }, { rotate: '1deg', dwell: 8.5 }, { rotate: '-2deg', dwell: 7.5 },
  { rotate: '3deg', dwell: 11.5 }, { rotate: '-1deg', dwell: 9.5 }, { rotate: '2deg', dwell: 6 },
];

function nextRandomIndex(current: number, total: number) {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  while (next === current) next = Math.floor(Math.random() * total);
  return next;
}

interface GalleryFrameProps {
  rotate: string;
  dwell: number;
  initialIndex: number;
}

function GalleryFrame({ rotate, dwell, initialIndex }: GalleryFrameProps) {
  const [photoIndex, setPhotoIndex] = useState(initialIndex);
  const [fading, setFading] = useState(false);
  const photoIndexRef = useRef(initialIndex);
  photoIndexRef.current = photoIndex;

  useEffect(() => {
    if (photos.length <= 1) return;
    const timeoutId = window.setTimeout(() => setFading(true), dwell * 1000);
    return () => window.clearTimeout(timeoutId);
  }, [photoIndex, dwell]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'opacity' || !fading) return;
    const nextIndex = nextRandomIndex(photoIndexRef.current, photos.length);
    const preload = new window.Image();
    preload.onload = () => {
      setPhotoIndex(nextIndex);
      setFading(false);
    };
    preload.onerror = () => setFading(false);
    preload.src = photos[nextIndex].src;
  };

  const photo = photos[photoIndex % photos.length];

  return (
    <figure
      className={`gallery-frame ${fading ? 'is-fading' : ''}`}
      style={{ '--frame-rotate': rotate } as unknown as CSSProperties}
      onTransitionEnd={handleTransitionEnd}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" />
      <span className="gallery-tape" aria-hidden="true" />
    </figure>
  );
}

export default function PhotoGallery() {
  return (
    <section className="photo-gallery reveal section-band section-band--paper" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <span className="section-index">01 / recuerdos</span>
        <h2 id="gallery-title">Un día para volver a mirar</h2>
      </div>
      <div className="gallery-stage">
        {frames.map((frame, index) => (
          <GalleryFrame
            key={index}
            rotate={frame.rotate}
            dwell={frame.dwell}
            initialIndex={index % photos.length}
          />
        ))}
      </div>
    </section>
  );
}
