export const translations = {
  en: {
    // Shared / Branding
    brand: "Cam Guide",
    mission: "🌍 FastBarrierFree Mission",
    pageTitle: "Cam Guide — Webcam Position Assistant",
    srHeading: "Cam Guide — Webcam position assistant for blind users on video calls",
    audioOn: "Audio feedback: ON",
    audioOff: "Audio feedback: OFF",
    stop: "Stop",
    audioLabel: "Speaking via audio",
    navLive: "Live check",
    navHistory: "History",
    navSettings: "Settings",
    navPlatform: "Platform",
    legendLanguage: "Language Settings",
    legendAudio: "Audio Alerts Settings",
    legendVoice: "Voice Customization",
    navSmile: "Smile Coach",
    ttsSpeed: "Voice Speed",
    ttsSpeedDesc: "Adjust how fast the voice instructions are spoken.",
    ttsPitch: "Voice Pitch",
    ttsPitchDesc: "Adjust the pitch (highness/lowness) of the voice.",
    ttsVolume: "Voice Volume",
    ttsVolumeDesc: "Adjust the volume level of the voice feedback.",

    // TTS Engine
    ttsEngine: "Text-to-Speech Engine",
    ttsEngineBrowser: "Browser Speech",
    ttsEngineGemini: "Gemini AI Voice",
    ttsEngineDesc: "Choose between browser speech or Gemini AI voice.",
    geminiApiKey: "Gemini API Key",
    geminiApiKeyDesc: "Enter your Google Gemini API key. Get one at aistudio.google.com.",
    geminiApiKeyPlaceholder: "Paste your API key here",
    geminiApiKeySaved: "Key saved",
    geminiApiKeySave: "Save",
    geminiApiKeyTest: "Test",
    geminiApiKeyTesting: "Testing...",
    geminiTestSuccess: "Connection successful",
    geminiTestFailed: "Connection failed",

    
    // Cam Guide Specific
    sectionLive: "Live check",
    pageHeading: "How does it work?",
    pageSub: "On-device AI analyzes your face and the results are communicated by VoiceOver or text-to-speech voice.",
    camLabel: "Live webcam",
    startBtn: "Start camera",
    startBtnSub: "Webcam access required",
    
    // Position Checks
    checkFace: "Face in frame",
    checkCenter: "Centered left-right",
    checkAngle: "Head angle",
    checkLight: "Lighting",
    
    // Cam Guide Status Pills
    statusWaiting: "Waiting...",
    statusStarting: "Starting...",
    statusFinding: "Finding face...",
    statusAllGood: "All good",
    statusLighting: "Lighting issue",
    statusDistance: "Distance",
    statusOffCenter: "Off center",
    statusHeadPos: "Head position",
    statusHeadTilt: "Head tilt",
    statusCamErr: "Camera error",
    statusNoFace: "No face found",

    // Cam Guide Feedback Cards
    fbWaiting: "Waiting for camera...",
    fbWaitingDesc: 'Click "Start camera" above to begin.',
    fbGoodTitle: "You look great!",
    fbGoodDesc: "Face centered, head level, lighting good. You're ready for your call.",
    fbNoFaceTitle: "Face not detected",
    fbNoFaceDesc: "Position yourself in front of the camera. Make sure the room is lit.",
    fbCamDeniedTitle: "Camera access denied",
    fbCamDeniedDesc: "Please allow webcam access in your browser and reload the page.",

    // Cam Guide Voice Alerts (TTS)
    moveRight: "Move slightly right",
    moveLeft: "Move slightly left",
    raiseScreen: "Look slightly higher or raise your screen",
    lowerScreen: "Lower your screen or sit back a little",
    straightenHead: "Straighten your head — it's tilted",
    moveBack: "Move back — you're too close",
    moveCloser: "Move closer — you're too far",
    tooDark: "Too dark — turn on a light facing you",
    tooBright: "Too bright — move away from bright background",

    // Cam Guide Descriptions
    descLighting: "Lighting affects how you appear on video calls.",
    descDistance: "Adjust your distance from the camera.",
    descCenter: "Shift your position so your face is centered.",
    descVert: "Adjust your screen or seat height.",
    descAngle: "Keep your head level for a professional look.",

    // Cam Guide Streak
    streakLabel: "Good sessions",
    streakStart: "Start a session",
    streakMinute: "good minute this session",
    streakMinutes: "good minutes this session",

    // Navigation announcements
    navAnnounceCamGuide: "Navigated to Live Check page",
    navAnnounceSmileCoach: "Navigated to Smile Coach page",
    navAnnounceHistory: "Navigated to History page",
    navAnnounceSettings: "Navigated to Settings page",
    navAnnouncePlatform: "Navigated to Platform page",

    // Cam Guide TTS Phrases
    ttsCamStarted: "Camera started. Position yourself in front of the camera.",
    ttsCamDenied: "Camera access denied. Please allow webcam access and reload.",
    ttsAudioOn: "Audio feedback on",
    ttsAllGood: "You look great, you are ready for your call",
    ttsNoFace: "Face not detected. Please position yourself in front of the camera.",

    // Smile Coach Specific
    smileTitle: "SmileCoach",
    smileSubtitle: "Learn to smile better with voice guidance",
    smileDescription: "Real-time feedback helps you find your most natural, confident smile. Works with or without video. 100% privacy-first.",
    cameraView: "Camera View",
    startCamera: "Start Camera",
    startHint: "Click to begin · Audio guidance included",
    readyBegin: "Ready to begin",
    readyText: "Click \"Start Camera\" to begin. We'll guide you to your best smile!",
    audioTip: "💬 Audio will announce tips in real-time. Keep the volume on.",
    smileScore: "Smile Score",
    mouthScore: "Mouth",
    eyeScore: "Eyes",
    goodSecs: "Good Seconds",
    sessionTime: "Session Time",
    tipsTitle: "Tips for Your Best Smile",
    
    // Smile Coach Status Cards
    cameraReady: "Camera Ready",
    cameraReadyText: "Smile for the camera! I'll give you real-time feedback on your smile quality.",
    cameraReadyTip: "💬 Keep audio on for voice guidance.",
    faceNotDetected: "Face Not Detected",
    faceNotDetectedText: "Position yourself in front of the camera. Make sure you're well-lit.",
    faceNotDetectedTip: "Your face should be centered on screen.",
    amazingSmile: "Perfect!",
    goodSmile: "Good",
    mouthTooOpen: "Mouth too open",
    mouthTooNarrow: "Mouth too narrow",
    noSmile: "Neutral face",
    cameraAccessDenied: "Camera Access Denied",
    cameraAccessDeniedText: "Please allow camera access in your browser settings and reload the page.",
    cameraAccessDeniedTip: "We need camera access to help you perfect your smile.",
    sessionEnded: "Session Ended",
    sessionEndedText: "Great practice! Your smile is improving every session. Come back soon.",
    sessionEndedTip: "💡 Practice 2–3 minutes daily for best results.",
    cameraStarting: "Camera starting. Positioning face...",
    cameraAccessInitError: "Camera access denied. Please allow webcam access and reload the page.",

    // Arrays/Lists for Smile Coach
    tips: [
      "Relax your jaw. Let your mouth fall slightly open, then lift the corners.",
      "Eyes matter. A real smile engages the muscles around your eyes (crow's feet).",
      "Chin down. Keep your chin slightly tucked to avoid double chins in photos.",
      "Natural light. Position a light source in front of you, not behind.",
      "Think happy. Genuine smiles come from genuine emotion. Recall something joyful.",
      "Practice daily. Muscle memory helps. 2–3 minutes per day builds confidence."
    ],
    amazingSmileQuips: [
      "Hold that.",
      "Lock it.",
      "Don't move.",
      "That's gold.",
      "Keep it."
    ],
    goodSmileQuips: [
      "Open mouth wider.",
      "Lift the eyes.",
      "Raise mouth corners.",
      "Engage the eyes.",
      "More mouth width."
    ],
    mouthTooOpenQuips: [
      "Close mouth slightly.",
      "Tighten the jaw.",
      "Less teeth showing.",
      "Compress the mouth.",
      "Relax the jaw."
    ],
    mouthTooNarrowQuips: [
      "Open mouth wider.",
      "Spread the teeth.",
      "Widen the opening.",
      "Bigger mouth opening.",
      "Expand the mouth."
    ],
    noSmileQuips: [
      "Smile now.",
      "Go for it.",
      "Hit me with it.",
      "Show the smile.",
      "Fire away."
    ]
  },
  ja: {
    // Shared / Branding
    brand: "カムガイド",
    mission: "🌍 FastBarrierFree ミッション",
    pageTitle: "カムガイド — ウェブカメラ位置アシスタント",
    srHeading: "カムガイド — ビデオ通話で視覚障害者向けのウェブカメラ位置アシスタント",
    audioOn: "音声フィードバック: オン",
    audioOff: "音声フィードバック: オフ",
    stop: "停止",
    audioLabel: "音声で案内中",
    navLive: "ライブチェック",
    navHistory: "履歴",
    navSettings: "設定",
    navPlatform: "プラットフォーム",
    legendLanguage: "言語設定",
    legendAudio: "音声警告設定",
    legendVoice: "音声のカスタマイズ",
    navSmile: "スマイルコーチ",
    ttsSpeed: "音声速度",
    ttsSpeedDesc: "音声案内の読み上げ速度を調整します。",
    ttsPitch: "音声の高さ",
    ttsPitchDesc: "音声のピッチ（高低）を調整します。",
    ttsVolume: "音声の音量",
    ttsVolumeDesc: "音声案内の音量レベルを調整します。",

    // TTS Engine
    ttsEngine: "音声合成エンジン",
    ttsEngineBrowser: "ブラウザ音声",
    ttsEngineGemini: "Gemini AI音声",
    ttsEngineDesc: "ブラウザ音声またはGemini AI音声を選択します。",
    geminiApiKey: "Gemini APIキー",
    geminiApiKeyDesc: "Google Gemini APIキーを入力してください。aistudio.google.comで取得できます。",
    geminiApiKeyPlaceholder: "APIキーを貼り付けてください",
    geminiApiKeySaved: "キーを保存しました",
    geminiApiKeySave: "保存",
    geminiApiKeyTest: "テスト",
    geminiApiKeyTesting: "テスト中...",
    geminiTestSuccess: "接続成功",
    geminiTestFailed: "接続失敗",

    
    // Cam Guide Specific
    sectionLive: "ライブチェック",
    pageHeading: "どうやって機能するの？",
    pageSub: "端末上のAIが顔を分析し、結果はVoiceOverまたは音声合成で伝えられます。",
    camLabel: "ライブカメラ",
    startBtn: "カメラを開始",
    startBtnSub: "ウェブカメラへのアクセスが必要です",
    
    // Position Checks
    checkFace: "顔がフレームに入っている",
    checkCenter: "左右の中央",
    checkAngle: "頭の角度",
    checkLight: "明るさ",
    
    // Cam Guide Status Pills
    statusWaiting: "待機中...",
    statusStarting: "起動中...",
    statusFinding: "顔を検出中...",
    statusAllGood: "すべて良好",
    statusLighting: "明るさの問題",
    statusDistance: "距離",
    statusOffCenter: "中央から外れています",
    statusHeadPos: "頭の位置",
    statusHeadTilt: "頭の傾き",
    statusCamErr: "カメラエラー",
    statusNoFace: "顔が見つかりません",

    // Cam Guide Feedback Cards
    fbWaiting: "カメラ起動を待っています...",
    fbWaitingDesc: '上の「カメラを開始」をクリックしてください。',
    fbGoodTitle: "バッチリです！",
    fbGoodDesc: "顔が中央・頭がまっすぐ・明るさも良好。通話の準備が整いました。",
    fbNoFaceTitle: "顔が検出できません",
    fbNoFaceDesc: "カメラの前に位置し、部屋が明るいか確認してください。",
    fbCamDeniedTitle: "カメラへのアクセスが拒否されました",
    fbCamDeniedDesc: "ブラウザでウェブカメラへのアクセスを許可し、ページを再読み込みしてください。",

    // Cam Guide Voice Alerts (TTS)
    moveRight: "少し右に動いてください",
    moveLeft: "少し左に動いてください",
    raiseScreen: "少し上を見るか、画面を上げてください",
    lowerScreen: "画面を下げるか、少し後ろに座ってください",
    straightenHead: "頭がまっすぐではありません。傾きを直してください",
    moveBack: "少し後ろに下がってください。近すぎます",
    moveCloser: "少し前に出てください。遠すぎます",
    tooDark: "暗すぎます。正面に光をあててください",
    tooBright: "明るすぎます。明るい背景から離れてください",

    // Cam Guide Descriptions
    descLighting: "明るさはビデオ通話での見え方に影響します。",
    descDistance: "カメラとの距離を調整してください。",
    descCenter: "顔が中央に来るように位置を調整してください。",
    descVert: "画面の高さや座る高さを調整してください。",
    descAngle: "通話用に頭をまっすぐ保ってください。",

    // Cam Guide Streak
    streakLabel: "良好セッション",
    streakStart: "セッションを開始",
    streakMinute: "良好な分（今回のセッション）",
    streakMinutes: "良好な分（今回のセッション）",

    // Navigation announcements
    navAnnounceCamGuide: "ライブチェックページに移動しました",
    navAnnounceSmileCoach: "スマイルコーチページに移動しました",
    navAnnounceHistory: "履歴ページに移動しました",
    navAnnounceSettings: "設定ページに移動しました",
    navAnnouncePlatform: "プラットフォームページに移動しました",

    // Cam Guide TTS Phrases
    ttsCamStarted: "カメラを起動しました。カメラの前に位置してください。",
    ttsCamDenied: "カメラへのアクセスが拒否されました。アクセスを許可してから再読み込みしてください。",
    ttsAudioOn: "音声フィードバックをオンにしました",
    ttsAllGood: "バッチリです。通話の準備が整いました",
    ttsNoFace: "顔が検出できません。カメラの前に位置してください。",

    // Smile Coach Specific
    smileTitle: "スマイルコーチ",
    smileSubtitle: "音声ガイド付きで笑顔を改善しよう",
    smileDescription: "リアルタイムフィードバックで、最も自然で自信のある笑顔を見つけるお手伝いします。ビデオの有無を問わず動作します。完全プライベート対応。",
    cameraView: "カメラビュー",
    startCamera: "カメラを開始",
    startHint: "クリックして開始 · 音声ガイド付き",
    readyBegin: "準備完了",
    readyText: "「カメラを開始」をクリックして始めましょう。最高の笑顔へとガイドします！",
    audioTip: "💬 音声でリアルタイムのアドバイスを提供します。音量をオンにしてください。",
    smileScore: "スマイルスコア",
    mouthScore: "口",
    eyeScore: "目",
    goodSecs: "良好秒数",
    sessionTime: "セッション時間",
    tipsTitle: "最高の笑顔のためのコツ",
    
    // Smile Coach Status Cards
    cameraReady: "カメラ準備完了",
    cameraReadyText: "カメラに向かって笑ってください！リアルタイムで笑顔品質のフィードバックをします。",
    cameraReadyTip: "💬 音声ガイダンスのために音量をオンにしてください。",
    faceNotDetected: "顔が検出されていません",
    faceNotDetectedText: "カメラの前に位置して、照明が良いことを確認してください。",
    faceNotDetectedTip: "顔がスクリーンの中央にあるはずです。",
    amazingSmile: "完璧！",
    goodSmile: "いい",
    mouthTooOpen: "口が開きすぎ",
    mouthTooNarrow: "口が狭すぎ",
    noSmile: "真顔",
    cameraAccessDenied: "カメラアクセスが拒否されました",
    cameraAccessDeniedText: "ブラウザの設定でカメラアクセスを許可し、ページを再度読み込んでください。",
    cameraAccessDeniedTip: "最高の笑顔を完成させるには、カメラアクセスが必要です。",
    sessionEnded: "セッション終了",
    sessionEndedText: "素晴らしい練習でした！笑顔は毎回改善されています。また来てください。",
    sessionEndedTip: "💡 最良の結果を得るため、毎日2～3分の練習をしてください。",
    cameraStarting: "カメラを起動中。顔を配置中...",
    cameraAccessInitError: "カメラアクセスが拒否されました。カメラアクセスを許可して再度読み込んでください。",

    // Arrays/Lists for Smile Coach
    tips: [
      "顎をリラックスさせます。口をわずかに開けてから、角を持ち上げます。",
      "目が重要です。本当の笑顔は目の周りの筋肉を使います。",
      "顎を下げます。顔写真で二重あごを避けるため、わずかに顎を引きます。",
      "自然光を使います。光源を自分の前に置き、後ろではなく。",
      "幸せを思い出します。本当の笑顔は本当の感情から生まれます。",
      "毎日練習します。筋肉記憶を使えば、1日2～3分で自信が付きます。"
    ],
    amazingSmileQuips: [
      "その笑顔。",
      "止めるな。",
      "動くな。",
      "これだ。",
      "キープしろ。"
    ],
    goodSmileQuips: [
      "口広げて、口角をあげて。",
      "目をもっと使って。",
      "口角上げる。",
      "目開いて。",
      "より口を開く。"
    ],
    mouthTooOpenQuips: [
      "口少し閉じて。",
      "顎引いて。",
      "歯隠して。",
      "口のサイズ落とす。",
      "リラックス。"
    ],
    mouthTooNarrowQuips: [
      "口広げて、より。",
      "歯見せて。",
      "口の開き大きく。",
      "デカく開く。",
      "広がれ。"
    ],
    noSmileQuips: [
      "笑ってよ。",
      "やってみ。",
      "いまだ。",
      "出して。",
      "さあ。"
    ]
  }
};
export const encouragements = {
  en: [
    "Very good.",
    "Nice.",
    "Good work.",
    "Beautiful.",
    "Nice job.",
    "Excellent.",
    "You got it.",
    "Nailed it."
  ],
  ja: [
    "いいね。",
    "いい感じ。",
    "素敵。",
    "グッド。",
    "ナイス。",
    "完璧。",
    "素晴らしい。",
    "いけてる。"
  ]
};
