import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { BookingModal } from '../components/booking/BookingModal';

type BookingContextValue = { openBooking: () => void; closeBooking: () => void };
const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  return <BookingContext.Provider value={{ openBooking, closeBooking }}>
    {children}
    <BookingModal open={open} onClose={closeBooking} />
  </BookingContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside BookingProvider');
  return context;
}
