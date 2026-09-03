import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const root = process.cwd();
const config = JSON.parse(await readFile(path.join(root, 'src', 'config', 'seo.json'), 'utf8'));
const env = loadEnv(process.env.NODE_ENV || 'production', root, '');
const siteUrl = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || config.fallbackSiteUrl).replace(/\/+$/, '');
const publicPages = Object.values(config.pages).filter(page => page.path !== '/404');
const failures = [];
const titles = new Set();
const descriptions = new Set();
const paths = new Set();

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};
const occurrences = (source, pattern) => source.match(pattern)?.length ?? 0;

for (const page of Object.values(config.pages)) {
  const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}/index.html`;
  const html = await readFile(path.join(root, 'dist', file), 'utf8');
  const prefix = page.path;
  expect(occurrences(html, /<title>/gi) === 1, `${prefix}: expected one title`);
  expect(occurrences(html, /<meta name="description"/gi) === 1, `${prefix}: expected one meta description`);
  expect(occurrences(html, /<link rel="canonical"/gi) === 1, `${prefix}: expected one canonical`);
  expect(html.includes(`<link rel="canonical" href="${siteUrl}${page.path}">`), `${prefix}: incorrect canonical URL`);
  expect(occurrences(html, /<h1(?:\s|>)/gi) === 1, `${prefix}: expected one H1 in generated HTML`);
  expect(html.includes(`content="${page.description}"`), `${prefix}: generated description differs from config`);
  expect(html.includes(`property="og:title" content="${page.title}"`), `${prefix}: missing Open Graph title`);
  expect(html.includes(`property="og:url" content="${siteUrl}${page.path}"`), `${prefix}: incorrect Open Graph URL`);
  expect(html.includes(`name="twitter:card" content="summary_large_image"`), `${prefix}: missing Twitter card`);
  expect(html.includes('property="og:image:alt"'), `${prefix}: missing Open Graph image alt`);
  expect(html.includes('name="twitter:image:alt"'), `${prefix}: missing Twitter image alt`);
  if (page.path !== '/404') expect(html.includes('max-image-preview:large'), `${prefix}: missing expanded preview directive`);
  expect(page.path === '/404' ? html.includes('noindex, follow') : !html.includes('noindex, follow'), `${prefix}: incorrect index directive`);

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  for (const schema of jsonLd) {
    expect(schema['@context'] === 'https://schema.org', `${prefix}: invalid schema context`);
    expect(!JSON.stringify(schema).includes('example.com'), `${prefix}: placeholder URL in schema`);
  }
  const types = jsonLd.flatMap(schema => Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]);
  if (page.path !== '/404') {
    expect(types.includes('Organization'), `${prefix}: missing Organization schema`);
    expect(types.includes('WebPage'), `${prefix}: missing WebPage schema`);
    expect(types.includes('ImageObject'), `${prefix}: missing ImageObject schema`);
  }
  if (page.path === '/') expect(types.includes('WebSite') && types.includes('LocalBusiness') && types.includes('TattooParlor'), `${prefix}: missing home entity schemas`);
  if (page.path === '/contact') expect(types.includes('LocalBusiness') && types.includes('BreadcrumbList'), `${prefix}: missing contact schemas`);
  if (page.path === '/why-joker') expect(types.includes('FAQPage') && types.includes('BreadcrumbList'), `${prefix}: missing Why Joker schemas`);
  if (page.path === '/gallery') expect(types.includes('BreadcrumbList'), `${prefix}: missing gallery breadcrumbs`);

  const organization = jsonLd.find(schema => schema['@type'] === 'Organization');
  if (organization) expect(organization['@id'] === `${siteUrl}/#organization` && Boolean(organization.logo), `${prefix}: incomplete Organization schema`);
  const webPage = jsonLd.find(schema => schema['@type'] === 'WebPage');
  if (webPage) expect(webPage.url === `${siteUrl}${page.path}` && Boolean(webPage.publisher) && Boolean(webPage.primaryImageOfPage), `${prefix}: incomplete WebPage schema`);
  const localBusiness = jsonLd.find(schema => Array.isArray(schema['@type']) && schema['@type'].includes('LocalBusiness'));
  if (localBusiness) expect(Boolean(localBusiness.address) && Boolean(localBusiness.geo) && Boolean(localBusiness.openingHoursSpecification), `${prefix}: incomplete LocalBusiness schema`);
  const faq = jsonLd.find(schema => schema['@type'] === 'FAQPage');
  if (faq) expect(Array.isArray(faq.mainEntity) && faq.mainEntity.every(item => item.name && item.acceptedAnswer?.text), `${prefix}: invalid FAQ entities`);

  if (page.path !== '/404') {
    expect(!titles.has(page.title), `${prefix}: duplicate title`);
    expect(!descriptions.has(page.description), `${prefix}: duplicate description`);
    titles.add(page.title);
    descriptions.add(page.description);
    expect(!paths.has(page.path), `${prefix}: duplicate public path`);
    paths.add(page.path);
  }
  for (const linkedPage of publicPages) {
    expect(html.includes(`href="${linkedPage.path}"`), `${prefix}: missing internal link to ${linkedPage.path}`);
  }
}

const sitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
expect(occurrences(sitemap, /<url>/g) === publicPages.length, 'sitemap: incorrect public URL count');
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
expect(sitemapLocations.length === publicPages.length, 'sitemap: incorrect location count');
expect(sitemapLocations.every(location => location.startsWith(`${siteUrl}/`)), 'sitemap: location uses a different origin');
for (const page of publicPages) {
  expect(sitemap.includes(`<loc>${siteUrl}${page.path}</loc>`), `sitemap: missing ${page.path}`);
  expect(sitemap.includes(`<changefreq>${page.changefreq}</changefreq>`), `sitemap: missing ${page.changefreq} frequency`);
}
expect(!sitemap.includes('/404'), 'sitemap: 404 must not be listed');
expect(!sitemap.includes('/what-we-do'), 'sitemap: legacy redirect must not be listed');
expect(!sitemap.includes('example.com'), 'sitemap: placeholder domain found');

const robots = await readFile(path.join(root, 'dist', 'robots.txt'), 'utf8');
expect(robots.includes('User-agent: *'), 'robots: missing wildcard user agent');
expect(robots.includes('Allow: /'), 'robots: site is not explicitly crawlable');
expect(!robots.includes('Disallow:'), 'robots: unexpected disallow directive');
expect(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), 'robots: incorrect sitemap reference');

const llms = await readFile(path.join(root, 'dist', 'llms.txt'), 'utf8');
for (const page of publicPages) expect(llms.includes(`${siteUrl}${page.path}`), `llms.txt: missing ${page.path}`);

for (const asset of ['favicon.ico', 'favicon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', config.defaultImage.replace(/^\//, '')]) {
  try {
    await access(path.join(root, 'dist', asset));
  } catch {
    failures.push(`asset: missing ${asset}`);
  }
}

if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed for ${publicPages.length} public pages plus the noindex 404 page.`);
  if (siteUrl.includes('example.com')) console.warn('Production warning: set VITE_SITE_URL to the canonical live domain before deployment.');
}
