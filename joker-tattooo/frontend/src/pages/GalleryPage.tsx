import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion as m } from 'framer-motion';
import { galleryCategories, galleryItems, type GalleryItem } from '../data/gallery';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BookingButton } from '../components/booking/BookingButton';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/seo/SEO';
import { breadcrumbSchema, imageObjectSchema, organizationSchema, webPageSchema } from '../components/seo/structuredData';
import { seoConfig } from '../config/seo';

const imagePreloads = new Map<string, Promise<string>>();
const thumbnailSizes = '(max-width: 700px) calc(100vw - 40px), 33vw';

const thumbnailSrcSet = (item: GalleryItem) => item.imageSmall !== item.image && item.width > 480
  ? `${item.imageSmall} 480w, ${item.image} ${item.width}w`
  : undefined;

function preloadImage(src: string, srcSet?: string) {
  const key = `${src}|${srcSet ?? ''}`;
  const existing = imagePreloads.get(key);
  if (existing) return existing;

  const pending = new Promise<string>(resolve => {
    const image = new Image();
    const ready = () => image.decode().then(() => resolve(image.currentSrc || image.src), () => resolve(''));
    image.addEventListener('load', ready, { once: true });
    image.addEventListener('error', () => resolve(''), { once: true });
    if (srcSet) {
      image.srcset = srcSet;
      image.sizes = thumbnailSizes;
    }
    image.src = src;
    if (image.complete && image.naturalWidth > 0) ready();
  });
  imagePreloads.set(key, pending);
  return pending;
}

const preloadThumbnail = (item: GalleryItem) => preloadImage(item.imageSmall, thumbnailSrcSet(item));

function waitForImage(image?: HTMLImageElement) {
  if (!image) return Promise.resolve();
  if (image.complete) return image.naturalWidth > 0 ? image.decode().catch(() => undefined) : Promise.resolve();
  return new Promise<void>(resolve => {
    const ready = () => image.decode().then(() => resolve(), () => resolve());
    image.addEventListener('load', ready, { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
}

export function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const filterRequest = useRef(0);
  const imageRequest = useRef(0);
  const imageElements = useRef(new Map<number, HTMLImageElement>());
  const { t } = useLanguage();
  const activeItem = active === null ? null : galleryItems[active];
  const activeItemIsLowResolution = activeItem !== null && Math.min(activeItem.width, activeItem.height) < 800;
  const activeImageStyle = activeItemIsLowResolution ? {
    '--lightbox-max-width': `${Math.round(activeItem.width * 1.75)}px`,
    '--lightbox-max-height': `${Math.round(activeItem.height * 1.75)}px`,
  } as CSSProperties : undefined;

  const selectFilter = async (category: string) => {
    if (category === filter) return;
    const request = ++filterRequest.current;
    const nextItems = category === 'All' ? galleryItems : galleryItems.filter(item => item.category === category);
    setPendingFilter(category);
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    await Promise.all(nextItems.map(item => waitForImage(imageElements.current.get(item.id))));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (request === filterRequest.current) {
      setFilter(category);
      setPendingFilter(null);
    }
  };

  const loadFullImage = (index: number, request: number) => {
    const item = galleryItems[index];
    void preloadImage(item.image).then(src => {
      if (src && request === imageRequest.current) setActiveImage(src);
    });
  };

  const openImage = (index: number) => {
    const request = ++imageRequest.current;
    const item = galleryItems[index];
    setActiveImage(item.imageSmall);
    setActive(index);
    loadFullImage(index, request);
  };

  const closeImage = () => {
    imageRequest.current += 1;
    setActive(null);
  };

  const move = async (direction: number) => {
    if (active === null) return;
    const index = (active + direction + galleryItems.length) % galleryItems.length;
    const request = ++imageRequest.current;
    const item = galleryItems[index];
    const src = await preloadThumbnail(item);
    if (!src || request !== imageRequest.current) return;
    setActiveImage(src);
    setActive(index);
    loadFullImage(index, request);
  };

  useEffect(() => {
    if (active === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeImage();
      if (event.key === 'ArrowRight') void move(1);
      if (event.key === 'ArrowLeft') void move(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  return <main className="page">
    <SEO {...seoConfig.pages.gallery} structuredData={[organizationSchema(), webPageSchema(seoConfig.pages.gallery.path, seoConfig.pages.gallery.title, seoConfig.pages.gallery.description), breadcrumbSchema('Gallery', seoConfig.pages.gallery.path), imageObjectSchema()]} />
    <section className="page-hero page-hero--gallery"><SectionHeading level="h1" eyebrow={t('Our work')} title={t('Made to belong to you.')} text={t('Explore tattoos created at Joker Tattoo in Patong, from Japanese sleeves and realism to traditional Sak Yant.')}/></section>
    <section className="gallery-section" aria-label={t('Joker Tattoo portfolio gallery')}>
      <div className="filters" role="group" aria-label={t('Filter gallery')}>{galleryCategories.map(category => <button className={filter === category ? 'active' : ''} onClick={() => void selectFilter(category)} key={category}>{t(category)}</button>)}</div>
      <div className="masonry">{galleryItems.map((item, index) => {
        const shown = filter === 'All' || item.category === filter;
        const requested = pendingFilter === 'All' || pendingFilter === item.category;
        return <button className={`gallery-tile gallery-tile--${index % 4}${requested && !shown ? ' gallery-tile--preparing' : ''}`} hidden={!shown && !requested} key={item.id} onClick={() => openImage(index)}><img ref={node => { if (node) imageElements.current.set(item.id, node); else imageElements.current.delete(item.id); }} src={item.imageSmall} srcSet={thumbnailSrcSet(item)} sizes={thumbnailSizes} width={item.width} height={item.height} alt={t(item.alt)} loading={index < 3 || requested ? 'eager' : 'lazy'} decoding="async" /><span><strong>{t(item.title)}</strong><small>{t(item.category)}</small></span></button>;
      })}</div>
      <div className="gallery-cta"><p>{t('Found a direction you like? Tell us what you have in mind.')}</p><BookingButton variant="outline">{t('Start Your Tattoo Journey')}</BookingButton></div>
    </section>
    <AnimatePresence>{active !== null && <m.div className="lightbox" role="dialog" aria-modal="true" aria-label={t('Gallery image viewer')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="lightbox__close" onClick={closeImage} aria-label={t('Close image viewer')}>{t('Close')} ×</button>
      <button className="lightbox__prev" onClick={() => void move(-1)} aria-label={t('Previous image')}>←</button>
      <m.img className={activeItemIsLowResolution ? 'lightbox__image lightbox__image--low-res' : 'lightbox__image'} style={activeImageStyle} initial={{ opacity: 0, scale: .965 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .32, ease: 'easeOut' }} src={activeImage} width={galleryItems[active].width} height={galleryItems[active].height} alt={t(galleryItems[active].alt)} decoding="async" />
      <div className="lightbox__caption"><strong>{t(galleryItems[active].title)}</strong><span>{t(galleryItems[active].category)} · {active + 1}/{galleryItems.length}</span></div>
      <button className="lightbox__next" onClick={() => void move(1)} aria-label={t('Next image')}>→</button>
    </m.div>}</AnimatePresence>
  </main>;
}
