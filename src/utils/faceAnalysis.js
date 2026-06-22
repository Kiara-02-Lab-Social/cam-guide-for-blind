/**
 * Pure functions to analyze MediaPipe FaceMesh landmarks.
 * These are extracted from the original HTML implementations.
 */

/**
 * Analyzes face positioning metrics (centering, vertical position, head tilt, and distance).
 * @param {Array} landmarks - MediaPipe FaceMesh 468-point landmarks array.
 * @returns {Object} Position check results.
 */
export function analyzeFace(landmarks) {
  if (!landmarks || landmarks.length === 0) return null;

  // Key landmark indices for FaceMesh 468-point model
  // Nose tip: 1, Left eye outer: 33, Right eye outer: 263
  // Chin: 152, Forehead: 10
  const chin = landmarks[152];
  const forehead = landmarks[10];

  // Face bounding box (approximate)
  const xs = landmarks.map(l => l.x);
  const ys = landmarks.map(l => l.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const faceW = maxX - minX;

  // Face center
  const faceCX = (minX + maxX) / 2;
  const faceCY = (minY + maxY) / 2;

  const checks = {};

  // 1. Centered left-right (nose X should be near 0.5, mirrored)
  const centerX = 1 - faceCX; // mirror compensation
  const offsetX = centerX - 0.5;
  if (Math.abs(offsetX) < 0.12) {
    checks.center = 'ok';
  } else if (offsetX < 0) {
    checks.center = 'warn';
    checks.centerDirKey = 'moveRight';
  } else {
    checks.center = 'warn';
    checks.centerDirKey = 'moveLeft';
  }

  // 2. Head vertical position (face center Y)
  const offsetY = faceCY - 0.42; // ideal: face center at 42% from top
  if (Math.abs(offsetY) < 0.12) {
    checks.vertPos = 'ok';
  } else if (offsetY > 0) {
    checks.vertPos = 'warn';
    checks.vertDirKey = 'raiseScreen';
  } else {
    checks.vertPos = 'warn';
    checks.vertDirKey = 'lowerScreen';
  }

  // 3. Head tilt / angle — measure chin to forehead angle
  const tiltDx = chin.x - forehead.x;
  const tiltDy = chin.y - forehead.y;
  const tiltAngle = Math.abs(Math.atan2(tiltDx, tiltDy) * 180 / Math.PI);
  if (tiltAngle < 8) {
    checks.angle = 'ok';
  } else {
    checks.angle = 'warn';
    checks.angleDirKey = 'straightenHead';
  }

  // 4. Distance (face size as proxy)
  if (faceW > 0.15 && faceW < 0.65) {
    checks.distance = 'ok';
  } else if (faceW >= 0.65) {
    checks.distance = 'warn';
    checks.distDirKey = 'moveBack';
  } else {
    checks.distance = 'warn';
    checks.distDirKey = 'moveCloser';
  }

  // Return face bbox for drawing
  checks.bbox = { minX, minY, maxX, maxY };
  checks.faceCX = 1 - faceCX; // mirrored
  checks.faceCY = faceCY;

  return checks;
}

/**
 * Analyzes smile metrics (mouth shape, eye crinkle, symmetry).
 * @param {Array} landmarks - MediaPipe FaceMesh landmarks.
 * @returns {Object} Smile coach score and states.
 */
export function analyzeMouth(landmarks) {
  if (!landmarks || landmarks.length === 0) return null;

  const top = landmarks[13];
  const bottom = landmarks[14];
  const left = landmarks[78];
  const right = landmarks[308];
  const leftEye = landmarks[130];
  const rightEye = landmarks[359];

  // MOUTH METRICS
  const mouthWidth = Math.abs(right.x - left.x);
  const mouthHeight = Math.abs(bottom.y - top.y);
  const lipCurve = Math.max(0, Math.min(1, (mouthHeight / (mouthWidth * 0.3))));

  let mouthScore = 0;
  let mouthState = null;

  // Width check
  if (mouthWidth > 0.18) {
    mouthScore += 35;
  } else if (mouthWidth > 0.12) {
    mouthScore += 20;
    mouthState = 'narrow';
  } else {
    mouthScore += 0;
    mouthState = 'narrow';
  }

  // Height check
  if (mouthHeight > 0.14) {
    mouthScore += 0;
    mouthState = 'tooOpen';
  } else if (mouthHeight > 0.06 && mouthHeight <= 0.14) {
    mouthScore += 35;
  } else if (mouthHeight >= 0.02) {
    mouthScore += 20;
    mouthState = mouthState || 'narrow';
  } else {
    mouthScore += 0;
    mouthState = mouthState || 'noSmile';
  }

  // Lip curve (natural shape)
  if (lipCurve > 0.4) {
    mouthScore += 30;
  } else if (lipCurve > 0.2) {
    mouthScore += 15;
  }

  mouthScore = Math.min(100, Math.round(mouthScore));

  // EYE ENGAGEMENT METRICS
  const eyeEngagement = 
    Math.abs(leftEye.y - top.y) + Math.abs(rightEye.y - top.y);
  
  let eyeScore = 0;

  // Eye crinkle/engagement (higher = more genuine smile)
  if (eyeEngagement > 0.08) {
    eyeScore += 50; // Strong eye engagement
  } else if (eyeEngagement > 0.05) {
    eyeScore += 35;
  } else if (eyeEngagement > 0.02) {
    eyeScore += 20;
  } else {
    eyeScore += 5;
  }

  // Corner symmetry
  const leftCorner = landmarks[78];
  const rightCorner = landmarks[308];
  const cornerSymmetry = Math.abs(leftCorner.y - rightCorner.y);
  
  if (cornerSymmetry < 0.03) {
    eyeScore += 50;
  } else if (cornerSymmetry < 0.06) {
    eyeScore += 30;
  } else {
    eyeScore += 10;
  }

  eyeScore = Math.min(100, Math.round(eyeScore));

  // Combined overall score
  const score = Math.round((mouthScore + eyeScore) / 2);

  return {
    score,
    mouthScore,
    eyeScore,
    mouthWidth,
    mouthHeight,
    lipCurve,
    eyeEngagement,
    mouthState: mouthState || (score >= 70 ? null : 'noSmile')
  };
}
