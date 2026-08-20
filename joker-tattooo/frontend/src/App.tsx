import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollToTop } from './components/layout/ScrollToTop';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(module => ({ default: module.GalleryPage })));
const WhyJokerPage = lazy(() => import('./pages/ServicesPage').then(module => ({ default: module.WhyJokerPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

export default function App() {
  const location = useLocation();
  return <><ScrollToTop /><Header /><Suspense fallback={<main className="page-loading" aria-label="Loading" />}><AnimatePresence mode="wait"><PageTransition key={location.pathname}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/gallery" element={<GalleryPage />} /><Route path="/why-joker" element={<WhyJokerPage />} /><Route path="/what-we-do" element={<Navigate to="/why-joker" replace />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></PageTransition></AnimatePresence></Suspense><Footer /></>;
}
