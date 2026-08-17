import { contactDetails } from '../data/contact';
import { BookingButton } from '../components/booking/BookingButton';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

export function ContactPage() {
  const { t } = useLanguage();
  return <main className="page contact-page">
    <SEO {...seoConfig.pages.contact} structuredData={[webPageSchema(seoConfig.pages.contact.path, seoConfig.pages.contact.title, seoConfig.pages.contact.description), breadcrumbSchema('Contact', seoConfig.pages.contact.path)]} />
    <section className="contact-intro"><p className="eyebrow">{t('Contact / Booking')}</p><h1>{t('Let’s make')}<br /><span>{t('something permanent.')}</span></h1><p>{t('Tell us what you have in mind. The more context you share, the better the first conversation can be.')}</p></section>
    <section className="contact-layout">
      <aside aria-label={t('Joker Tattoo business information')}>
        <address>
          <div><p className="eyebrow">{t('Find us')}</p><h2>Patong, Phuket</h2><p>{t(contactDetails.address)}</p></div>
          <div><p className="eyebrow">{t('Talk to us')}</p><p><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">{t(contactDetails.phone)} · WhatsApp</a></p><p>{t(contactDetails.email)}</p></div>
          <div><p className="eyebrow">{t('Studio hours')}</p><p>{t(contactDetails.hours)}</p></div>
        </address>
        <div className="social-row"><a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={contactDetails.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
        <div className="contact-map" id="map">
          <iframe src={contactDetails.mapsEmbed} title={t('Interactive map showing Joker Tattoo in Patong')} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          <a href={contactDetails.maps} target="_blank" rel="noopener noreferrer">{t('Open Joker Tattoo in Google Maps')}<span aria-hidden="true">↗</span></a>
        </div>
      </aside>
      <div className="contact-booking-card">
        <span className="contact-booking-card__number">01</span><p className="eyebrow">{t('Appointment requests')}</p><h2>{t('Your idea starts here.')}</h2>
        <p>{t('Send your preferred date, time and references through our private booking request. Our team will review everything and reply personally by WhatsApp or email.')}</p>
        <ul><li>{t('No commitment')}</li><li>{t('Personal studio reply')}</li><li>{t('Reference images welcome')}</li></ul>
        <BookingButton variant="red">{t('Book a Tattoo')}</BookingButton>
        <small>{t('This is a request only. Your appointment is confirmed after our team contacts you.')}</small>
      </div>
    </section>
  </main>;
}
