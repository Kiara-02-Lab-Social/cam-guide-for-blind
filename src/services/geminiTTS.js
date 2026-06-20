const GEMINI_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

let audioContext = null;
let currentSource = null;
let currentGain = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function stopGeminiTTS() {
  if (currentSource) {
    try { currentSource.stop(); } catch {}
    currentSource.disconnect();
    currentSource = null;
  }
  if (currentGain) {
    currentGain.disconnect();
    currentGain = null;
  }
}

export async function speakWithGemini(text, apiKey, lang = 'en', options = {}) {
  const voiceName = 'Kore';
  const ttsPrompt = `Say: ${text}`;

  const response = await fetch(
    `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: ttsPrompt }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    const status = response.status;
    let message = `Gemini TTS error (${status})`;
    if (status === 400) message = 'Invalid request. Check your API key and input.';
    else if (status === 403) message = 'API key not authorized for Gemini TTS.';
    else if (status === 404) message = 'Gemini model not found.';
    else if (status === 429) message = 'Rate limited. Try again later.';
    if (errorBody) {
      try {
        const err = JSON.parse(errorBody);
        message = err.error?.message || message;
      } catch {}
    }
    throw new Error(message);
  }

  const data = await response.json();

  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('Gemini returned no audio data.');
  }

  const audioPart = parts.find(p => p.inlineData?.mimeType?.startsWith('audio/'));
  if (!audioPart) {
    throw new Error('Gemini response did not contain audio.');
  }

  const { data: base64Data } = audioPart.inlineData;
  const binaryStr = atob(base64Data);
  const pcmBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    pcmBytes[i] = binaryStr.charCodeAt(i);
  }

  // Decode as 16-bit signed PCM, 24000Hz, mono
  const numSamples = pcmBytes.length / 2;
  const int16View = new Int16Array(pcmBytes.buffer, pcmBytes.byteOffset, numSamples);
  const floatData = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    floatData[i] = int16View[i] / 32768;
  }

  stopGeminiTTS();

  const ctx = getAudioContext();
  const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
  audioBuffer.getChannelData(0).set(floatData);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  const gain = ctx.createGain();
  gain.gain.value = options.volume !== undefined ? options.volume : 1;

  source.connect(gain);
  gain.connect(ctx.destination);

  currentSource = source;
  currentGain = gain;

  source.start(0);

  return new Promise((resolve) => {
    source.onended = () => {
      if (currentSource === source) {
        currentSource = null;
        currentGain = null;
      }
      resolve();
    };
  });
}

export async function testGeminiConnection(apiKey) {
  const response = await fetch(
    `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say: Hello' }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    let message = `API error (${response.status})`;
    if (errorBody) {
      try {
        const err = JSON.parse(errorBody);
        message = err.error?.message || message;
      } catch {}
    }
    throw new Error(message);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const hasAudio = parts?.some(p => p.inlineData?.mimeType?.startsWith('audio/'));

  if (!hasAudio) {
    throw new Error('Gemini did not return audio output.');
  }

  return true;
}
