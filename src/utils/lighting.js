/**
 * Analyzes the brightness of a video stream frame.
 * @param {HTMLVideoElement} video - The video element to sample.
 * @returns {string} 'ok' | 'dark' | 'bright'
 */
export function checkLighting(video) {
  if (!video) return 'ok';
  try {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 64;
    tmpCanvas.height = 48;
    const ctx = tmpCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 64, 48);
    const data = ctx.getImageData(0, 0, 64, 48).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const avg = sum / (data.length / 4);
    if (avg > 40 && avg < 220) return 'ok';
    if (avg <= 40) return 'dark';
    return 'bright';
  } catch (e) {
    console.warn('Could not read canvas pixel data (e.g. cross-origin video source):', e);
    return 'ok';
  }
}
