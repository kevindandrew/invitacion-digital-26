interface WeddingCalendarProps {
  year: string;
  month: string;
  day: string;
}

export default function WeddingCalendar({ year, month, day }: WeddingCalendarProps) {
  const numericYear = Number(year);
  const numericMonth = new Date(`${month} 1, ${year}`).getMonth();
  const numericDay = Number(day);
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(
    new Date(numericYear, numericMonth, 1),
  );
  const firstWeekday = new Date(numericYear, numericMonth, 1).getDay();
  const mondayOffset = (firstWeekday + 6) % 7;
  const daysInMonth = new Date(numericYear, numericMonth + 1, 0).getDate();
  const cells = Array.from({ length: mondayOffset + daysInMonth }, (_, index) =>
    index < mondayOffset ? null : index - mondayOffset + 1,
  );

  return (
    <section className="calendar-card reveal" aria-label={`Calendario de ${monthName} de ${year}`}>
      <div className="calendar-heading">
        <span className="calendar-kicker">Guarda la fecha</span>
        <span className="calendar-month">{monthName}</span>
        <span className="calendar-year">{year}</span>
      </div>
      <div className="calendar-body">
        <div className="calendar-weekdays" aria-hidden="true">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((weekday) => <span key={weekday}>{weekday}</span>)}
        </div>
        <div className="calendar-grid">
            {cells.map((value, index) => (
              <span className={`calendar-day ${value === numericDay ? 'calendar-day--event' : ''}`} key={`${value}-${index}`}>
                {value === numericDay ? '' : value ?? ''}
                {value === numericDay && <span className="calendar-heart" aria-hidden="true"><span>♥<b>{value}</b></span></span>}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
