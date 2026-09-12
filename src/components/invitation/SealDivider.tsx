interface SealDividerProps {
  monogram: string;
}

export default function SealDivider({ monogram }: SealDividerProps) {
  return (
    <div className="seal-divider" aria-hidden="true">
      <span className="seal-divider-line" />
      <span className="seal-divider-seal">{monogram}</span>
      <span className="seal-divider-line" />
    </div>
  );
}
