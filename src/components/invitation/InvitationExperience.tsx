import { useEffect, useRef, useState } from 'react';
import Envelope from './Envelope';
import CountdownTimer from './CountdownTimer';
import SealDivider from './SealDivider';
import IvyCorner from './IvyCorner';
import ConfirmationForm from './ConfirmationForm';
import SongRequestForm from './SongRequestForm';
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
      <section className="envelope-hero">
        <IvyCorner />
        <IvyCorner flip />
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
        <div className="names reveal">
          <span className="name">{wedding.groom}</span>
          <span className="monogram-badge">{wedding.monogram}</span>
          <span className="name">{wedding.bride}</span>
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

        <p className="announcement reveal">{wedding.announcement}</p>

        <SealDivider monogram={wedding.monogram} />

        <div className="reveal">
          <p className="section-title">{wedding.parents.title}</p>
          <div className="parents-grid">
            {wedding.parents.columns.map((column) => (
              <div key={column.join('-')}>
                {column.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="invitation-line reveal">{wedding.invitationLine}</p>

        <div className="reveal">
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

        <SealDivider monogram={wedding.monogram} />

        <div className="reception reveal">
          <p className="section-title">Recepción</p>
          <p className="venue">&ldquo;{wedding.reception.venue}&rdquo;</p>
          <p className="address">{wedding.reception.address}</p>
        </div>

        <div className="reveal">
          <div className="padrinos-grid">
            {wedding.padrinos.map((group) => (
              <div key={group.label}>
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

        <SealDivider monogram={wedding.monogram} />

        <div className="reveal">
          <ConfirmationForm
            token={guest.token}
            initialConfirmed={guest.confirmed}
            deadlineIso={wedding.rsvpDeadlineIso}
          />
        </div>

        <div className="reveal">
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

        <p className="city reveal">{wedding.city}</p>
      </div>
    </div>
  );
}
