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
    inLanguage: 'en',
  };
}

function breadcrumbSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: page.heading, item: absolute(page.path) },
    ],
  };
}

function localBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: businessName,
    url: siteUrl,
    logo: absolute(config.logo),
    image: absolute(config.defaultImage),
    areaServed: config.areaServed.map(name => ({ '@type': 'Place', name })),
  };
  if (config.telephone) schema.telephone = config.telephone;
  if (config.email) schema.email = config.email;
  if (config.socialAccounts.length) schema.sameAs = config.socialAccounts;
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
  const schemas = [pageSchema(page)];
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
    });
  }
  if (page.path === '/what-we-do') schemas.push(faqSchema());
  return `
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}">
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escape(page.title)}">
    <meta property="og:description" content="${escape(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta property="og:site_name" content="${escape(businessName)}">
    <meta property="og:locale" content="${config.defaultLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(page.title)}">
    <meta name="twitter:description" content="${escape(page.description)}">
    <meta name="twitter:image" content="${image}">
    ${schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`).join('\n')}`;
}

function render(page, noindex = false) {
  const clean = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta name="description"[^>]*>/i, '');
  const nav = Object.values(config.pages).filter(item => item.path !== '/404').map(item => `<a href="${item.path}">${escape(item.heading)}</a>`).join(' ');
  return clean
    .replace('</head>', `${metadata(page, noindex)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main data-prerendered="true"><h1>${escape(page.heading)}</h1><p>${escape(page.summary)}</p><nav aria-label="Primary">${nav}</nav></main></div>`);
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
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map(page => `  <url><loc>${absolute(page.path)}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), robots);
