import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitBookingRequest, type BookingRequest } from '../../services/booking';
import { InternationalPhoneInput, type InternationalPhoneValue } from './InternationalPhoneInput';

const styles = ['Japanese', 'Realism', 'Black & Grey', 'Fine Line', 'Colour', 'Tribal', 'Bamboo Tattoo', 'Cover Up', 'Not Sure Yet'];
const sizes = ['Small', 'Medium', 'Large', 'Full Sleeve', 'Half Sleeve', 'Back Piece', 'Leg Sleeve', 'Chest', 'Other'];
type Errors = Partial<Record<'name' | 'email' | 'whatsapp' | 'preferredDate' | 'preferredTime' | 'references' | 'submit', string>>;

export function BookingModal({ open, onClose, onExitComplete }: { open: boolean; onClose: () => void; onExitComplete: () => void }) {
  const { t } = useLanguage();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsapp, setWhatsapp] = useState<InternationalPhoneValue>({ e164: '', hasValue: false, isValid: false });

  const updateWhatsapp = useCallback((value: InternationalPhoneValue) => {
    setWhatsapp(value);
    setErrors(current => current.whatsapp ? { ...current, whatsapp: undefined } : current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', escape);
    window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', escape);
  }, [open, onClose]);

  const completeExit = () => {
    if (open) return;
    setSuccess(false);
    setErrors({});
    setFiles([]);
    setWhatsapp({ e164: '', hasValue: false, isValid: false });
    onExitComplete();
  };

  const addFiles = (incoming: FileList | File[]) => {
    const images = Array.from(incoming).filter(file => file.type.startsWith('image/'));
    const oversized = images.some(file => file.size > 3 * 1024 * 1024);
    setFiles(current => [...current, ...images.filter(file => file.size <= 3 * 1024 * 1024)].filter((file, index, all) => all.findIndex(item => item.name === file.name && item.size === file.size) === index).slice(0, 5));
    setErrors(current => ({ ...current, references: oversized ? t('Each image must be 3 MB or smaller.') : current.references }));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const next: Errors = {};
    if (!value('name')) next.name = t('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(value('email'))) next.email = t('Please enter a valid email.');
    if (!whatsapp.hasValue) next.whatsapp = t('Please enter your WhatsApp number.');
    else if (!whatsapp.isValid) next.whatsapp = t('Please enter a valid WhatsApp number for the selected country.');
    if (!value('preferredDate')) next.preferredDate = t('Please choose a preferred date.');
    if (!value('preferredTime')) next.preferredTime = t('Please choose a preferred time.');
    setErrors(next);
    if (Object.keys(next).length) return;

    const request: BookingRequest = {
      name: value('name'), email: value('email'), whatsapp: whatsapp.e164,
      preferredDate: value('preferredDate'), preferredTime: value('preferredTime'),
      tattooStyle: value('tattooStyle') || undefined, estimatedSize: value('estimatedSize') || undefined,
      notes: value('notes') || undefined, references: files,
    };
    setSubmitting(true);
    try {
      await submitBookingRequest(request);
      formElement.reset();
      setSuccess(true);
    } catch {
      setErrors({ submit: t('Something went wrong. Please try again or contact us directly.') });
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return <AnimatePresence onExitComplete={completeExit}>{open && <m.div className="booking-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .24 }}>
    <button className="booking-modal__backdrop" aria-label={t('Close booking form')} onClick={onClose} />
    <m.section className="booking-modal__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} initial={{ opacity: 0, y: 34, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 28, scale: .99 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}>
      <div className="booking-modal__rail" aria-hidden="true"><span>JOKER TATTOO</span><i /><small>PATONG · PHUKET</small></div>
      <button ref={closeRef} className="booking-modal__close" onClick={onClose} aria-label={t('Close booking form')}><span>{t('Close')}</span><i aria-hidden="true">×</i></button>
      {success ? <div className="booking-success">
        <div className="booking-success__mark" aria-hidden="true"><span>✓</span></div>
        <p className="eyebrow">{t('Request received')}</p>
        <h2 id={titleId}>{t('Thank you!')}</h2>
        <p>{t("We've received your booking request.")}</p>
        <p>{t('Our team will contact you shortly via WhatsApp or email to confirm your appointment.')}</p>
        <button className="button booking-success__button" onClick={onClose}>{t('Return to Website')}<span aria-hidden="true">↗</span></button>
      </div> : <form className="booking-request" onSubmit={submit} noValidate>
        <header className="booking-request__header">
          <div><p className="eyebrow">{t('Private booking request')}</p><h2 id={titleId}>{t('Tell us your idea.')}</h2></div>
          <p>{t('Share a few details and our studio team will contact you personally to discuss your tattoo and confirm availability.')}</p>
        </header>
        <div className="booking-request__body">
          <fieldset><legend><span>01</span>{t('Your details')}</legend><div className="booking-fields">
            <Field label={t('Name')} required error={errors.name}><input name="name" autoComplete="name" placeholder={t('Your full name')} aria-invalid={!!errors.name} /></Field>
            <Field label={t('Email')} required error={errors.email}><input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} /></Field>
            <InternationalPhoneInput error={errors.whatsapp} onValueChange={updateWhatsapp} />
          </div></fieldset>
          <fieldset><legend><span>02</span>{t('Preferred appointment')}</legend><div className="booking-fields booking-fields--two">
            <Field label={t('Preferred Date')} required error={errors.preferredDate}><input name="preferredDate" type="date" min={today} aria-invalid={!!errors.preferredDate} /></Field>
            <Field label={t('Preferred Time')} required error={errors.preferredTime}><input name="preferredTime" type="time" aria-invalid={!!errors.preferredTime} /></Field>
          </div><p className="booking-request__hint">{t('This is a booking request. We will contact you to confirm availability.')}</p></fieldset>
          <fieldset><legend><span>03</span>{t('Your tattoo')}</legend><div className="booking-fields booking-fields--two">
            <Field label={t('Tattoo Style')}><select name="tattooStyle" defaultValue=""><option value="">{t('Select a style (optional)')}</option>{styles.map(style => <option key={style} value={style}>{t(style)}</option>)}</select></Field>
            <Field label={t('Estimated Size')}><select name="estimatedSize" defaultValue=""><option value="">{t('Select a size (optional)')}</option>{sizes.map(size => <option key={size} value={size}>{t(size)}</option>)}</select></Field>
          </div></fieldset>
          <fieldset><legend><span>04</span>{t('References & notes')}</legend>
            <label className={`booking-upload ${dragging ? 'is-dragging' : ''}`} onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDragOver={event => event.preventDefault()} onDrop={onDrop}>
              <input type="file" accept="image/*" multiple capture={undefined} onChange={onFileChange} />
              <span className="booking-upload__icon" aria-hidden="true">＋</span><strong>{t('Add reference images')}</strong><small>{t('Drag & drop or choose from camera / gallery')}</small>
            </label>
            {errors.references && <p className="booking-upload-error" role="alert">{errors.references}</p>}
            {files.length > 0 && <div className="booking-files" aria-label={t('Selected reference images')}>{files.map((file, index) => <div key={`${file.name}-${file.size}`}><span>{file.name}</span><small>{(file.size / 1048576).toFixed(1)} MB</small><button type="button" onClick={() => setFiles(current => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`${t('Remove')} ${file.name}`}>×</button></div>)}</div>}
            <Field label={t('Additional Notes')}><textarea name="notes" rows={4} placeholder={t('Tell us about the placement, meaning, colours or any other detail that matters to you.')} /></Field>
          </fieldset>
        </div>
        <footer className="booking-request__footer">
          <div><span className="booking-request__secure" aria-hidden="true">◇</span><p><strong>{t('Reviewed by our studio')}</strong><small>{t('Your request goes directly to the Joker Tattoo team.')}</small></p></div>
          <button className="booking-submit" type="submit" disabled={submitting}>{submitting ? t('Sending request…') : t('Send Booking Request')}<span aria-hidden="true">↗</span></button>
          {errors.submit && <p className="booking-submit-error" role="alert">{errors.submit}</p>}
        </footer>
      </form>}
    </m.section>
  </m.div>}</AnimatePresence>;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return <label className="booking-field"><span>{label}{required && <b aria-hidden="true"> *</b>}</span>{children}{error && <small className="booking-field__error">{error}</small>}</label>;
}
