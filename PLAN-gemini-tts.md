# Gemini TTS Implementation Plan

## Goal
Add Gemini 2.5 Flash TTS as an alternative to the existing Web Speech API for voice guidance.

## Overview
- Users choose between **Browser Speech** (Web Speech API, current default) and **Gemini AI Voice** (Gemini 2.5 Flash TTS)
- If Gemini is selected, users provide their own API key via Settings
- The `speak()` function in AppContext dispatches to the selected engine
- Gemini errors are caught and spoken via Web Speech fallback

---

## Files to Create

### 1. `src/services/geminiTTS.js`
Service module for Gemini TTS API calls.

```
speakWithGemini(text, apiKey, lang, options) → Promise<void>
  - POST to https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}
  - Request body:
    {
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: lang === 'ja' ? 'ja-JP-Standard-A' : 'en-US-Journey-F' }
          }
        }
      }
    }
  - Extract base64 audio from response -> play via new Audio() -> resolve on end, reject on error
  - Support abort via AbortController

testGeminiConnection(apiKey) → Promise<boolean>
  - Same API call with a short test phrase ("Hello")
  - Returns true if successful, throws with explanation on failure
```

---

## Files to Modify

### 2. `src/context/AppContext.jsx`
Core TTS engine dispatch logic.

**New state:**
| State | Type | Default | Persisted | Description |
|-------|------|---------|-----------|-------------|
| `ttsEngine` | `'web-speech'` \| `'gemini'` | `'web-speech'` | localStorage `ttsEngine` | Selected TTS engine |
| `geminiApiKey` | `string` | `''` | localStorage `geminiApiKey` | User's Gemini API key |
| `geminiTtsStatus` | `'idle'` \| `'error'` \| `'testing'` \| `'tested-ok'` | `'idle'` | — | Status for UI feedback |
| `geminiTtsError` | `string` | `''` | — | Last Gemini TTS error message |

**New setters:**
- `setTtsEngine(val)` – updates + persists to localStorage
- `setGeminiApiKey(val)` – updates + persists to localStorage
- `setGeminiTtsStatus(val)` – updates only
- `testGeminiKey()` – async: sets status to 'testing', calls `testGeminiConnection(apiKey)`, sets 'tested-ok' or 'error' with message

**Modified `speak()` function:**
```
speak(text, force=false, debounceMs=2500):
  1. If muted, return
  2. Debounce check (existing logic)
  3. setSpeakingText(text); setIsSpeaking(true)
  4. If ttsEngine === 'gemini' && geminiApiKey is non-empty:
     a. Call speakWithGemini(text, geminiApiKey, lang, { rate, pitch, volume })
     b. .then(() => setIsSpeaking(false))
     c. .catch((err) => {
          setIsSpeaking(false)
          setGeminiTtsStatus('error')
          setGeminiTtsError(err.message)
          // Fallback: speak error message via Web Speech
          speakWithWebSpeech("Gemini TTS error: " + err.message, lang, { rate, pitch, volume })
        })
  5. Else (web-speech engine or no API key):
     a. Use existing Web Speech API logic (extracted as internal speakWithWebSpeech())
```

**Exposed in context provider value:**
Add: `ttsEngine`, `setTtsEngine`, `geminiApiKey`, `setGeminiApiKey`, `geminiTtsStatus`, `geminiTtsError`, `testGeminiKey`

---

### 3. `src/App.jsx`
Settings UI additions.

**Within `settings-view` → Voice Customization fieldset** (at the top, before Speed slider):

```
<fieldset class="settings-group">
  <legend>TTS Engine</legend>

  <div class="setting-row">
    <div>
      <div class="setting-label-text">Text-to-Speech Engine</div>
      <div class="setting-desc-text">Choose between browser speech and Gemini AI voice.</div>
    </div>
    <div class="radio-group">
      <label class="radio-option">
        <input type="radio" name="ttsEngine" value="web-speech" checked={ttsEngine === 'web-speech'} onChange={() => setTtsEngine('web-speech')} />
        <span>Browser Speech</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="ttsEngine" value="gemini" checked={ttsEngine === 'gemini'} onChange={() => setTtsEngine('gemini')} />
        <span>Gemini AI Voice</span>
      </label>
    </div>
  </div>

  {/* Visible only when ttsEngine === 'gemini' */}
  {ttsEngine === 'gemini' && (
    <div class="setting-row">
      <div>
        <div class="setting-label-text">Gemini API Key</div>
        <div class="setting-desc-text">Enter your Google Gemini API key. Get one at aistudio.google.com.</div>
      </div>
      <div class="api-key-group">
        <div class="api-key-input-row">
          <input type="password" class="api-key-input" value={localKey} onChange={...} placeholder="Paste your API key" />
          <button class="api-key-save-btn" onClick={handleSaveKey}>Save</button>
          <button class="api-key-test-btn" onClick={handleTestKey} disabled={geminiTtsStatus === 'testing' || !geminiApiKey}>
            {geminiTtsStatus === 'testing' ? 'Testing...' : 'Test'}
          </button>
        </div>
        {geminiTtsStatus === 'tested-ok' && <div class="api-key-status ok">✓ Connection successful</div>}
        {geminiTtsStatus === 'error' && <div class="api-key-status err">✗ {geminiTtsError}</div>}
        {geminiApiKey && keyJustSaved && <div class="api-key-status ok">✓ Key saved</div>}
      </div>
    </div>
  )}
</fieldset>
```

**State:**
- `localKey` – local input state (not saved until "Save" clicked)
- `keyJustSaved` – boolean shown temporarily after save

---

### 4. `src/translations.js`
New keys for both `en` and `ja`:

| Key | EN Value | JA Value |
|-----|----------|----------|
| `ttsEngine` | "Text-to-Speech Engine" | "音声合成エンジン" |
| `ttsEngineBrowser` | "Browser Speech" | "ブラウザ音声" |
| `ttsEngineGemini` | "Gemini AI Voice" | "Gemini AI音声" |
| `ttsEngineDesc` | "Choose between browser speech and Gemini AI voice." | "ブラウザ音声とGemini AI音声を選択します。" |
| `geminiApiKey` | "Gemini API Key" | "Gemini APIキー" |
| `geminiApiKeyDesc` | "Enter your Google Gemini API key. Get one at aistudio.google.com." | "Google Gemini APIキーを入力してください。aistudio.google.comで取得できます。" |
| `geminiApiKeyPlaceholder` | "Paste your API key here" | "APIキーを貼り付けてください" |
| `geminiApiKeySaved` | "✓ Key saved" | "✓ キーを保存しました" |
| `geminiApiKeySave` | "Save" | "保存" |
| `geminiApiKeyTest` | "Test" | "テスト" |
| `geminiApiKeyTesting` | "Testing..." | "テスト中..." |
| `geminiTestSuccess` | "✓ Connection successful" | "✓ 接続成功" |
| `geminiTestFailed` | "✗ Connection failed" | "✗ 接続失敗" |

---

### 5. `src/index.css`
New CSS classes:

```css
/* Radio group for TTS engine selection */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.radio-option:hover {
  background: var(--gray-200);
}

.radio-option input[type="radio"] {
  accent-color: var(--green);
}

/* API key input row */
.api-key-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.api-key-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.api-key-input {
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid var(--gray-300);
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  min-width: 180px;
  outline: none;
  transition: border-color 0.15s;
}

.api-key-input:focus {
  border-color: var(--green);
}

.api-key-save-btn,
.api-key-test-btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--gray-300);
  background: var(--white);
  color: var(--gray-700);
  transition: all 0.15s;
  white-space: nowrap;
}

.api-key-save-btn:hover,
.api-key-test-btn:hover {
  background: var(--gray-200);
}

.api-key-save-btn:active,
.api-key-test-btn:active {
  transform: scale(0.97);
}

.api-key-test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.api-key-test-btn {
  background: var(--green);
  color: var(--white);
  border-color: var(--green);
}

.api-key-test-btn:hover {
  background: var(--green-dark);
}

.api-key-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 0;
}

.api-key-status.ok {
  color: var(--green-dark);
}

.api-key-status.err {
  color: var(--red-dark);
}
```

---

## Implementation Order

1. Create `src/services/geminiTTS.js` (service + test function)
2. Update `src/context/AppContext.jsx` (new state, refactored speak, exposed values)
3. Update `src/translations.js` (new keys en/ja)
4. Update `src/index.css` (new styles)
5. Update `src/App.jsx` (settings UI with engine selector + API key input)

---

## Error Handling Strategy

| Scenario | Behavior |
|----------|----------|
| Gemini selected, no API key | Silently fall back to Web Speech API |
| Gemini API returns 4xx/5xx | Speak error message via Web Speech fallback; set `geminiTtsStatus = 'error'` |
| Gemini API network failure | Timeout after 15s; speak timeout error via Web Speech |
| Gemini selected, API key invalid | "Test" button shows failure; `speak()` will fail and fallback to Web Speech with error |
| Gemini selected, API key valid | `speak()` uses Gemini exclusively |

---

## Edge Cases

- **Tab switch during Gemini TTS playback**: `stopSpeaking()` should abort the Gemini fetch and stop audio
- **Multiple rapid speak() calls**: Current debounce logic still applies; but if a Gemini call is in-flight, it should be aborted before starting a new one (use AbortController ref)
- **Empty API key after save**: If user clears the key and saves, fall back to Web Speech
- **localStorage quota**: Unlikely issue for a single string key
