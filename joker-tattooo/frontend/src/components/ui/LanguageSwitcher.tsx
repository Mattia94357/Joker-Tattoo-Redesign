import { useLanguage } from '../../context/LanguageContext';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return <div className={`language-switcher ${compact ? 'language-switcher--compact' : ''}`} role="group" aria-label="Language / Lingua">
    <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
    <span>/</span>
    <button className={language === 'it' ? 'active' : ''} onClick={() => setLanguage('it')} aria-pressed={language === 'it'}>IT</button>
  </div>;
}
