import { absoluteUrl, seoConfig } from '../../config/seo';

type JsonLd = Record<string, unknown>;

const definedEntries = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined && entry !== '' && (!Array.isArray(entry) || entry.length > 0)));

type RatingConfig = {
  enabled: boolean;
  ratingValue: number | null;
  reviewCount: number | null;
  bestRating: number;
  worstRating: number;
};

const ratingConfig = seoConfig.aggregateRating as RatingConfig;
const aggregateRating = ratingConfig.enabled && ratingConfig.ratingValue && ratingConfig.reviewCount
  ? {
      '@type': 'AggregateRating',
      ratingValue: ratingConfig.ratingValue,
      reviewCount: ratingConfig.reviewCount,
      bestRating: ratingConfig.bestRating,
      worstRating: ratingConfig.worstRating,
    }
  : undefined;

export function organizationSchema(): JsonLd {
  return definedEntries({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.businessName,
    url: seoConfig.siteUrl,
    description: seoConfig.businessDescription,
    logo: {
      '@type': 'ImageObject',
      '@id': `${absoluteUrl(seoConfig.logo)}#logo`,
      url: absoluteUrl(seoConfig.logo),
      contentUrl: absoluteUrl(seoConfig.logo),
      width: 512,
      height: 512,
      caption: `${seoConfig.businessName} logo`,
    },
    email: seoConfig.email,
    telephone: seoConfig.telephone,
    sameAs: seoConfig.socialAccounts,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: seoConfig.telephone,
      email: seoConfig.email,
      areaServed: 'TH',
      availableLanguage: ['English', 'Italian'],
    },
  });
}

export function localBusinessSchema(): JsonLd {
  const address = definedEntries(seoConfig.address);
  const geo = definedEntries({
    '@type': 'GeoCoordinates',
    latitude: seoConfig.geo.latitude,
    longitude: seoConfig.geo.longitude,
  });

  return definedEntries({
    '@context': 'https://schema.org',
    '@type': ['TattooParlor', 'LocalBusiness'],
    '@id': `${seoConfig.siteUrl}/#business`,
    name: seoConfig.businessName,
    url: seoConfig.siteUrl,
    description: seoConfig.businessDescription,
    logo: absoluteUrl(seoConfig.logo),
    image: absoluteUrl(seoConfig.defaultImage),
    telephone: seoConfig.telephone,
    email: seoConfig.email,
    priceRange: seoConfig.priceRange,
    hasMap: seoConfig.mapUrl,
    address: Object.keys(address).length > 2 ? { '@type': 'PostalAddress', ...address } : undefined,
    geo: Object.keys(geo).length > 1 ? geo : undefined,
    openingHoursSpecification: seoConfig.openingHours,
    sameAs: seoConfig.socialAccounts,
    areaServed: seoConfig.areaServed.map(name => ({ '@type': 'Place', name })),
    parentOrganization: { '@id': `${seoConfig.siteUrl}/#organization` },
    knowsAbout: ['Custom tattoos', 'Japanese tattoos', 'Realism tattoos', 'Sak Yant tattoos', 'Black and grey tattoos', 'Fine line tattoos', 'Tattoo cover-ups', 'Large-scale tattoos'],
    aggregateRating,
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
    publisher: { '@id': `${seoConfig.siteUrl}/#organization` },
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
    publisher: { '@id': `${seoConfig.siteUrl}/#organization` },
    primaryImageOfPage: { '@id': `${absoluteUrl(seoConfig.defaultImage)}#image` },
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

export function imageObjectSchema(image = seoConfig.defaultImage, caption = seoConfig.defaultImageAlt, width = seoConfig.defaultImageWidth, height = seoConfig.defaultImageHeight): JsonLd {
  const imageUrl = absoluteUrl(image);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${imageUrl}#image`,
    url: imageUrl,
    contentUrl: imageUrl,
    width,
    height,
    caption,
    representativeOfPage: true,
  };
}
