import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
export function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  const { t } = useLanguage();
  return <AnimatePresence>{open && <motion.div className="mobile-menu" role="dialog" aria-modal="true" aria-label={t('Navigate the studio')} initial={{ clipPath: 'circle(0% at 90% 5%)' }} animate={{ clipPath: 'circle(150% at 90% 5%)' }} exit={{ clipPath: 'circle(0% at 90% 5%)' }} transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }}>
    <div className="mobile-menu__top"><p className="eyebrow">{t('Navigate the studio')}</p><LanguageSwitcher /></div><nav aria-label="Mobile navigation">{navigation.map((item, i) => <motion.div key={item.to} initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + i * .07 }}><NavLink to={item.to} onClick={close}>{t(item.label)}</NavLink></motion.div>)}</nav>
    <p className="mobile-menu__meta">{t('Patong · Phuket · Thailand')}</p>
  </motion.div>}</AnimatePresence>;
}
