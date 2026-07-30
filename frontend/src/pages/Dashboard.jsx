import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../api.js';
import { BarList } from '../components/BarList.jsx';
import { VerticalBarChart } from '../components/VerticalBarChart.jsx';
import { PieChart } from '../components/PieChart.jsx';
import { GrievanceFeedList } from '../components/GrievanceFeedList.jsx';

export function Dashboard() {
  const { t, topicLabel } = useLanguage();
  const [hotspots, setHotspots] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [urgencyStats, setUrgencyStats] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api.getHotspots().then((d) => setHotspots(d.hotspots)).catch((e) => setError(e.message));
    api.getTopicStats().then((d) => setTopicStats(d.topics)).catch((e) => setError(e.message));
    api.getUrgencyStats().then((d) => setUrgencyStats(d.urgency)).catch((e) => setError(e.message));
    api
      .getRecommendations()
      .then((d) => setRanking(d.ranking || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRanking(false));
  }, []);

  const wardItems = hotspots
    .slice()
    .sort((a, b) => b.total - a.total)
    .map((h) => ({ label: h.ward, value: h.total }));

  const topicItems = topicStats
    .filter((t) => t.count > 0)
    .map((t) => ({ label: topicLabel(t.topic), value: t.count }));

  return (
    <div className="dashboard-page">
      <h1 className="page-title">{t('dashboardTitle')}</h1>
      <p className="page-subtitle">{t('dashboardSubtitle')}</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="chart-grid">
        <section className="chart-card">
          <h2 className="chart-heading">{t('dashboardUrgency')}</h2>
          {urgencyStats ? (
            <PieChart data={urgencyStats} />
          ) : (
            <div className="loading-state">{t('dashboardLoading')}</div>
          )}
        </section>

        <section className="chart-card">
          <h2 className="chart-heading">{t('dashboardTopics')}</h2>
          {topicItems.length > 0 ? (
            <VerticalBarChart items={topicItems} colorVar="var(--ke-green)" />
          ) : (
            <p className="empty-state">{t('dashboardEmpty')}</p>
          )}
        </section>

        <section className="chart-card">
          <h2 className="chart-heading">{t('dashboardHotspots')}</h2>
          {wardItems.length > 0 ? (
            <BarList items={wardItems} colorVar="var(--ocean)" />
          ) : (
            <p className="empty-state">{t('dashboardEmpty')}</p>
          )}
        </section>
      </div>

      {loadingRanking && <div className="loading-state">{t('dashboardLoading')}</div>}

      {!loadingRanking && ranking?.length === 0 && (
        <div className="empty-state">{t('dashboardEmpty')}</div>
      )}

      {!loadingRanking && ranking?.length > 0 && (
        <ul className="rank-list">
          {ranking
            .slice()
            .sort((a, b) => a.rank - b.rank)
            .map((item) => (
              <li className="rank-item" key={`${item.title}-${item.ward}`}>
                <div className="rank-header">
                  <span className="rank-number">#{item.rank}</span>
                  <span className="rank-title">{item.title}</span>
                </div>
                <div className="rank-meta">
                  {item.ward} · score {item.score}
                </div>
                <div className="rationale">{item.rationale}</div>
                {item.evidence && (
                  <div className="evidence-pills">
                    {Object.entries(item.evidence).map(([k, v]) => (
                      <span className="evidence-pill" key={k}>
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}

      <section className="dashboard-feed-section">
        <h2 className="section-heading">{t('feedTitle')}</h2>
        <p className="section-subheading">{t('dashboardFeedSubtitle')}</p>
        <GrievanceFeedList showVoting={false} layout="sidebar" />
      </section>
    </div>
  );
}
