import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const root = process.cwd();
const config = JSON.parse(await readFile(path.join(root, 'src', 'config', 'seo.json'), 'utf8'));
const faqItems = JSON.parse(await readFile(path.join(root, 'src', 'data', 'faq.json'), 'utf8'));
const env = loadEnv(process.env.NODE_ENV || 'production', root, '');
const siteUrl = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || config.fallbackSiteUrl).replace(/\/+$/, '');
const businessName = env.VITE_BUSINESS_NAME || process.env.VITE_BUSINESS_NAME || config.businessName;
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

const absolute = value => `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function pageSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absolute(page.path)}#webpage`,
    url: absolute(page.path),
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#business` },
    publisher: { '@id': `${siteUrl}/#organization` },
    primaryImageOfPage: { '@id': `${absolute(config.defaultImage)}#image` },
    inLanguage: 'en',
  };
}

function imageObjectSchema() {
  const image = absolute(config.defaultImage);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${image}#image`,
    url: image,
    contentUrl: image,
    width: config.defaultImageWidth,
    height: config.defaultImageHeight,
    caption: config.defaultImageAlt,
    representativeOfPage: true,
  };
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: businessName,
    url: siteUrl,
    description: config.businessDescription,
    logo: {
      '@type': 'ImageObject',
      '@id': `${absolute(config.logo)}#logo`,
      url: absolute(config.logo),
      contentUrl: absolute(config.logo),
      width: 512,
      height: 512,
      caption: `${businessName} logo`,
    },
    email: config.email,
    telephone: config.telephone,
    sameAs: config.socialAccounts,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: config.telephone,
      email: config.email,
      areaServed: 'TH',
      availableLanguage: ['English', 'Italian'],
    },
  };
}

function breadcrumbSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbLabel || page.heading, item: absolute(page.path) },
    ],
  };
}

function localBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['TattooParlor', 'LocalBusiness'],
    '@id': `${siteUrl}/#business`,
    name: businessName,
    url: siteUrl,
    description: config.businessDescription,
    logo: absolute(config.logo),
    image: absolute(config.defaultImage),
    hasMap: config.mapUrl,
    address: { '@type': 'PostalAddress', ...config.address },
    geo: { '@type': 'GeoCoordinates', ...config.geo },
    openingHoursSpecification: config.openingHours,
    areaServed: config.areaServed.map(name => ({ '@type': 'Place', name })),
    parentOrganization: { '@id': `${siteUrl}/#organization` },
    knowsAbout: ['Custom tattoos', 'Japanese tattoos', 'Realism tattoos', 'Sak Yant tattoos', 'Black and grey tattoos', 'Fine line tattoos', 'Tattoo cover-ups', 'Large-scale tattoos'],
  };
  if (config.telephone) schema.telephone = config.telephone;
  if (config.email) schema.email = config.email;
  if (config.socialAccounts.length) schema.sameAs = config.socialAccounts;
  if (config.aggregateRating.enabled && config.aggregateRating.ratingValue && config.aggregateRating.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
      bestRating: config.aggregateRating.bestRating,
      worstRating: config.aggregateRating.worstRating,
    };
  }
  return schema;
}

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

function metadata(page, noindex = false) {
  const canonical = absolute(page.path);
  const image = absolute(config.defaultImage);
  const robots = noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const schemas = [organizationSchema(), pageSchema(page), imageObjectSchema()];
  if (page.path !== '/' && !noindex) schemas.push(breadcrumbSchema(page));
  if (page.path === '/') {
    schemas.push(localBusinessSchema());
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: businessName,
      inLanguage: 'en',
      publisher: { '@id': `${siteUrl}/#organization` },
    });
  }
  if (page.path === '/contact') schemas.push(localBusinessSchema());
  if (page.path === '/why-joker') schemas.push(faqSchema());
  const preload = page.preloadImage
    ? `<link rel="preload" as="image" href="${page.preloadImage}" imagesrcset="${page.preloadImageSrcSet}" imagesizes="${page.preloadImageSizes}" fetchpriority="high">`
    : '';
  return `
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}">
    <meta name="robots" content="${robots}">
    <meta name="googlebot" content="${robots}">
    <meta name="author" content="${escape(businessName)}">
    <meta name="geo.region" content="TH-83">
    <meta name="geo.placename" content="Patong">
    <meta name="ICBM" content="${config.geo.latitude}, ${config.geo.longitude}">
    <link rel="canonical" href="${canonical}">
    ${preload}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escape(page.title)}">
    <meta property="og:description" content="${escape(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:secure_url" content="${image}">
    <meta property="og:image:width" content="${config.defaultImageWidth}">
    <meta property="og:image:height" content="${config.defaultImageHeight}">
    <meta property="og:image:alt" content="${escape(config.defaultImageAlt)}">
    <meta property="og:site_name" content="${escape(businessName)}">
    <meta property="og:locale" content="${config.defaultLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(page.title)}">
    <meta name="twitter:description" content="${escape(page.description)}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${escape(config.defaultImageAlt)}">
    ${schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`).join('\n')}`;
}

function render(page, noindex = false) {
  const clean = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta name="description"[^>]*>/i, '');
  const nav = Object.values(config.pages).filter(item => item.path !== '/404').map(item => `<a href="${item.path}">${escape(item.heading)}</a>`).join(' ');
  const facts = page.facts?.length
    ? `<section aria-labelledby="page-facts"><h2 id="page-facts">About ${escape(businessName)}</h2><ul>${page.facts.map(fact => `<li>${escape(fact)}</li>`).join('')}</ul></section>`
    : '';
  const fallback = `<main data-prerendered="true"><h1>${escape(page.heading)}</h1><p>${escape(page.summary)}</p>${facts}<nav aria-label="Primary">${nav}</nav></main>`;
  return clean
    .replace('</head>', `${metadata(page, noindex)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${fallback}</noscript>`);
}

for (const [key, page] of Object.entries(config.pages)) {
  const noindex = key === 'notFound';
  const html = render(page, noindex);
  if (page.path === '/') {
    await writeFile(path.join(dist, 'index.html'), html);
  } else {
    const target = path.join(dist, page.path.slice(1));
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, 'index.html'), html);
  }
  if (noindex) await writeFile(path.join(dist, '404.html'), html);
}

const publicPages = Object.values(config.pages).filter(page => page.path !== '/404');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map(page => `  <url>\n    <loc>${absolute(page.path)}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${Number(page.priority).toFixed(1)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const llms = `# ${businessName}\n\n> ${config.businessDescription}\n\n## Key facts\n\n- Address: ${config.address.streetAddress}, ${config.address.addressLocality}, ${config.address.addressRegion} ${config.address.postalCode}, Thailand\n- Phone: ${config.telephone}\n- Email: ${config.email}\n- Hours: Daily, 1:00 PM to 8:00 PM\n- Services: Custom tattoos, Japanese tattoos, realism tattoos, Sak Yant, black and grey, fine line, cover-ups and large-scale tattoos.\n- Booking: Customers can request an appointment online and receive a personal reply from the studio.\n\n## Public pages\n\n${publicPages.map(page => `- [${page.heading}](${absolute(page.path)}): ${page.summary}`).join('\n')}\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), robots);
await writeFile(path.join(dist, 'llms.txt'), llms);
