import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { galleryCategories, galleryItems } from '../data/gallery';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BookingButton } from '../components/booking/BookingButton';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, imageObjectSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

export function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const { t } = useLanguage();
  const visible = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter);
  const activeItem = active === null ? null : galleryItems[active];
  const activeItemIsLowResolution = activeItem !== null && Math.min(activeItem.width, activeItem.height) < 800;
  const activeImageStyle = activeItemIsLowResolution ? {
    '--lightbox-max-width': `${Math.round(activeItem.width * 1.75)}px`,
    '--lightbox-max-height': `${Math.round(activeItem.height * 1.75)}px`,
  } as CSSProperties : undefined;

  useEffect(() => {
    if (active === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((active + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setActive((active - 1 + galleryItems.length) % galleryItems.length);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [active]);

  const move = (direction: number) => active !== null && setActive((active + direction + galleryItems.length) % galleryItems.length);

  return <main className="page">
    <SEO {...seoConfig.pages.gallery} structuredData={[webPageSchema(seoConfig.pages.gallery.path, seoConfig.pages.gallery.title, seoConfig.pages.gallery.description), breadcrumbSchema('Gallery', seoConfig.pages.gallery.path), imageObjectSchema()]} />
    <section className="page-hero page-hero--gallery"><SectionHeading level="h1" eyebrow={t('The work')} title={t('Every piece has a pulse.')} text={t('Explore tattoo work created by Joker Tattoo in Patong, from Japanese sleeves and realism to traditional Sak Yant.')} /></section>
    <section className="gallery-section">
      <div className="filters" role="group" aria-label={t('Filter gallery')}>{galleryCategories.map(category => <button className={filter === category ? 'active' : ''} onClick={() => setFilter(category)} key={category}>{t(category)}</button>)}</div>
      <motion.div layout className="masonry">{visible.map((item, index) => <motion.button layout className={`gallery-tile gallery-tile--${index % 4}`} key={item.id} onClick={() => setActive(galleryItems.indexOf(item))}><img src={item.imageSmall} srcSet={item.imageSmall !== item.image ? `${item.imageSmall} 640w, ${item.image} ${item.width}w` : undefined} sizes="(max-width: 700px) 100vw, 33vw" width={item.width} height={item.height} alt={t(item.alt)} loading="lazy" decoding="async" /><span><strong>{t(item.title)}</strong><small>{t(item.category)}</small></span></motion.button>)}</motion.div>
      <div className="gallery-cta"><p>{t('Have a direction in mind? Tell the studio about your idea.')}</p><BookingButton variant="outline">{t('Discuss your tattoo idea')}</BookingButton></div>
    </section>
    <AnimatePresence>{active !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={t('Gallery image viewer')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="lightbox__close" onClick={() => setActive(null)} aria-label={t('Close image viewer')}>{t('Close')} ×</button>
      <button className="lightbox__prev" onClick={() => move(-1)} aria-label={t('Previous image')}>←</button>
      <motion.img className={activeItemIsLowResolution ? 'lightbox__image lightbox__image--low-res' : 'lightbox__image'} style={activeImageStyle} key={active} initial={{ opacity: 0, scale: .965 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .32, ease: 'easeOut' }} src={galleryItems[active].image} width={galleryItems[active].width} height={galleryItems[active].height} alt={t(galleryItems[active].alt)} decoding="async" />
      <div className="lightbox__caption"><strong>{t(galleryItems[active].title)}</strong><span>{t(galleryItems[active].category)} · {active + 1}/{galleryItems.length}</span></div>
      <button className="lightbox__next" onClick={() => move(1)} aria-label={t('Next image')}>→</button>
    </motion.div>}</AnimatePresence>
  </main>;
}
