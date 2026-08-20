import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion } from 'framer-motion';

import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import './styles/global.css';

const loadMotionFeatures = () => import('./motionFeatures').then(module => module.default);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <LazyMotion features={loadMotionFeatures}><BookingProvider><App /></BookingProvider></LazyMotion>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  </StrictMode>,
);
