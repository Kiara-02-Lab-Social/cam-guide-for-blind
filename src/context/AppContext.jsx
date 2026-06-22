import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { translations } from '../translations';
import { speakWithGemini, stopGeminiTTS, testGeminiConnection } from '../services/geminiTTS';

const AppContext = createContext();

function speakViaWebSpeech(text, language, rate, pitch, volume, setIsSpeakingFn, setSpeakingTextFn, silenceTimeoutRef) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeakingFn(true);
    };

    utterance.onend = () => {
      setIsSpeakingFn(false);
    };

    utterance.onerror = () => {
      setIsSpeakingFn(false);
    };

    window.speechSynthesis.speak(utterance);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      setIsSpeakingFn(false);
    }, 4000);
  } else {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      setIsSpeakingFn(false);
    }, 3000);
  }
}

export function AppProvider({ children }) {
  const getBrowserLanguage = () => {
    const browserLang = (navigator.language || 'en').toLowerCase();
    return browserLang.startsWith('ja') ? 'ja' : 'en';
  };

  const [language, setLanguageState] = useState(getBrowserLanguage());
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('cam-guide');

  const [speakingText, setSpeakingText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [ttsRate, setTtsRateState] = useState(() => {
    const saved = localStorage.getItem('ttsRate');
    const parsed = parseFloat(saved);
    return (saved !== null && !isNaN(parsed)) ? parsed : 1.0;
  });
  const [ttsPitch, setTtsPitchState] = useState(() => {
    const saved = localStorage.getItem('ttsPitch');
    const parsed = parseFloat(saved);
    return (saved !== null && !isNaN(parsed)) ? parsed : 1.0;
  });
  const [ttsVolume, setTtsVolumeState] = useState(() => {
    const saved = localStorage.getItem('ttsVolume');
    const parsed = parseFloat(saved);
    return (saved !== null && !isNaN(parsed)) ? parsed : 1.0;
  });

  const [ttsEngine, setTtsEngineState] = useState(() => {
    return localStorage.getItem('ttsEngine') || 'web-speech';
  });
  const [geminiApiKey, setGeminiApiKeyState] = useState(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });
  const [geminiTtsStatus, setGeminiTtsStatus] = useState('idle');
  const [geminiTtsError, setGeminiTtsError] = useState('');

  const setTtsRate = (val) => {
    setTtsRateState(val);
    localStorage.setItem('ttsRate', val.toString());
  };

  const setTtsPitch = (val) => {
    setTtsPitchState(val);
    localStorage.setItem('ttsPitch', val.toString());
  };

  const setTtsVolume = (val) => {
    setTtsVolumeState(val);
    localStorage.setItem('ttsVolume', val.toString());
  };

  const setTtsEngine = (val) => {
    setTtsEngineState(val);
    localStorage.setItem('ttsEngine', val);
  };

  const setGeminiApiKey = (val) => {
    setGeminiApiKeyState(val);
    localStorage.setItem('geminiApiKey', val);
  };

  const lastSpokenRef = useRef({});
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  const speak = useCallback((text, force = false, debounceMs = 2500) => {
    if (muted) return;
    if (!text) return;

    const now = Date.now();
    const lastSpoken = lastSpokenRef.current[text] || 0;

    if (!force && (now - lastSpoken < debounceMs)) {
      return;
    }

    lastSpokenRef.current[text] = now;
    setSpeakingText(text);
    setIsSpeaking(true);

    stopGeminiTTS();

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    const useGemini = ttsEngine === 'gemini' && geminiApiKey && geminiApiKey.trim().length > 0;

    if (useGemini) {
      speakWithGemini(text, geminiApiKey.trim(), language, {
        rate: ttsRate,
        pitch: ttsPitch,
        volume: ttsVolume
      })
        .then(() => {
          setIsSpeaking(false);
        })
        .catch((err) => {
          setIsSpeaking(false);
          setGeminiTtsStatus('error');
          setGeminiTtsError(err.message);
        });
    } else {
      speakViaWebSpeech(
        text,
        language,
        ttsRate,
        ttsPitch,
        ttsVolume,
        setIsSpeaking,
        setSpeakingText,
        silenceTimeoutRef
      );
    }
  }, [muted, ttsEngine, geminiApiKey, language, ttsRate, ttsPitch, ttsVolume]);

  const stopSpeaking = useCallback(() => {
    stopGeminiTTS();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingText('');
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const nextMuted = !prev;
      if (!nextMuted) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const msg = translations[language]?.ttsAudioOn || 'Audio feedback on';
          const utterance = new SpeechSynthesisUtterance(msg);
          utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
          utterance.rate = ttsRate;
          utterance.pitch = ttsPitch;
          utterance.volume = ttsVolume;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        window.speechSynthesis.cancel();
      }
      return nextMuted;
    });
  }, [language, ttsRate, ttsPitch, ttsVolume]);

  const testGeminiKey = useCallback(async () => {
    if (!geminiApiKey || !geminiApiKey.trim()) {
      setGeminiTtsStatus('error');
      setGeminiTtsError('No API key provided.');
      return;
    }
    setGeminiTtsStatus('testing');
    setGeminiTtsError('');
    try {
      await testGeminiConnection(geminiApiKey.trim());
      setGeminiTtsStatus('tested-ok');
      setGeminiTtsError('');
    } catch (err) {
      setGeminiTtsStatus('error');
      setGeminiTtsError(err.message);
    }
  }, [geminiApiKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      stopGeminiTTS();
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
        ttsRate,
        setTtsRate,
        ttsPitch,
        setTtsPitch,
        ttsVolume,
        setTtsVolume,
        t,
        ttsEngine,
        setTtsEngine,
        geminiApiKey,
        setGeminiApiKey,
        geminiTtsStatus,
        geminiTtsError,
        testGeminiKey
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
