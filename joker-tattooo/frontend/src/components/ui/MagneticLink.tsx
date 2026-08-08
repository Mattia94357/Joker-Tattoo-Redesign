import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
export function MagneticLink({ to, children }: { to: string; children: ReactNode }) {
  return <motion.span className="magnetic" whileHover={{ x: 5 }}><Link to={to}>{children} <span aria-hidden="true">↗</span></Link></motion.span>;
}
