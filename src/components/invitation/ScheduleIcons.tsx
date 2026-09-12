export type ScheduleIconName = 'rings' | 'toast' | 'dance' | 'dinner' | 'cake';

function Rings() {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="19" cy="26" r="9" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="29" cy="26" r="9" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function Toast() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <g transform="rotate(-16 16 22)">
        <path d="M10 9h12l-2 14a4 4 0 0 1-8 0z" />
        <line x1="16" y1="23" x2="16" y2="33" />
        <line x1="12" y1="33" x2="20" y2="33" />
      </g>
      <g transform="rotate(16 32 22)">
        <path d="M26 9h12l-2 14a4 4 0 0 1-8 0z" />
        <line x1="32" y1="23" x2="32" y2="33" />
        <line x1="28" y1="33" x2="36" y2="33" />
      </g>
    </svg>
  );
}

function Dance() {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" stroke="currentColor">
      <ellipse cx="14" cy="34" rx="5.5" ry="4.2" strokeWidth="0" />
      <rect x="18.5" y="9" width="2.2" height="25" strokeWidth="0" />
      <path d="M20.5 9 L32 5 L32 14 L20.5 18 Z" strokeWidth="0" />
    </svg>
  );
}

function Dinner() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6v11M11 6v6a3 3 0 0 0 6 0V6M14 17v25" />
      <path d="M34 6c-4.5 1-7 5.5-6 10.5.8 3.8 3.6 6 6 6.5v19" />
      <path
        d="M21.5 8c1-2 3.6-2 4.5 0 .9-2 3.5-2 4.5 0 0 2.8-4.5 5.6-4.5 5.6s-4.5-2.8-4.5-5.6z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function Cake() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="27" width="30" height="11" rx="1.5" />
      <rect x="15" y="17" width="18" height="10" rx="1.5" />
      <path
        d="M21.5 10c1-2 3.6-2 4.5 0 .9-2 3.5-2 4.5 0 0 2.8-4.5 5.6-4.5 5.6s-4.5-2.8-4.5-5.6z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export default function ScheduleIcon({ name }: { name: ScheduleIconName }) {
  switch (name) {
    case 'rings':
      return <Rings />;
    case 'toast':
      return <Toast />;
    case 'dance':
      return <Dance />;
    case 'dinner':
      return <Dinner />;
    case 'cake':
      return <Cake />;
    default:
      return null;
  }
}
