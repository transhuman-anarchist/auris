import './Exercise.css';

export default function RetentionTimer({ seconds }) {
  if (seconds <= 0) return null;

  return (
    <div className="retention-timer">
      <div className="retention-ring">
        <span className="retention-count mono">{seconds}</span>
      </div>
      <span className="retention-label">Silenzio...</span>
    </div>
  );
}
