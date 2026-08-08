import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import jokerLogo from '../../../assets/images.jpg';
import { navigation } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const { t } = useLanguage();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return <>
    <header className={`site-header ${solid ? 'site-header--solid' : ''}`}>
      <NavLink className="logo site-logo" to="/" aria-label={t('Joker Tattoo home')}>
        <img src={jokerLogo} width="225" height="225" alt="Joker Tattoo" />
        <span><b>JOKER</b><small>TATTOO · PHUKET</small></span>
      </NavLink>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(x => <NavLink key={x.to} to={x.to} className={({ isActive }) => isActive ? 'active' : ''}>{t(x.label)}</NavLink>)}</nav>
      <div className="header-actions"><LanguageSwitcher compact /><Button to="/contact">{t('Book a Tattoo')}</Button><button className={`menu-toggle ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t(open ? 'Close menu' : 'Open menu')}><span /><span /><em>{t(open ? 'Close' : 'Menu')}</em></button></div>
    </header>
    <MobileMenu open={open} close={() => setOpen(false)} />
  </>;
}
