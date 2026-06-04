import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useMediaPipe } from '../hooks/useMediaPipe';
import { analyzeMouth } from '../utils/faceAnalysis';
import { drawMouthOverlay } from '../utils/drawing';
import { encouragements } from '../translations';
import FeedbackCard from '../components/FeedbackCard';
import TipsSection from '../components/TipsSection';

export default function SmileCoachView() {
  const { t, speak, activeTab, language } = useApp();

  // Local state
  const [smileAnalysis, setSmileAnalysis] = useState(null);
  const [noFace, setNoFace] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [goodSeconds, setGoodSeconds] = useState(0);

  // DOM refs for video and canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Refs for tracking timer & feedback intervals
  const noFaceFramesRef = useRef(0);
  const lastFeedbackTimeRef = useRef(0);
  const sessionTimerRef = useRef(null);
  const latestAnalysisRef = useRef(null);

  // Keep a ref of latest analysis so the 1s interval can access it without closures
  useEffect(() => {
    latestAnalysisRef.current = smileAnalysis;
  }, [smileAnalysis]);

  // Results callback from camera stream
  const handleResults = useCallback((results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      noFaceFramesRef.current = 0;
      const landmarks = results.multiFaceLandmarks[0];

      // 1. Analyze landmarks
      const analysis = analyzeMouth(landmarks);

      // 2. Draw overlay (checkmark if score >= 80)
      drawMouthOverlay(canvas, landmarks, analysis.score >= 80);

      setSmileAnalysis(analysis);
      setNoFace(false);
    } else {
      noFaceFramesRef.current++;
      if (noFaceFramesRef.current >= 15) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setNoFace(true);
        setSmileAnalysis(null);
      }
    }
  }, []);

  // MediaPipe Hook integration – pass refs to hook
  const {
    cameraActive,
    isStarting,
    error: cameraError,
    startCamera,
    stopCamera
  } = useMediaPipe(handleResults, videoRef, canvasRef);

  // Stop camera when leaving this view
  useEffect(() => {
    if (activeTab !== 'smile-coach') {
      stopCamera();
    }
  }, [activeTab, stopCamera]);

  // Helper: choose a random item from array
  const random = (arr) => {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Speak and update feedback (triggered by landmarks or timers)
  const processFeedback = useCallback((analysis) => {
    if (!analysis) return;
    const { score, mouthState, mouthScore, eyeScore } = analysis;
    const now = Date.now();

    // Limit voice guides to once every 3 seconds to avoid noise overload
    if (now - lastFeedbackTimeRef.current < 3000) {
      return;
    }

    lastFeedbackTimeRef.current = now;

    // Pick appropriate guidance prompt
    if (score >= 80) {
      const quips = t('amazingSmileQuips') || [];
      const quip = random(quips);
      const encs = encouragements[language] || [];
      const withEnc = Math.random() < 0.3 ? `${random(encs)} ${quip}` : quip;
      speak(withEnc, true);
    } else if (score >= 65) {
      let instruction = '';
      if (language === 'ja') {
        if (mouthScore < eyeScore) instruction = '口広げて、口角をあげて。';
        else if (eyeScore < mouthScore) instruction = '目をもっと使って。';
        else instruction = '口角上げる。';
      } else {
        if (mouthScore < eyeScore) instruction = 'Open mouth wider.';
        else if (eyeScore < mouthScore) instruction = 'Lift the eyes.';
        else instruction = 'Raise mouth corners.';
      }
      const encs = encouragements[language] || [];
      const withEnc = Math.random() < 0.4 ? `${random(encs)} ${instruction}` : instruction;
      speak(withEnc, true);
    } else {
      if (mouthState === 'tooOpen') {
        const quips = t('mouthTooOpenQuips') || [];
        speak(random(quips), true);
      } else if (mouthState === 'narrow') {
        const quips = t('mouthTooNarrowQuips') || [];
        speak(random(quips), true);
      } else {
        const quips = t('noSmileQuips') || [];
        speak(random(quips), true);
      }
    }
  }, [speak, t, language]);

  // Voice guide effect
  useEffect(() => {
    if (!cameraActive) return;

    if (noFace) {
      const now = Date.now();
      if (now - lastFeedbackTimeRef.current >= 3000) {
        speak(t('faceNotDetectedText'), true);
        lastFeedbackTimeRef.current = now;
      }
      return;
    }

    if (smileAnalysis) {
      processFeedback(smileAnalysis);
    }
  }, [cameraActive, noFace, smileAnalysis, processFeedback, t, speak]);

  // Timer effect for tracking sessions and good scores
  useEffect(() => {
    if (cameraActive && !noFace) {
      if (!sessionTimerRef.current) {
        sessionTimerRef.current = setInterval(() => {
          setSessionTime((prev) => prev + 1);

          // If the last analysis score was good, increment good seconds
          const lastAnalysis = latestAnalysisRef.current;
          if (lastAnalysis && lastAnalysis.score >= 65) {
            setGoodSeconds((prev) => prev + 1);
          }
        }, 1000);
      }
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    }

    return () => {
      // Clean up timer
    };
  }, [cameraActive, noFace]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const handleStartClick = () => {
    setSessionTime(0);
    setGoodSeconds(0);
    startCamera().then(() => {
      speak(t('cameraStarting'));
    });
  };

  const handleStopClick = () => {
    stopCamera();
    speak(t('sessionEndedText'));
  };

  // Feedback Card configuration based on state
  let cardClass = 'idle';
  let cardIcon = '👀';
  let cardTitleKey = 'readyBegin';
  let cardDescKey = 'readyText';
  let cardTipKey = 'audioTip';

  if (isStarting) {
    cardClass = 'idle animate-pulse';
    cardIcon = '⏳';
    cardTitleKey = 'cameraStarting';
    cardDescKey = 'statusFinding';
    cardTipKey = null;
  } else if (cameraActive) {
    if (noFace) {
      cardClass = 'error';
      cardIcon = '👀';
      cardTitleKey = 'faceNotDetected';
      cardDescKey = 'faceNotDetectedText';
      cardTipKey = 'faceNotDetectedTip';
    } else if (smileAnalysis) {
      const { score, mouthState } = smileAnalysis;
      if (score >= 80) {
        cardClass = 'success';
        cardIcon = '😊';
        cardTitleKey = 'amazingSmile';
        cardDescKey = 'Hold that.';
        cardTipKey = null;
      } else if (score >= 65) {
        cardClass = 'success';
        cardIcon = '🙂';
        cardTitleKey = 'goodSmile';
        cardDescKey = 'Almost.';
        cardTipKey = null;
      } else if (mouthState === 'tooOpen') {
        cardClass = 'warning';
        cardIcon = '😮';
        cardTitleKey = 'mouthTooOpen';
        cardDescKey = 'Close it.';
        cardTipKey = null;
      } else if (mouthState === 'narrow') {
        cardClass = 'warning';
        cardIcon = '😐';
        cardTitleKey = 'mouthTooNarrow';
        cardDescKey = 'Open it.';
        cardTipKey = null;
      } else {
        cardClass = 'error';
        cardIcon = '😐';
        cardTitleKey = 'noSmile';
        cardDescKey = 'Show the smile.';
        cardTipKey = null;
      }
    }
  } else if (cameraError) {
    cardClass = 'error';
    cardIcon = '❌';
    cardTitleKey = 'cameraAccessDenied';
    cardDescKey = 'cameraAccessDeniedText';
    cardTipKey = 'cameraAccessDeniedTip';
  }

  // Helper to read raw text values from translations dictionary
  const getCardText = (key) => {
    if (key && key.startsWith('_')) {
      return key.slice(1);
    }
    return t(key);
  };

  return (
    <div className="main">
      <div>
        <div className="section-label" aria-hidden="true">
          {t('navSmile')}
        </div>
        <h2 className="page-title">{t('smileTitle')}</h2>
        <p className="page-sub">{t('smileSubtitle')}</p>
        <p className="page-sub" style={{ marginTop: '2px', fontSize: '12px' }}>
          {t('smileDescription')}
        </p>
      </div>

      <div className="main-grid-layout">
        <div className="camera-container-box">
          <div className="cam-card">
            <div className="cam-header">{t('cameraView')}</div>
            <div className="cam-area" style={{ height: '240px' }}>
              <video ref={videoRef} id="videoEl" autoPlay muted playsInline style={{ display: cameraActive ? 'block' : 'none' }} aria-hidden="true"></video>
              <canvas ref={canvasRef} id="overlayCanvas" style={{ display: cameraActive ? 'block' : 'none' }}></canvas>
              
              {!cameraActive && !isStarting && (
                <div className="start-overlay" onClick={handleStartClick}>
                  <button className="start-button">{t('startCamera')}</button>
                  <div className="start-text">{t('startHint')}</div>
                </div>
              )}
              {isStarting && (
                <div className="start-overlay">
                  <div className="start-text">{t('cameraStarting')}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="controls" style={{ marginTop: '12px' }}>
            {cameraActive && (
              <button className="danger" onClick={handleStopClick}>
                {t('stop')}
              </button>
            )}
          </div>
        </div>

        <div className="feedback-container-box">
          <FeedbackCard
            type={cardClass}
            icon={cardIcon}
            title={getCardText(cardTitleKey)}
            desc={getCardText(cardDescKey)}
            tip={cardTipKey ? t(cardTipKey) : null}
          />

          <div className="stats-row" style={{ marginTop: '16px' }}>
            <div className="stat-box">
              <div className="stat-value">
                {smileAnalysis && smileAnalysis.mouthScore !== null ? `${smileAnalysis.mouthScore}%` : '—'}
              </div>
              <div className="stat-label">{t('mouthScore')}</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">
                {smileAnalysis && smileAnalysis.eyeScore !== null ? `${smileAnalysis.eyeScore}%` : '—'}
              </div>
              <div className="stat-label">{t('eyeScore')}</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{goodSeconds}s</div>
              <div className="stat-label">{t('goodSecs')}</div>
            </div>
            <div className="stat-box" style={{ gridColumn: 'span 3' }}>
              <div className="stat-value" style={{ fontSize: '18px', padding: '4px 0' }}>
                {sessionTime}s
              </div>
              <div className="stat-label">{t('sessionTime')}</div>
            </div>
          </div>
        </div>
      </div>

      <TipsSection />
    </div>
  );
}
