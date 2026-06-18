import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const ANNOUNCE_KEYS = {
  'cam-guide': 'navAnnounceCamGuide',
  'smile-coach': 'navAnnounceSmileCoach',
  'history': 'navAnnounceHistory',
  'settings': 'navAnnounceSettings',
  'platform-check': 'navAnnouncePlatform',
};

const ANNOUNCE_DURATION = 3000;

export default function NavAnnouncer() {
  const { activeTab, t } = useApp();
  const prevTabRef = useRef(activeTab);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;

    const key = ANNOUNCE_KEYS[activeTab];
    if (!key) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const text = t(key);

    // Inject empty element first, then set text on next frame
    // so screen readers detect the text change in the live region
    setVisible(true);
    setMessage('');
    setPending(text);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMessage(text);
        setPending('');
      });
    });

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setMessage('');
    }, ANNOUNCE_DURATION);
  }, [activeTab, t]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="navAnnouncer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
