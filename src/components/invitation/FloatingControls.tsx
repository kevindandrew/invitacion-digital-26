interface FloatingControlsProps {
  playing: boolean;
  onToggleMusic: () => void;
  onScrollDown: () => void;
}

export default function FloatingControls({ playing, onToggleMusic, onScrollDown }: FloatingControlsProps) {
  return (
    <div className="floating-controls">
      <button
        type="button"
        className="floating-btn"
        onClick={onToggleMusic}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
      >
        {playing ? 'Ⅱ' : '▶'}
      </button>
      <button
        type="button"
        className="floating-btn"
        onClick={onScrollDown}
        aria-label="Ir a la siguiente sección"
      >
        ↓
      </button>
    </div>
  );
}
