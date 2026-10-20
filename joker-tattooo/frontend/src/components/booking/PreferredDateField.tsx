import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';

const isoDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const fromISO = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};
const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1, 12);
const shiftMonth = (date: Date, amount: number) => {
  const month = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  return new Date(month.getFullYear(), month.getMonth(), Math.min(date.getDate(), new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()), 12);
};

export function PreferredDateField({ error }: { error?: string }) {
  const { language, t } = useLanguage();
  const locale = language === 'it' ? 'it-IT' : 'en-GB';
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => firstOfMonth(new Date()));
  const [focused, setFocused] = useState(() => isoDate(new Date()));
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight?: number }>({ top: 8, left: 8 });
  const today = isoDate(new Date());
  const lastDate = `${new Date().getFullYear() + 10}-12-31`;
  const value = selected >= today ? selected : '';
  const fullDate = (date: Date) => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - (month.getDay() + 6) % 7, 12);
  const dates = Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index, 12));

  const close = () => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };
  const openCalendar = () => {
    const date = value ? fromISO(value) : fromISO(today);
    setMonth(firstOfMonth(date));
    setFocused(isoDate(date));
    setOpen(true);
  };
  const focusDate = (date: Date) => {
    const next = isoDate(date) < today ? fromISO(today) : isoDate(date) > lastDate ? fromISO(lastDate) : date;
    setMonth(firstOfMonth(next));
    setFocused(isoDate(next));
  };

  useLayoutEffect(() => {
    if (!open) return;
    const positionCalendar = () => {
      if (!trigger.current || !popup.current) return;
      const anchor = trigger.current.getBoundingClientRect();
      const { width, height } = popup.current.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const panel = trigger.current.closest('.booking-modal__panel')?.getBoundingClientRect();
      const topEdge = Math.max(viewportTop, panel?.top ?? viewportTop) + 8;
      const bottomEdge = Math.min(viewportTop + viewportHeight, panel?.bottom ?? viewportTop + viewportHeight) - 8;
      const leftEdge = Math.max(viewportLeft, panel?.left ?? viewportLeft) + 8;
      const rightEdge = Math.min(viewportLeft + viewportWidth, panel?.right ?? viewportLeft + viewportWidth) - 8;
      const availableHeight = Math.max(44, bottomEdge - topEdge);
      const visibleHeight = Math.min(height, availableHeight);
      const below = anchor.bottom + 8;
      const top = below + visibleHeight <= bottomEdge ? below : anchor.top - visibleHeight - 8;
      setPosition({
        top: Math.max(topEdge, Math.min(top, bottomEdge - visibleHeight)),
        left: Math.max(leftEdge, Math.min(anchor.left, rightEdge - width)),
        maxHeight: availableHeight,
      });
    };
    positionCalendar();
    window.addEventListener('resize', positionCalendar);
    window.addEventListener('scroll', positionCalendar, true);
    window.visualViewport?.addEventListener('resize', positionCalendar);
    window.visualViewport?.addEventListener('scroll', positionCalendar);
    return () => {
      window.removeEventListener('resize', positionCalendar);
      window.removeEventListener('scroll', positionCalendar, true);
      window.visualViewport?.removeEventListener('resize', positionCalendar);
      window.visualViewport?.removeEventListener('scroll', positionCalendar);
    };
  }, [open, month]);

  useLayoutEffect(() => {
    if (open) popup.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus({ preventScroll: true });
  }, [open, focused, month]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popup.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    const keyboard = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close only this popup, before the booking modal's Escape handler runs.
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      } else if (event.key === 'Tab') {
        const controls = Array.from(popup.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not([tabindex="-1"])') ?? []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('keydown', keyboard, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('keydown', keyboard, true);
    };
  }, [open]);

  const navigateDays = (event: KeyboardEvent<HTMLTableElement>) => {
    const date = fromISO(focused);
    const weekday = (date.getDay() + 6) % 7;
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    if (event.key in offsets) {
      event.preventDefault();
      focusDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + offsets[event.key], 12));
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      focusDate(shiftMonth(date, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1)));
    }
  };

  return <div className="booking-field booking-date">
    <span id={`${id}-label`}>{t('Preferred Date')}<b aria-hidden="true"> *</b></span>
    <button ref={trigger} type="button" className="booking-date-trigger" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-calendar` : undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : `${id}-hint`} onClick={() => open ? close() : openCalendar()}>
      <span id={`${id}-value`} className={value ? '' : 'booking-date-placeholder'}>{value ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(fromISO(value)) : t('Select a date')}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18" /></svg>
    </button>
    <input type="hidden" name="preferredDate" value={value} />
    <span id={`${id}-hint`} className="booking-date-sr">{t('Please choose a preferred date.')}</span>
    {error && <small className="booking-field__error" id={`${id}-error`}>{error}</small>}
    {open && createPortal(<div ref={popup} id={`${id}-calendar`} className="booking-calendar" role="dialog" aria-modal="true" aria-label={t('Choose preferred date')} style={position}>
      <div className="booking-calendar__header">
        <button type="button" aria-label={t('Previous month')} disabled={isoDate(new Date(month.getFullYear(), month.getMonth(), 0, 12)) < today} onClick={() => focusDate(shiftMonth(fromISO(focused), -1))}>‹</button>
        <span id={`${id}-month`} aria-live="polite">{monthLabel}</span>
        <button type="button" aria-label={t('Next month')} disabled={isoDate(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12)) > lastDate} onClick={() => focusDate(shiftMonth(fromISO(focused), 1))}>›</button>
      </div>
      <table role="grid" aria-labelledby={`${id}-month`} onKeyDown={navigateDays}>
        <thead><tr>{dates.slice(0, 7).map(date => <th key={date.getDay()} scope="col" aria-label={new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date)}>{new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)}</th>)}</tr></thead>
        <tbody>{Array.from({ length: 6 }, (_, row) => <tr key={row}>{dates.slice(row * 7, row * 7 + 7).map(date => {
          const iso = isoDate(date);
          const disabled = iso < today || iso > lastDate;
          return <td key={iso} aria-selected={value === iso}><button type="button" data-date={iso} aria-label={fullDate(date)} aria-current={iso === today ? 'date' : undefined} tabIndex={!disabled && iso === focused ? 0 : -1} disabled={disabled} className={date.getMonth() !== month.getMonth() ? 'booking-calendar__outside' : undefined} onFocus={() => setFocused(iso)} onClick={() => {
            if (iso < isoDate(new Date()) || iso > lastDate) return;
            setSelected(iso);
            close();
          }}>{date.getDate()}</button></td>;
        })}</tr>)}</tbody>
      </table>
      <div className="booking-calendar__footer"><button type="button" onClick={close}>{t('Close calendar')}</button></div>
    </div>, document.body)}
  </div>;
}
