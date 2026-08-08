# Joker Tattoo SEO Architecture

This project provides a technical and local SEO foundation. It does not guarantee rankings or a first position in search results. Search performance also depends on accurate business data, useful original content, portfolio quality, reputation, links, competition, and ongoing maintenance.

## Canonical domain

Set the production origin before building:

```env
VITE_SITE_URL=https://your-production-domain.com
VITE_BUSINESS_NAME=Joker Tattoo
```

Never use a temporary preview URL as the permanent `VITE_SITE_URL`. Canonicals, Open Graph URLs, the sitemap, robots reference, and structured-data URLs are generated from this value. The checked-in `https://example.com` value is an explicit placeholder and must be replaced before launch.

## Metadata system

- `frontend/src/config/seo.json` contains business-wide settings and unique data for every route.
- `frontend/src/config/seo.ts` applies environment overrides and creates absolute URLs.
- `frontend/src/components/seo/SEO.tsx` supplies titles, descriptions, canonical links, robots directives, Open Graph, Twitter/X cards, and optional JSON-LD through `react-helmet-async`.
- Every public page uses `index, follow`.
- The catch-all 404 page uses `noindex, follow`.

Edit page titles and descriptions centrally in `seo.json`; do not duplicate them inside page components.

## Structured data

`frontend/src/components/seo/structuredData.ts` provides:

- `LocalBusiness` on Home.
- `WebSite` on Home.
- `WebPage` on all public pages.
- `BreadcrumbList` on Gallery, What We Do, and Contact.
- `FAQPage` on What We Do only, using the same visible questions and answers from `frontend/src/data/faq.json`.
- `ImageObject` for the real generated social-sharing image.

Unconfirmed phone, email, street address, postal code, coordinates, opening hours, price range, and social accounts are omitted from published JSON-LD. Do not add ratings or reviews unless they are genuine, visible, and eligible under current search-engine guidelines.

## Sitemap, robots, and prerender snapshots

`npm run build` runs `frontend/scripts/generate-seo.mjs` after Vite. It:

1. Generates static route HTML for `/`, `/gallery`, `/what-we-do`, `/contact`, and `/404`.
2. Injects each route’s unique title, description, canonical, robots, social metadata, JSON-LD, heading, summary, and internal links.
3. Writes `dist/sitemap.xml` with public routes only.
4. Writes `dist/robots.txt` referencing the production sitemap.
5. Writes `dist/404.html` with `noindex, follow`.

Checked-in copies under `frontend/public` use `example.com` as a safe placeholder for development. The build output replaces them using `VITE_SITE_URL`.

The route snapshots are crawlable SEO-first HTML shells rather than a full server-rendered copy of every animated component. The React application replaces the snapshot after startup. This is a practical static prerender layer for the current Vite SPA; full SSG could be considered later if content becomes more complex.

## Production routing

`frontend/vercel.json` serves generated route files first and uses the generated 404 document for unknown paths. It is scoped to the frontend deployment and therefore does not rewrite the separate Express backend or `/api` server.

If another host is used, configure it to:

- Serve each generated route directory’s `index.html`.
- Serve `404.html` for unknown URLs.
- Preserve static assets, `robots.txt`, `sitemap.xml`, icons, and images.
- Keep API routing separate from the frontend fallback.

## Business information

Update confirmed details in:

- `frontend/src/config/seo.json` for machine-readable SEO data.
- `frontend/src/data/contact.ts` for visible contact content.

Keep both sources aligned. Fields still awaiting confirmation:

- Full street address and postal code.
- Telephone and WhatsApp.
- Public email address.
- Opening hours.
- Geographic coordinates.
- Instagram and Facebook URLs.
- Google Maps place/directions URL.
- Price range, if the business wants to publish it.

Do not publish placeholders as if they were real details.

## Image SEO

Original source PNG files remain under `frontend/src/assets/images`. `frontend/scripts/prepare-assets.mjs` creates:

- Descriptively named WebP assets.
- 640-pixel responsive variants.
- A 1200 × 630 social-sharing JPEG.
- Non-branded application icons and favicon.

Images include explicit dimensions, descriptive alt text, responsive `srcset`/`sizes`, async decoding, eager loading for primary hero media, and lazy loading below the fold. Run `npm run prepare:assets` after replacing source images.

Rules for future images:

- Use truthful, concise filenames and alt text.
- Describe the visible tattoo or studio scene naturally.
- Use empty alt text for purely decorative media.
- Avoid keyword repetition.
- Keep originals out of component imports; import optimized output.
- Preserve width and height to prevent layout shift.

## Adding a public page

1. Create a useful page with unique visible content and one `h1`.
2. Add its route to `App.tsx` using route-level lazy loading.
3. Add navigation only when appropriate.
4. Add unique metadata and a path to `seo.json`.
5. Add the reusable `SEO` component and appropriate valid schemas.
6. Update `generate-seo.mjs` only if the page needs additional schema.
7. Build and inspect the new route HTML, sitemap, canonical, and internal links.

## Future service landing pages

The intended architecture supports:

```text
/tattoo-styles/realism
/tattoo-styles/fine-line
/tattoo-styles/black-and-grey
/tattoo-styles/japanese
/tattoo-services/cover-ups
/tattoo-services/custom-designs
```

Do not create these routes until each can provide substantial original value: representative portfolio work, a clear service explanation, process considerations, relevant FAQs, natural Phuket/Patong context, and a specific enquiry path. Do not publish thin, duplicated, automatically generated, or doorway-style pages.

Store future page records in a typed central data file and render them through reusable templates only when every page has genuinely distinct content.

## Search platform recommendations

After the real domain and business information are confirmed:

1. Verify the domain property in Google Search Console.
2. Submit the production `/sitemap.xml`.
3. Inspect all four canonical URLs and request indexing after launch.
4. Monitor Core Web Vitals, indexing, enhancements, manual actions, and search queries.
5. Keep the Google Business Profile name, primary category, address/service area, phone, hours, website, and map pin consistent with the website.
6. Upload genuine studio and portfolio photography to the Business Profile.
7. Use a consent-aware analytics setup such as Google Analytics 4 or a privacy-focused alternative.
8. Add Google Tag Manager only if its governance benefits outweigh the additional script cost.
9. Do not add analytics IDs or advertising scripts until ownership, consent, and privacy requirements are confirmed.

## Validation checklist

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Then verify:

- One title, description, canonical, and robots directive per generated HTML file.
- Unique metadata for each route.
- One `h1` in every generated route snapshot.
- No 404 URL in the sitemap.
- `robots.txt` points to the correct production sitemap.
- JSON-LD parses as JSON and matches visible content.
- All internal links resolve.
- No unconfirmed business facts are published.
