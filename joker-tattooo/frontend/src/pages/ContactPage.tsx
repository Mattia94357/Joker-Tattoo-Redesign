import { contactDetails } from '../data/contact';
import { BookingButton } from '../components/booking/BookingButton';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, imageObjectSchema, localBusinessSchema, organizationSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';
import { trackEvent } from '../lib/analytics';

export function ContactPage() {
  const { t } = useLanguage();
  return <main className="page contact-page">
    <SEO {...seoConfig.pages.contact} structuredData={[organizationSchema(), webPageSchema(seoConfig.pages.contact.path, seoConfig.pages.contact.title, seoConfig.pages.contact.description), breadcrumbSchema('Contact', seoConfig.pages.contact.path), localBusinessSchema(), imageObjectSchema()]} />
    <section className="contact-intro"><p className="eyebrow">{t('Consultation / Booking')}</p><h1>{t('Let’s create')}<br /><span>{t('something personal.')}</span></h1><p>{t('Tell us about your idea, preferred style and placement. We’ll reply personally and help you plan the next step.')}</p></section>
    <section className="contact-layout">
      <aside aria-label={t('Joker Tattoo business information')}>
        <address>
          <div><p className="eyebrow">{t('Find us')}</p><h2>Patong, Phuket</h2><p>{t(contactDetails.address)}</p></div>
          <div><p className="eyebrow">{t('Talk to us')}</p><p><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click')}>{t(contactDetails.phone)} · WhatsApp</a></p><p>{t(contactDetails.email)}</p></div>
          <div><p className="eyebrow">{t('Studio hours')}</p><p>{t(contactDetails.hours)}</p></div>
        </address>
        <div className="social-row"><a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={contactDetails.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click')}>WhatsApp</a></div>
        <div className="contact-map" id="map">
          <iframe src={contactDetails.mapsEmbed} title={t('Interactive map showing Joker Tattoo in Patong')} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          <a href={contactDetails.maps} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('directions_click')}>{t('Open Joker Tattoo in Google Maps')}<span aria-hidden="true">↗</span></a>
        </div>
      </aside>
      <article className="contact-booking-card">
        <span className="contact-booking-card__number">01</span><p className="eyebrow">{t('Booking requests')}</p><h2>{t('Start with your idea.')}</h2>
        <p>{t('Share your preferred date and time, along with any reference images. Our studio team will review your request and reply personally by WhatsApp or email.')}</p>
        <ul><li>{t('No commitment')}</li><li>{t('Personal studio reply')}</li><li>{t('Reference images welcome')}</li></ul>
        <BookingButton variant="red">{t('Request Your Booking')}</BookingButton>
        <small>{t('Your appointment is confirmed once our studio team contacts you.')}</small>
      </article>
    </section>
  </main>;
}
