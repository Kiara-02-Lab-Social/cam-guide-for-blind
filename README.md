# Cam Guide

**Webcam position assistant and Smile Coach for blind and low-vision users on video calls.**

Tells you — via audio — whether your face is centered, well-lit, and properly framed, and helps you practice your most natural, confident smile. Join video calls and present yourself confidently without needing to see the screen.

> [!IMPORTANT]
> **Compatibility Note**: This application is specifically designed and optimized **only for Apple devices and browsers running on Apple devices** (macOS, iOS, and iPadOS). 

![Cam Guide UI](cam-guide-ui.svg)

---

## What's New in this Web App
This application has been upgraded from a single static page to a complete offline-first React application with multiple features:
- **Cam Guide (Live Check)**: Real-time alignment checks (horizontal/vertical framing, distance, tilt, and lighting check) with spoken instructions.
- **Smile Coach**: Guides you to perfect a confident smile by analyzing your mouth shape and eye engagements with real-time feedback scores and audio encouragements.
- **Customizable TTS Controls**: Custom sliders on the Settings page to adjust voice speed (rate), pitch, and volume parameters to your liking (saved automatically to your browser).
- **Smart Screen Reader Mode**: Smartly disables `aria-live` regions when the built-in TTS voice is active to prevent double-audio overlap, while enabling screen reader fallback announcements when muted.

---

## How to Run the Project (For Beginners)

If you have never run a web project before, follow these step-by-step instructions. We will walk you through cloning the code, installing the required tools, and running the application on your computer.

### Step 1: Clone the Repository
First, you need to download a copy of the project files to your computer using Git.

1. Open your terminal or command prompt (see **Step 3** below for instructions on how to open it on your operating system).
2. Navigate to the folder where you want to download the project (for example, your Projects or Desktop directory):
   ```bash
   cd Desktop
   ```
3. Type the following command to download the code:
   ```bash
   git clone https://github.com/Kiara-02-Lab-Social/cam-guide-for-blind.git
   ```
4. Press `Enter`. This will create a folder named `cam-guide-for-blind` on your desktop containing all the files.

---

### Step 2: Install Node.js
To run this project, you need a free software tool called **Node.js** (which automatically includes **npm**).

1. Go to the official download page: [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version recommended for macOS.
3. Open the downloaded installer file and follow the standard installation instructions on your screen (you can leave all options as default).

---

### Step 3: Open your Terminal
You will run the project by typing simple commands into a text terminal.

*   **Mac (macOS)**: Press `Cmd + Space` to open Spotlight search, type `Terminal`, and press `Enter`.

---

### Step 4: Navigate to the Project Directory
In your terminal, you need to point the command line to the folder where you cloned the project.

1. Type the following command:
   ```bash
   cd cam-guide-for-blind
   ```
2. Press `Enter`.

---

### Step 5: Install Dependencies
The project uses external helpers (like React and MediaPipe) which need to be downloaded.

1. In the terminal, type the following command:
   ```bash
   npm install
   ```
2. Press `Enter`.
3. Wait a few moments. You will see progress bars on the screen. Once finished, it will return to the command prompt. You only need to do this step **once** when setting up the project for the first time.

---

### Step 6: Start the Project
Now you are ready to run the local server.

1. Type the following command in the terminal:
   ```bash
   npm run dev
   ```
2. Press `Enter`.
3. The terminal will display a message showing that the local server is running, looking like this:
   ```text
     VITE vX.X.X  ready in XXX ms

     ➜  Local:   http://localhost:5173/
   ```
4. Click the URL `http://localhost:5173/` in Safari, Chrome, or any browser running on your Apple device.

To stop the server at any time, return to the terminal and press `Ctrl + C`.

---

## Core Features & Logic

### 1. Cam Guide Alignment Checks

| Check | What it detects | Audio guidance example |
|---|---|---|
| **Face in frame** | If your face is visible on screen | "Face not detected. Position yourself in front of the camera." |
| **Centering** | If you are centered horizontally | "Move slightly right" or "Move slightly left" |
| **Vertical position** | If you are seated too high or low | "Look slightly higher or raise your screen" |
| **Head tilt** | If your head is level | "Straighten your head — it's tilted" |
| **Distance** | If you are too close or too far | "Move back — you're too close" |
| **Lighting** | If the room is dark or excessively bright | "Too dark — turn on a light facing you" |

### 2. Smile Coach Analysis
- **Mouth Score**: Measures mouth width and lip curvature.
- **Eye Score**: Measures eye narrowing/engagement (Duchenne marker) to ensure a genuine smile.
- **Session Stats**: Tracks practice session time and the total seconds of high-quality smile held.

---

## Privacy & Offline Processing
- **100% Privacy**: All video and camera processing is executed locally in your browser using WASM (WebAssembly). No camera streams or images are ever uploaded to a server.
- **Offline First**: The application works completely offline after the initial page loads.

---

## Credits
- Built using [MediaPipe FaceMesh](https://google.github.io/mediapipe/solutions/face_mesh) and the native browser [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).
- Inspired by *Posture Sensei* by Kiara Lab.
