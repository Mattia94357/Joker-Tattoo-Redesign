import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.scrollBehavior = previousBehavior;
  }, [pathname]);
  return null;
}
