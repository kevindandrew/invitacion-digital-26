import type { CSSProperties } from 'react';

const imageModules = import.meta.glob<string>(
  '../../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' },
);

const videoModules = import.meta.glob<string>(
  '../../assets/gallery/*.{mp4,webm,mov,MP4,WEBM,MOV}',
  { eager: true, query: '?url', import: 'default' },
);

const fallbackPhotos: MediaItem[] = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82',
    alt: 'Pareja caminando entre árboles',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=82',
    alt: 'Manos de una pareja con anillos',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=82',
    alt: 'Ramo de flores claras sobre una mesa',
  },
];

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

function fromModules(modules: Record<string, string>, type: MediaItem['type']): MediaItem[] {
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path, index) => ({
      type,
      src: modules[path],
      alt: `Recuerdo de la boda ${index + 1}`,
    }))
    .filter((item) => item.src);
}

const localMedia = [...fromModules(imageModules, 'image'), ...fromModules(videoModules, 'video')];

const media = localMedia.length > 0 ? localMedia : fallbackPhotos;

const tickerItems = media.length > 0 ? [...media, ...media] : media;

function GalleryTicket({ item, index }: { item: MediaItem; index: number }) {
  return (
    <figure className={`gallery-ticket ${index % 2 === 0 ? 'gallery-ticket--left' : 'gallery-ticket--right'}`}>
      {item.type === 'video' ? (
        <video src={item.src} autoPlay muted loop playsInline />
      ) : (
        <img src={item.src} alt={item.alt} loading="lazy" />
      )}
    </figure>
  );
}

export default function PhotoGallery() {
  const duration = Math.max(media.length * 4.5, 24);

  return (
    <section className="photo-gallery reveal section-band section-band--paper" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <span className="section-index">01 / recuerdos</span>
        <h2 id="gallery-title">Un día para volver a mirar</h2>
      </div>
      <div className="gallery-ticker">
        <div className="gallery-track" style={{ '--ticker-duration': `${duration}s` } as CSSProperties}>
          {tickerItems.map((item, index) => (
            <GalleryTicket item={item} index={index} key={`${item.src}-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
