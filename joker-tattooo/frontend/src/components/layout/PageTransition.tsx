import { m, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { useMobileViewport } from '../../hooks/useMobileViewport';
export const PageTransition = forwardRef<HTMLDivElement, { children: ReactNode }>(function PageTransition({ children }, ref) {
  const reduced = useReducedMotion();
  const mobile = useMobileViewport();

  if (mobile) return <div ref={ref} className="page-transition">{children}</div>;

  const animatePage = !reduced;
  return <m.div ref={ref} className="page-transition" initial={animatePage ? { y: 12 } : false} animate={{ y: 0 }} exit={animatePage ? { y: -6 } : undefined} transition={{ duration: .4 }}>{children}</m.div>;
});
