import { m, useReducedMotion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
export const PageTransition = forwardRef<HTMLDivElement, { children: ReactNode }>(function PageTransition({ children }, ref) {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const animatePage = !reduced && !mobile;
  return <m.div ref={ref} initial={animatePage ? { y: 12 } : false} animate={{ y: 0 }} exit={animatePage ? { y: -6 } : undefined} transition={{ duration: .4 }}>{children}</m.div>;
});
