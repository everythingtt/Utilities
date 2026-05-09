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
║                    🛡️  VAULTGUARD™ CAPTCHA v1.0.0  🛡️                      ║
║                                                                             ║
║   Privacy-First • Zero Tracking • Cryptographically Secure                  ║
║                                                                             ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

# VaultGuard™ CAPTCHA

**A privacy-first, cryptographically secure CAPTCHA solution in a single file.**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/vaultguard/captcha)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-zero%20tracking-brightgreen.svg)](https://vaultguard-captcha.dev/privacy)

## ✨ Features

- 🔒 **Cryptographic Security** - SHA-256 hashing with secret salts
- 👁️ **Zero Tracking** - No fingerprinting, cookies, or user tracking
- 🚫 **No Dependencies** - Completely self-contained
- ⏱️ **Time-Limited Challenges** - Configurable expiry (default 5 minutes)
- 🎯 **Multiple Challenge Types** - Math, text, pattern, and image puzzle challenges
- 🎨 **Beautiful Branded UI** - Professional, accessible design
- 📦 **Single File** - Easy to deploy and integrate
- 🤖 **Anti-Bot Detection** - Behavioral analysis, honeypot fields, timing checks
- 🛡️ **Web Attack Protection** - XSS, CSRF, clickjacking, session hijack, tabnapping
- 🔍 **Rogue Extension Detection** - Scans for malicious browser extensions
- 🔐 **Security Headers** - CSP generation, recommended HTTP headers

## 🚀 Quick Start

### Browser (CDN)

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
        expiryTime: 300000,
        maxAttempts: 3,
        enableBotDetection: true,
        enableCSRF: true,
        enableFingerprintBinding: true,
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
          console.log('Verified!', result);
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

### Node.js

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

## ⚙️ Configuration Examples

### Basic Setup
```javascript
const captcha = new VaultGuard.Captcha();
```

### High Security
```javascript
const captcha = new VaultGuard.Captcha({
  difficulty: 'hard',
  expiryTime: 180000,    // 3 minutes
  maxAttempts: 2,        // Only 2 attempts
  challengeTypes: ['math', 'text']  // No pattern challenges
});
```

### Relaxed Security
```javascript
const captcha = new VaultGuard.Captcha({
  difficulty: 'easy',
  expiryTime: 600000,    // 10 minutes
  maxAttempts: 5,        // 5 attempts
  challengeTypes: ['math']  // Only math
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

## 🔗 Links

- **Website**: https://vaultguard-captcha.dev
- **Documentation**: https://docs.vaultguard-captcha.dev
- **GitHub**: https://github.com/vaultguard/captcha
- **Issues**: https://github.com/vaultguard/captcha/issues

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📧 Contact

- **Email**: support@vaultguard-captcha.dev
- **Twitter**: [@VaultGuardCaptcha](https://twitter.com/VaultGuardCaptcha)

---

<p align="center">
  <strong>Protected by VaultGuard™ CAPTCHA</strong><br>
  <em>Privacy-First • Zero Tracking • Cryptographically Secure</em>
</p>
