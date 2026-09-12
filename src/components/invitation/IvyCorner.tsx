interface IvyCornerProps {
  flip?: boolean;
}

export default function IvyCorner({ flip = false }: IvyCornerProps) {
  return (
    <svg
      className="ivy-corner"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      viewBox="0 0 120 160"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4C24 20 30 44 22 66C14 88 22 108 40 118"
        stroke="var(--color-moss)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g fill="var(--color-moss)">
        <ellipse cx="20" cy="22" rx="10" ry="6" transform="rotate(35 20 22)" />
        <ellipse cx="30" cy="48" rx="9" ry="5.5" transform="rotate(-20 30 48)" />
        <ellipse cx="16" cy="70" rx="9" ry="5.5" transform="rotate(50 16 70)" />
        <ellipse cx="34" cy="94" rx="8" ry="5" transform="rotate(-15 34 94)" />
        <ellipse cx="42" cy="116" rx="8" ry="5" transform="rotate(30 42 116)" />
      </g>
    </svg>
  );
}
