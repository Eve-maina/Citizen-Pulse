import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LANGUAGES } from '../i18n/translations.js';

export function Layout({ children }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <>
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="flag-dot" aria-hidden="true" />
          {t('appName')}
        </Link>
        <nav>
          <Link to="/feed" className="nav-link">
            {t('feedNavLink')}
          </Link>
          <Link to="/dashboard" className="nav-link">
            {t('dashboardNavLink')}
          </Link>
          <div className="lang-toggle" role="group" aria-label="Language">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={l.code === lang ? 'active' : ''}
                onClick={() => setLang(l.code)}
                type="button"
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
