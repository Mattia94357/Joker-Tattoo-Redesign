import { Helmet } from 'react-helmet-async';
import { absoluteUrl, seoConfig } from '../../config/seo';

type JsonLd = Record<string, unknown>;
type SEOProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: JsonLd | JsonLd[];
};

export function SEO({ title, description, path, image = seoConfig.defaultImage, type = 'website', noindex = false, structuredData }: SEOProps) {
  const canonical = absoluteUrl(path.split('?')[0]);
  const socialImage = absoluteUrl(image);
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];

  return <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:site_name" content={seoConfig.businessName} />
    <meta property="og:locale" content={seoConfig.defaultLocale} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={socialImage} />
    {schemas.map((schema, index) => <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>)}
  </Helmet>;
}
