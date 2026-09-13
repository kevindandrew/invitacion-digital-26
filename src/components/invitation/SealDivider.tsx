interface SealDividerProps {
  monogram: string;
}

function LeafSprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className="seal-divider-sprig"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      viewBox="0 0 40 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 8C12 8 20 8 38 8" stroke="var(--color-moss)" strokeWidth="1" opacity="0.6" />
      <g fill="var(--color-moss)">
        <ellipse cx="12" cy="6" rx="5.5" ry="3" transform="rotate(-18 12 6)" opacity="0.85" />
        <ellipse cx="20" cy="10" rx="5" ry="2.7" transform="rotate(18 20 10)" opacity="0.7" />
        <ellipse cx="28" cy="5.5" rx="4.5" ry="2.5" transform="rotate(-14 28 5.5)" opacity="0.6" />
      </g>
    </svg>
  );
}

export default function SealDivider({ monogram }: SealDividerProps) {
  return (
    <div className="seal-divider" aria-hidden="true">
      <span className="seal-divider-line" />
      <LeafSprig />
      <span className="seal-divider-seal">{monogram}</span>
      <LeafSprig flip />
      <span className="seal-divider-line" />
    </div>
  );
}
