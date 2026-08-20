import { Link } from 'react-router-dom';
import jokerWordmark from '../../assets/images/optimized/joker-tattoo-patong-logo.webp';
import jokerWordmarkSmall from '../../assets/images/optimized/joker-tattoo-patong-logo-344.webp';
import { contactDetails } from '../../data/contact';
import { navigation } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';

export function Footer() {
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  return <footer className="site-footer">
    <div className="footer-brand">
      <img className="footer-wordmark" src={jokerWordmarkSmall} srcSet={`${jokerWordmarkSmall} 344w, ${jokerWordmark} 688w`} sizes="(max-width: 600px) calc(100vw - 40px), 25vw" width="688" height="181" alt={t('Joker Tattoo Patong studio wordmark')} loading="lazy" decoding="async" />
      <p>{t('Original tattoo work in the heart of Patong, Phuket.')}</p>
      <nav className="footer-nav" aria-label={t('Footer navigation')}>{navigation.map(item => <Link key={item.to} to={item.to}>{t(item.label)}</Link>)}</nav>
    </div>
    <address><p className="eyebrow">{t('Visit')}</p><p>{t(contactDetails.address)}</p><p>{t(contactDetails.hours)}</p></address>
    <address><p className="eyebrow">{t('Contact')}</p><p><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">{t(contactDetails.phone)} · WhatsApp</a></p><p>{t(contactDetails.email)}</p></address>
    <div><p className="eyebrow">{t('Follow')}</p><a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={contactDetails.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={contactDetails.maps} target="_blank" rel="noopener noreferrer">Google Maps</a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Joker Tattoo. {t('All rights reserved.')}</span><button className="footer-booking-link" onClick={openBooking}>{t('Discuss your tattoo idea')} →</button></div>
  </footer>;
}
