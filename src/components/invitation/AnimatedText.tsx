import type { CSSProperties } from 'react';

interface AnimatedTextProps {
  children: string;
  className?: string;
}

export default function AnimatedText({ children, className = '' }: AnimatedTextProps) {
  return (
    <span className={`animated-text ${className}`} aria-label={children}>
      {Array.from(children).map((character, index) => (
        <span className="animated-text-character" style={{ '--character-index': index } as CSSProperties} aria-hidden="true" key={`${character}-${index}`}>
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </span>
  );
}
