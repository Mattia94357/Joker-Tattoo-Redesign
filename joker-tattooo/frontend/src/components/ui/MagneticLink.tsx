import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function MagneticLink({ to, children }: { to: string; children: ReactNode }) {
  return <span className="magnetic"><Link to={to}>{children} <span aria-hidden="true">↗</span></Link></span>;
}
