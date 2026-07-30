import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../api.js';
import { GrievanceCard } from './GrievanceCard.jsx';

export function GrievanceFeedList({ showVoting = true, layout = 'stacked' }) {
  const { t, topicLabel } = useLanguage();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicFilter, setTopicFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api
      .getSubmissions()
      .then((d) => setSubmissions(d.submissions))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const topics = useMemo(() => [...new Set(submissions.map((s) => s.topic))], [submissions]);

  const visible = useMemo(() => {
    let list = submissions;
    if (topicFilter !== 'all') list = list.filter((s) => s.topic === topicFilter);
    list = list.slice();
    if (sort === 'top') {
      list.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [submissions, topicFilter, sort]);

  const controls = (
    <div className="feed-controls">
      <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
        <option value="all">{t('feedFilterAll')}</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topicLabel(topic)}
          </option>
        ))}
      </select>

      <div className="feed-sort-toggle" role="group">
        <button
          type="button"
          className={sort === 'newest' ? 'active' : ''}
          onClick={() => setSort('newest')}
        >
          {t('feedSortNewest')}
        </button>
        <button
          type="button"
          className={sort === 'top' ? 'active' : ''}
          onClick={() => setSort('top')}
        >
          {t('feedSortTop')}
        </button>
      </div>
    </div>
  );

  const results = (
    <>
      {loading && <div className="loading-state">{t('dashboardLoading')}</div>}

      {!loading && visible.length === 0 && <p className="empty-state">{t('feedEmpty')}</p>}

      {!loading && visible.length > 0 && (
        <div className="grievance-list">
          {visible.map((s) => (
            <GrievanceCard
              key={s.id}
              submission={s}
              topicLabel={topicLabel}
              showVoting={showVoting}
            />
          ))}
        </div>
      )}
    </>
  );

  if (layout === 'sidebar') {
    return (
      <>
        {error && <div className="error-banner">{error}</div>}
        <div className="feed-layout-grid">
          <aside className="feed-sidebar">{controls}</aside>
          <div className="feed-main">{results}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}
      {controls}
      {results}
    </>
  );
}
