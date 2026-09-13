interface EnvelopeProps {
  monogram: string;
  guestName?: string;
  opened: boolean;
  onOpen: () => void;
}

export default function Envelope({ monogram, guestName, opened, onOpen }: EnvelopeProps) {
  return (
    <div className={`envelope ${opened ? 'is-open' : ''}`}>
      <div className="envelope-card">
        <span className="envelope-card-greeting">
          Hola,
          <br />
          estás invitado&hellip;
        </span>
        <span className="envelope-card-rule" />
        {guestName && (
          <span className="envelope-card-guest">
            <span className="envelope-card-guest-label">Invitación para</span>
            <span className="envelope-card-guest-name">{guestName}</span>
          </span>
        )}
      </div>

      <div className="envelope-flap envelope-flap--top" />
      <div className="envelope-flap envelope-flap--right" />
      <div className="envelope-flap envelope-flap--bottom" />
      <div className="envelope-flap envelope-flap--left" />

      <div className="envelope-twine" />

      <button
        type="button"
        className="envelope-seal"
        onClick={onOpen}
        aria-expanded={opened}
        aria-label={opened ? 'Invitación abierta' : 'Abrir invitación'}
        disabled={opened}
      >
        <img src="/sellokyb.png" alt="Sello K y B" />
      </button>
    </div>
  );
}
