import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { WhyJokerPage } from './pages/ServicesPage';

export default function App() {
  const location = useLocation();
  return <><ScrollToTop /><Header /><AnimatePresence mode="popLayout"><PageTransition key={location.pathname}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/gallery" element={<GalleryPage />} /><Route path="/why-joker" element={<WhyJokerPage />} /><Route path="/what-we-do" element={<Navigate to="/why-joker" replace />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></PageTransition></AnimatePresence><Footer /></>;
}
