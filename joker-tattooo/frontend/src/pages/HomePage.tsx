import { useEffect, useRef } from 'react';
import processImage from '../../assets/japanesebackjokertattoo.avif';
import heroVideo from '../../assets/jokertattooshopvideo.mp4';
import processImageSmall from '../assets/images/optimized/japanesebackjokertattoo-480.avif';
import processImageMedium from '../assets/images/optimized/japanesebackjokertattoo-768.avif';
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
import { imageObjectSchema, localBusinessSchema, organizationSchema, webPageSchema, websiteSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';
import { SafetySection } from '../components/sections/SafetySection';

export function HomePage() {
  const { t } = useLanguage();
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      const playback = video.play();
      if (playback) void playback.catch(() => undefined);
    };

    video.addEventListener('canplay', playVideo);
    playVideo();
    return () => video.removeEventListener('canplay', playVideo);
  }, []);

  return <main>
    <SEO {...seoConfig.pages.home} structuredData={[organizationSchema(), localBusinessSchema(), websiteSchema(), webPageSchema(seoConfig.pages.home.path, seoConfig.pages.home.title, seoConfig.pages.home.description), imageObjectSchema()]} />
    <section className="hero">
      <video ref={heroVideoRef} className="hero__image" src={heroVideo} width="883" height="1024" autoPlay muted loop playsInline preload="auto" controls={false} controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture aria-label={t('Tattoo Artist working with a client at Joker Tattoo in Patong')} />
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className="eyebrow">{t('Patong · Phuket · Custom tattoo studio')}</p>
        <h1><span>{t('Your body.')}</span><span>{t('Your idea.')}</span><em>{t('Our art.')}</em></h1>
        <p>{t('Custom tattoos, created with care in the heart of Patong, Phuket.')}</p>
        <div className="button-row"><Button to="/gallery">{t('Explore Our Work')}</Button><BookingButton variant="outline">{t('Book Your Tattoo')}</BookingButton></div>
      </div>
      <a className="scroll-cue" href="#intro">{t('Scroll to discover')} <span aria-hidden="true">↓</span></a>
    </section>
    <section className="section intro" id="intro">
      <Reveal className="intro__image"><img src={processImageSmall} srcSet={`${processImageSmall} 480w, ${processImageMedium} 768w, ${processImage} 813w`} sizes="(max-width: 600px) 88vw, 40vw" width="813" height="1024" alt={t('Japanese backpiece tattoo by Joker Tattoo Patong')} loading="lazy" decoding="async" /><span className="image-note">{t('Concept / Craft / Commitment')}</span></Reveal>
      <Reveal className="intro__copy"><p className="eyebrow">{t('Created for you')}</p><h2>{t('More than a tattoo.')}<br /><span>{t('A part of you.')}</span></h2><p>{t('We listen to your ideas and bring them to life, respecting your body and your style.')}</p><MagneticLink to="/why-joker">{t('Discover Joker Tattoo')}</MagneticLink></Reveal>
    </section>
    <section className="section section--charcoal"><Reveal><SectionHeading eyebrow={t('Our styles')} title={t('The right style for you.')} text={t('From realism to traditional, Japanese to Sak Yant. Find the style that best fits your idea.')}/></Reveal><div className="style-grid">{tattooStyles.map((style, index) => <ImageCard key={style.title} {...style} index={index} />)}</div></section>
    <SafetySection />
    <section className="section reviews-section">
      <Reveal><SectionHeading eyebrow={t('Google Reviews')} title={t('What our clients say.')} text={t('Experiences from people who chose Joker Tattoo in Patong.')} /></Reveal>
      <div className="reviews-grid">{customerReviews.map((review, index) => <Reveal key={review.name} className="review-card">
        <div className="review-card__top"><span className="review-card__index">{String(index + 1).padStart(2, '0')}</span><span className="review-card__stars" aria-label={`${review.rating} ${t('out of 5 stars')}`}>{'★'.repeat(review.rating)}</span></div>
        <blockquote>“{t(review.text)}”</blockquote>
        <footer><strong>{review.name}</strong><span>{t('Google Review')}</span></footer>
      </Reveal>)}</div>
      <a className="reviews-link" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">{t('Read all Google reviews')} <span aria-hidden="true">↗</span></a>
    </section>
    <section className="booking-cta"><div><p className="eyebrow">{t('Your idea starts here')}</p><h2>{t('Ready to create')}<br />{t('something unique?')}</h2></div><div className="button-row"><BookingButton variant="red">{t('Request a Consultation')}</BookingButton><BookingButton variant="outline">{t('Book Your Tattoo')}</BookingButton></div></section>
  </main>;
}
