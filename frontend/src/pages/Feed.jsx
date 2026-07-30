import { useLanguage } from '../context/LanguageContext.jsx';
import { GrievanceFeedList } from '../components/GrievanceFeedList.jsx';

export function Feed() {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="page-title">{t('feedTitle')}</h1>
      <p className="page-subtitle">{t('feedSubtitle')}</p>
      <GrievanceFeedList showVoting />
    </>
  );
}
