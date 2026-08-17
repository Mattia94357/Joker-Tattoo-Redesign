import hero from '../../assets/tattoo10.jpg';
import processImage from '../../assets/japanesebackjokertattoo.avif';
import hygieneImage from '../assets/images/optimized/joker-tattoo-health-and-safety.webp';
import hygieneImageSmall from '../assets/images/optimized/joker-tattoo-health-and-safety-768.webp';
import type { ReactNode } from 'react';
import { tattooStyles } from '../data/services';
import { customerReviews, googleReviewsUrl } from '../data/reviews';
import { Button } from '../components/ui/Button';
import { BookingButton } from '../components/booking/BookingButton';
import { ImageCard } from '../components/ui/ImageCard';
import { MagneticLink } from '../components/ui/MagneticLink';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { localBusinessSchema, webPageSchema, websiteSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

const safetyFeatures: Array<{ title: string; text: string; icon: ReactNode }> = [
  {
    title: 'Single-Use Sterile Needles',
    text: 'Every needle is opened in front of the client and disposed of immediately after use.',
    icon: <><path d="M9 3h6v4H9z" /><path d="M10 7v8l2 3 2-3V7M12 18v3M9 21h6" /></>,
  },
  {
    title: 'Disposable Protective Equipment',
    text: 'Fresh gloves, disposable materials and protective barriers are used throughout every tattoo session.',
    icon: <><path d="M8 11V5a1.5 1.5 0 0 1 3 0v5-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v6-2a1.5 1.5 0 0 1 3 0v4c0 4.4-3.6 8-8 8h-1c-3.2 0-5-1.8-7-5l-2-3a1.7 1.7 0 0 1 2.7-2l3.3 3z" /></>,
  },
  {
    title: 'Medical-Grade Sterilisation',
    text: 'Our studio follows professional sterilisation procedures and maintains a clean working environment.',
    icon: <><path d="M12 3v18M3 12h18" /><path d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" /><circle cx="12" cy="12" r="9" /></>,
  },
  {
    title: 'Premium Tattoo Inks',
    text: 'We use high-quality professional inks chosen for their safety, colour vibrancy and long-lasting results.',
    icon: <><path d="M8 3h8l1 4H7zM7 7h10l1 14H6z" /><path d="M9 12c1.5-2 4.5-2 6 0-1.5 2-4.5 2-6 0Z" /></>,
  },
  {
    title: 'Experienced Artists',
    text: 'Our artists combine years of experience with precision and attention to detail to deliver exceptional tattoos safely.',
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 3.5-6 8-6s7.2 1.8 8 6M18 4l1.2 1.2L22 4" /></>,
  },
  {
    title: 'Aftercare Guidance',
    text: 'Every client receives clear aftercare instructions to help their tattoo heal beautifully and maintain its quality.',
    icon: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /><path d="M8.5 12h7M12 8.5v7" /></>,
  },
];

export function HomePage() {
  const { t } = useLanguage();
  return <main>
    <SEO {...seoConfig.pages.home} structuredData={[localBusinessSchema(), websiteSchema(), webPageSchema(seoConfig.pages.home.path, seoConfig.pages.home.title, seoConfig.pages.home.description)]} />
    <section className="hero">
      <img className="hero__image" src={hero} width="1000" height="1260" alt={t('Traditional tiger Sak Yant tattoo created at Joker Tattoo Patong')} loading="eager" fetchPriority="high" decoding="async" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className="eyebrow">{t('Patong · Phuket · Custom tattoo studio')}</p>
        <h1><span>{t('Wear your story.')}</span><em>{t('Leave your mark.')}</em></h1>
        <p>{t('Custom tattoo work created in the heart of Patong, Phuket.')}</p>
        <div className="button-row"><Button to="/gallery">{t('Explore Our Work')}</Button><BookingButton variant="outline">{t('Book a Tattoo')}</BookingButton></div>
      </div>
      <a className="scroll-cue" href="#intro">{t('Scroll to discover')} <span aria-hidden="true">↓</span></a>
    </section>
    <section className="section intro" id="intro">
      <Reveal className="intro__image"><img src={processImage} sizes="(max-width: 600px) 88vw, 40vw" width="813" height="1024" alt={t('Japanese backpiece tattoo by Joker Tattoo Patong')} loading="lazy" decoding="async" /><span className="image-note">{t('Concept / Craft / Commitment')}</span></Reveal>
      <Reveal className="intro__copy"><p className="eyebrow">{t('A mark made personal')}</p><h2>{t('Not decoration.')}<br /><span>{t('A piece of you.')}</span></h2><p>{t('We approach every tattoo as a collaboration—built around your idea, your body and the way you want to carry it.')}</p><MagneticLink to="/what-we-do">{t('Discover the studio')}</MagneticLink></Reveal>
    </section>
    <section className="section section--charcoal"><Reveal><SectionHeading eyebrow={t('Ways to make a mark')} title={t('Styles with intent.')} text={t('Provisional categories for the first visual template.')} /></Reveal><div className="style-grid">{tattooStyles.map((style, index) => <ImageCard key={style.title} {...style} index={index} />)}</div></section>
    <section className="safety-section" aria-labelledby="safety-heading">
      <div className="safety-section__glow" aria-hidden="true" />
      <div className="safety-section__inner">
        <Reveal className="safety-section__header">
          <p className="eyebrow">{t('Hygiene & Safety')}</p>
          <h2 id="safety-heading">{t('Your Safety Comes First')}</h2>
          <p>{t('At Joker Tattoo, every tattoo is performed using strict hygiene protocols, professional equipment and single-use sterile supplies to ensure a safe, clean and comfortable experience.')}</p>
        </Reveal>
        <div className="safety-section__content">
          <Reveal className="safety-section__visual">
            <img src={hygieneImage} srcSet={`${hygieneImageSmall} 768w, ${hygieneImage} 1280w`} sizes="(max-width: 1050px) calc(100vw - 40px), 40vw" width="1280" height="853" alt={t('Joker Tattoo artist working in a professional hygiene and safety focused studio')} loading="lazy" decoding="async" />
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
    </section>
    <section className="section reviews-section">
      <Reveal><SectionHeading eyebrow={t('Google Reviews')} title={t('Stories carried forward.')} text={t('What clients say about their experience at Joker Tattoo Patong.')} /></Reveal>
      <div className="reviews-grid">{customerReviews.map((review, index) => <Reveal key={review.name} className="review-card">
        <div className="review-card__top"><span className="review-card__index">{String(index + 1).padStart(2, '0')}</span><span className="review-card__stars" aria-label={`${review.rating} ${t('out of 5 stars')}`}>{'★'.repeat(review.rating)}</span></div>
        <blockquote>“{t(review.text)}”</blockquote>
        <footer><strong>{review.name}</strong><span>{t('Customer Review')}</span></footer>
      </Reveal>)}</div>
      <a className="reviews-link" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">{t('Read all Google reviews')} <span aria-hidden="true">↗</span></a>
    </section>
    <section className="booking-cta"><div><p className="eyebrow">{t('Your idea starts here')}</p><h2>{t('Ready to make')}<br />{t('it permanent?')}</h2></div><div className="button-row"><BookingButton variant="red">{t('Discuss your tattoo idea')}</BookingButton><BookingButton variant="outline">{t('Book a Tattoo')}</BookingButton></div></section>
  </main>;
}
