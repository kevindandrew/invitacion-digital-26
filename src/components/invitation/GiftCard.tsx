import { useState } from 'react';

interface GiftCardProps {
  cardImage: string;
  qrImage: string;
  bank: {
    name: string;
    account: string;
  };
}

export default function GiftCard({ cardImage, qrImage, bank }: GiftCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'qr' | 'bank'>('qr');
  const [copied, setCopied] = useState(false);

  const close = () => {
    setOpen(false);
    setTab('qr');
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bank.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button type="button" className="gift-card-trigger" onClick={() => setOpen(true)}>
        <img src={cardImage} alt="Tarjeta para dejar tu regalo de boda" className="gift-card-image" />
        <span className="gift-card-hint">Click en la tarjeta para ver el QR o la cuenta bancaria</span>
      </button>

      {open && (
        <div
          className="gift-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Mesa de regalos"
          onClick={close}
        >
          <div className="gift-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="gift-modal-close" onClick={close} aria-label="Cerrar">
              &times;
            </button>
            <p className="gift-modal-title">Mesa de Regalos</p>

            <div className="gift-modal-tabs">
              <button
                type="button"
                className={`gift-modal-tab ${tab === 'qr' ? 'gift-modal-tab--active' : ''}`}
                onClick={() => setTab('qr')}
              >
                Código QR
              </button>
              <button
                type="button"
                className={`gift-modal-tab ${tab === 'bank' ? 'gift-modal-tab--active' : ''}`}
                onClick={() => setTab('bank')}
              >
                Transferencia
              </button>
            </div>

            {tab === 'qr' ? (
              <div className="gift-modal-panel">
                <img src={qrImage} alt="Código QR para enviar un regalo en dinero" className="gift-modal-qr" />
              </div>
            ) : (
              <div className="gift-modal-panel gift-modal-bank">
                <p className="gift-bank-row">
                  <span>Banco</span>
                  <b>{bank.name}</b>
                </p>
                <p className="gift-bank-row">
                  <span>N.º de cuenta</span>
                  <b>{bank.account}</b>
                </p>
                <button type="button" className="gift-bank-copy" onClick={handleCopy}>
                  {copied ? 'Copiado ✓' : 'Copiar número de cuenta'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
