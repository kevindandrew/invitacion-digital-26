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

      <div className="schedule-timeline">
        <div className="schedule-line reveal" />

        {items.map((item, index) => {
          const delay = `${index * 0.15}s`;

          return (
            <div className="schedule-item reveal" style={{ transitionDelay: delay }} key={`${item.label}-${item.time}`}>
              <span className="schedule-node" style={{ transitionDelay: delay }} />
              <div className="schedule-content">
                <span className="schedule-icon">
                  <ScheduleIcon name={item.icon} />
                </span>
                <div className="schedule-copy">
                  <span className="schedule-label">{item.label}</span>
                  <span className="schedule-time">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
