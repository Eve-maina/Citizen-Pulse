import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api, RejectionError } from '../api.js';

export function Submit() {
  const { topic } = useParams();
  const { t, lang, topicLabel } = useLanguage();
  const navigate = useNavigate();

  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState('');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [rejection, setRejection] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api
      .getWards()
      .then((d) => setWards(d.wards))
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setRejection(null);
    if (!text.trim() && !photo) {
      setError('Please add text or a photo.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('topic', topic);
      formData.append('ward', ward);
      formData.append('text', text);
      formData.append('channel', 'web');
      if (photo) formData.append('photo', photo);

      const result = await api.submit(formData);
      navigate('/confirmation', { state: { result, topic } });
    } catch (err) {
      if (err instanceof RejectionError) {
        setRejection(err);
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Link to="/" className="back-link">
        {t('backToTopics')}
      </Link>
      <h1 className="page-title">{topicLabel(topic)}</h1>
      <p className="page-subtitle">{t('formTitle')}</p>

      {error && <div className="error-banner">{error}</div>}

      {rejection && (
        <div className="rejection-banner">
          <span className="rejection-title">{t('rejectedTitle')}</span>
          <p>{(lang === 'sw' && rejection.reasonSw) || rejection.reason}</p>
          <p className="rejection-hint">{t('rejectedHint')}</p>
        </div>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="ward">{t('formWard')}</label>
          <select id="ward" value={ward} onChange={(e) => setWard(e.target.value)}>
            <option value="">{t('formWardPlaceholder')}</option>
            {wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="text">{t('formText')}</label>
          <textarea
            id="text"
            placeholder={t('formTextPlaceholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="photo">{t('formPhoto')}</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? t('formSubmitting') : t('formSubmit')}
        </button>
      </form>
    </>
  );
}
