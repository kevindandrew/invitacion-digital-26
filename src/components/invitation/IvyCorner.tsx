interface IvyCornerProps {
  flip?: boolean;
  variant?: 'hero' | 'muted';
}

export default function IvyCorner({ flip = false, variant = 'hero' }: IvyCornerProps) {
  const leafColor = variant === 'hero' ? 'var(--color-moss-light)' : 'var(--color-moss)';
  const stemColor = variant === 'hero' ? 'var(--color-moss-light)' : 'var(--color-moss)';
  const sparkleColor = variant === 'hero' ? 'var(--color-gold-light)' : 'var(--color-gold)';

  return (
    <svg
      className={`ivy-corner ivy-corner--${variant}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      viewBox="0 0 160 200"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4C34 24 42 52 30 78C18 104 26 128 18 150C12 166 16 180 28 190"
        stroke={stemColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M6 4C22 10 34 8 44 -2"
        stroke={stemColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <g fill={leafColor}>
        <ellipse cx="26" cy="18" rx="13" ry="7.5" transform="rotate(30 26 18)" opacity="0.95" />
        <ellipse cx="40" cy="30" rx="11" ry="6.5" transform="rotate(-25 40 30)" opacity="0.8" />
        <ellipse cx="38" cy="52" rx="12.5" ry="7" transform="rotate(40 38 52)" opacity="0.9" />
        <ellipse cx="20" cy="66" rx="10" ry="6" transform="rotate(-30 20 66)" opacity="0.75" />
        <ellipse cx="34" cy="86" rx="11.5" ry="6.5" transform="rotate(28 34 86)" opacity="0.9" />
        <ellipse cx="16" cy="98" rx="9.5" ry="5.5" transform="rotate(-45 16 98)" opacity="0.7" />
        <ellipse cx="28" cy="118" rx="10.5" ry="6" transform="rotate(35 28 118)" opacity="0.85" />
        <ellipse cx="12" cy="132" rx="9" ry="5.2" transform="rotate(-20 12 132)" opacity="0.65" />
        <ellipse cx="24" cy="152" rx="9.5" ry="5.5" transform="rotate(42 24 152)" opacity="0.8" />
        <ellipse cx="30" cy="176" rx="8.5" ry="5" transform="rotate(-15 30 176)" opacity="0.6" />
      </g>
      <g fill={sparkleColor} opacity="0.85">
        <circle cx="58" cy="14" r="1.6" />
        <circle cx="70" cy="34" r="1.1" />
        <circle cx="50" cy="46" r="1.3" />
        <circle cx="64" cy="70" r="1" />
        <circle cx="44" cy="108" r="1.2" />
      </g>
    </svg>
  );
}
