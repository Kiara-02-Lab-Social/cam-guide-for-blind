import React, { useEffect, useState } from 'react';
import './PlatformChecker.css';

const STORAGE_KEY = 'cam_guide_platform_apple';

/**
 * Detects whether the current device is running Apple hardware.
 * Checks user-agent strings for iOS/macOS/iPadOS signals.
 */
function detectAppleDevice() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';

  const isAppleUA =
    /iPhone|iPad|iPod/i.test(ua) ||
    /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua) ||
    /Mac OS X/i.test(ua);

  const isApplePlatform =
    /iPhone|iPad|iPod|Mac/i.test(platform);

  // Modern iPads report as "MacIntel" — also check maxTouchPoints
  const isTouchMac =
    /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

  return isAppleUA || isApplePlatform || isTouchMac;
}

export default function PlatformChecker({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'apple' | 'unsupported'
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) {
      // Already verified — trust the stored value
      setStatus(stored === 'true' ? 'apple' : 'unsupported');
      return;
    }

    // First visit — run detection and persist result
    const isApple = detectAppleDevice();
    localStorage.setItem(STORAGE_KEY, String(isApple));
    setStatus(isApple ? 'apple' : 'unsupported');
  }, []);

  // While checking, render nothing (avoids flash)
  if (status === 'checking') return null;

  // Apple device — render the app normally
  if (status === 'apple') return <>{children}</>;

  // Non-Apple device — show the blocking screen
  return (
    <div className={`pc-overlay ${dismissing ? 'pc-overlay--exit' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pc-title" aria-describedby="pc-desc">
      {/* Animated background blobs */}
      <div className="pc-bg">
        <div className="pc-blob pc-blob--1" aria-hidden="true" />
        <div className="pc-blob pc-blob--2" aria-hidden="true" />
        <div className="pc-blob pc-blob--3" aria-hidden="true" />
      </div>

      <div className="pc-card">
        {/* Icon */}
        <div className="pc-icon-wrap" aria-hidden="true">
          <div className="pc-icon-ring pc-icon-ring--outer" />
          <div className="pc-icon-ring pc-icon-ring--inner" />
          <span className="pc-icon-emoji">🍎</span>
        </div>

        {/* Badge */}
        <div className="pc-badge" aria-hidden="true">
          <span className="pc-badge-dot" />
          Platform Restricted
        </div>

        {/* Heading */}
        <h1 id="pc-title" className="pc-title">
          This Platform Is<br />Not Supported
        </h1>

        {/* Message */}
        <p id="pc-desc" className="pc-desc">
          This app is designed exclusively for <strong>Apple devices</strong>. It leverages Apple hardware and browser capabilities to deliver the best experience.
        </p>

        {/* Divider */}
        <div className="pc-divider" aria-hidden="true" />

        {/* Instructions */}
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

        {/* Footer note */}
        <p className="pc-footer-note">
          Make sure you are browsing from an Apple device running iOS, iPadOS, or macOS.
        </p>
      </div>
    </div>
  );
}