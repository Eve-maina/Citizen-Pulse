import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, lang, topicLabel, urgencyLabel } = useLanguage();

  if (!state?.result) {
    navigate('/');
    return null;
  }

  const { understood } = state.result;
  const urgency = (understood.urgency || 'medium').toLowerCase();
  const summary = (lang === 'sw' && understood.summarySw) || understood.summary;
  const photoCaption =
    (lang === 'sw' && understood.photoCaptionSw !== 'null' && understood.photoCaptionSw) ||
    understood.photoCaption;

  return (
    <>
      <h1 className="page-title">{t('confirmTitle')}</h1>
      <p className="page-subtitle">{topicLabel(state.topic)}</p>

      <div className="card">
        <div className="summary-row">
          <div>
            <div className="label">{t('confirmSummary')}</div>
            <div>{summary}</div>
          </div>

          {understood.language && (
            <div>
              <div className="label">{t('confirmLanguage')}</div>
              <div>{understood.language}</div>
            </div>
          )}

          {photoCaption && photoCaption !== 'null' && (
            <div>
              <div className="label">{t('confirmPhotoCaption')}</div>
              <div>{photoCaption}</div>
            </div>
          )}

          <div>
            <div className="label">{t('confirmUrgency')}</div>
            <span className={`urgency-badge urgency-${urgency}`}>{urgencyLabel(urgency)}</span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate('/')} type="button">
          {t('confirmSubmitAnother')}
        </button>
      </div>
    </>
  );
}
