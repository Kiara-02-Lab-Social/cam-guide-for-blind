import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useMediaPipe } from '../hooks/useMediaPipe';
import { analyzeFace } from '../utils/faceAnalysis';
import { checkLighting } from '../utils/lighting';
import { drawPositionOverlay } from '../utils/drawing';
import FeedbackCard from '../components/FeedbackCard';

export default function CamGuideView({ onStreakChange }) {
  const { t, speak, activeTab } = useApp();

  // Local state
  const [faceChecks, setFaceChecks] = useState(null);
  const [lightState, setLightState] = useState('ok');
  const [noFace, setNoFace] = useState(true);
  const [sessionGood, setSessionGood] = useState(0);

  // DOM refs — declared here so handleResults can use them before useMediaPipe call
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Refs for tracking performance/flicker
  const noFaceFramesRef = useRef(0);
  const lastLightCheckRef = useRef(0);
  const goodTimerRef = useRef(null);

  // Propagate streak upward to display in Sidebar
  useEffect(() => {
    const streakSubText = sessionGood === 0
      ? t('streakStart')
      : `${sessionGood} ${sessionGood === 1 ? t('streakMinute') : t('streakMinutes')}`;
    onStreakChange(sessionGood, streakSubText);
  }, [sessionGood, onStreakChange, t]);

  // Landmarks analysis callback
  const handleResults = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      noFaceFramesRef.current = 0;
      const landmarks = results.multiFaceLandmarks[0];

      // 1. Analyze positions
      const checks = analyzeFace(landmarks);

      // 2. Draw overlay
      drawPositionOverlay(canvas, checks);

      // 3. Periodic light check (every 2s)
      const now = Date.now();
      if (now - lastLightCheckRef.current > 2000) {
        const light = checkLighting(video);
        setLightState(light);
        lastLightCheckRef.current = now;
      }

      setFaceChecks(checks);
      setNoFace(false);
    } else {
      // Debounce frame loss
      noFaceFramesRef.current++;
      if (noFaceFramesRef.current >= 10) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setNoFace(true);
        setFaceChecks(null);
      }
    }
  }, []);

  // Initialize MediaPipe hook — pass refs as parameters
  const {
    cameraActive,
    isStarting,
    error: cameraError,
    startCamera,
    stopCamera
  } = useMediaPipe(handleResults, videoRef, canvasRef);

  // Stop camera when switching tabs
  useEffect(() => {
    if (activeTab !== 'cam-guide') {
      stopCamera();
    }
  }, [activeTab, stopCamera]);

  // Determine current alignment status & speak guidance
  const allGood =
    !noFace &&
    faceChecks &&
    faceChecks.center === 'ok' &&
    faceChecks.vertPos === 'ok' &&
    faceChecks.angle === 'ok' &&
    faceChecks.distance === 'ok' &&
    lightState === 'ok';

  useEffect(() => {
    if (!cameraActive) {
      if (goodTimerRef.current) {
        clearInterval(goodTimerRef.current);
        goodTimerRef.current = null;
      }
      return;
    }

    if (noFace) {
      speak(t('ttsNoFace'));
      if (goodTimerRef.current) {
        clearInterval(goodTimerRef.current);
        goodTimerRef.current = null;
      }
      return;
    }

    // Check lighting issues first
    if (lightState !== 'ok') {
      const msgKey = lightState === 'dark' ? 'tooDark' : 'tooBright';
      speak(t(msgKey));
      if (goodTimerRef.current) {
        clearInterval(goodTimerRef.current);
        goodTimerRef.current = null;
      }
      return;
    }

    // Check positioning order: distance -> centering -> vertical -> tilt
    if (faceChecks) {
      if (faceChecks.distance === 'warn') {
        speak(t(faceChecks.distDirKey));
        if (goodTimerRef.current) { clearInterval(goodTimerRef.current); goodTimerRef.current = null; }
      } else if (faceChecks.center === 'warn') {
        speak(t(faceChecks.centerDirKey));
        if (goodTimerRef.current) { clearInterval(goodTimerRef.current); goodTimerRef.current = null; }
      } else if (faceChecks.vertPos === 'warn') {
        speak(t(faceChecks.vertDirKey));
        if (goodTimerRef.current) { clearInterval(goodTimerRef.current); goodTimerRef.current = null; }
      } else if (faceChecks.angle === 'warn') {
        speak(t(faceChecks.angleDirKey));
        if (goodTimerRef.current) { clearInterval(goodTimerRef.current); goodTimerRef.current = null; }
      } else if (allGood) {
        speak(t('ttsAllGood'), false, 4000);

        // Start counting good seconds
        if (!goodTimerRef.current) {
          goodTimerRef.current = setInterval(() => {
            setSessionGood((sg) => {
              // Increment every 30 seconds
              return sg; // actual increment handled by goodSeconds below
            });
          }, 1000);

          // Use a separate counter ref for good-second tracking
          let localGoodSecs = 0;
          if (goodTimerRef.current) clearInterval(goodTimerRef.current);
          goodTimerRef.current = setInterval(() => {
            localGoodSecs++;
            if (localGoodSecs % 30 === 0) {
              setSessionGood((sg) => sg + 1);
            }
          }, 1000);
        }
      }
    }
  }, [cameraActive, noFace, lightState, faceChecks, allGood, speak, t]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (goodTimerRef.current) {
        clearInterval(goodTimerRef.current);
      }
    };
  }, []);

  // UI display values based on status
  let statusClass = 'searching';
  let statusKey = 'statusWaiting';
  let cardClass = 'idle';
  let cardIcon = '?';
  let cardTitleKey = 'fbWaiting';
  let cardDescKey = 'fbWaitingDesc';

  if (isStarting) {
    statusKey = 'statusStarting';
  } else if (cameraActive) {
    if (noFace) {
      statusClass = 'error';
      statusKey = 'statusNoFace';
      cardClass = 'error';
      cardIcon = '!';
      cardTitleKey = 'fbNoFaceTitle';
      cardDescKey = 'fbNoFaceDesc';
    } else if (lightState !== 'ok') {
      statusClass = 'warn';
      statusKey = 'statusLighting';
      cardClass = 'warn';
      cardIcon = '☀';
      cardTitleKey = lightState === 'dark' ? 'tooDark' : 'tooBright';
      cardDescKey = 'descLighting';
    } else if (faceChecks) {
      if (faceChecks.distance === 'warn') {
        statusClass = 'warn'; statusKey = 'statusDistance';
        cardClass = 'warn'; cardIcon = '⟷';
        cardTitleKey = faceChecks.distDirKey; cardDescKey = 'descDistance';
      } else if (faceChecks.center === 'warn') {
        statusClass = 'warn'; statusKey = 'statusOffCenter';
        cardClass = 'warn'; cardIcon = '←→';
        cardTitleKey = faceChecks.centerDirKey; cardDescKey = 'descCenter';
      } else if (faceChecks.vertPos === 'warn') {
        statusClass = 'warn'; statusKey = 'statusHeadPos';
        cardClass = 'warn'; cardIcon = '↕';
        cardTitleKey = faceChecks.vertDirKey; cardDescKey = 'descVert';
      } else if (faceChecks.angle === 'warn') {
        statusClass = 'warn'; statusKey = 'statusHeadTilt';
        cardClass = 'warn'; cardIcon = '↗';
        cardTitleKey = faceChecks.angleDirKey; cardDescKey = 'descAngle';
      } else if (allGood) {
        statusClass = 'good'; statusKey = 'statusAllGood';
        cardClass = 'good'; cardIcon = '✓';
        cardTitleKey = 'fbGoodTitle'; cardDescKey = 'fbGoodDesc';
      }
    }
  } else if (cameraError) {
    statusClass = 'error'; statusKey = 'statusCamErr';
    cardClass = 'error'; cardIcon = '!';
    cardTitleKey = 'fbCamDeniedTitle'; cardDescKey = 'fbCamDeniedDesc';
  }

  // Position indicator check dots helper
  const getDotStatus = (checkName) => {
    if (!cameraActive || noFace) return 'idle';
    if (checkName === 'Light') return lightState === 'ok' ? 'ok' : 'warn';
    if (!faceChecks) return 'idle';
    if (checkName === 'Face') return 'ok';
    if (checkName === 'Center') return faceChecks.center === 'ok' ? 'ok' : 'warn';
    if (checkName === 'Angle') return faceChecks.angle === 'ok' ? 'ok' : 'warn';
    return 'idle';
  };

  const handleStartClick = () => {
    startCamera().then(() => {
      speak(t('ttsCamStarted'));
    });
  };

  return (
    <div className="main">
      <div>
        <div className="section-label" aria-hidden="true">
          {t('sectionLive')}
        </div>
        <h2 className="page-title">{t('pageHeading')}</h2>
        <p className="page-sub">{t('pageSub')}</p>
      </div>

      <div className="cam-area">
        <video ref={videoRef} id="videoEl" autoPlay muted playsInline aria-label="Webcam feed"></video>
        <canvas ref={canvasRef} id="overlayCanvas" aria-hidden="true"></canvas>
        <div className="grid-overlay" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div className="grid-cell" key={i}></div>
          ))}
        </div>

        <div className={`status-pill ${statusClass}`} aria-live="polite">
          {t(statusKey)}
        </div>
        <div className="cam-label" aria-hidden="true">
          {t('camLabel')}
        </div>

        {!cameraActive && !isStarting && (
          <div className="start-btn" onClick={handleStartClick}>
            <button className="start-btn-inner" tabIndex={0}>
              {t('startBtn')}
            </button>
            <div className="start-btn-sub">{t('startBtnSub')}</div>
          </div>
        )}
      </div>

      <FeedbackCard
        type={cardClass}
        icon={cardIcon}
        title={t(cardTitleKey)}
        desc={t(cardDescKey)}
      />

      <div className="checks" role="list" aria-label="Position checks">
        {['Face', 'Center', 'Angle', 'Light'].map((name) => (
          <div className={`check-item ${getDotStatus(name)}`} role="listitem" key={name}>
            <div className={`check-dot ${getDotStatus(name)}`} aria-hidden="true"></div>
            <span>{t(`check${name}`)}</span>
          </div>
        ))}
      </div>

      {cameraActive && (
        <button className="mute-btn danger" onClick={stopCamera}>
          {t('stop')}
        </button>
      )}
    </div>
  );
}
