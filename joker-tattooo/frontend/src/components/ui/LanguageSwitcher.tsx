import { useLanguage } from '../../context/LanguageContext';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return <div className={`language-switcher ${compact ? 'language-switcher--compact' : ''}`} role="group" aria-label="Language / Lingua">
    <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'} aria-label="Switch to English" title="English"><span className="language-flag" aria-hidden="true">🇬🇧</span></button>
    <button className={language === 'it' ? 'active' : ''} onClick={() => setLanguage('it')} aria-pressed={language === 'it'} aria-label="Passa all’italiano" title="Italiano"><span className="language-flag" aria-hidden="true">🇮🇹</span></button>
  </div>;
}
