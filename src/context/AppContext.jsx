import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { translations } from '../translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Determine browser default language
  const getBrowserLanguage = () => {
    const browserLang = (navigator.language || 'en').toLowerCase();
    return browserLang.startsWith('ja') ? 'ja' : 'en';
  };

  const [language, setLanguageState] = useState(getBrowserLanguage());
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('cam-guide'); // 'cam-guide' | 'smile-coach' | 'settings' | 'history'
  
  // TTS State
  const [speakingText, setSpeakingText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lastSpokenRef = useRef({});
  const silenceTimeoutRef = useRef(null);

  // Set html document lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  // Speaks text with debouncing
  const speak = (text, force = false, debounceMs = 2500) => {
    if (muted) return;
    if (!text) return;

    const now = Date.now();
    const lastSpoken = lastSpokenRef.current[text] || 0;

    // Debounce check
    if (!force && (now - lastSpoken < debounceMs)) {
      return;
    }

    lastSpokenRef.current[text] = now;
    setSpeakingText(text);
    setIsSpeaking(true);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);

      // Fallback timeout to clear speaking state if events fail
      silenceTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
      }, 4000);
    } else {
      // Mock speaking for unsupported browsers
      silenceTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingText('');
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  // Speak notification on mute toggle
  const toggleMute = () => {
    setMuted(prev => {
      const nextMuted = !prev;
      if (!nextMuted) {
        // We speak using next state, but since state hasn't updated yet, we speak manually
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const msg = translations[language]?.ttsAudioOn || 'Audio feedback on';
          const utterance = new SpeechSynthesisUtterance(msg);
          utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
          window.speechSynthesis.speak(utterance);
        }
      } else {
        window.speechSynthesis.cancel();
      }
      return nextMuted;
    });
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        muted,
        setMuted,
        toggleMute,
        activeTab,
        setActiveTab,
        speak,
        stopSpeaking,
        speakingText,
        isSpeaking,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
