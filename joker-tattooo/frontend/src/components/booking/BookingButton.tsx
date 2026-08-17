import type { ReactNode } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../ui/Button';

export function BookingButton({ children, variant = 'primary' }: { children: ReactNode; variant?: 'primary' | 'outline' | 'red' }) {
  const { openBooking } = useBooking();
  return <Button variant={variant} onClick={openBooking}>{children}</Button>;
}
