import { useEffect, useRef, useState } from 'react';
import Envelope from './Envelope';
import CountdownTimer from './CountdownTimer';
import SealDivider from './SealDivider';
import IvyCorner from './IvyCorner';
import Schedule from './Schedule';
import PetalIcon from './PetalIcon';
import ConfirmationForm from './ConfirmationForm';
import SongRequestForm from './SongRequestForm';
import PhotoGallery from './PhotoGallery';
import WeddingCalendar from './WeddingCalendar';
import AudioPlayer from './AudioPlayer';
import AnimatedText from './AnimatedText';
import FlowerRain from './FlowerRain';
import { wedding } from '../../data/wedding';
import '../../styles/invitation.css';

interface GuestInfo {
  token: string;
  name_1: string;
  name_2: string | null;
  invite_type: 'single' | 'double';
  confirmed: boolean | null;
  confirmed_at: string | null;
}

interface Song {
  id: string;
  song_title: string;
  artist: string | null;
}

interface InvitationExperienceProps {
  guest: GuestInfo;
  initialSongs: Song[];
}

export default function InvitationExperience({ guest, initialSongs }: InvitationExperienceProps) {
  const [opened, setOpened] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const guestName =
    guest.invite_type === 'double' && guest.name_2 ? `${guest.name_1} y ${guest.name_2}` : guest.name_1;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${wedding.reception.venue}, ${wedding.reception.address}`,
  )}`;

  useEffect(() => {
    document.documentElement.classList.toggle('invitation-locked', !opened);
    document.body.classList.toggle('invitation-locked', !opened);

    return () => {
      document.documentElement.classList.remove('invitation-locked');
      document.body.classList.remove('invitation-locked');
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const timeout = setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 550);
    return () => clearTimeout(timeout);
  }, [opened]);

  useEffect(() => {
    const nodes = contentRef.current?.querySelectorAll('.reveal');
    if (!nodes || nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="invitation-page">
      <FlowerRain />
      <section className="envelope-hero">
        <IvyCorner />
        <IvyCorner flip />
        <div className="hero-monogram" aria-label={`Monograma ${wedding.monogram}`}>{wedding.monogram}</div>
        <div className={`hero-guest ${opened ? 'is-hidden' : ''}`}>
          <span className="hero-guest-label">Invitación para</span>
          <span className="hero-guest-name">{guestName}</span>
        </div>
        <Envelope
          monogram={wedding.monogram}
          guestName={guestName}
          opened={opened}
          onOpen={() => setOpened(true)}
        />
        <p className={`hero-hint ${opened ? 'is-hidden' : ''}`}>Toca el sello para abrir tu invitación</p>
      </section>

      <div ref={contentRef} className={`content ${opened ? 'is-open' : ''}`}>
        <AudioPlayer />
        <div className="names reveal">
          <AnimatedText className="name">{wedding.groom}</AnimatedText>
          <span className="name-ampersand">&amp;</span>
          <AnimatedText className="name">{wedding.bride}</AnimatedText>
        </div>

        <div className="guest-welcome reveal">
          <span className="guest-welcome-label">Esta invitación es especialmente para</span>
          <span className="guest-welcome-name">{guestName}</span>
        </div>

        <div className="reveal">
          {wedding.quote.map((line) => (
            <p className="quote" key={line}>
              {line}
            </p>
          ))}
          <p className="quote-footer">{wedding.quoteFooter}</p>
        </div>

        <p className="announcement reveal"><AnimatedText>{wedding.announcement}</AnimatedText></p>

        <PhotoGallery />

        <SealDivider monogram={wedding.monogram} />

        <div className="reveal">
          <p className="section-title">{wedding.parents.title}</p>
          <div className="parents-grid">
            {wedding.parents.groups.map((group) => (
              <div className="parent-group" key={group.title}>
                <span className="parent-group-title">{group.title}</span>
                {group.names.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="invitation-line reveal">{wedding.invitationLine}</p>

        <div className="date-card reveal section-band section-band--paper">
          <p className="section-title">Nuestro día</p>
          <div className="date-block">
            <div className="date-side">
              <span>{wedding.date.year}</span>
              <span>{wedding.date.month}</span>
            </div>
            <div className="date-center">
              <div className="weekday">{wedding.date.weekday}</div>
              <div className="day">{wedding.date.day}</div>
            </div>
            <div className="date-side">
              <span>Horas</span>
              <span>{wedding.date.time}</span>
            </div>
          </div>
          <CountdownTimer targetIso={wedding.date.iso} />
        </div>

        <div className="section-band section-band--green">
          <WeddingCalendar year={wedding.date.year} month={wedding.date.month} day={wedding.date.day} />
        </div>

        <div className="pass-card reveal section-band section-band--paper">
          <span className="pass-card-label">Pases reservados</span>
          <strong>{guest.invite_type === 'double' ? '02' : '01'}</strong>
          <span>{guest.invite_type === 'double' ? 'para compartir este día' : 'para ti'}</span>
        </div>

        <SealDivider monogram={wedding.monogram} />

        <div className="section-band section-band--green schedule-band">
          <Schedule items={wedding.schedule} />
        </div>

        <div className="venue-notice reveal">
          <span className="venue-notice-icon">
            <PetalIcon />
          </span>
          <p className="section-title">{wedding.venueNotice.eyebrow}</p>
          {wedding.venueNotice.messages.map((message) => (
            <p className="venue-notice-message" key={message}>
              {message}
            </p>
          ))}
        </div>

        <SealDivider monogram={wedding.monogram} />

        <div className="details-card reveal section-band section-band--paper">
          <p className="section-title">Detalles de la recepción</p>
          <div className="details-grid">
            <div className="details-col">
              <p className="details-label">Recepción</p>
              <p className="venue">&ldquo;{wedding.reception.venue}&rdquo;</p>
              <p className="address">{wedding.reception.address}</p>
              <a className="maps-link" href={mapsUrl} target="_blank" rel="noreferrer">Abrir en Google Maps <span aria-hidden="true">↗</span></a>
              <iframe
                className="maps-frame"
                title={`Mapa de ${wedding.reception.venue}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${wedding.reception.venue}, ${wedding.reception.address}`)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="details-col">
              <p className="details-label">Padrinos</p>
              {wedding.padrinos.map((group) => (
                <div className="padrino-group" key={group.label}>
                  <p className="padrino-label">{group.label}</p>
                  {group.names.map((name) => (
                    <p className="padrino-name" key={name}>
                      {name}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="details-dresscode">
            <p className="details-label">Código de vestimenta</p>
            <p className="details-value">{wedding.dressCode}</p>
          </div>
        </div>

        <SealDivider monogram={wedding.monogram} />

        <div className="reveal section-band section-band--green form-band">
          <ConfirmationForm
            token={guest.token}
            initialConfirmed={guest.confirmed}
            deadlineIso={wedding.rsvpDeadlineIso}
          />
        </div>

        <div className="reveal section-band section-band--paper form-band">
          <SongRequestForm
            token={guest.token}
            initialSongs={initialSongs}
            maxSongs={guest.invite_type === 'double' ? 4 : 2}
          />
        </div>

        <SealDivider monogram={wedding.monogram} />

        <div className="gift-section reveal">
          <p className="section-title">{wedding.gift.eyebrow}</p>
          <p className="rsvp-message">{wedding.gift.message}</p>
          <img src={wedding.gift.qrImage} alt="Código QR para enviar un regalo en dinero" className="gift-qr" />
        </div>

        <div className="content-footer">
          <IvyCorner variant="muted" />
          <p className="city reveal">{wedding.city}</p>
          <IvyCorner variant="muted" flip />
        </div>
      </div>
    </div>
  );
}
