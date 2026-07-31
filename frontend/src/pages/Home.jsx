import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../api.js';
import { TopicCard } from '../components/TopicCard.jsx';
import { WaveDivider } from '../components/WaveDivider.jsx';
import heroClassroom from '../assets/photos/hero-classroom.jpg';
import heroLandscape from '../assets/photos/hero-landscape.jpg';
import classroomPhoto from '../assets/photos/classroom.jpg';
import hospitalPhoto from '../assets/photos/hospital.jpg';
import agriculturePhoto from '../assets/photos/agriculture.jpg';
import environmentPhoto from '../assets/photos/environment.jpg';
import governancePhoto from '../assets/photos/governance.jpg';
import securityPhoto from '../assets/photos/security.jpg';

const TOPIC_PHOTOS = {
  Governance: governancePhoto,
  Education: classroomPhoto,
  Health: hospitalPhoto,
  Agriculture: agriculturePhoto,
  Environment: environmentPhoto,
  Security: securityPhoto,
  'Water & Infrastructure': heroLandscape,
};

export function Home() {
  const { t, topicLabel, topicDescription, topicExamples } = useLanguage();
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
    <div className="home-page">
      <div className="hero-banner" style={{ backgroundImage: `url(${heroClassroom})` }}>
        <div className="hero-text">
          <p className="hero-eyebrow">{t('appName')}</p>
          <h1 className="page-title">{t('tagline')}</h1>
          <p className="page-subtitle">{t('chooseTopic')}</p>
          <div className="hero-actions">
            <a href="#topics" className="btn-hero-primary">
              {t('topicsSectionTitle')}
            </a>
            <Link to="/feed" className="btn-hero-secondary">
              {t('feedNavLink')}
            </Link>
          </div>
        </div>
      </div>
      <WaveDivider />

      <div className="impact-strip">
        <p className="impact-caption">{t('impactCaption')}</p>
      </div>

      <section className="how-it-works">
        <h2 className="section-title">{t('howItWorksTitle')}</h2>
        <ol className="steps-row">
          <li className="step-card">
            <span className="step-num">1</span>
            <strong>{t('howItWorksStep1Title')}</strong>
            <p>{t('howItWorksStep1Desc')}</p>
          </li>
          <li className="step-card">
            <span className="step-num">2</span>
            <strong>{t('howItWorksStep2Title')}</strong>
            <p>{t('howItWorksStep2Desc')}</p>
          </li>
          <li className="step-card">
            <span className="step-num">3</span>
            <strong>{t('howItWorksStep3Title')}</strong>
            <p>{t('howItWorksStep3Desc')}</p>
          </li>
        </ol>
      </section>

      <section className="topics-section" id="topics">
        <div className="topics-section-header">
          <h2 className="section-title">{t('topicsSectionTitle')}</h2>
          <p className="section-subtitle">{t('topicsSectionSubtitle')}</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="topic-grid">
          {topics.map((topic, i) => (
            <TopicCard
              key={topic}
              topic={topic}
              title={topicLabel(topic)}
              description={topicDescription(topic)}
              examples={topicExamples(topic)}
              photo={TOPIC_PHOTOS[topic]}
              index={i}
              onSelect={(selected) => navigate(`/submit/${encodeURIComponent(selected)}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
