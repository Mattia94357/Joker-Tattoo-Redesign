import { useState } from 'react';
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

export function WhyJokerPage() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const visibleFaqs = faqs.map(([question, answer]) => [t(question), t(answer)]);

  return <main className="page">
    <SEO {...seoConfig.pages.whyJoker} structuredData={[organizationSchema(), webPageSchema(seoConfig.pages.whyJoker.path, seoConfig.pages.whyJoker.title, seoConfig.pages.whyJoker.description), breadcrumbSchema('Why Joker', seoConfig.pages.whyJoker.path), faqSchema(visibleFaqs), imageObjectSchema()]} />
    <section className="service-hero">
      <div><p className="eyebrow">{t('Why Joker')}</p><h1>{t('Your idea.')}<br /><span>{t('Our craft.')}</span></h1><p>{t('Custom tattoo work, shaped with patience, precision and a clear point of view.')}</p></div>
      <div className="service-hero__media">
        <picture><source type="image/avif" srcSet="/images/hero/traditional-tiger-sak-yant-tattoo-480.avif 480w, /images/hero/traditional-tiger-sak-yant-tattoo-768.avif 768w, /images/hero/traditional-tiger-sak-yant-tattoo.avif 1000w" sizes="(max-width: 900px) 90vw, 45vw" /><img src="/images/hero/traditional-tiger-sak-yant-tattoo.webp" srcSet="/images/hero/traditional-tiger-sak-yant-tattoo-480.webp 480w, /images/hero/traditional-tiger-sak-yant-tattoo-768.webp 768w, /images/hero/traditional-tiger-sak-yant-tattoo.webp 1000w" sizes="(max-width: 900px) 90vw, 45vw" width="1000" height="1260" alt={t('Traditional tiger Sak Yant tattoo created at Joker Tattoo Patong')} loading="eager" fetchPriority="high" decoding="async" /></picture>
      </div>
    </section>
    <section className="section services">
      <Reveal><SectionHeading eyebrow={t('Tattoo services')} title={t('Designed for you. Made to last.')} /></Reveal>
      <div className="service-list">{services.filter(([title]) => title !== 'Tattoo Consultations').map(([title, text], index) => <Reveal key={title}><article><span>{String(index + 1).padStart(2, '0')}</span><h3>{t(title)}</h3><div><p>{t(text)}</p><button className="service-booking-link" onClick={openBooking}>{t('Discuss this tattoo service')} <span aria-hidden="true">→</span></button></div></article></Reveal>)}</div>
    </section>
    <section className="premium-faq">
      <div className="premium-faq__glow" aria-hidden="true" />
      <div className="premium-faq__inner">
        <Reveal><header className="premium-faq__header"><p className="eyebrow">{t('Before you book')}</p><h2>{t('Frequently Asked Questions')}</h2><p>{t('Clear answers to the questions clients ask before booking with Joker Tattoo in Patong, Phuket.')}</p></header></Reveal>
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
    <section className="booking-cta"><div><p className="eyebrow">{t('Your idea starts here')}</p><h2>{t('Ready to make')}<br />{t('it permanent?')}</h2></div><div className="button-row"><BookingButton variant="red">{t('Start the Conversation')}</BookingButton><BookingButton variant="outline">{t('Request a Consultation')}</BookingButton></div></section>
  </main>;
}
