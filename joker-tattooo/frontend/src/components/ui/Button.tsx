import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = { children: ReactNode; to?: string; variant?: 'primary' | 'outline' | 'red'; type?: 'button' | 'submit'; onClick?: () => void };
export function Button({ children, to, variant = 'primary', type = 'button', onClick }: Props) {
  const className = `button button--${variant}`;
  return to ? <Link className={className} to={to}>{children}<span aria-hidden="true">↗</span></Link> :
    <button className={className} type={type} onClick={onClick}>{children}<span aria-hidden="true">↗</span></button>;
}
