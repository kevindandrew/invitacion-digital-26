import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeModalProps {
  url: string;
  guestName: string;
  onClose: () => void;
}

export default function QrCodeModal({ url, guestName, onClose }: QrCodeModalProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: { dark: '#43371F', light: '#F5EFDD' },
    }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const fileName = `qr-${guestName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}.png`;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <p className="admin-modal-title">{guestName}</p>

        {dataUrl ? (
          <img src={dataUrl} alt={`Código QR de invitación para ${guestName}`} className="admin-modal-qr" />
        ) : (
          <p className="admin-status">Generando QR…</p>
        )}

        <p className="admin-modal-url">{url}</p>

        <div className="admin-modal-actions">
          {dataUrl && (
            <a href={dataUrl} download={fileName} className="admin-login-submit">
              Descargar PNG
            </a>
          )}
          <button type="button" className="admin-signout" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
