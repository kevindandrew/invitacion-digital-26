import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface AudioTrack {
  title: string;
  src: string;
}

export interface AudioPlayerHandle {
  play: () => void;
  toggle: () => void;
}

interface AudioPlayerProps {
  onPlayingChange?: (playing: boolean) => void;
}

const musicModules = import.meta.glob<unknown>('../../assets/music/*.{mp3,MP3}', { eager: true });

function resolveSrc(mod: unknown): string {
  const value = (mod as { default?: unknown } | undefined)?.default ?? mod;
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'src' in value) {
    return (value as { src: string }).src;
  }
  return '';
}

function titleFromPath(path: string): string {
  const fileName = path.split('/').pop() ?? path;
  const withoutExt = fileName.replace(/\.[^.]+$/, '');
  const cleaned = withoutExt.replace(/^\d+[\s._-]*/, '').replace(/[-_]+/g, ' ').trim();
  return cleaned.length > 0 ? cleaned : withoutExt;
}

const tracks: AudioTrack[] = Object.keys(musicModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path) => ({ title: titleFromPath(path), src: resolveSrc(musicModules[path]) }))
  .filter((track) => track.src);

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(function AudioPlayer({ onPlayingChange }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const wantsToPlayRef = useRef(false);

  useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current;
      if (!audio) return;
      wantsToPlayRef.current = true;
      void audio.play().catch(() => setPlaying(false));
    },
    toggle: () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        wantsToPlayRef.current = true;
        void audio.play().catch(() => setPlaying(false));
      } else {
        wantsToPlayRef.current = false;
        audio.pause();
      }
    },
  }), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncState = () => setPlaying(!audio.paused);
    const nextTrack = () => {
      wantsToPlayRef.current = true;
      setTrackIndex((current) => (current + 1) % tracks.length);
    };
    audio.addEventListener('play', syncState);
    audio.addEventListener('pause', syncState);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('play', syncState);
      audio.removeEventListener('pause', syncState);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !wantsToPlayRef.current) return;
    void audio.play().catch(() => setPlaying(false));
  }, [trackIndex]);

  if (tracks.length === 0) return null;

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      wantsToPlayRef.current = true;
      await audio.play().catch(() => setPlaying(false));
    } else {
      wantsToPlayRef.current = false;
      audio.pause();
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  return (
    <aside className="audio-player" aria-label="Reproductor de música">
      <audio ref={audioRef} src={tracks[trackIndex]?.src} preload="auto" />
      <span className="audio-copy"><span>soundtrack {trackIndex + 1}/{tracks.length}</span><strong>{tracks[trackIndex]?.title}</strong></span>
      <button type="button" className="audio-control" onClick={togglePlayback} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
        {playing ? 'Ⅱ' : '▶'}
      </button>
      <button type="button" className="audio-mute" onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar música'}>
        {muted ? '×' : '•••'}
      </button>
      <button
        type="button"
        className="audio-next"
        onClick={() => {
          wantsToPlayRef.current = !audioRef.current?.paused;
          setTrackIndex((current) => (current + 1) % tracks.length);
        }}
        aria-label="Siguiente canción"
      >
        ›
      </button>
    </aside>
  );
});

export default AudioPlayer;
