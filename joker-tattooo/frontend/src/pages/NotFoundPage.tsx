import { Button } from '../components/ui/Button';
import { SEO } from '../components/seo/SEO';
import { seoConfig } from '../config/seo';
import { useLanguage } from '../context/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();
  return <main className="page not-found">
    <SEO {...seoConfig.pages.notFound} noindex />
    <p className="eyebrow">404 / {t('Page Not Found')}</p>
    <h1>{t('Wrong turn.')}<br /><span>{t('Let’s get you back.')}</span></h1>
    <p>{t('The page you requested does not exist. Return home, explore the gallery or start a conversation with the studio.')}</p>
    <div className="button-row">
      <Button to="/">{t('Back to Home')}</Button>
      <Button to="/gallery" variant="outline">{t('Explore the Gallery')}</Button>
      <Button to="/contact" variant="outline">{t('Contact the Studio')}</Button>
    </div>
  </main>;
}
