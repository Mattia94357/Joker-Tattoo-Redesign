import { Helmet } from 'react-helmet-async';
import { absoluteUrl, seoConfig } from '../../config/seo';

type JsonLd = Record<string, unknown>;
type SEOProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  noindex?: boolean;
  preloadImage?: string;
  preloadImageSrcSet?: string;
  preloadImageSizes?: string;
  structuredData?: JsonLd | JsonLd[];
};

export function SEO({ title, description, path, image = seoConfig.defaultImage, imageAlt = seoConfig.defaultImageAlt, type = 'website', noindex = false, preloadImage, preloadImageSrcSet, preloadImageSizes, structuredData }: SEOProps) {
  const canonical = absoluteUrl(path.split('?')[0]);
  const socialImage = absoluteUrl(image);
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];

  return <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
    <meta name="googlebot" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
    <meta name="author" content={seoConfig.businessName} />
    <meta name="geo.region" content="TH-83" />
    <meta name="geo.placename" content="Patong, Phuket" />
    <meta name="ICBM" content={`${seoConfig.geo.latitude}, ${seoConfig.geo.longitude}`} />
    <link rel="canonical" href={canonical} />
    {preloadImage && <link rel="preload" as="image" href={preloadImage} imageSrcSet={preloadImageSrcSet} imageSizes={preloadImageSizes} fetchPriority="high" />}
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:image:secure_url" content={socialImage} />
    <meta property="og:image:width" content={String(seoConfig.defaultImageWidth)} />
    <meta property="og:image:height" content={String(seoConfig.defaultImageHeight)} />
    <meta property="og:image:alt" content={imageAlt} />
    <meta property="og:site_name" content={seoConfig.businessName} />
    <meta property="og:locale" content={seoConfig.defaultLocale} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={socialImage} />
    <meta name="twitter:image:alt" content={imageAlt} />
    {schemas.map((schema, index) => <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>)}
  </Helmet>;
}
