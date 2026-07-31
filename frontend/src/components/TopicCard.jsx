import { TopicIcon } from './TopicIcon.jsx';

const TOPIC_ACCENTS = {
  Governance: { accent: '#00693e', bg: 'linear-gradient(135deg, #e8f5ee 0%, #f0faf4 100%)' },
  Education: { accent: '#0f7d9e', bg: 'linear-gradient(135deg, #e3f4f8 0%, #f0f9fc 100%)' },
  Health: { accent: '#b71c1c', bg: 'linear-gradient(135deg, #fce8e8 0%, #fdf5f5 100%)' },
  'Water & Infrastructure': { accent: '#00838f', bg: 'linear-gradient(135deg, #e0f4f5 0%, #f0fafb 100%)' },
  Security: { accent: '#37474f', bg: 'linear-gradient(135deg, #eceff1 0%, #f5f7f8 100%)' },
  Agriculture: { accent: '#558b2f', bg: 'linear-gradient(135deg, #edf3e4 0%, #f6f9f0 100%)' },
  Environment: { accent: '#2e7d32', bg: 'linear-gradient(135deg, #e6f2e7 0%, #f2f9f3 100%)' },
};

export function TopicCard({ topic, title, description, examples, index, onSelect, photo }) {
  const { accent, bg } = TOPIC_ACCENTS[topic] ?? TOPIC_ACCENTS.Governance;

  return (
    <button
      className="topic-card"
      style={{
        '--topic-accent': accent,
        '--topic-bg': bg,
        animationDelay: `${index * 70}ms`,
        ...(photo ? { '--topic-photo': `url(${photo})` } : {}),
      }}
      onClick={() => onSelect(topic)}
      type="button"
    >
      <span className="topic-card-accent" aria-hidden="true" />
      <div className="topic-card-top">
        <span className="topic-icon">
          <TopicIcon topic={topic} size={28} />
        </span>
        <span className="topic-card-arrow" aria-hidden="true">
          →
        </span>
      </div>
      <h3 className="topic-card-title">{title}</h3>
      <p className="topic-card-desc">{description}</p>
      {examples?.length > 0 && (
        <ul className="topic-card-examples">
          {examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      )}
    </button>
  );
}
