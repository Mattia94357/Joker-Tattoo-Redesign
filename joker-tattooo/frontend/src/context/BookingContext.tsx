import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { BookingModal } from '../components/booking/BookingModal';

type BookingContextValue = { openBooking: () => void; closeBooking: () => void; isBookingPresent: boolean };
const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const openBooking = useCallback(() => {
    setPresent(true);
    setOpen(true);
  }, []);
  const closeBooking = useCallback(() => setOpen(false), []);
  const completeExit = useCallback(() => setPresent(false), []);

  return <BookingContext.Provider value={{ openBooking, closeBooking, isBookingPresent: present }}>
    {children}
    <BookingModal open={open} onClose={closeBooking} onExitComplete={completeExit} />
  </BookingContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside BookingProvider');
  return context;
}
