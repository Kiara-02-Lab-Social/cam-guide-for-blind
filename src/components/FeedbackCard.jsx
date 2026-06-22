import React from 'react';
import { useApp } from '../context/AppContext';

export default function FeedbackCard({ type = 'idle', icon = '?', title = '', desc = '' }) {
  const { isSpeaking, speakingText, muted, t } = useApp();

  return (
    <div className={`feedback-card ${type}`} role="alert" aria-live={muted ? "assertive" : "off"}>
      <div className={`feedback-icon ${type}`} aria-hidden="true">
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3 className={`feedback-title ${type}`}>{title}</h3>
        <p className={`feedback-desc ${type}`}>{desc}</p>
        
        <div className={`audio-badge ${isSpeaking ? 'visible' : ''}`} aria-label={t('audioLabel')}>
          <div className="audio-wave" aria-hidden="true">
            <div className="bar animated" style={{ height: '6px' }}></div>
            <div className="bar animated" style={{ height: '10px' }}></div>
            <div className="bar animated" style={{ height: '7px' }}></div>
            <div className="bar animated" style={{ height: '12px' }}></div>
            <div className="bar animated" style={{ height: '5px' }}></div>
          </div>
          <span className="audio-speaking-text">{speakingText || t('audioLabel')}</span>
        </div>
      </div>
    </div>
  );
}
