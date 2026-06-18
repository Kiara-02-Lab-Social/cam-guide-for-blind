import { useState } from 'react';
import './PlatformChecker.css';
import { useApp } from '../context/AppContext';

const STORAGE_KEY = 'cam_guide_platform_apple';

function detectAppleDevice() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';

  const isAppleUA =
    /iPhone|iPad|iPod/i.test(ua) ||
    /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua) ||
    /Mac OS X/i.test(ua);

  const isApplePlatform =
    /iPhone|iPad|iPod|Mac/i.test(platform);

  const isTouchMac =
    /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

  return isAppleUA || isApplePlatform || isTouchMac;
}

function getInitialPlatform() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  const detected = detectAppleDevice();
  localStorage.setItem(STORAGE_KEY, String(detected));
  return detected;
}

export default function PlatformChecker() {
  const { t } = useApp();
  const [isApple] = useState(getInitialPlatform);

  return (
    <main id="main-content" className="main platform-check-view">
      <div className="pc-card">
        <div className="pc-icon-wrap" aria-hidden="true">
          <div className="pc-icon-ring pc-icon-ring--outer" />
          <div className="pc-icon-ring pc-icon-ring--inner" />
          <span className="pc-icon-emoji">🍎</span>
        </div>

        <div className={`pc-badge ${isApple ? 'pc-badge--success' : ''}`} aria-hidden="true">
          <span className="pc-badge-dot" />
          {isApple ? 'Supported Platform' : 'Platform Restricted'}
        </div>

        <h2 className="pc-title">
          {isApple ? 'Apple Device Detected' : 'This Platform Is Not Supported'}
        </h2>

        <p className="pc-desc">
          {isApple ? (
            'Great! Your device is fully compatible. You can use all features of this app.'
          ) : (
            <>
              This app is designed exclusively for <strong>Apple devices</strong>. It leverages Apple hardware and browser
              capabilities to deliver the best experience.
            </>
          )}
        </p>

        <div className="pc-divider" aria-hidden="true" />

        <div className="pc-instructions">
          <div className="pc-instruction-item">
            <div className="pc-instruction-icon" aria-hidden="true">📱</div>
            <div className="pc-instruction-text">
              <strong>Use an Apple Device</strong>
              <span>iPhone, iPad, iPod touch, or Mac</span>
            </div>
          </div>
          <div className="pc-instruction-item">
            <div className="pc-instruction-icon" aria-hidden="true">🌐</div>
            <div className="pc-instruction-text">
              <strong>Open in Any Browser</strong>
              <span>Safari, Chrome, Firefox, or Edge on Apple OS</span>
            </div>
          </div>
        </div>

        <p className="pc-footer-note">
          {isApple
            ? 'Your device meets the platform requirements.'
            : 'Make sure you are browsing from an Apple device running iOS, iPadOS, or macOS.'}
        </p>
      </div>
    </main>
  );
}
