import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { useLanguage } from '../../context/LanguageContext';

export type InternationalPhoneValue = {
  e164: string;
  hasValue: boolean;
  isValid: boolean;
};

const supportedCountries = new Set(getCountries());

function detectCountry(): CountryCode {
  if (typeof navigator === 'undefined') return 'TH';
  for (const locale of navigator.languages ?? [navigator.language]) {
    try {
      const region = new Intl.Locale(locale).maximize().region?.toUpperCase() as CountryCode | undefined;
      if (region && supportedCountries.has(region)) return region;
    } catch {
      const region = locale.split(/[-_]/)[1]?.toUpperCase() as CountryCode | undefined;
      if (region && supportedCountries.has(region)) return region;
    }
  }
  return 'TH';
}

function countryFlag(country: CountryCode) {
  return String.fromCodePoint(...country.split('').map(character => 127397 + character.charCodeAt(0)));
}

export function InternationalPhoneInput({ error, onValueChange }: { error?: string; onValueChange: (value: InternationalPhoneValue) => void }) {
  const { language, t } = useLanguage();
  const inputId = useId();
  const pickerId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState<CountryCode>(detectCountry);
  const [localNumber, setLocalNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const displayNames = useMemo(() => new Intl.DisplayNames([language], { type: 'region' }), [language]);
  const countries = useMemo(() => getCountries().map(code => ({
    code,
    name: displayNames.of(code) ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
  })).sort((a, b) => a.name.localeCompare(b.name, language)), [displayNames, language]);

  const selected = countries.find(item => item.code === country) ?? countries.find(item => item.code === 'TH')!;
  const filteredCountries = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(language);
    if (!term) return countries;
    return countries.filter(item => `${item.name} ${item.code} ${item.dialCode}`.toLocaleLowerCase(language).includes(term));
  }, [countries, language, query]);

  useEffect(() => {
    const parsed = localNumber ? parsePhoneNumberFromString(localNumber, country) : undefined;
    onValueChange({
      e164: parsed?.isValid() ? parsed.number : '',
      hasValue: localNumber.length > 0,
      isValid: parsed?.isValid() ?? false,
    });
  }, [country, localNumber, onValueChange]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    window.addEventListener('keydown', closeOnEscape);
    window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const chooseCountry = (code: CountryCode) => {
    setCountry(code);
    setOpen(false);
    setQuery('');
  };

  return <div className="booking-field booking-phone" ref={rootRef}>
    <label htmlFor={inputId}>{t('WhatsApp')}<b aria-hidden="true"> *</b></label>
    <div className={`booking-phone__control ${open ? 'is-open' : ''} ${error ? 'is-invalid' : ''}`}>
      <button type="button" className="booking-phone__country" aria-label={t('Select country')} aria-haspopup="listbox" aria-expanded={open} aria-controls={pickerId} onClick={() => setOpen(current => !current)}>
        <span className="booking-phone__flag" aria-hidden="true">{countryFlag(selected.code)}</span>
        <span className="booking-phone__selected-name">{selected.name}</span>
        <span className="booking-phone__dial">{selected.dialCode}</span>
        <span className="booking-phone__chevron" aria-hidden="true" />
      </button>
      <input id={inputId} type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]*" value={localNumber} onChange={event => setLocalNumber(event.target.value.replace(/\D/g, ''))} placeholder={t('Local phone number')} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} />
    </div>
    {open && <div className="booking-phone__picker" id={pickerId}>
      <div className="booking-phone__picker-head"><strong>{t('Choose your country')}</strong><button type="button" onClick={() => setOpen(false)} aria-label={t('Close country selector')}>×</button></div>
      <div className="booking-phone__search"><span aria-hidden="true" /> <input ref={searchRef} type="search" inputMode="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t('Search by country or code')} aria-label={t('Search countries')} /></div>
      <div className="booking-phone__list" role="listbox" aria-label={t('Countries')}>
        {filteredCountries.length ? filteredCountries.map(item => <button type="button" role="option" aria-selected={item.code === country} key={item.code} onClick={() => chooseCountry(item.code)}>
          <span className="booking-phone__flag" aria-hidden="true">{countryFlag(item.code)}</span><span className="booking-phone__name">{item.name}</span><span className="booking-phone__code">{item.dialCode}</span>
        </button>) : <p>{t('No countries found.')}</p>}
      </div>
    </div>}
    {error && <small className="booking-field__error" id={`${inputId}-error`}>{error}</small>}
  </div>;
}
