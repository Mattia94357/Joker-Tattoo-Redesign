import { useState } from 'react';
import serviceHeroVideo from '../../assets/jokertattooshopvideo.mp4';
import { faqs } from '../data/faq';
import { services } from '../data/services';
import { BookingButton } from '../components/booking/BookingButton';
import { useBooking } from '../context/BookingContext';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, faqSchema, imageObjectSchema, organizationSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

const consultationSteps = [
  ['Tell us your idea', 'Bring references, a rough thought or simply a feeling.'],
  ['Choose the right direction', 'We help refine the style, placement, scale and composition around your body.'],
  ['Meet the right artist', 'Your project is matched with an experienced artist whose strengths suit the work.'],
  ['Plan with confidence', 'You receive clear guidance on timing, pricing, preparation and what happens next.'],
];

export function WhyJokerPage() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const visibleFaqs = faqs.map(([question, answer]) => [t(question), t(answer)]);

  return <main className="page">
    <SEO {...seoConfig.pages.whyJoker} structuredData={[organizationSchema(), webPageSchema(seoConfig.pages.whyJoker.path, seoConfig.pages.whyJoker.title, seoConfig.pages.whyJoker.description), breadcrumbSchema('Why Joker', seoConfig.pages.whyJoker.path), faqSchema(visibleFaqs), imageObjectSchema()]} />
    <section className="service-hero">
      <div><p className="eyebrow">{t('Why Joker')}</p><h1>{t('Your idea.')}<br /><span>{t('Our craft.')}</span></h1><p>{t('Custom work with the patience, planning and precision it deserves.')}</p></div>
      <div className="service-hero__media">
        <video
          src={serviceHeroVideo}
          width="883"
          height="1024"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          aria-label={t('Tattoo artist working on a client at Joker Tattoo Patong')}
        />
      </div>
    </section>
    <section className="section services">
      <Reveal><SectionHeading eyebrow={t('Tattoo services')} title={t('No templates. No shortcuts.')} /></Reveal>
      <div className="service-list">{services.filter(([title]) => title !== 'Tattoo Consultations').map(([title, text], index) => <Reveal key={title}><article><span>{String(index + 1).padStart(2, '0')}</span><h3>{t(title)}</h3><div><p>{t(text)}</p><button className="service-booking-link" onClick={openBooking}>{t('Discuss this tattoo service')} <span aria-hidden="true">→</span></button></div></article></Reveal>)}</div>
    </section>
    <section className="section process-section consultation-section">
      <Reveal><SectionHeading eyebrow={t('Tattoo Consultations')} title={t('A considered process.')} text={t('A professional consultation turns an early idea into a clear, achievable tattoo plan before any work begins.')} /></Reveal>
      <div className="process-grid">{consultationSteps.map(([title, text], index) => <Reveal key={title}><article><strong>{String(index + 1).padStart(2, '0')}</strong><h3>{t(title)}</h3><p>{t(text)}</p></article></Reveal>)}</div>
    </section>
    <section className="premium-faq">
      <div className="premium-faq__glow" aria-hidden="true" />
      <div className="premium-faq__inner">
        <Reveal><header className="premium-faq__header"><p className="eyebrow">{t('Before you book')}</p><h2>{t('Frequently Asked Questions')}</h2><p>{t('Everything you need to know before booking your tattoo session at Joker Tattoo Phuket.')}</p></header></Reveal>
        <div className="premium-faq__grid">{visibleFaqs.map(([question, answer], index) => {
          const isOpen = open === index;
          const answerId = `faq-answer-${index}`;
          return <article key={question} className={`premium-faq__card ${isOpen ? 'is-open' : ''}`}>
            <button onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={answerId}>
              <span className="premium-faq__number">{String(index + 1).padStart(2, '0')}</span>
              <span className="premium-faq__question">{question}</span>
              <span className="premium-faq__icon" aria-hidden="true" />
            </button>
            <div className="premium-faq__answer" id={answerId}><div><p>{answer}</p></div></div>
          </article>;
        })}</div>
      </div>
    </section>
    <section className="booking-cta"><div><p className="eyebrow">{t('Your idea starts here')}</p><h2>{t('Ready to make')}<br />{t('it permanent?')}</h2></div><div className="button-row"><BookingButton variant="red">{t('Discuss your tattoo idea')}</BookingButton><BookingButton variant="outline">{t('Book a Tattoo')}</BookingButton></div></section>
  </main>;
}
