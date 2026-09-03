import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

const publicRoutes = new Set(['/', '/gallery', '/why-joker', '/contact']);

export function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/what-we-do') return;
    trackPageView(publicRoutes.has(pathname) ? pathname : '/404');
  }, [pathname]);

  return null;
}
