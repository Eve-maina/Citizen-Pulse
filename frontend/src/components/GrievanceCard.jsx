import { useState } from 'react';
import { api, BASE_URL } from '../api.js';
import { getVote, setVote } from '../lib/votedStore.js';
import { useLanguage } from '../context/LanguageContext.jsx';

function ThumbIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === 'down' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M7 10 v10 H4 a1 1 0 0 1 -1 -1 v-8 a1 1 0 0 1 1 -1 Z" />
      <path d="M7 10 l3 -7 a2 2 0 0 1 2 2 v4 h6 a2 2 0 0 1 2 2.4 l-1.5 7 A2 2 0 0 1 16.5 20 H7" />
    </svg>
  );
}

export function GrievanceCard({ submission, topicLabel, showVoting = true }) {
  const { lang, urgencyLabel } = useLanguage();
  const [upvotes, setUpvotes] = useState(submission.upvotes || 0);
  const [downvotes, setDownvotes] = useState(submission.downvotes || 0);
  const [voted, setVoted] = useState(() => getVote(submission.id));
  const [voting, setVoting] = useState(false);

  const urgency = (submission.urgency || 'medium').toLowerCase();
  const bodyText =
    (lang === 'sw' && submission.summarySw) ||
    submission.summary ||
    submission.translatedText ||
    submission.rawText ||
    '';
  const tags =
    lang === 'sw' && submission.subtopicsSw?.length ? submission.subtopicsSw : submission.subtopics;

  async function handleVote(direction) {
    if (voted || voting) return;
    setVoting(true);
    try {
      const result = await api.vote(submission.id, direction);
      setUpvotes(result.upvotes);
      setDownvotes(result.downvotes);
      setVote(submission.id, direction);
      setVoted(direction);
    } catch {
      // silently ignore — vote just won't register
    } finally {
      setVoting(false);
    }
  }

  return (
    <article className="grievance-card">
      <div className="grievance-header">
        <span className="grievance-topic">{topicLabel(submission.topic)}</span>
        {submission.ward && <span className="grievance-ward">{submission.ward}</span>}
        <span className={`urgency-badge urgency-${urgency}`}>{urgencyLabel(urgency)}</span>
      </div>

      <p className="grievance-body">{bodyText}</p>

      {tags?.length > 0 && (
        <div className="grievance-tags">
          {tags.map((tag) => (
            <span className="grievance-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {submission.photoUrl && (
        <img className="grievance-photo" src={`${BASE_URL}${submission.photoUrl}`} alt="" />
      )}

      <div className="grievance-footer">
        <time className="grievance-date">
          {new Date(submission.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </time>

        {showVoting && (
          <div className="vote-controls">
            <button
              type="button"
              className={`vote-btn ${voted === 'up' ? 'voted' : ''}`}
              onClick={() => handleVote('up')}
              disabled={!!voted || voting}
              aria-label={`Upvote (${upvotes})`}
            >
              <ThumbIcon direction="up" />
              {upvotes}
            </button>
            <button
              type="button"
              className={`vote-btn ${voted === 'down' ? 'voted' : ''}`}
              onClick={() => handleVote('down')}
              disabled={!!voted || voting}
              aria-label={`Downvote (${downvotes})`}
            >
              <ThumbIcon direction="down" />
              {downvotes}
            </button>
          </div>
        )}

        {!showVoting && (
          <div className="vote-summary">
            <ThumbIcon direction="up" /> {upvotes} <ThumbIcon direction="down" /> {downvotes}
          </div>
        )}
      </div>
    </article>
  );
}
