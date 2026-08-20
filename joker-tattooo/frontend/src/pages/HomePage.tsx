import processImage from '../../assets/japanesebackjokertattoo.avif';
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
  return <main>
    <SEO {...seoConfig.pages.home} structuredData={[organizationSchema(), localBusinessSchema(), websiteSchema(), webPageSchema(seoConfig.pages.home.path, seoConfig.pages.home.title, seoConfig.pages.home.description), imageObjectSchema()]} />
    <section className="hero">
      <picture><source type="image/avif" srcSet="/images/hero/traditional-tiger-sak-yant-tattoo-480.avif 480w, /images/hero/traditional-tiger-sak-yant-tattoo-768.avif 768w, /images/hero/traditional-tiger-sak-yant-tattoo.avif 1000w" sizes="100vw" /><img className="hero__image" src="/images/hero/traditional-tiger-sak-yant-tattoo.webp" srcSet="/images/hero/traditional-tiger-sak-yant-tattoo-480.webp 480w, /images/hero/traditional-tiger-sak-yant-tattoo-768.webp 768w, /images/hero/traditional-tiger-sak-yant-tattoo.webp 1000w" sizes="100vw" width="1000" height="1260" alt={t('Traditional tiger Sak Yant tattoo created at Joker Tattoo Patong')} loading="eager" fetchPriority="high" decoding="async" /></picture>
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
      <Reveal className="intro__image"><img src={processImageSmall} srcSet={`${processImageSmall} 480w, ${processImageMedium} 768w, ${processImage} 813w`} sizes="(max-width: 600px) 88vw, 40vw" width="813" height="1024" alt={t('Japanese backpiece tattoo by Joker Tattoo Patong')} loading="lazy" decoding="async" /><span className="image-note">{t('Concept / Craft / Commitment')}</span></Reveal>
      <Reveal className="intro__copy"><p className="eyebrow">{t('A mark made personal')}</p><h2>{t('Not decoration.')}<br /><span>{t('A piece of you.')}</span></h2><p>{t('We approach every tattoo as a collaboration—built around your idea, your body and the way you want to carry it.')}</p><MagneticLink to="/why-joker">{t('Discover the studio')}</MagneticLink></Reveal>
    </section>
    <section className="section section--charcoal"><Reveal><SectionHeading eyebrow={t('Ways to make a mark')} title={t('Styles with intent.')} text={t('Provisional categories for the first visual template.')} /></Reveal><div className="style-grid">{tattooStyles.map((style, index) => <ImageCard key={style.title} {...style} index={index} />)}</div></section>
    <SafetySection />
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
