import { absoluteUrl, seoConfig } from '../../config/seo';

type JsonLd = Record<string, unknown>;

const definedEntries = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined && entry !== '' && (!Array.isArray(entry) || entry.length > 0)));

export function localBusinessSchema(): JsonLd {
  const address = definedEntries(seoConfig.address);
  const geo = definedEntries({
    '@type': 'GeoCoordinates',
    latitude: seoConfig.geo.latitude,
    longitude: seoConfig.geo.longitude,
  });

  return definedEntries({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${seoConfig.siteUrl}/#business`,
    name: seoConfig.businessName,
    url: seoConfig.siteUrl,
    logo: absoluteUrl(seoConfig.logo),
    image: absoluteUrl(seoConfig.defaultImage),
    telephone: seoConfig.telephone,
    email: seoConfig.email,
    priceRange: seoConfig.priceRange,
    address: Object.keys(address).length > 2 ? { '@type': 'PostalAddress', ...address } : undefined,
    geo: Object.keys(geo).length > 1 ? geo : undefined,
    openingHoursSpecification: seoConfig.openingHours,
    sameAs: seoConfig.socialAccounts,
    areaServed: seoConfig.areaServed.map(name => ({ '@type': 'Place', name })),
  });
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${seoConfig.siteUrl}/#website`,
    url: seoConfig.siteUrl,
    name: seoConfig.businessName,
    inLanguage: 'en',
    publisher: { '@id': `${seoConfig.siteUrl}/#business` },
  };
}

export function webPageSchema(path: string, title: string, description: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { '@id': `${seoConfig.siteUrl}/#website` },
    about: { '@id': `${seoConfig.siteUrl}/#business` },
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(label: string, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: seoConfig.siteUrl },
      { '@type': 'ListItem', position: 2, name: label, item: absoluteUrl(path) },
    ],
  };
}

export function faqSchema(items: string[][]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function imageObjectSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${absoluteUrl(seoConfig.defaultImage)}#image`,
    contentUrl: absoluteUrl(seoConfig.defaultImage),
    width: 1200,
    height: 630,
    caption: `${seoConfig.businessName} tattoo studio in Patong, Phuket`,
    representativeOfPage: true,
  };
}
