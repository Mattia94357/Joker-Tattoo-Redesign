const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

type AnalyticsEvent =
  | 'booking_modal_open'
  | 'booking_request_success'
  | 'whatsapp_click'
  | 'directions_click'
  | 'gallery_image_open';

type GtagArguments = ['js', Date] | ['config', string, Record<string, unknown>] | ['event', string, Record<string, unknown>];

type Gtag = (...args: GtagArguments) => void;

declare global {
  interface Window {
    dataLayer?: GtagArguments[];
    gtag?: Gtag;
  }
}

let initialized = false;
let lastPagePath: string | null = null;

function isConfigured() {
  return Boolean(measurementId && /^G-[A-Z0-9]+$/i.test(measurementId));
}

export function initializeAnalytics() {
  if (initialized || !isConfigured() || typeof window === 'undefined') return isConfigured();

  initialized = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: GtagArguments) => {
    window.dataLayer?.push(args);
  });

  window.gtag('js', new Date());
  window.gtag('config', measurementId!, {
    send_page_view: false,
    ...(import.meta.env.DEV ? { debug_mode: true } : {}),
  });

  const loaderUrl = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId!)}`;
  const loaderExists = Array.from(document.scripts).some(script => script.src === loaderUrl);
  if (!loaderExists) {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.jokerGa4 = 'true';
    script.src = loaderUrl;
    document.head.appendChild(script);
  }

  return true;
}

export function trackPageView(path: string) {
  if (!initializeAnalytics() || path === lastPagePath) return;
  lastPagePath = path;
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_referrer: sanitizeReferrer(document.referrer),
  });
}

export function trackEvent(eventName: AnalyticsEvent) {
  if (!initializeAnalytics()) return;
  window.gtag?.('event', eventName, {});
}

function sanitizeReferrer(referrer: string) {
  if (!referrer) return '';
  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}
