import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

type ImageCardProps = {
  image: string;
  imageSmall?: string;
  imageMedium?: string;
  width?: number;
  height?: number;
  title: string;
  text: string;
  index?: number;
};

export function ImageCard({ image, imageSmall, imageMedium, width, height, title, text, index = 0 }: ImageCardProps) {
  const { t } = useLanguage();
  const srcSet = imageSmall
    ? `${imageSmall} 480w, ${imageMedium ? `${imageMedium} 768w, ` : ''}${image} ${width ?? 1200}w`
    : undefined;

  return <article className="image-card">
    <img src={imageSmall ?? image} srcSet={srcSet} sizes="(max-width: 600px) 82vw, (max-width: 900px) 50vw, 33vw" width={width} height={height} alt={`${t(title)} — ${t('tattoo style portfolio image')}`} loading="lazy" decoding="async" />
    <div className="image-card__shade" /><span className="image-card__number">{String(index + 1).padStart(2, '0')}</span>
    <div className="image-card__body"><h3>{t(title)}</h3><p>{t(text)}</p><Link to="/gallery">{t('View')} {t(title)} {t('tattoo portfolio')} <span aria-hidden="true">→</span></Link></div>
  </article>;
}
