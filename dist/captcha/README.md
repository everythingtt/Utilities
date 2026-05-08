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
- 🎯 **Multiple Challenge Types** - Math, text, and pattern challenges
- 🎨 **Beautiful Branded UI** - Professional, accessible design
- 📦 **Single File** - Easy to deploy and integrate

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
      callbacks: {
        onSuccess: (result, id) => {
          console.log('Verified!', result);
          // Proceed with form submission
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
  - `challengeTypes` (string[]) - Available types: `'math'`, `'text'`, `'pattern'` (default: all)

```javascript
const captcha = new VaultGuard.Captcha({
  difficulty: 'hard',
  expiryTime: 600000,
  maxAttempts: 5,
  challengeTypes: ['math', 'text']
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

### `captcha.verifyAnswer(challengeId, userAnswer)`

Verify user's answer to a challenge.

**Parameters:**
- `challengeId` (string) - The challenge ID
- `userAnswer` (string) - User's answer

**Returns:** `Promise<{ success, verified?, error?, remainingAttempts? }>`

```javascript
const result = await captcha.verifyAnswer(challenge.id, '17');
// { success: true, verified: true, brand: 'VaultGuard™' }

const failed = await captcha.verifyAnswer(challenge.id, '99');
// { success: false, error: 'Incorrect answer', remainingAttempts: 2, brand: 'VaultGuard™' }
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

- **SHA-256 Hashing**: Answers are hashed with unique salts
- **Time-Limited Challenges**: Automatic expiry prevents replay attacks
- **Attempt Limiting**: Configurable maximum attempts prevent brute force
- **Secure Random**: Cryptographically secure random number generation
- **No Answer Storage**: Answers are never stored in plain text

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
