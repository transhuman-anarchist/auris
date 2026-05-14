import { useEffect } from 'react';
import './Exercise.css';

function formatAnswer(answer) {
  if (Array.isArray(answer)) return answer.join(', ');
  if (answer === 'correct') return 'corretto';
  return String(answer);
}

export default function FeedbackOverlay({ feedback, onDismiss }) {
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(onDismiss, 1200);
      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  return (
    <div className={`feedback-overlay ${feedback.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
      <span className="feedback-icon">{feedback.correct ? '✓' : '✗'}</span>
      <span className="feedback-text">
        {feedback.correct ? 'Corretto!' : `Sbagliato — era ${formatAnswer(feedback.correctAnswer)}`}
      </span>
    </div>
  );
}
