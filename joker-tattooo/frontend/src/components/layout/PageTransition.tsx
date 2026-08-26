import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <m.div initial={reduced ? false : { y: 12 }} animate={{ y: 0 }} exit={reduced ? undefined : { y: -6 }} transition={{ duration: .4 }}>{children}</m.div>;
}
