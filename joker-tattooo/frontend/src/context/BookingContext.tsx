import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { BookingModal } from '../components/booking/BookingModal';

type BookingContextValue = { openBooking: () => void; closeBooking: () => void; isBookingPresent: boolean };
type BookingPhase = 'closed' | 'open' | 'closing';
const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<BookingPhase>('closed');
  const openBooking = useCallback(() => setPhase('open'), []);
  const closeBooking = useCallback(() => {
    setPhase(current => current === 'open' ? 'closing' : current);
  }, []);
  const completeExit = useCallback(() => {
    setPhase(current => current === 'closing' ? 'closed' : current);
  }, []);
  const open = phase === 'open';

  return <BookingContext.Provider value={{ openBooking, closeBooking, isBookingPresent: phase !== 'closed' }}>
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
