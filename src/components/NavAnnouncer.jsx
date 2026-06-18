import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const ANNOUNCE_KEYS = {
  'cam-guide': 'navAnnounceCamGuide',
  'smile-coach': 'navAnnounceSmileCoach',
  'history': 'navAnnounceHistory',
  'settings': 'navAnnounceSettings',
};

export default function NavAnnouncer() {
  const { activeTab, t } = useApp();
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;

    const key = ANNOUNCE_KEYS[activeTab];
    if (!key) return;

    const el = document.getElementById('navAnnouncer');
    if (el) {
      el.textContent = '';
      requestAnimationFrame(() => {
        el.textContent = t(key);
      });
    }
  }, [activeTab, t]);

  return (
    <div
      id="navAnnouncer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
