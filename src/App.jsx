import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Skipper from './components/Skipper';
import CamGuideView from './views/CamGuideView';
import SmileCoachView from './views/SmileCoachView';
import PlatformChecker from './components/PlatformChecker';
import './App.css';

function MainAppLayout() {
  const { 
    activeTab, 
    language, 
    setLanguage, 
    muted, 
    toggleMute, 
    ttsRate, 
    setTtsRate, 
    ttsPitch, 
    setTtsPitch, 
    ttsVolume, 
    setTtsVolume, 
    t 
  } = useApp();
  const [streakNum, setStreakNum] = useState(0);
  const [liveMessage, setLiveMessage] = useState('');
  const [streakSub, setStreakSub] = useState('');

  const handleStreakChange = (num, sub) => {
    setStreakNum(num);
    setStreakSub(sub);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'cam-guide':
        return <CamGuideView onStreakChange={handleStreakChange} />;
      case 'smile-coach':
        return <SmileCoachView />;
      case 'history':
        return (
          <main id="main-content" className="main mock-view">
            <h2 className="page-title">{t('navHistory')}</h2>
            <p className="page-sub">Your video call camera framing metrics and statistics are recorded offline.</p>
            <div className="mock-card">
              <div className="mock-chart-placeholder">
                <div className="mock-bar" style={{ height: '60%' }}><span className="mock-val">82%</span><span className="mock-label">Mon</span></div>
                <div className="mock-bar" style={{ height: '75%' }}><span className="mock-val">88%</span><span className="mock-label">Tue</span></div>
                <div className="mock-bar" style={{ height: '90%' }}><span className="mock-val">95%</span><span className="mock-label">Wed</span></div>
                <div className="mock-bar" style={{ height: '40%' }}><span className="mock-val">70%</span><span className="mock-label">Thu</span></div>
                <div className="mock-bar" style={{ height: '85%' }}><span className="mock-val">92%</span><span className="mock-label">Fri</span></div>
              </div>
              <p className="mock-desc">Practice daily to build muscle memory and maintain a high framing score!</p>
            </div>
          </main>
        );
      case 'settings':
        return (
          <main id="main-content" className="main settings-view">
            <h2 className="page-title">{t('navSettings')}</h2>
            <p className="page-sub">Configure user settings, localization preferences, and voice guidance alerts.</p>
            
            <div className="settings-container">
              <fieldset className="settings-group">
                <legend className="settings-legend">{t('legendLanguage')}</legend>
                <div className="setting-row">
                  <div>
                    <div className="setting-label-text">Language Selection / 言語切り替え</div>
                    <div className="setting-desc-text">Select system voice alerts and visual interface translation language.</div>
                  </div>
                  <div className="lang-toggle-inline" role="group" aria-label="Language Selection">
                    <button 
                      className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </button>
                    <button 
                      className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
                      onClick={() => setLanguage('ja')}
                    >
                      日本語
                    </button>
                  </div>
                </div>
              </fieldset>

              <fieldset className="settings-group">
                <legend className="settings-legend">{t('legendAudio')}</legend>
                <div className="setting-row">
                  <div>
                    <div className="setting-label-text">Audio Feedback Alerts</div>
                    <div className="setting-desc-text">Spoken status instructions for blind and low-vision users.</div>
                  </div>
                  <button 
                    className={`mute-btn ${muted ? 'muted' : ''}`}
                    onClick={toggleMute}
                    aria-pressed={muted}
                  >
                    {muted ? t('audioOff') : t('audioOn')}
                  </button>
                </div>
              </fieldset>

              <fieldset className="settings-group">
                <legend className="settings-legend">{t('legendVoice')}</legend>
                <div className="setting-row">
                  <div>
                    <div className="setting-label-text">{t('ttsSpeed')}</div>
                    <div className="setting-desc-text">{t('ttsSpeedDesc')}</div>
                  </div>
                  <div className="setting-slider-group">
                    <button className="slider-btn" aria-label="Decrease speed" onClick={() => { const newVal = Math.max(0.5, Math.round((ttsRate - 0.1) * 10) / 10); setTtsRate(newVal); setLiveMessage(`Speed ${newVal.toFixed(1)}x`); }}>−</button>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={ttsRate} 
                      onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                      aria-label={t('ttsSpeed')}
                      className="settings-slider"
                    />
                    <button className="slider-btn" aria-label="Increase speed" onClick={() => { const newVal = Math.min(2.0, Math.round((ttsRate + 0.1) * 10) / 10); setTtsRate(newVal); setLiveMessage(`Speed ${newVal.toFixed(1)}x`); }}>+</button>
                    <span className="slider-value-badge">{ttsRate.toFixed(1)}x</span>
                  </div>
                </div>

                <div className="setting-row">
                  <div>
                    <div className="setting-label-text">{t('ttsPitch')}</div>
                    <div className="setting-desc-text">{t('ttsPitchDesc')}</div>
                  </div>
                  <div className="setting-slider-group">
                    <button className="slider-btn" aria-label="Decrease pitch" onClick={() => { const newVal = Math.max(0.5, Math.round((ttsPitch - 0.1) * 10) / 10); setTtsPitch(newVal); setLiveMessage(`Pitch ${newVal.toFixed(1)}x`); }}>−</button>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={ttsPitch} 
                      onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                      aria-label={t('ttsPitch')}
                      className="settings-slider"
                    />
                    <button className="slider-btn" aria-label="Increase pitch" onClick={() => { const newVal = Math.min(2.0, Math.round((ttsPitch + 0.1) * 10) / 10); setTtsPitch(newVal); setLiveMessage(`Pitch ${newVal.toFixed(1)}x`); }}>+</button>
                    <span className="slider-value-badge">{ttsPitch.toFixed(1)}</span>
                  </div>
                </div>

                <div className="setting-row">
                  <div>
                    <div className="setting-label-text">{t('ttsVolume')}</div>
                    <div className="setting-desc-text">{t('ttsVolumeDesc')}</div>
                  </div>
                  <div className="setting-slider-group">
                    <button className="slider-btn" aria-label="Decrease volume" onClick={() => { const newVal = Math.max(0.0, Math.round((ttsVolume - 0.1) * 10) / 10); setTtsVolume(newVal); setLiveMessage(`Volume ${newVal.toFixed(1)}`); }}>−</button>
                    <input 
                      type="range" 
                      min="0.0" 
                      max="1.0" 
                      step="0.1" 
                      value={ttsVolume} 
                      onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                      aria-label={t('ttsVolume')}
                      className="settings-slider"
                    />
                    <button className="slider-btn" aria-label="Increase volume" onClick={() => { const newVal = Math.min(1.0, Math.round((ttsVolume + 0.1) * 10) / 10); setTtsVolume(newVal); setLiveMessage(`Volume ${newVal.toFixed(1)}`); }}>+</button>
                    <span className="slider-value-badge">{Math.round(ttsVolume * 100)}%</span>
                  </div>
                </div>
              </fieldset>
            </div>
          </main>
        );
      default:
        return <CamGuideView onStreakChange={handleStreakChange} />;
    }
  };

  return (
    <div className="app">
      <Skipper />
      <div id="liveRegion" role="status" aria-live="assertive" aria-atomic="false" className="sr-only">{liveMessage}</div>

      {/* TOP FLOATING LOCALIZATION AND VOLUME CONTROLLER */}
      <header className="top-actions-bar">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
            onClick={() => setLanguage('en')} 
            aria-label="English"
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'ja' ? 'active' : ''}`} 
            onClick={() => setLanguage('ja')} 
            aria-label="日本語"
          >
            JP
          </button>
        </div>

        <button 
          className={`volume-toggle-btn ${muted ? 'muted' : ''}`} 
          onClick={toggleMute}
          aria-label={muted ? "Unmute audio feedback" : "Mute audio feedback"}
          title={muted ? t('audioOff') : t('audioOn')}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </header>

      <Sidebar streakNum={streakNum} streakSub={streakSub} />
      
      {renderActiveView()}
    </div>
  );
}

export default function App() {
  return (
    <PlatformChecker>
      <AppProvider>
        <MainAppLayout />
      </AppProvider>
    </PlatformChecker>
  );
}
