import { useState, type FormEvent } from 'react';
import { contactDetails } from '../data/contact';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

type Errors = Record<string, string>;

export function ContactPage() {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Errors = {};
    ['name', 'email', 'style', 'placement', 'description'].forEach(key => {
      if (!String(form.get(key) ?? '').trim()) next[key] = t('This field is required.');
    });
    if (!/^\S+@\S+\.\S+$/.test(String(form.get('email') ?? ''))) next.email = t('Enter a valid email address.');
    if (!form.get('consent')) next.consent = t('Please confirm consent before continuing.');
    setErrors(next);
    setMessage(Object.keys(next).length ? t('Please check the highlighted fields.') : t('Prototype only — form delivery and image upload will be connected in a future backend step. Nothing has been submitted.'));
  };
  const field = (name: string) => errors[name] && <span className="field-error">{errors[name]}</span>;

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
        <a className="map-placeholder" id="map" href={contactDetails.maps} target="_blank" rel="noopener noreferrer" aria-label={t('Open Joker Tattoo in Google Maps')}><span aria-hidden="true">MAP</span><p>{t('Open Joker Tattoo in Google Maps')}<br /><small>{t(contactDetails.address)}</small></p></a>
      </aside>
      <form className="booking-form" onSubmit={submit} noValidate>
        <div className="form-heading"><span>01</span><h2>{t('Tell us about your idea.')}</h2></div>
        <div className="form-grid">
          <label>{t('Name')} *<input name="name" autoComplete="name" aria-invalid={!!errors.name} />{field('name')}</label>
          <label>{t('Email')} *<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />{field('email')}</label>
          <label>{t('Phone or WhatsApp')}<input name="phone" type="tel" autoComplete="tel" /></label>
          <label>{t('Preferred artist')}<input name="artist" placeholder={t('No preference / to be confirmed')} /></label>
          <label>{t('Tattoo style')} *<select name="style" defaultValue=""><option value="" disabled>{t('Select a direction')}</option><option value="Black & Grey">{t('Black & Grey')}</option><option value="Realism">{t('Realism')}</option><option value="Traditional">{t('Traditional')}</option><option value="Japanese">{t('Japanese')}</option><option value="Fine Line">{t('Fine Line')}</option><option value="Not sure yet">{t('Not sure yet')}</option></select>{field('style')}</label>
          <label>{t('Placement')} *<input name="placement" aria-invalid={!!errors.placement} />{field('placement')}</label>
          <label>{t('Approximate size')}<input name="size" placeholder={t('e.g. palm-sized, half sleeve')} /></label>
          <label>{t('Preferred date')}<input name="date" type="date" /></label>
          <label className="span-2">{t('Describe your idea')} *<textarea name="description" rows={6} aria-invalid={!!errors.description} />{field('description')}</label>
          <label className="span-2 upload">{t('Image references')}<input name="references" type="file" multiple accept="image/*" /><span>{t('Drop files here or choose images')}</span><small>{t('Interface only — files are not uploaded in this prototype.')}</small></label>
          <label className="span-2 checkbox"><input name="consent" type="checkbox" /><span>{t('I consent to being contacted about this enquiry.')} *</span>{field('consent')}</label>
        </div>
        <Button type="submit" variant="red">{t('Review enquiry')}</Button>
        {message && <p className="form-message" role="status">{message}</p>}
      </form>
    </section>
  </main>;
}
