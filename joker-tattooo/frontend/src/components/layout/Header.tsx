import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jokerLogo from '../../assets/images/optimized/joker-tattoo-patong-studio-emblem-96.webp';
import { navigation } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { BookingButton } from '../booking/BookingButton';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { useBooking } from '../../context/BookingContext';

type MenuPhase = 'closed' | 'open' | 'closing';

export function Header() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { isBookingPresent } = useBooking();
  const [solid, setSolid] = useState(false);
  const [menuPhase, setMenuPhase] = useState<MenuPhase>('closed');
  const open = menuPhase === 'open';
  const menuPresent = menuPhase !== 'closed';
  const scrollLocked = menuPresent || isBookingPresent;
  const closeMenu = useCallback(() => setMenuPhase(current => current === 'open' ? 'closing' : current), []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => { setSolid(false); }, [pathname]);

  useLayoutEffect(() => {
    if (!scrollLocked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [scrollLocked]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, closeMenu]);

  return <>
    <header className={`site-header ${solid ? 'site-header--solid' : ''}`}>
      <NavLink className="logo site-logo" to="/" aria-label={t('Joker Tattoo home')}>
        <img src={jokerLogo} width="96" height="96" alt={t('Joker Tattoo Patong studio logo')} decoding="async" />
        <span><b>JOKER</b><small>TATTOO · PHUKET</small></span>
      </NavLink>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(x => <NavLink key={x.to} to={x.to} className={({ isActive }) => isActive ? 'active' : ''}>{t(x.label)}</NavLink>)}</nav>
      <div className="header-actions"><LanguageSwitcher compact /><BookingButton>{t('Book Your Tattoo')}</BookingButton><button className={`menu-toggle ${open ? 'is-open' : ''}`} onClick={() => setMenuPhase(current => current === 'open' ? 'closing' : 'open')} aria-expanded={open} aria-label={t(open ? 'Close menu' : 'Open menu')}><span /><span /><em>{t(open ? 'Close' : 'Menu')}</em></button></div>
    </header>
    <MobileMenu open={open} close={closeMenu} onExitComplete={() => setMenuPhase(current => current === 'closing' ? 'closed' : current)} />
  </>;
}
