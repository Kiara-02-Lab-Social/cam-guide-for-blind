/**
 * Reusable canvas drawing functions for MediaPipe FaceMesh overlays.
 */

/**
 * Draws the face boundary tracking box and crosshair in the center of the camera.
 * @param {HTMLCanvasElement} canvas - Target canvas element.
 * @param {Object} checks - Object containing face bounding box and check states.
 */
export function drawPositionOverlay(canvas, checks) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!checks || !checks.bbox) return;

  const { minX, minY, maxX, maxY } = checks.bbox;
  const allGood =
    checks.center === 'ok' &&
    checks.vertPos === 'ok' &&
    checks.angle === 'ok' &&
    checks.distance === 'ok';

  const color = allGood ? '#1D9E75' : '#EF9F27';

  const x = minX * canvas.width;
  const y = minY * canvas.height;
  const w = (maxX - minX) * canvas.width;
  const h = (maxY - minY) * canvas.height;
  const pad = 12;

  // Draw rounded face box
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, 8);
  } else {
    // Fallback for browsers that don't support roundRect yet
    ctx.rect(x - pad, y - pad, w + pad * 2, h + pad * 2);
  }
  ctx.stroke();

  // Corner accents
  const cs = 14;
  ctx.lineWidth = 2.5;
  const corners = [
    [x - pad, y - pad],
    [x + w + pad, y - pad],
    [x - pad, y + h + pad],
    [x + w + pad, y + h + pad]
  ];

  corners.forEach(([cx, cy], i) => {
    const sx = i % 2 === 0 ? 1 : -1;
    const sy = i < 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx + sx * cs, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * cs);
    ctx.stroke();
  });

  // Center cross
  const frameCX = canvas.width / 2;
  const frameCY = canvas.height / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(frameCX - 10, frameCY);
  ctx.lineTo(frameCX + 10, frameCY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(frameCX, frameCY - 10);
  ctx.lineTo(frameCX, frameCY + 10);
  ctx.stroke();
}

/**
 * Draws the mouth landmark mesh wireframe.
 * @param {HTMLCanvasElement} canvas - Target canvas.
 * @param {Array} landmarks - Landmark points from MediaPipe FaceMesh.
 * @param {boolean} showCheckmark - Whether to show a success checkmark on top right.
 */
export function drawMouthOverlay(canvas, landmarks, showCheckmark = false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!landmarks || landmarks.length === 0) return;

  const mouthIndices = [
    61, 92, 181, 38, 128, 245, 95, 88, 178, 87, 10, 152, 273, 253, 446,
    463, 288, 387, 470, 471, 472, 474, 475, 476, 477
  ];

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;

  const mouthLower = landmarks[17];
  if (mouthLower) {
    ctx.beginPath();
    mouthIndices.forEach((idx, i) => {
      if (landmarks[idx]) {
        const x = landmarks[idx].x * canvas.width;
        const y = landmarks[idx].y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  if (showCheckmark) {
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('✓', canvas.width - 20, 40);
  }
}
