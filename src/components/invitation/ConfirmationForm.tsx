import { useState } from 'react';

interface ConfirmationFormProps {
  token: string;
  initialConfirmed: boolean | null;
  deadlineIso: string;
}

export default function ConfirmationForm({ token, initialConfirmed, deadlineIso }: ConfirmationFormProps) {
  const [confirmed, setConfirmed] = useState<boolean | null>(initialConfirmed);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isClosed = Date.now() > new Date(deadlineIso).getTime();

  async function respond(value: boolean) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, confirmed: value }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'No pudimos guardar tu respuesta. Inténtalo de nuevo.');
        return;
      }
      setConfirmed(value);
    } catch {
      setError('No pudimos guardar tu respuesta. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rsvp-section">
      <p className="section-title">Confirma tu asistencia</p>

      {confirmed === true && <p className="rsvp-message">¡Gracias por confirmar! Los esperamos con muchas ganas.</p>}
      {confirmed === false && <p className="rsvp-message">Gracias por avisarnos. ¡Los vamos a extrañar!</p>}
      {confirmed === null && (
        <p className="rsvp-message">
          {isClosed ? 'No llegamos a recibir tu respuesta a tiempo.' : 'Cuéntanos si puedes acompañarnos.'}
        </p>
      )}

      {isClosed ? (
        <p className="rsvp-closed">
          Las confirmaciones cerraron el 19 de septiembre. Si necesitas avisar un cambio, escríbenos directamente.
        </p>
      ) : (
        <div className="rsvp-buttons">
          <button
            type="button"
            className={`rsvp-button rsvp-button--yes ${confirmed === true ? 'is-active' : ''}`}
            onClick={() => respond(true)}
            disabled={submitting}
          >
            Sí, ahí estaremos
          </button>
          <button
            type="button"
            className={`rsvp-button rsvp-button--no ${confirmed === false ? 'is-active' : ''}`}
            onClick={() => respond(false)}
            disabled={submitting}
          >
            No podremos asistir
          </button>
        </div>
      )}

      {error && <p className="rsvp-error">{error}</p>}
    </div>
  );
}
