import React from 'react';
import './Skipper.css';

/**
 * Accessible "Skip to main content" link.
 * Visually hidden but appears on focus.
 */
export default function Skipper() {
  return (
    <button type="button" className="skipper" onClick={() => {
      const h2 = document.querySelector('h2');
      if (h2) {
        h2.setAttribute('tabIndex', '-1');
        h2.focus();
        h2.scrollIntoView({ behavior: 'smooth' });
      }
    }}>
      Skip to main content
    </button>
  );
}
