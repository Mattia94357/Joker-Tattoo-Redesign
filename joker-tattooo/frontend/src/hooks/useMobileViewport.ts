import { useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 768px)';

function subscribe(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

export function useMobileViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
