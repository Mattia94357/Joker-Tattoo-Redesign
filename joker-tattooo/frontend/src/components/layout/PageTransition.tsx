import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>{children}</motion.div>;
}
