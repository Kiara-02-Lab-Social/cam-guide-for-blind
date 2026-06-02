import { useState, useEffect, useRef, useCallback } from 'react';
// FaceMesh is loaded via CDN in index.html to avoid bundler/CommonJS packaging issues
const FaceMesh = typeof window !== 'undefined' ? window.FaceMesh : null;

export function useMediaPipe(onResults, videoRef, canvasRef) {
  const [cameraActive, setCameraActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  const faceMeshRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const onResultsRef = useRef(onResults);

  // Keep callback reference fresh to avoid re-triggering effects
  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  // Stop camera stream and clear animations
  const stopCamera = useCallback(() => {
    setCameraActive(false);
    setIsStarting(false);

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
      } catch (e) {
        console.warn('Error closing FaceMesh:', e);
      }
      faceMeshRef.current = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // Start camera and initialize FaceMesh
  const startCamera = useCallback(async () => {
    if (cameraActive || isStarting) return;
    setIsStarting(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError('DOM elements not ready');
      setIsStarting(false);
      return;
    }

    // Set canvas sizes to match container/video layout
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth || 640;
      canvas.height = parent.offsetHeight || 480;
    } else {
      canvas.width = 640;
      canvas.height = 480;
    }

    try {
      // 1. Initialize FaceMesh
      const fm = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      fm.onResults((results) => {
        if (onResultsRef.current) {
          onResultsRef.current(results);
        }
      });

      faceMeshRef.current = fm;

      // 2. Start Video Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      video.srcObject = stream;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve);
        };
      });

      // 3. Process Video Frames
      const processFrame = async () => {
        if (!streamRef.current) return;
        try {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            await fm.send({ image: video });
          }
        } catch (e) {
          console.error('FaceMesh frame processing error:', e);
        }
        if (streamRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(processFrame);
        }
      };

      processFrame();
      setCameraActive(true);
      setIsStarting(false);
    } catch (e) {
      console.error('Failed to start camera or FaceMesh:', e);
      setError(e.message || 'Camera permission denied or camera initialization failed');
      stopCamera();
    }
  }, [cameraActive, isStarting, stopCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    cameraActive,
    isStarting,
    error,
    startCamera,
    stopCamera
  };
}
