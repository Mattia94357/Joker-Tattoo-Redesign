import type { ReactNode } from 'react';
import hygieneImage from '../../assets/images/optimized/joker-tattoo-health-and-safety.webp';
import hygieneImageSmall from '../../assets/images/optimized/joker-tattoo-health-and-safety-768.webp';
import { useLanguage } from '../../context/LanguageContext';
import { Reveal } from '../ui/Reveal';

const safetyFeatures: Array<{ title: string; text: string; icon: ReactNode }> = [
  {
    title: 'Single-Use Sterile Needles',
    text: 'Every needle is opened in front of you and safely disposed of after your session.',
    icon: <><path d="M9 3h6v4H9z" /><path d="M10 7v8l2 3 2-3V7M12 18v3M9 21h6" /></>,
  },
  {
    title: 'Disposable Protective Equipment',
    text: 'Fresh gloves, single-use materials and protective barriers are used throughout every session.',
    icon: <><path d="M8 11V5a1.5 1.5 0 0 1 3 0v5-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v6-2a1.5 1.5 0 0 1 3 0v4c0 4.4-3.6 8-8 8h-1c-3.2 0-5-1.8-7-5l-2-3a1.7 1.7 0 0 1 2.7-2l3.3 3z" /></>,
  },
  {
    title: 'Medical-Grade Sterilisation',
    text: 'We follow professional sterilisation procedures and keep every work area meticulously clean.',
    icon: <><path d="M12 3v18M3 12h18" /><path d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" /><circle cx="12" cy="12" r="9" /></>,
  },
  {
    title: 'Professional Tattoo Inks',
    text: 'We use high-quality professional inks selected for safety, colour clarity and lasting results.',
    icon: <><path d="M8 3h8l1 4H7zM7 7h10l1 14H6z" /><path d="M9 12c1.5-2 4.5-2 6 0-1.5 2-4.5 2-6 0Z" /></>,
  },
  {
    title: 'Experienced Tattoo Artists',
    text: 'Our Tattoo Artists bring experience, precision and close attention to every detail.',
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 3.5-6 8-6s7.2 1.8 8 6M18 4l1.2 1.2L22 4" /></>,
  },
  {
    title: 'Aftercare Guidance',
    text: 'You will receive clear aftercare advice to support healing and protect the quality of your tattoo.',
    icon: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /><path d="M8.5 12h7M12 8.5v7" /></>,
  },
];

export function SafetySection() {
  const { t } = useLanguage();

  return <section className="safety-section" aria-labelledby="safety-heading">
    <div className="safety-section__glow" aria-hidden="true" />
    <div className="safety-section__inner">
      <Reveal className="safety-section__header">
        <p className="eyebrow">{t('Hygiene & Safety')}</p>
        <h2 id="safety-heading">{t('Care you can see.')}</h2>
        <p>{t('At Joker Tattoo, strict hygiene protocols, professional equipment and sterile single-use supplies are part of every session.')}</p>
      </Reveal>
      <div className="safety-section__content">
        <Reveal className="safety-section__visual">
          <img src={hygieneImage} srcSet={`${hygieneImageSmall} 768w, ${hygieneImage} 1280w`} sizes="(max-width: 1050px) calc(100vw - 40px), 40vw" width="1280" height="853" alt={t('Tattoo Artist working in the clean, professional Joker Tattoo studio in Patong')} loading="lazy" decoding="async" />
        </Reveal>
        <div className="safety-features">
          {safetyFeatures.map((feature, index) => <Reveal key={feature.title} className="safety-card">
            <div className="safety-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">{feature.icon}</svg></div>
            <span className="safety-card__number">0{index + 1}</span>
            <h3>{t(feature.title)}</h3>
            <p>{t(feature.text)}</p>
          </Reveal>)}
        </div>
      </div>
    </div>
  </section>;
}
