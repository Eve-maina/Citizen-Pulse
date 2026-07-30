import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../api.js';
import { TopicIcon } from '../components/TopicIcon.jsx';
import { WaveDivider } from '../components/WaveDivider.jsx';
import oceanSunset from '../assets/photos/ocean-sunset.jpg';
import heroLandscape from '../assets/photos/hero-landscape.jpg';
import classroomPhoto from '../assets/photos/classroom.jpg';

export function Home() {
  const { t, topicLabel } = useLanguage();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api
      .getTopics()
      .then((d) => setTopics(d.topics))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="hero-banner" style={{ backgroundImage: `url(${oceanSunset})` }}>
        <div className="hero-text">
          <h1 className="page-title">{t('tagline')}</h1>
          <p className="page-subtitle">{t('chooseTopic')}</p>
        </div>
      </div>
      <WaveDivider />

      <div className="impact-strip">
        <div className="impact-photos">
          <img src={heroLandscape} alt="" className="impact-photo" />
          <img src={classroomPhoto} alt="" className="impact-photo" />
        </div>
        <p className="impact-caption">{t('impactCaption')}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      <div className="topic-grid">
        {topics.map((topic, i) => (
          <button
            key={topic}
            className="topic-card"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => navigate(`/submit/${encodeURIComponent(topic)}`)}
            type="button"
          >
            <span className="topic-icon">
              <TopicIcon topic={topic} />
            </span>
            {topicLabel(topic)}
          </button>
        ))}
      </div>
    </>
  );
}
