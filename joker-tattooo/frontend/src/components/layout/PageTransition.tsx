import { m, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const animatePage = !reduced && !mobile;
  return <m.div initial={animatePage ? { y: 12 } : false} animate={{ y: 0 }} exit={animatePage ? { y: -6 } : undefined} transition={{ duration: .4 }}>{children}</m.div>;
}
