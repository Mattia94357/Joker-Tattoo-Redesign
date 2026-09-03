import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { BookingModal } from '../components/booking/BookingModal';
import { trackEvent } from '../lib/analytics';

type BookingContextValue = { openBooking: () => void; closeBooking: () => void; isBookingPresent: boolean };
type BookingPhase = 'closed' | 'open' | 'closing';
const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<BookingPhase>('closed');
  const phaseRef = useRef<BookingPhase>('closed');
  const openBooking = useCallback(() => {
    if (phaseRef.current === 'open') return;
    phaseRef.current = 'open';
    setPhase('open');
    trackEvent('booking_modal_open');
  }, []);
  const closeBooking = useCallback(() => {
    if (phaseRef.current !== 'open') return;
    phaseRef.current = 'closing';
    setPhase('closing');
  }, []);
  const completeExit = useCallback(() => {
    if (phaseRef.current !== 'closing') return;
    phaseRef.current = 'closed';
    setPhase('closed');
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
