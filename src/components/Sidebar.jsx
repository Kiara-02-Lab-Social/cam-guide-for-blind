import React from 'react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ streakNum = 0, streakSub = '' }) {
  const { activeTab, setActiveTab, t } = useApp();

  return (
    <nav className="sidebar" aria-label={t('brand') + ' main navigation'}>
      <div className="logo">
        <div className="logo-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="3" stroke="white" strokeWidth="1.5" />
            <path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span>{t('brand')}</span>
      </div>

      <button
        className={`nav-item ${activeTab === 'cam-guide' ? 'active' : ''}`}
        onClick={() => setActiveTab('cam-guide')}
        aria-current={activeTab === 'cam-guide' ? 'page' : undefined}
      >
        <span className={`nav-dot ${activeTab === 'cam-guide' ? 'green' : 'muted'}`} aria-hidden="true"></span>
        <span>{t('navLive')}</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'smile-coach' ? 'active' : ''}`}
        onClick={() => setActiveTab('smile-coach')}
        aria-current={activeTab === 'smile-coach' ? 'page' : undefined}
      >
        <span className={`nav-dot ${activeTab === 'smile-coach' ? 'green' : 'muted'}`} aria-hidden="true"></span>
        <span>{t('navSmile')}</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => setActiveTab('history')}
        aria-current={activeTab === 'history' ? 'page' : undefined}
      >
        <span className="nav-dot muted" aria-hidden="true"></span>
        <span>{t('navHistory')}</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
        aria-current={activeTab === 'settings' ? 'page' : undefined}
      >
        <span className="nav-dot muted" aria-hidden="true"></span>
        <span>{t('navSettings')}</span>
      </button>

      <div className="streak-box" aria-label={t('streakLabel')}>
        <div className="streak-label">{t('streakLabel')}</div>
        <div className="streak-num">{streakNum}</div>
        <div className="streak-sub">{streakSub || t('streakStart')}</div>
      </div>
    </nav>
  );
}
