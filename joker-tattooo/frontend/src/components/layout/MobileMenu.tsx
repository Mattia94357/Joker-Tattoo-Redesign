import { AnimatePresence, m } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useBooking } from '../../context/BookingContext';
import { useMobileViewport } from '../../hooks/useMobileViewport';
export function MobileMenu({ open, close, onExitComplete }: { open: boolean; close: () => void; onExitComplete: () => void }) {
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const mobile = useMobileViewport();
  return <AnimatePresence onExitComplete={onExitComplete}>{open && <m.div className="mobile-menu" role="dialog" aria-modal="true" aria-label={t('Navigate the studio')} initial={mobile ? false : { clipPath: 'circle(0% at 90% 5%)' }} animate={mobile ? undefined : { clipPath: 'circle(150% at 90% 5%)' }} exit={mobile ? undefined : { clipPath: 'circle(0% at 90% 5%)' }} transition={mobile ? undefined : { duration: .55, ease: [0.76, 0, 0.24, 1] }}>
    <m.div className="mobile-menu__content" initial={false}>
    <div className="mobile-menu__top"><p className="eyebrow">{t('Navigate the studio')}</p><LanguageSwitcher /></div><nav aria-label="Mobile navigation">{navigation.map((item, i) => <m.div key={item.to} initial={mobile ? false : { opacity: 0, x: 25 }} animate={mobile ? undefined : { opacity: 1, x: 0 }} transition={mobile ? undefined : { delay: .12 + i * .07 }}><NavLink to={item.to} onClick={close}>{t(item.label)}</NavLink></m.div>)}</nav>
    <button className="button mobile-menu__booking" onClick={event => {
      event.preventDefault();
      event.stopPropagation();
      close();
      requestAnimationFrame(openBooking);
    }}>{t('Book Your Tattoo')}<span aria-hidden="true">↗</span></button>
    <p className="mobile-menu__meta">{t('Patong · Phuket · Thailand')}</p>
    </m.div>
  </m.div>}</AnimatePresence>;
}
