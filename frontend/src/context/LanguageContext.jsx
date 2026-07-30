import { createContext, useContext, useState, useMemo } from 'react';
import { STRINGS, TOPIC_LABELS, URGENCY_LABELS } from '../i18n/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key,
      topicLabel: (topic) => TOPIC_LABELS[lang]?.[topic] ?? topic,
      urgencyLabel: (urgency) =>
        URGENCY_LABELS[lang]?.[urgency?.toLowerCase()] ?? URGENCY_LABELS.en[urgency?.toLowerCase()] ?? urgency,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
