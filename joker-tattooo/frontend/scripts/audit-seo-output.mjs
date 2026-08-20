import { readFile } from 'node:fs/promises';
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
  expect(occurrences(html, /<h1(?:\s|>)/gi) === 1, `${prefix}: expected one H1 in generated HTML`);
  expect(html.includes(`content="${page.description}"`), `${prefix}: generated description differs from config`);
  expect(html.includes(`property="og:title" content="${page.title}"`), `${prefix}: missing Open Graph title`);
  expect(html.includes(`name="twitter:card" content="summary_large_image"`), `${prefix}: missing Twitter card`);
  expect(html.includes('property="og:image:alt"'), `${prefix}: missing Open Graph image alt`);
  expect(html.includes('name="twitter:image:alt"'), `${prefix}: missing Twitter image alt`);
  if (page.path !== '/404') expect(html.includes('max-image-preview:large'), `${prefix}: missing expanded preview directive`);
  expect(page.path === '/404' ? html.includes('noindex, follow') : !html.includes('noindex, follow'), `${prefix}: incorrect index directive`);

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
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

  if (page.path !== '/404') {
    expect(!titles.has(page.title), `${prefix}: duplicate title`);
    expect(!descriptions.has(page.description), `${prefix}: duplicate description`);
    titles.add(page.title);
    descriptions.add(page.description);
  }
  for (const linkedPage of publicPages) {
    expect(html.includes(`href="${linkedPage.path}"`), `${prefix}: missing internal link to ${linkedPage.path}`);
  }
}

const sitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
expect(occurrences(sitemap, /<url>/g) === publicPages.length, 'sitemap: incorrect public URL count');
for (const page of publicPages) {
  expect(sitemap.includes(`<loc>${siteUrl}${page.path}</loc>`), `sitemap: missing ${page.path}`);
  expect(sitemap.includes(`<changefreq>${page.changefreq}</changefreq>`), `sitemap: missing ${page.changefreq} frequency`);
}
expect(!sitemap.includes('/404'), 'sitemap: 404 must not be listed');
expect(!sitemap.includes('/what-we-do'), 'sitemap: legacy redirect must not be listed');

const robots = await readFile(path.join(root, 'dist', 'robots.txt'), 'utf8');
for (const agent of ['OAI-SearchBot', 'PerplexityBot', 'Google-Extended']) expect(robots.includes(`User-agent: ${agent}`), `robots: missing ${agent}`);
expect(robots.includes('Sitemap:'), 'robots: missing sitemap reference');

const llms = await readFile(path.join(root, 'dist', 'llms.txt'), 'utf8');
for (const page of publicPages) expect(llms.includes(`${siteUrl}${page.path}`), `llms.txt: missing ${page.path}`);

if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed for ${publicPages.length} public pages plus the noindex 404 page.`);
  if (siteUrl === 'https://example.com') console.warn('Production warning: set VITE_SITE_URL to the canonical live domain before deployment.');
}
