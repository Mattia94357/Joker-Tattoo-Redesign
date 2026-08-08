import rawSeo from './seo.json';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const seoConfig = {
  ...rawSeo,
  siteUrl: trimTrailingSlash(import.meta.env.VITE_SITE_URL || rawSeo.fallbackSiteUrl),
  businessName: import.meta.env.VITE_BUSINESS_NAME || rawSeo.businessName,
};

export type SeoPageKey = keyof typeof seoConfig.pages;
export const absoluteUrl = (path: string) => `${seoConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
