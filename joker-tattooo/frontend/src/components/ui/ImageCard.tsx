import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function ImageCard({ image, imageSmall, width, height, title, text, index = 0 }: { image: string; imageSmall?: string; width?: number; height?: number; title: string; text: string; index?: number }) {
  const { t } = useLanguage();
  return <motion.article className="image-card" whileHover={{ y: -8 }} transition={{ duration: .25 }}>
    <img src={image} srcSet={imageSmall ? `${imageSmall} 640w, ${image} ${width ?? 1200}w` : undefined} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 50vw, 33vw" width={width} height={height} alt={`${t(title)} tattoo style portfolio image`} loading="lazy" decoding="async" />
    <div className="image-card__shade" /><span className="image-card__number">{String(index + 1).padStart(2, '0')}</span>
    <div className="image-card__body"><h3>{t(title)}</h3><p>{t(text)}</p><Link to="/what-we-do">{t('Discover style')} <span aria-hidden="true">→</span></Link></div>
  </motion.article>;
}
