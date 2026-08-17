import { useState } from 'react';
import serviceHero from '../../assets/8FFBhedj6Z3Q9mLAQbDdXWm5V4.avif';
import { faqs } from '../data/faq';
import { services } from '../data/services';
import { contactDetails } from '../data/contact';
import { BookingButton } from '../components/booking/BookingButton';
import { useBooking } from '../context/BookingContext';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, faqSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

export function ServicesPage() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const visibleFaqs = faqs.map(([question, answer]) => [t(question), t(answer)]);

  return <main className="page">
    <SEO {...seoConfig.pages.services} structuredData={[webPageSchema(seoConfig.pages.services.path, seoConfig.pages.services.title, seoConfig.pages.services.description), breadcrumbSchema('What We Do', seoConfig.pages.services.path), faqSchema(visibleFaqs)]} />
    <section className="service-hero">
      <div><p className="eyebrow">{t('What we do')}</p><h1>{t('Your idea.')}<br /><span>{t('Our craft.')}</span></h1><p>{t('Custom work with the patience, planning and precision it deserves.')}</p></div>
      <img src={serviceHero} sizes="(max-width: 900px) 100vw, 50vw" width="883" height="1024" alt={t('Black and grey custom portfolio tattoo by Joker Tattoo Patong')} loading="eager" fetchPriority="high" decoding="async" />
    </section>
    <section className="section services">
      <Reveal><SectionHeading eyebrow={t('Tattoo services')} title={t('No templates. No shortcuts.')} /></Reveal>
      <div className="service-list">{services.map(([title, text], index) => <Reveal key={title}><article><span>{String(index + 1).padStart(2, '0')}</span><h3>{t(title)}</h3><div><p>{t(text)}</p><button className="service-booking-link" onClick={openBooking}>{t('Discuss this tattoo service')} <span aria-hidden="true">→</span></button></div></article></Reveal>)}</div>
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
        <Reveal><div className="premium-faq__cta"><div><p className="eyebrow">{t('Personal guidance')}</p><h3>{t('Still have questions?')}</h3><p>{t("We're happy to help. Contact our artists today and we'll guide you through the entire process.")}</p></div><div className="button-row"><BookingButton variant="red">{t('Book a Tattoo')}</BookingButton><a className="button button--outline" href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">{t('WhatsApp Us')}<span aria-hidden="true">↗</span></a></div></div></Reveal>
      </div>
    </section>
  </main>;
}
