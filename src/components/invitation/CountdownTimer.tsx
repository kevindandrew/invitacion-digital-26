import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetIso: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetIso: string): TimeLeft {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function CountdownTimer({ targetIso }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetIso));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetIso)), 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  const units: [string, number][] = [
    ['Días', timeLeft?.days ?? 0],
    ['Horas', timeLeft?.hours ?? 0],
    ['Min', timeLeft?.minutes ?? 0],
    ['Seg', timeLeft?.seconds ?? 0],
  ];

  return (
    <div className="countdown" aria-hidden={timeLeft === null}>
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <span className="countdown-value">{timeLeft ? String(value).padStart(2, '0') : '--'}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
