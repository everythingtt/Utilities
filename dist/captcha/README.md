```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║   ██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗  ║
║   ██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗ ║
║   ██║   ██║███████║██║   ██║██║     ██║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║ ║
║   ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║ ║
║    ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝ ║
║     ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ║
║                                                                             ║
║                    🛡️  VAULTGUARD™ CAPTCHA v2.0.0  🛡️                      ║
║                                                                             ║
║   Privacy-First • Zero Tracking • Cryptographically Secure                  ║
║                                                                             ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

# VaultGuard™ CAPTCHA

**A privacy-first, cryptographically secure CAPTCHA solution with client-server architecture.**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/everythingtt/Utilities)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/everythingtt/Utilities/blob/main/LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-zero%20tracking-brightgreen.svg)](https://everythingtt.github.io/Utilities/dist/captcha/privacy.html)

## ✨ Features

- 🔒 **Server-Side Answer Validation** - The server is the source of truth for challenge answers. Answers never leave the server.
- 👁️ **Zero Tracking** - No canvas fingerprinting, cookies, or user tracking
- 🚫 **No Client Dependencies** - Completely self-contained (server uses Node.js built-ins)
- ⏱️ **Time-Limited Challenges** - Configurable expiry (default 5 minutes)
- 🎯 **7 Challenge Types** - Math, text, pattern, image puzzle, text illusion, audio, and visual path
- 🎨 **Beautiful Branded UI** - Professional, accessible design
- 📦 **Single File Client** - Easy to deploy and integrate
- 🤖 **Anti-Bot Detection** - Behavioral analysis with trust scoring, honeypot fields, timing checks
- 🛡️ **Web Attack Protection** - XSS sanitization, CSRF tokens, clickjacking protection, tabnapping defense
- 🔍 **Rogue Extension Detection** - Scans for malicious browser extensions
- 🔐 **Security Headers** - CSP generation, recommended HTTP headers
- 🔄 **Double-Gate Validation** - Client-side (Gate 1) + Server-side (Gate 2) verification
- 📊 **Trust Scoring** - Behavioral signals sent to server for risk assessment
- 🔌 **Pluggable Storage** - Memory store (dev) or Redis store (production)
- ⛏️ **Proof-of-Work** - Hash-based PoW challenges force computational cost on bots (Hashcash-style)
- 📈 **Adaptive Difficulty** - PoW difficulty scales with trust score (suspicious clients get harder puzzles)
- 🚦 **Rate Limiting** - Sliding window rate limiter with automatic IP banning for abuse

## 🚀 Quick Start

### 🏗️ Architecture (v2.0)

```
┌─────────────────────────────────────────────────────────────┐
│                    VAULTGUARD™ v2.0                         │
│                                                             │
│  ┌──────────┐    POST /challenge     ┌──────────────────┐  │
│  │          │ ──────────────────────► │                  │  │
│  │  Client  │    { id, question }     │  Server          │  │
│  │          │ ◄────────────────────── │  (Source of      │  │
│  │  captcha │                         │   Truth)         │  │
│  │  .js     │    POST /verify         │                  │  │
│  │          │ ──────────────────────► │  vaultguard-     │  │
│  │          │  { id, answer }         │  server.js       │  │
│  │          │ ◄────────────────────── │                  │  │
│  │          │  { verified, score }    │  Memory / Redis  │  │
│  └──────────┘                         └──────────────────┘  │
│                                                             │
│  Gate 1: Client-side security (honeypot, behavioral, CSRF)  │
│  Gate 2: Server-side answer validation (source of truth)    │
└─────────────────────────────────────────────────────────────┘
```

### Server Setup (Required for Production)

```bash
npm install express express-session
# For production: npm install redis
```

```javascript
// server.js
const express = require('express');
const vaultGuard = require('./vaultguard-server');

const app = express();
app.use(express.json());

// VaultGuard middleware — adds req.vaultGuard methods
app.use(vaultGuard.middleware({
  secret: 'your-secret-key',
  ttl: 300000,
  // redis: redisClient, // Uncomment for production
}));

// Challenge endpoint — generates challenge, stores answer server-side
app.post('/api/vaultguard/challenge', (req, res) => {
  const challenge = req.vaultGuard.generateChallenge(req.sessionID);
  res.json(challenge);
});

// Verify endpoint — server checks answer against stored value
app.post('/api/vaultguard/verify', (req, res) => {
  const { challengeId, answer, behavioral } = req.body;
  const result = req.vaultGuard.verifyAnswer(challengeId, answer, behavioral, req.sessionID);
  res.json(result);
});

app.listen(3000);
```

### Browser (with Server — Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <title>VaultGuard CAPTCHA Demo</title>
</head>
<body>
  <div id="captcha-container"></div>

  <script src="captcha.js"></script>
  <script>
    VaultGuard.quickSetup('captcha-container', {
      captcha: {
        serverUrl: '/api/vaultguard',  // ← Enable server mode
        expiryTime: 300000,
        maxAttempts: 3,
        enableBotDetection: true,
        enableCSRF: true,
        enableHoneypot: true
      },
      security: {
        enableBehavioralTracking: true,
        enableFrameBusting: true,
        enableTabnappingProtection: true,
        enableExtensionDetection: true,
        enableCSP: true
      },
      callbacks: {
        onSuccess: (result, id) => {
          console.log('Verified! Trust score:', result.trustScore);
        },
        onError: (result, id) => {
          console.log('Failed:', result.error);
        }
      }
    });
  </script>
</body>
</html>
```

### Browser (Client-Side Only — Demo/Prototyping)

> ⚠️ **Warning:** Client-side mode stores answers in the browser. This is vulnerable to bots that read JavaScript variables. Always use server mode for production.

```html
<div id="captcha-container"></div>
<script src="captcha.js"></script>
<script>
  VaultGuard.quickSetup('captcha-container', {
    captcha: {
      // No serverUrl = client-side mode (not recommended for production)
      enableBotDetection: true,
      enableHoneypot: true
    },
    callbacks: {
      onSuccess: (result) => console.log('Verified!'),
      onError: (result) => console.log('Failed:', result.error)
    }
  });
</script>
```

### Browser (Module)

```javascript
import VaultGuard from './captcha.js';

const { captcha, controller } = await VaultGuard.quickSetup('captcha-container', {
  callbacks: {
    onSuccess: (result) => console.log('Verified!'),
    onError: (result) => console.log('Failed:', result.error)
  }
});

// Reload challenge manually
controller.reload();
```

### Node.js Server

```javascript
const vaultGuard = require('./vaultguard-server');

// Create server instance
const vg = vaultGuard.create({
  secret: 'your-secret-key',
  ttl: 300000,
  maxAttempts: 3,
  // redis: redisClient, // For production
});

// Generate challenge (answer stored server-side)
const challenge = vg.generateChallenge();
console.log(challenge.question); // "What is 12 + 7?"
// challenge.answer is NOT included — only the server knows it

// Verify answer (server compares against stored answer)
const result = vg.verifyAnswer(challenge.id, '19');
console.log(result.verified); // true
console.log(result.trustScore); // 0.0 - 1.0
```

### Node.js Client (Serverless Mode)

```javascript
const VaultGuard = require('./captcha.js');

const captcha = new VaultGuard.Captcha();

// Generate challenge
const challenge = await captcha.generateChallenge();
console.log(challenge.question);

// Verify answer
const result = await captcha.verifyAnswer(challenge.id, '42');
console.log(result.success); // true or false
```

## ⛏️ Proof-of-Work (PoW)

VaultGuard™ uses a Hashcash-style Proof-of-Work system to impose a computational cost on each challenge request. This makes large-scale bot attacks expensive — while a human solving one challenge per form submission barely notices the CPU work, an attacker trying millions of requests faces prohibitive compute costs.

### How It Works

```
Server                              Client
  │                                    │
  │  1. Generate challenge + secret    │
  │  2. Store secret server-side       │
  │  3. Send { challenge, difficulty } │
  │ ──────────────────────────────────►│
  │                                    │  4. Find nonce where
  │                                    │     SHA-256(secret + nonce)
  │                                    │     starts with N zeros
  │                                    │
  │  6. Verify: hash(secret + nonce)   │
  │     starts with N zeros?           │
  │ ◄──────────────────────────────────│  5. Send { nonce, elapsedMs }
  │                                    │
  │  7. Also check elapsedMs is        │
  │     reasonable (anti-precompute)   │
```

### Difficulty Levels

| Difficulty | Leading Zeros | Avg Attempts | Avg Time (modern CPU) | Use Case |
|---|---|---|---|---|
| 1 | 1 hex char | 16 | <0.1s | Testing only |
| 2 | 2 hex chars | 256 | ~0.5s | Low security |
| 3 | 3 hex chars | 4,096 | ~2s | **Default** |
| 4 | 4 hex chars | 65,536 | ~15s | High security |
| 5 | 5 hex chars | 1,048,576 | ~5min | Paranoid mode |

### Adaptive Difficulty

When `adaptivePow` is enabled (default), the server adjusts PoW difficulty based on the client's trust score:

| Trust Score | Difficulty Adjustment |
|---|---|
| ≥ 0.8 (trusted) | −1 level (easier) |
| ≥ 0.5 (normal) | Base difficulty |
| ≥ 0.3 (suspicious) | +1 level (harder) |
| < 0.3 (very suspicious) | +2 levels (much harder) |

### Configuration

```javascript
app.use(vaultGuard.middleware({
  pow: true,              // Enable PoW (default: true)
  powDifficulty: 3,       // Base difficulty 1-5 (default: 3)
  adaptivePow: true       // Scale difficulty by trust score (default: true)
}));
```

### Client-Side Behavior

- PoW solving runs **in the background** while the user interacts with the challenge
- The UI shows "Computing proof-of-work..." if the user submits before PoW completes
- The solver yields to the main thread every 5,000 attempts to keep the UI responsive
- Maximum wait time: 60 seconds (after which the user can retry)

### Server-Side Verification

The server verifies:
1. **Hash validity**: `SHA-256(secret + nonce)` starts with the required number of zeros
2. **Minimum time**: The solution wasn't computed impossibly fast (pre-computation detection)
3. **One-time use**: Each PoW challenge is deleted after verification (replay prevention)

## 📖 API Reference

### `VaultGuard.quickSetup(containerId, options)`

Quick setup helper that creates and initializes a CAPTCHA form.

**Parameters:**
- `containerId` (string) - ID of the container element
- `options` (object) - Configuration options
  - `captcha` (object) - CAPTCHA instance options
  - `callbacks` (object) - Event callbacks
    - `onSuccess(result, challengeId)` - Called on successful verification
    - `onError(result, challengeId)` - Called on verification failure
    - `onChallengeLoaded(challenge)` - Called when new challenge loads

**Returns:** `Promise<{ captcha, form, controller }>`

```javascript
const { captcha, form, controller } = await VaultGuard.quickSetup('container', {
  captcha: {
    expiryTime: 600000,  // 10 minutes
    maxAttempts: 5
  },
  callbacks: {
    onSuccess: (result, id) => alert('Verified!'),
    onError: (result, id) => alert('Failed: ' + result.error)
  }
});
```

---

### `new VaultGuard.Captcha(options)`

Create a new CAPTCHA instance.

**Parameters:**
- `options` (object)
  - `difficulty` (string) - `'easy'`, `'medium'`, or `'hard'` (default: `'medium'`)
  - `expiryTime` (number) - Challenge expiry in milliseconds (default: `300000`)
  - `maxAttempts` (number) - Maximum verification attempts (default: `3`)
  - `challengeTypes` (string[]) - Available types: `'math'`, `'text'`, `'pattern'`, `'imagePuzzle'` (default: all)
  - `enableBotDetection` (boolean) - Enable behavioral bot detection (default: `true`)
  - `enableCSRF` (boolean) - Enable CSRF token protection (default: `true`)
  - `enableFingerprintBinding` (boolean) - Bind challenges to browser fingerprint (default: `true`)
  - `enableHoneypot` (boolean) - Deploy honeypot fields in forms (default: `true`)
  - `botScoreThreshold` (number) - Bot score threshold 0.0-1.0 (default: `0.5`)

```javascript
const captcha = new VaultGuard.Captcha({
  difficulty: 'hard',
  expiryTime: 600000,
  maxAttempts: 5,
  challengeTypes: ['math', 'text', 'imagePuzzle'],
  enableBotDetection: true,
  enableCSRF: true,
  enableFingerprintBinding: true,
  enableHoneypot: true,
  botScoreThreshold: 0.5
});
```

---

### `captcha.generateChallenge()`

Generate a new verification challenge.

**Returns:** `Promise<{ id, question, type, expiresIn }>`

```javascript
const challenge = await captcha.generateChallenge();
// {
//   id: 'a1b2c3d4e5f6...',
//   question: 'What is 12 + 5?',
//   type: 'math',
//   expiresIn: 300000
// }
```

---

### `captcha.verifyAnswer(challengeId, userAnswer, formElement?)`

Verify user's answer to a challenge.

**Parameters:**
- `challengeId` (string) - The challenge ID
- `userAnswer` (string) - User's answer
- `formElement` (HTMLFormElement, optional) - The form element. When provided, enables honeypot checking, CSRF validation, and fingerprint verification.

**Returns:** `Promise<{ success, verified?, error?, remainingAttempts?, securityFlag? }>`

```javascript
const result = await captcha.verifyAnswer(challenge.id, '17', formElement);
// { success: true, verified: true, brand: 'VaultGuard™' }

const failed = await captcha.verifyAnswer(challenge.id, '99', formElement);
// { success: false, error: 'Incorrect answer', remainingAttempts: 2, brand: 'VaultGuard™' }

// Security flag responses:
// { success: false, error: 'Automated submission detected', securityFlag: 'honeypot_triggered' }
// { success: false, error: 'Security token invalid...', securityFlag: 'csrf_failed' }
// { success: false, error: 'Automated behavior detected...', securityFlag: 'bot_detected' }
// { success: false, error: 'Session binding failed...', securityFlag: 'fingerprint_mismatch' }
```

---

### `captcha.getChallengeStatus(challengeId)`

Get the status of a challenge.

**Returns:** `{ exists, expired, solved, attempts, maxAttempts, type, brand }`

```javascript
const status = captcha.getChallengeStatus(challenge.id);
// { exists: true, expired: false, solved: false, attempts: 1, maxAttempts: 3, type: 'math' }
```

---

### `captcha.invalidateChallenge(challengeId)`

Manually invalidate a challenge.

```javascript
captcha.invalidateChallenge(challenge.id);
```

---

### `captcha.getStats()`

Get library statistics.

**Returns:** `{ activeChallenges, totalAttempts, brand, version }`

```javascript
const stats = captcha.getStats();
// { activeChallenges: 5, totalAttempts: 12, brand: 'VaultGuard™', version: '1.0.0' }
```

---

### `captcha.reset()`

Reset all challenges and attempts.

```javascript
captcha.reset();
```

---

### `VaultGuard.getVersion()`

Get version information.

**Returns:** `{ name, product, version, codename, fullVersion }`

```javascript
const version = VaultGuard.getVersion();
// {
//   name: 'VaultGuard™',
//   product: 'CAPTCHA',
//   version: '1.0.0',
//   codename: 'Aegis',
//   fullVersion: 'VaultGuard™ CAPTCHA v1.0.0 "Aegis"'
// }
```

## 🎨 Challenge Types

VaultGuard supports 7 challenge types, all generated client-side with zero external requests:

### Math Challenges
Simple arithmetic problems:
- Addition: `What is 12 + 5?`
- Subtraction: `What is 30 - 15?`
- Multiplication: `What is 7 × 8?`

### Text Challenges
Word manipulation tasks:
- Reverse: `Reverse this word: "apple"`
- First letter: `What is the first letter of "banana"?`
- Last letter: `What is the last letter of "cherry"?`
- Letter count: `How many letters in "dragon"?`

### Pattern Challenges
Visual pattern completion:
- `Complete the pattern: ○ ● □ ■ ___`

### Image Puzzle Challenges
"Select all X" grid-based challenges with 9 real photographs. Users select all images matching a category (cars, traffic lights, crosswalks, etc.). Images are loaded from LoremFlickr with deterministic locking.

### Text Illusion Challenges ✨
A word is rendered onto an HTML5 Canvas using `globalCompositeOperation` masking, noise overlays, and distortion lines. The answer text is **never present in the DOM** — only as pixel data on the canvas. This makes it impossible for standard bots to scrape the answer via DOM traversal, and OCR requires full canvas rendering.

**Security properties:**
- Answer is pixel data only — not in DOM, not in data attributes
- Canvas uses `willReadFrequently: false` to prevent read-back timing attacks
- Multiple composite operation layers resist simple image processing
- 30 possible words, randomly selected

### Audio Challenges ✨
Digits are synthesized entirely client-side using the Web Audio API — no audio files, no external requests. Uses DTMF-like dual-tone frequencies with added noise masking. An audio visualizer shows playback activity.

**Security properties:**
- Zero network requests for audio data
- Uses `OfflineAudioContext` for deterministic rendering
- Noise masking at 18% level resists simple frequency analysis
- 4-digit sequences from 10,000 possibilities
- No PII transmitted — fully GDPR Article 25 compliant

**Browser support:** Chrome 35+, Firefox 25+, Safari 14.1+, Edge 79+. Falls back gracefully — if Web Audio API is unavailable, VaultGuard selects a different challenge type.

### Visual Path Challenges ✨
A curved path (wave, spiral, zigzag, or arc) is rendered on canvas. The user must trace from Start (S) to End (E) using mouse or touch. The system records pointer coordinates, timing, and velocity for behavioral analysis.

**Verification criteria:**
- **Path coverage**: ≥75% of the path must be traced within tolerance
- **Velocity variance**: Human hand tremor produces natural speed variation (CV ≥ 0.05)
- **Direction changes**: Natural tracing has frequent micro-direction changes (rate ≥ 2%)
- **Timing**: Minimum duration based on point count prevents instant submission
- **Point density**: Minimum 20 trace points required

**Security properties:**
- Path geometry is verified client-side with behavioral analysis
- Bot-nets struggle to mimic natural human hand tremor and acceleration curves
- `Object.freeze()` on path data prevents accidental mutation
- Touch and pointer events supported for mobile accessibility

## ⚙️ Configuration Examples

### Basic Setup
```javascript
const captcha = new VaultGuard.Captcha();
```

### High Security
```javascript
const captcha = new VaultGuard.Captcha({
  difficulty: 'hard',
  expiryTime: 180000,
  maxAttempts: 2,
  challengeTypes: ['textIllusion', 'visualPath', 'audio'],
  enableBotDetection: true,
  enableCSRF: true,
  enableFingerprintBinding: true
});
```

### Accessibility-Focused
```javascript
const captcha = new VaultGuard.Captcha({
  challengeTypes: ['audio', 'math'],
  // Audio for visually impaired users, math as fallback
});
```

### Maximum Bot Resistance
```javascript
const captcha = new VaultGuard.Captcha({
  challengeTypes: ['visualPath', 'textIllusion', 'audio', 'imagePuzzle'],
  enableBotDetection: true,
  botScoreThreshold: 0.3,
  enableHoneypot: true,
  enableFingerprintBinding: true
});
```

## 🔐 Security Features

### Core CAPTCHA Security

- **SHA-256 Hashing**: Answers are hashed with unique salts
- **Time-Limited Challenges**: Automatic expiry prevents replay attacks
- **Attempt Limiting**: Configurable maximum attempts prevent brute force
- **Secure Random**: Cryptographically secure random number generation
- **No Answer Storage**: Answers are never stored in plain text

### Anti-Bot / Anti-Automation Detection

Behavioral analysis distinguishes humans from automated scripts by monitoring mouse movement patterns, keystroke dynamics, touch events, and timing anomalies. Honeypot fields (invisible to humans) catch bots that blindly fill all form inputs.

```javascript
const captcha = new VaultGuard.Captcha({
  enableBotDetection: true,
  botScoreThreshold: 0.5  // 0.0 = lenient, 1.0 = strict
});
```

**Detection heuristics:**
- Zero mouse movements with form submission
- Perfectly linear mouse trajectories (bots move in straight lines)
- Keystroke intervals with very low variance (machine-like uniformity)
- Submission faster than a human could read and answer
- No touch events on touch-capable devices

### CSRF Protection

Cryptographically random tokens bound to each session with constant-time comparison to prevent timing attacks. Tokens expire after 1 hour.

```javascript
const captcha = new VaultGuard.Captcha({
  enableCSRF: true
});
```

### Session Hijack Protection

Browser fingerprinting via canvas rendering and navigator properties binds each challenge to the browser session. Stolen tokens are useless from a different browser or device.

```javascript
const captcha = new VaultGuard.Captcha({
  enableFingerprintBinding: true
});
```

### Honeypot Fields

Invisible form fields that bots fill out but humans cannot see. Any filled honeypot field immediately flags the submission as automated.

```javascript
const captcha = new VaultGuard.Captcha({
  enableHoneypot: true
});
```

---

## 🛡️ Web Protection Features

The `VaultGuard.Security` module provides client-side protections against common web attacks. Initialize via the `security` option in `quickSetup`:

```javascript
VaultGuard.quickSetup('captcha-container', {
  security: {
    enableBehavioralTracking: true,
    enableFrameBusting: true,
    enableTabnappingProtection: true,
    enableExtensionDetection: true,
    enableCSP: true,
    enableSecurityMetas: true
  }
});
```

### XSS Protection

Input sanitization encodes HTML entities, neutralizes `javascript:` and `data:` URI schemes, and strips event handler patterns. Content Security Policy meta tags restrict resource loading.

```javascript
// Sanitize user input
const safe = VaultGuard.Security.sanitizeInput(userInput);

// Safely set text on an element
VaultGuard.Security.safeSetText(element, userInput);

// Generate CSP header value
const csp = VaultGuard.Security.generateCSP({
  'script-src': ["'self'", "'nonce-abc123'"]
});
```

### Clickjacking Protection

Frame-busting JavaScript prevents the page from being loaded in iframes. MutationObserver monitors for injected untrusted iframe elements and removes them.

```javascript
VaultGuard.Security.injectFrameBuster();

// Recommended server header
// X-Frame-Options: DENY
```

### Tabnapping Protection

Clears `window.opener` references, sets strict referrer policy, and wraps `window.open` to add `noopener`/`noreferrer` to external links.

```javascript
VaultGuard.Security.protectAgainstTabnapping();
VaultGuard.Security.secureExternalLinks();
```

### Rogue Extension Detection

Scans for suspicious DOM modifications, injected scripts from unknown sources, and unexpected global variables commonly injected by malicious browser extensions.

```javascript
const result = VaultGuard.Security.detectRogueExtensions();
// {
//   detected: true,
//   findings: [
//     { type: 'external_script', src: 'https://evil.com/inject.js', severity: 'high' },
//     { type: 'suspicious_globals', globals: ['__phantom'], severity: 'medium' }
//   ],
//   riskLevel: 'high'
// }
```

### Security Headers

Generates recommended HTTP headers. These should be configured on the server side:

```javascript
const headers = VaultGuard.Security.getRecommendedHeaders();
// {
//   'X-Content-Type-Options': 'nosniff',
//   'X-Frame-Options': 'DENY',
//   'X-XSS-Protection': '1; mode=block',
//   'Referrer-Policy': 'strict-origin-when-cross-origin',
//   'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
//   'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
//   'Content-Security-Policy': "default-src 'self'; ..."
// }
```

### Security Module API Reference

| Method | Description |
|--------|-------------|
| `Security.init(options)` | Initialize all client-side protections |
| `Security.initBehavioralTracking()` | Start monitoring mouse/key/touch events |
| `Security.analyzeBehavior()` | Returns `{ score, signals, isBot }` |
| `Security.deployHoneypot(form)` | Add invisible honeypot fields to a form |
| `Security.checkHoneypot(form)` | Returns `true` if a honeypot was filled |
| `Security.sanitizeInput(input)` | XSS-safe encoding of user input |
| `Security.safeSetText(el, text)` | Safe DOM text insertion |
| `Security.generateCSP(rules)` | Generate CSP header value |
| `Security.injectCSPMeta()` | Inject CSP meta tag |
| `Security.generateCSRFToken()` | Create session-bound CSRF token |
| `Security.validateCSRFToken(token)` | Validate a CSRF token |
| `Security.injectCSRFField(form)` | Add hidden CSRF field to form |
| `Security.injectFrameBuster()` | Frame-breaking + iframe detection |
| `Security.generateFingerprint()` | Browser fingerprint hash |
| `Security.verifyFingerprint(fp)` | Verify fingerprint matches |
| `Security.bindChallengeToSession(id)` | Bind challenge to fingerprint |
| `Security.verifyChallengeSession(id)` | Verify challenge session binding |
| `Security.protectAgainstTabnapping()` | Clear opener, set referrer policy |
| `Security.secureExternalLinks()` | Add noopener/noreferrer to links |
| `Security.detectRogueExtensions()` | Scan for malicious extensions |
| `Security.getRecommendedHeaders()` | Get recommended HTTP headers |
| `Security.injectSecurityMetas()` | Inject security meta tags |

## 🛡️ Privacy Features

- **Zero Tracking**: No fingerprinting or user tracking
- **No Cookies**: No cookies are set or read
- **No External Requests**: All processing happens locally
- **No Data Collection**: No personal data is collected or stored
- **Self-Contained**: No external dependencies or CDN requests

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Opera 47+

**Note:** Requires Web Crypto API support (all modern browsers).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

```
Copyright 2024 VaultGuard Technologies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🪝 Hooks System

VaultGuard includes a built-in hooks system for extending behavior at key lifecycle points. All hooks are optional, fire asynchronously, and errors are caught so they never break the CAPTCHA flow.

### Available Hooks

| Hook | Fired When |
|------|-----------|
| `onChallengeGenerated` | A new challenge is created |
| `onChallengeExpired` | A challenge expires before being solved |
| `onClientVerified` | Client-side verification passes (Gate 1) |
| `onServerVerified` | Server-side verification passes (Gate 2) |
| `onServerRejected` | Server rejects a client-verified challenge |
| `onSecurityFlag` | Any security check triggers a flag |
| `onBotDetected` | Behavioral analysis flags a bot |
| `onHoneypotTriggered` | A honeypot field is filled |
| `onCSRFInvalid` | CSRF validation fails |
| `onFingerprintMismatch` | Browser fingerprint doesn't match |
| `onImageLoadFailed` | An image puzzle image fails to load |
| `onImageRetry` | An image puzzle retries loading |
| `onMaxAttemptsExceeded` | Max attempts are exceeded |
| `onSuccess` | Fully verified success (both gates passed) |
| `onError` | Any verification error |

### Basic Usage

```javascript
const hooks = new VaultGuard.Hooks();

hooks.on('onBotDetected', (data) => {
  console.log('Bot detected! Score:', data.score);
  console.log('Signals:', data.signals);
});

hooks.on('onHoneypotTriggered', (data) => {
  console.log('Honeypot triggered for challenge:', data.challengeId);
});

hooks.on('onSuccess', (data) => {
  console.log('Verified! Server gate:', data.serverVerified);
});

hooks.on('onError', (data) => {
  console.log('Error:', data.error);
});

// Attach to captcha instance
const captcha = new VaultGuard.Captcha({ hooks });
```

### Global Handler

Listen to all hook events:

```javascript
const hooks = new VaultGuard.Hooks();

hooks.onAny((data) => {
  console.log(`[${data.event}]`, data);
});
```

### Chaining

```javascript
const hooks = new VaultGuard.Hooks()
  .on('onBotDetected', handleBot)
  .on('onSuccess', handleSuccess)
  .on('onError', handleError);
```

---

## 🔄 Double-Gate Validation (Server Extension)

VaultGuard works **fully serverless by default**. For enhanced security, the optional `ServerExtension` adds a second validation gate:

- **Gate 1 (Client)**: Challenge is generated and verified locally in the browser
- **Gate 2 (Server)**: The server independently re-verifies the challenge answer

This prevents attackers from bypassing client-side validation, as the server performs its own verification.

### Setup

```javascript
// 1. Create captcha instance
const captcha = new VaultGuard.Captcha({
  expiryTime: 300000,
  maxAttempts: 3
});

// 2. Create server extension
const server = new VaultGuard.ServerExtension({
  endpoint: '/api/vaultguard',
  secret: 'your-server-secret',
  timeout: 10000,
  retries: 2
});

// 3. Attach to captcha (this wraps verifyAnswer with Double-Gate)
server.attach(captcha);

// 4. Optionally attach hooks
const hooks = new VaultGuard.Hooks();
hooks.on('onServerVerified', (data) => {
  console.log('Both gates passed!');
});
hooks.on('onServerRejected', (data) => {
  console.log('Server rejected:', data.error);
});
server.setHooks(hooks);
```

### Server Endpoint Contract

Your server endpoint receives:

```json
{
  "challengeId": "abc123...",
  "answer": "42",
  "clientToken": "sha256hash...",
  "fingerprint": "browser-fingerprint-hash",
  "timestamp": 1234567890
}
```

Your server responds:

```json
// Success
{ "valid": true, "serverToken": "optional-token-for-client" }

// Rejection
{ "valid": false, "error": "Reason for rejection" }
```

### Server Extension Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | string | `/api/vaultguard` | Server verification endpoint |
| `secret` | string | `''` | Shared secret for server communication |
| `timeout` | number | `10000` | Request timeout in ms |
| `retries` | number | `2` | Number of retry attempts |
| `retryDelay` | number | `1000` | Delay between retries (ms) |
| `enabled` | boolean | `true` | Enable/disable server verification |
| `hooks` | Hooks | `null` | VaultGuard Hooks instance |
| `onServerVerified` | function | `null` | Legacy callback for server verification |
| `onServerError` | function | `null` | Legacy callback for server errors |

### Disabling Server Gate

```javascript
// Temporarily disable (falls back to client-only)
server.disable();

// Re-enable
server.enable();

// Check status
server.isEnabled(); // true/false
```

### Error Handling

When the server is unreachable after all retries, the verification fails with `securityFlag: 'server_rejected'`. Your hook or callback can handle this gracefully:

```javascript
hooks.on('onServerRejected', (data) => {
  if (data.error.includes('unavailable')) {
    // Server is down — optionally allow client-only verification
    console.warn('Server verification unavailable');
  }
});
```

---

## 🔗 Links

- **Website**: https://everythingtt.github.io/Utilities/dist/captcha/
- **Documentation**: https://github.com/everythingtt/Utilities
- **GitHub**: https://github.com/everythingtt/Utilities
- **Issues**: https://github.com/everythingtt/Utilities/issues

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📧 Contact

- **GitHub**: https://github.com/everythingtt/Utilities
- **Twitter**: [@VaultGuardCaptcha](https://twitter.com/VaultGuardCaptcha)

---

<p align="center">
  <strong>Protected by VaultGuard™ CAPTCHA</strong><br>
  <em>Privacy-First • Zero Tracking • Cryptographically Secure</em>
</p>
