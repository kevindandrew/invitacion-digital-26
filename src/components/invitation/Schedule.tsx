import ScheduleIcon, { type ScheduleIconName } from './ScheduleIcons';

interface ScheduleItem {
  icon: ScheduleIconName;
  label: string;
  time: string;
}

interface ScheduleProps {
  items: readonly ScheduleItem[];
}

export default function Schedule({ items }: ScheduleProps) {
  return (
    <div className="schedule-section">
      <p className="section-title">Cronograma</p>

      <ol className="schedule-list">
        {items.map((item) => (
          <li className="schedule-row reveal" key={`${item.label}-${item.time}`}>
            <span className="schedule-row-icon">
              <ScheduleIcon name={item.icon} />
            </span>
            <span className="schedule-row-copy">
              <span className="schedule-row-label">{item.label}</span>
              <span className="schedule-row-time">{item.time}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
