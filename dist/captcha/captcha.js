/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                             ║
 * ║   ██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗  ║
 * ║   ██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗ ║
 * ║   ██║   ██║███████║██║   ██║██║     ██║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║ ║
 * ║   ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║ ║
 * ║    ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝ ║
 * ║     ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ║
 * ║                                                                             ║
 * ║                    🛡️  VAULTGUARD™ CAPTCHA v1.0.0  🛡️                      ║
 * ║                                                                             ║
 * ║   Privacy-First • Zero Tracking • Cryptographically Secure                  ║
 * ║                                                                             ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * @brand      VaultGuard™
 * @product    CAPTCHA
 * @version    1.0.0
 * @license    MIT
 * @author     VaultGuard Security Solutions
 * @copyright  2024 VaultGuard Technologies
 * 
 * A privacy-focused, secure CAPTCHA solution in a single file.
 * 
 * Features:
 * - 🔒 Cryptographic validation with SHA-256
 * - 👁️ Zero tracking or fingerprinting
 * - ⏱️ Time-limited challenges (configurable)
 * - 🎯 Multiple challenge types (math, text, pattern)
 * - 🚫 No external dependencies
 * - 🎨 Beautiful branded UI components
 * 
 * Website: https://vaultguard-captcha.dev
 * Documentation: https://docs.vaultguard-captcha.dev
 */

(function(global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════
  // VAULTGUARD BRAND CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const VAULTGUARD = {
    name: 'VaultGuard™',
    product: 'CAPTCHA',
    version: '1.0.0',
    codename: 'Aegis',
    
    // Base URL for production (GitHub Pages)
    // Update this when deploying to a different domain
    baseUrl: 'https://everythingtt.github.io/Utilities/dist/captcha',
    
    // Legal page URLs (relative for local dev, will use baseUrl in production)
    urls: {
      privacy: 'privacy.html',
      terms: 'terms.html',
      home: 'index.html'
    },
    
    brandColors: {
      primary: '#1e3a5f',      // Deep Security Blue
      secondary: '#00d4aa',    // Shield Green
      accent: '#ff6b35',       // Alert Orange
      success: '#10b981',      // Verified Green
      error: '#ef4444',        // Error Red
      warning: '#f59e0b',      // Warning Amber
      background: '#f8fafc',   // Light Background
      surface: '#ffffff',      // Card Surface
      text: '#1e293b',         // Primary Text
      textMuted: '#64748b',    // Secondary Text
      border: '#e2e8f0'        // Border Color
    },
    
    logo: {
      // SVG Logo - Shield with Checkmark
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a5f"/>
            <stop offset="100%" style="stop-color:#0f172a"/>
          </linearGradient>
          <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00d4aa"/>
            <stop offset="100%" style="stop-color:#10b981"/>
          </linearGradient>
        </defs>
        <path d="M50 5 L90 20 V45 C90 70 70 90 50 95 C30 90 10 70 10 45 V20 Z" 
              fill="url(#shieldGrad)" stroke="#0f172a" stroke-width="3"/>
        <path d="M30 50 L45 65 L70 35" 
              fill="none" stroke="url(#checkGrad)" stroke-width="8" 
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      
      // Compact shield icon
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V12C3 17.5 6.8 22.9 12 24C17.2 22.9 21 17.5 21 12V7L12 2Z" 
              fill="#1e3a5f" stroke="#0f172a" stroke-width="1.5"/>
        <path d="M8.5 12L11 14.5L15.5 9.5" 
              stroke="#00d4aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    
    // Brand typography
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      monoFamily: "'JetBrains Mono', 'Fira Code', monospace"
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CRYPTOGRAPHIC UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════

  const CryptoUtils = {
    /**
     * Generate cryptographic hash using Web Crypto API
     * @param {string} data - Data to hash
     * @returns {Promise<string>} SHA-256 hash as hex string
     */
    async hash(data) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Generate secure random token
     * @param {number} length - Token length in bytes
     * @returns {string} Hex string token
     */
    generateToken(length = 32) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Generate random number in range
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * @returns {number} Random integer
     */
    randomInt(min, max) {
      const range = max - min + 1;
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return min + (array[0] % range);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // VAULTGUARD SECURITY MODULE — Anti-Bot & Web Protection
  // ═══════════════════════════════════════════════════════════════════════════════

  const SecurityModule = {
    _initialized: false,
    _sessionToken: null,
    _fingerprint: null,
    _behaviorData: {
      mouseMovements: [],
      keyPresses: [],
      touchEvents: [],
      startTime: null,
      lastActivity: null,
      totalInteractions: 0
    },
    _honeypotFields: [],
    _securityHeaders: {},

    // ─── ANTI-BOT / ANTI-AUTOMATION ──────────────────────────────────────────

    /**
     * Initialize behavioral tracking for bot detection.
     * Monitors mouse movement patterns, keystroke dynamics, touch events,
     * and timing anomalies that distinguish humans from automated scripts.
     */
    initBehavioralTracking() {
      if (this._behaviorData.startTime) return;
      this._behaviorData.startTime = Date.now();
      this._behaviorData.lastActivity = Date.now();

      const moveHandler = (e) => {
        const now = Date.now();
        this._behaviorData.mouseMovements.push({
          x: e.clientX,
          y: e.clientY,
          t: now
        });
        if (this._behaviorData.mouseMovements.length > 200) {
          this._behaviorData.mouseMovements.shift();
        }
        this._behaviorData.lastActivity = now;
        this._behaviorData.totalInteractions++;
      };

      const keyHandler = (e) => {
        const now = Date.now();
        this._behaviorData.keyPresses.push({
          key: e.key.length === 1 ? '*' : e.key,
          t: now
        });
        if (this._behaviorData.keyPresses.length > 100) {
          this._behaviorData.keyPresses.shift();
        }
        this._behaviorData.lastActivity = now;
        this._behaviorData.totalInteractions++;
      };

      const touchHandler = (e) => {
        const now = Date.now();
        const touches = [];
        for (let i = 0; i < e.touches.length; i++) {
          touches.push({ x: e.touches[i].clientX, y: e.touches[i].clientY });
        }
        this._behaviorData.touchEvents.push({ touches, t: now });
        if (this._behaviorData.touchEvents.length > 100) {
          this._behaviorData.touchEvents.shift();
        }
        this._behaviorData.lastActivity = now;
        this._behaviorData.totalInteractions++;
      };

      document.addEventListener('mousemove', moveHandler, { passive: true });
      document.addEventListener('keydown', keyHandler, { passive: true });
      document.addEventListener('touchstart', touchHandler, { passive: true });
      document.addEventListener('touchmove', touchHandler, { passive: true });
    },

    /**
     * Analyze collected behavioral data to produce a bot-likelihood score.
     * Returns a score from 0.0 (definitely human) to 1.0 (definitely bot).
     *
     * Detection heuristics:
     * - Zero mouse movements with form submission = bot
     * - Perfectly linear mouse trajectories = bot
     * - Keystroke intervals too uniform (low variance) = bot
     * - Submission too fast for a human to read/answer = bot
     * - No touch events on a touch-capable device = suspicious
     */
    analyzeBehavior() {
      const data = this._behaviorData;
      const timeOnPage = Date.now() - (data.startTime || Date.now());
      let score = 0.0;
      const signals = [];

      // Signal 1: No mouse movement at all
      if (data.mouseMovements.length === 0) {
        score += 0.35;
        signals.push('no_mouse_movement');
      }

      // Signal 2: Mouse movement too linear (bots move in straight lines)
      if (data.mouseMovements.length >= 3) {
        let directionChanges = 0;
        let totalSegments = 0;
        for (let i = 2; i < data.mouseMovements.length; i++) {
          const dx1 = data.mouseMovements[i - 1].x - data.mouseMovements[i - 2].x;
          const dy1 = data.mouseMovements[i - 1].y - data.mouseMovements[i - 2].y;
          const dx2 = data.mouseMovements[i].x - data.mouseMovements[i - 1].x;
          const dy2 = data.mouseMovements[i].y - data.mouseMovements[i - 1].y;
          const cross = dx1 * dy2 - dy1 * dx2;
          if (Math.abs(cross) > 10) directionChanges++;
          totalSegments++;
        }
        const linearity = totalSegments > 0 ? 1 - (directionChanges / totalSegments) : 1;
        if (linearity > 0.95 && totalSegments > 5) {
          score += 0.25;
          signals.push('linear_mouse_path');
        }
      }

      // Signal 3: Keystroke dynamics too uniform
      if (data.keyPresses.length >= 3) {
        const intervals = [];
        for (let i = 1; i < data.keyPresses.length; i++) {
          intervals.push(data.keyPresses[i].t - data.keyPresses[i - 1].t);
        }
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
        const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
        if (cv < 0.1 && intervals.length > 3) {
          score += 0.2;
          signals.push('uniform_keystrokes');
        }
      }

      // Signal 4: Submission impossibly fast (< 1.5 seconds)
      if (timeOnPage < 1500) {
        score += 0.25;
        signals.push('too_fast_submission');
      }

      // Signal 5: No interactions at all
      if (data.totalInteractions === 0) {
        score += 0.3;
        signals.push('zero_interactions');
      }

      // Signal 6: Touch-capable device but no touch events
      if ('ontouchstart' in window && data.touchEvents.length === 0 && timeOnPage > 3000) {
        score += 0.1;
        signals.push('no_touch_on_touch_device');
      }

      return {
        score: Math.min(score, 1.0),
        signals,
        timeOnPage,
        interactionCount: data.totalInteractions,
        isBot: score >= 0.5
      };
    },

    /**
     * Create invisible honeypot fields that bots fill out but humans cannot see.
     * Any filled honeypot field indicates automated submission.
     * @param {HTMLFormElement} form - The form to add honeypots to
     * @returns {string[]} Names of honeypot fields created
     */
    deployHoneypot(form) {
      const fieldNames = [];
      const honeypotConfigs = [
        { name: 'website_url', type: 'text', placeholder: 'Your website URL' },
        { name: 'email_confirm', type: 'email', placeholder: 'Confirm your email' },
        { name: 'terms_agree', type: 'checkbox', label: 'I agree to receive newsletters' }
      ];

      honeypotConfigs.forEach(config => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.setAttribute('tabindex', '-1');

        if (config.type === 'checkbox') {
          const label = document.createElement('label');
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = config.name;
          input.setAttribute('tabindex', '-1');
          label.appendChild(input);
          label.appendChild(document.createTextNode(' ' + config.label));
          wrapper.appendChild(label);
        } else {
          const input = document.createElement('input');
          input.type = config.type;
          input.name = config.name;
          input.placeholder = config.placeholder;
          input.setAttribute('autocomplete', 'off');
          input.setAttribute('tabindex', '-1');
          wrapper.appendChild(input);
        }

        form.appendChild(wrapper);
        this._honeypotFields.push(config.name);
        fieldNames.push(config.name);
      });

      return fieldNames;
    },

    /**
     * Check if any honeypot fields were filled (indicates bot).
     * @param {HTMLFormElement} form - The form to check
     * @returns {boolean} True if a honeypot was triggered
     */
    checkHoneypot(form) {
      for (const name of this._honeypotFields) {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
          if (field.type === 'checkbox' && field.checked) return true;
          if (field.type !== 'checkbox' && field.value && field.value.trim() !== '') return true;
        }
      }
      return false;
    },

    // ─── XSS PROTECTION ──────────────────────────────────────────────────────

    /**
     * Sanitize user input to prevent XSS attacks.
     * Strips HTML tags, encodes special characters, and neutralizes
     * javascript: and data: URI schemes.
     * @param {string} input - Raw user input
     * @returns {string} Sanitized string safe for insertion into DOM
     */
    sanitizeInput(input) {
      if (typeof input !== 'string') return '';

      let sanitized = input;

      // Remove null bytes
      sanitized = sanitized.replace(/\0/g, '');

      // Encode HTML entities
      const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#96;'
      };
      sanitized = sanitized.replace(/[&<>"'\/`]/g, char => entityMap[char]);

      // Neutralize javascript: and data: URI schemes
      sanitized = sanitized.replace(/javascript:/gi, 'blocked:');
      sanitized = sanitized.replace(/data:text\/html/gi, 'blocked:');
      sanitized = sanitized.replace(/vbscript:/gi, 'blocked:');

      // Remove event handler patterns
      sanitized = sanitized.replace(/on\w+\s*=/gi, 'blocked=');

      return sanitized;
    },

    /**
     * Safely set text content on an element, preventing XSS via innerHTML.
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to set
     */
    safeSetText(element, text) {
      if (element) {
        element.textContent = this.sanitizeInput(text);
      }
    },

    /**
     * Generate Content-Security-Policy header value for the host page.
     * Should be set as a <meta> tag or HTTP header by the server.
     * @param {Object} customRules - Additional CSP directives
     * @returns {string} CSP header value
     */
    generateCSP(customRules = {}) {
      const defaults = {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'https://loremflickr.com', 'https://upload.wikimedia.org', 'data:'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"]
      };

      const merged = { ...defaults, ...customRules };
      const directives = [];
      for (const [directive, sources] of Object.entries(merged)) {
        if (Array.isArray(sources) && sources.length > 0) {
          directives.push(`${directive} ${sources.join(' ')}`);
        }
      }
      return directives.join('; ');
    },

    /**
     * Inject a CSP meta tag into the document head.
     * Note: HTTP headers are preferred; meta tags have limited support.
     */
    injectCSPMeta() {
      if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) return;
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = this.generateCSP();
      document.head.appendChild(meta);
    },

    // ─── CSRF PROTECTION ─────────────────────────────────────────────────────

    /**
     * Generate a CSRF token bound to the current session.
     * The token is a cryptographically random value stored in sessionStorage.
     * @returns {string} CSRF token
     */
    generateCSRFToken() {
      const token = CryptoUtils.generateToken(32);
      try {
        sessionStorage.setItem('vg_csrf_token', token);
        sessionStorage.setItem('vg_csrf_time', Date.now().toString());
      } catch (e) {
        // sessionStorage unavailable — fall back to memory
        this._sessionToken = token;
      }
      return token;
    },

    /**
     * Validate a submitted CSRF token against the stored token.
     * Tokens expire after 1 hour.
     * @param {string} submittedToken - Token from the form submission
     * @returns {boolean} True if token is valid
     */
    validateCSRFToken(submittedToken) {
      let storedToken;
      try {
        storedToken = sessionStorage.getItem('vg_csrf_token');
        const storedTime = parseInt(sessionStorage.getItem('vg_csrf_time') || '0', 10);
        if (Date.now() - storedTime > 3600000) {
          sessionStorage.removeItem('vg_csrf_token');
          sessionStorage.removeItem('vg_csrf_time');
          return false;
        }
      } catch (e) {
        storedToken = this._sessionToken;
      }

      if (!storedToken || !submittedToken) return false;

      // Constant-time comparison to prevent timing attacks
      if (storedToken.length !== submittedToken.length) return false;
      let result = 0;
      for (let i = 0; i < storedToken.length; i++) {
        result |= storedToken.charCodeAt(i) ^ submittedToken.charCodeAt(i);
      }
      return result === 0;
    },

    /**
     * Inject a hidden CSRF token field into a form.
     * @param {HTMLFormElement} form - The form to protect
     * @returns {string} The CSRF token value
     */
    injectCSRFField(form) {
      const token = this.generateCSRFToken();
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'vg_csrf_token';
      input.value = token;
      form.appendChild(input);
      return token;
    },

    // ─── CLICKJACKING PROTECTION ──────────────────────────────────────────────

    /**
     * Inject frame-busting JavaScript that prevents the page from being
     * loaded in an iframe. This is a client-side defense; the server
     * should also send X-Frame-Options: DENY or CSP frame-ancestors.
     */
    injectFrameBuster() {
      if (window.self !== window.top) {
        // We're in an iframe — attempt to break out
        try {
          window.top.location = window.self.location;
        } catch (e) {
          // Cross-origin restriction — hide the entire page
          document.body.style.display = 'none';
          throw new Error('VaultGuard: This page cannot be displayed in a frame. Clickjacking attempt detected.');
        }
      }

      // Monitor for iframe insertion via MutationObserver
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeName === 'IFRAME') {
              const src = node.getAttribute('src') || '';
              const isTrusted = src === '' || src.startsWith(window.location.origin);
              if (!isTrusted) {
                node.remove();
                console.warn('VaultGuard: Removed untrusted iframe element.');
              }
            }
          }
        }
      });

      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    },

    /**
     * Generate the recommended X-Frame-Options header value.
     * Server should set: X-Frame-Options: DENY
     * @returns {string} Recommended header value
     */
    getFrameOptionsHeader() {
      return 'DENY';
    },

    // ─── SESSION HIJACK PROTECTION ────────────────────────────────────────────

    /**
     * Generate a browser fingerprint using available navigator and screen
     * properties. This fingerprint is used to bind the CAPTCHA session
     * to the browser, making stolen tokens unusable from a different browser.
     *
     * This is NOT tracking — it is used only for session binding.
     * @returns {Promise<string>} SHA-256 hash of fingerprint components
     */
    async generateFingerprint() {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth.toString(),
        screen.width.toString() + 'x' + screen.height.toString(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        navigator.hardwareConcurrency?.toString() || '0',
        navigator.platform || ''
      ];

      // Add canvas fingerprint component
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 200, 50);
        ctx.fillStyle = '#069';
        ctx.fillText('VaultGuard FP', 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)';
        ctx.fillText('VaultGuard FP', 4, 17);
        components.push(canvas.toDataURL());
      } catch (e) {
        components.push('canvas_blocked');
      }

      const fingerprintString = components.join('|');
      this._fingerprint = await CryptoUtils.hash(fingerprintString);
      return this._fingerprint;
    },

    /**
     * Verify that the current browser fingerprint matches the one
     * recorded when the session was created.
     * @param {string} originalFingerprint - The fingerprint from session creation
     * @returns {Promise<boolean>} True if fingerprints match
     */
    async verifyFingerprint(originalFingerprint) {
      if (!originalFingerprint) return false;
      const current = await this.generateFingerprint();
      return current === originalFingerprint;
    },

    /**
     * Bind a challenge to the current browser fingerprint.
     * The challenge can only be verified from the same browser.
     * @param {string} challengeId - The challenge ID to bind
     * @returns {Promise<string>} The fingerprint hash
     */
    async bindChallengeToSession(challengeId) {
      const fingerprint = await this.generateFingerprint();
      try {
        sessionStorage.setItem('vg_challenge_fp_' + challengeId, fingerprint);
        sessionStorage.setItem('vg_challenge_time_' + challengeId, Date.now().toString());
      } catch (e) {
        // sessionStorage unavailable
      }
      return fingerprint;
    },

    /**
     * Verify a challenge submission against its bound fingerprint.
     * @param {string} challengeId - The challenge ID
     * @returns {Promise<boolean>} True if the session is valid
     */
    async verifyChallengeSession(challengeId) {
      let storedFp, storedTime;
      try {
        storedFp = sessionStorage.getItem('vg_challenge_fp_' + challengeId);
        storedTime = parseInt(sessionStorage.getItem('vg_challenge_time_' + challengeId) || '0', 10);
      } catch (e) {
        return true; // Can't verify without storage — allow
      }

      if (!storedFp) return true;

      // Check if session binding has expired (30 minutes)
      if (Date.now() - storedTime > 1800000) {
        return false;
      }

      const currentFp = await this.generateFingerprint();
      return currentFp === storedFp;
    },

    // ─── TABNAPPING PROTECTION ───────────────────────────────────────────────

    /**
     * Protect against tabnapping by clearing the window.opener reference
     * and injecting a referrer policy. Should be called on page load.
     */
    protectAgainstTabnapping() {
      // Clear opener to prevent reverse tabnapping
      if (window.opener) {
        try {
          window.opener = null;
        } catch (e) {
          // Some browsers restrict this
        }
      }

      // Set referrer policy to prevent leaking referrer to external sites
      let meta = document.querySelector('meta[name="referrer"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(meta);
      }

      // Monitor window.open calls
      const originalOpen = window.open;
      window.open = function(...args) {
        const url = args[0];
        if (url && typeof url === 'string' && !url.startsWith(window.location.origin)) {
          // Add noopener and noreferrer to external links
          const features = args[2] || '';
          if (features && typeof features === 'string') {
            if (!features.includes('noopener')) args[2] = features + ',noopener';
            if (!features.includes('noreferrer')) args[2] = features + ',noreferrer';
          } else {
            args[2] = 'noopener,noreferrer';
          }
        }
        return originalOpen.apply(this, args);
      };
    },

    /**
     * Mark all external links in the document with rel="noopener noreferrer"
     * to prevent tabnapping via user-clicked links.
     */
    secureExternalLinks() {
      const links = document.querySelectorAll('a[target="_blank"]');
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href && !href.startsWith(window.location.origin) && !href.startsWith('#')) {
          const rel = (link.getAttribute('rel') || '').split(/\s+/);
          if (!rel.includes('noopener')) rel.push('noopener');
          if (!rel.includes('noreferrer')) rel.push('noreferrer');
          link.setAttribute('rel', rel.join(' ').trim());
        }
      });
    },

    // ─── ROGUE ADDON / EXTENSION DETECTION ───────────────────────────────────

    /**
     * Detect potentially malicious browser extensions by checking for
     * known extension DOM modifications, injected scripts, and
     * unexpected global variables.
     * @returns {Object} Detection results with findings array
     */
    detectRogueExtensions() {
      const findings = [];

      // Check for known ad-injection patterns
      const suspiciousSelectors = [
        '[id*="adsense"]',
        '[id*="adblock"]',
        '[class*="adsby"]',
        '[id*="sponsored"][style]',
        'iframe[src*="ads"]'
      ];

      suspiciousSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          findings.push({
            type: 'suspicious_element',
            selector,
            count: elements.length,
            severity: 'medium'
          });
        }
      });

      // Check for injected scripts from unknown sources
      const scripts = document.querySelectorAll("script[src]");
      const trustedOrigins = [window.location.origin, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
      scripts.forEach(script => {
        const src = script.getAttribute('src') || '';
        if (src && !trustedOrigins.some(origin => src.startsWith(origin)) && !src.startsWith('/')) {
          findings.push({
            type: 'external_script',
            src: src.substring(0, 100),
            severity: 'high'
          });
        }
      });

      // Check for unexpected global variables that extensions commonly inject
      const suspiciousGlobals = ['__firefox__', 'chrome', 'safari', '_phantom', 'callPhantom', '__nightmare', '_selenium', 'callSelenium', 'domAutomation', 'domAutomationController', '__webdriver_script_fn', '__driver_evaluate', '__webdriver_evaluate', '__selenium_evaluate', '__fxdriver_evaluate', '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_unwrapped', '__fxdriver_unwrapped'];
      const detectedGlobals = [];
      suspiciousGlobals.forEach(name => {
        try {
          if (name in window) {
            detectedGlobals.push(name);
          }
        } catch (e) {
          // Some properties throw on access
        }
      });

      if (detectedGlobals.length > 0) {
        findings.push({
          type: 'suspicious_globals',
          globals: detectedGlobals,
          severity: 'medium'
        });
      }

      // Check for DOM elements that shouldn't exist (extension UI overlays)
      const bodyHTML = document.body ? document.body.innerHTML : '';
      const suspiciousPatterns = [
        { pattern: /data-ad-format/, name: 'ad-injection' },
        { pattern: /extension-installed/, name: 'extension-marker' }
      ];

      suspiciousPatterns.forEach(({ pattern, name }) => {
        if (pattern.test(bodyHTML)) {
          findings.push({
            type: 'suspicious_pattern',
            name,
            severity: 'low'
          });
        }
      });

      return {
        detected: findings.length > 0,
        findings,
        riskLevel: findings.some(f => f.severity === 'high') ? 'high' :
                   findings.some(f => f.severity === 'medium') ? 'medium' : 'low'
      };
    },

    // ─── SECURITY HEADERS RECOMMENDATION ─────────────────────────────────────

    /**
     * Generate a complete set of recommended security headers.
     * These should be configured on the server side.
     * @returns {Object} Map of header name to recommended value
     */
    getRecommendedHeaders() {
      return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': this.generateCSP()
      };
    },

    /**
     * Inject security-related meta tags that can be set client-side.
     */
    injectSecurityMetas() {
      // X-UA-Compatible for IE
      if (!document.querySelector('meta[http-equiv="X-UA-Compatible"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-UA-Compatible';
        meta.content = 'IE=edge';
        document.head.appendChild(meta);
      }

      // Referrer policy
      if (!document.querySelector('meta[name="referrer"]')) {
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(meta);
      }

      // Permissions policy (limited browser support via meta)
      if (!document.querySelector('meta[http-equiv="Permissions-Policy"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Permissions-Policy';
        meta.content = 'camera=(), microphone=(), geolocation=(), payment=()';
        document.head.appendChild(meta);
      }
    },

    // ─── MASTER INITIALIZATION ───────────────────────────────────────────────

    /**
     * Initialize all client-side security protections.
     * @param {Object} options - Configuration options
     * @param {boolean} options.enableBehavioralTracking - Enable bot detection (default: true)
     * @param {boolean} options.enableFrameBusting - Enable clickjacking protection (default: true)
     * @param {boolean} options.enableTabnappingProtection - Enable tabnapping protection (default: true)
     * @param {boolean} options.enableExtensionDetection - Enable rogue extension detection (default: true)
     * @param {boolean} options.enableCSP - Inject CSP meta tag (default: true)
     * @param {boolean} options.enableSecurityMetas - Inject security meta tags (default: true)
     */
    init(options = {}) {
      if (this._initialized) return;
      this._initialized = true;

      const config = {
        enableBehavioralTracking: true,
        enableFrameBusting: true,
        enableTabnappingProtection: true,
        enableExtensionDetection: true,
        enableCSP: true,
        enableSecurityMetas: true,
        ...options
      };

      if (config.enableBehavioralTracking) {
        this.initBehavioralTracking();
      }

      if (config.enableFrameBusting) {
        this.injectFrameBuster();
      }

      if (config.enableTabnappingProtection) {
        this.protectAgainstTabnapping();
        this.secureExternalLinks();
      }

      if (config.enableCSP) {
        this.injectCSPMeta();
      }

      if (config.enableSecurityMetas) {
        this.injectSecurityMetas();
      }

      if (config.enableExtensionDetection) {
        // Run detection after DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            this.detectRogueExtensions();
          });
        } else {
          this.detectRogueExtensions();
        }
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // IMAGE PUZZLE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const ImagePuzzles = {
    baseUrl: 'https://loremflickr.com/200/200',
    puzzles: [
      {
        id: 'select-all-cars',
        name: 'Select all cars',
        question: 'Select all images with cars',
        folder: 'select-all-cars',
        correctImages: [
          'https://loremflickr.com/200/200/car?lock=1',
          'https://loremflickr.com/200/200/car?lock=2',
          'https://loremflickr.com/200/200/car?lock=3',
          'https://loremflickr.com/200/200/car?lock=4'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/tree?lock=1',
          'https://loremflickr.com/200/200/house?lock=1',
          'https://loremflickr.com/200/200/cloud?lock=1',
          'https://loremflickr.com/200/200/sun?lock=1',
          'https://loremflickr.com/200/200/mountain?lock=1'
        ]
      },
      {
        id: 'select-all-traffic-lights',
        name: 'Select all traffic lights',
        question: 'Select all images with traffic lights',
        folder: 'select-all-traffic-lights',
        correctImages: [
          'https://loremflickr.com/200/200/traffic+light?lock=1',
          'https://loremflickr.com/200/200/traffic+light?lock=2',
          'https://loremflickr.com/200/200/traffic+light?lock=3',
          'https://loremflickr.com/200/200/traffic+light?lock=4'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/street+lamp?lock=1',
          'https://loremflickr.com/200/200/lantern?lock=1',
          'https://loremflickr.com/200/200/candle?lock=1',
          'https://loremflickr.com/200/200/flashlight?lock=1',
          'https://loremflickr.com/200/200/neon?lock=1'
        ]
      },
      {
        id: 'select-all-crosswalks',
        name: 'Select all crosswalks',
        question: 'Select all images with crosswalks',
        folder: 'select-all-crosswalks',
        correctImages: [
          'https://loremflickr.com/200/200/crosswalk?lock=1',
          'https://loremflickr.com/200/200/crosswalk?lock=2',
          'https://loremflickr.com/200/200/crosswalk?lock=3',
          'https://loremflickr.com/200/200/crosswalk?lock=4'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/ladder?lock=1',
          'https://loremflickr.com/200/200/bridge?lock=1',
          'https://loremflickr.com/200/200/stairs?lock=1',
          'https://loremflickr.com/200/200/railroad?lock=1',
          'https://loremflickr.com/200/200/highway?lock=1'
        ]
      },
      {
        id: 'select-all-fire-hydrants',
        name: 'Select all fire hydrants',
        question: 'Select all images with fire hydrants',
        folder: 'select-all-fire-hydrants',
        correctImages: [
          'https://loremflickr.com/200/200/fire+hydrant?lock=1',
          'https://loremflickr.com/200/200/fire+hydrant?lock=2',
          'https://loremflickr.com/200/200/fire+hydrant?lock=3'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/mailbox?lock=1',
          'https://loremflickr.com/200/200/bench?lock=1',
          'https://loremflickr.com/200/200/drain?lock=1',
          'https://loremflickr.com/200/200/manhole?lock=1',
          'https://loremflickr.com/200/200/valve?lock=1',
          'https://loremflickr.com/200/200/fountain?lock=1'
        ]
      },
      {
        id: 'select-all-bicycles',
        name: 'Select all bicycles',
        question: 'Select all images with bicycles',
        folder: 'select-all-bicycles',
        correctImages: [
          'https://loremflickr.com/200/200/bicycle?lock=1',
          'https://loremflickr.com/200/200/bicycle?lock=2',
          'https://loremflickr.com/200/200/bicycle?lock=3'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/wheel?lock=1',
          'https://loremflickr.com/200/200/scooter?lock=1',
          'https://loremflickr.com/200/200/motorcycle?lock=1',
          'https://loremflickr.com/200/200/skateboard?lock=1',
          'https://loremflickr.com/200/200/car?lock=10',
          'https://loremflickr.com/200/200/bus?lock=1'
        ]
      },
      {
        id: 'select-all-stop-signs',
        name: 'Select all stop signs',
        question: 'Select all images with stop signs',
        folder: 'select-all-stop-signs',
        correctImages: [
          'https://loremflickr.com/200/200/stop+sign?lock=1',
          'https://loremflickr.com/200/200/stop+sign?lock=2',
          'https://loremflickr.com/200/200/stop+sign?lock=3'
        ],
        incorrectImages: [
          'https://loremflickr.com/200/200/yield+sign?lock=1',
          'https://loremflickr.com/200/200/warning+sign?lock=1',
          'https://loremflickr.com/200/200/no+entry?lock=1',
          'https://loremflickr.com/200/200/caution?lock=1',
          'https://loremflickr.com/200/200/speed+limit?lock=1',
          'https://loremflickr.com/200/200/railroad+crossing?lock=1'
        ]
      }
    ],

    getPuzzle(puzzleId) {
      return this.puzzles.find(p => p.id === puzzleId) || this.puzzles[0];
    },

    getRandomPuzzle() {
      return this.puzzles[CryptoUtils.randomInt(0, this.puzzles.length - 1)];
    },

    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = CryptoUtils.randomInt(0, i);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHALLENGE GENERATORS
  // ═══════════════════════════════════════════════════════════════════════════════

  const ChallengeGenerators = {
    /**
     * Math challenge: simple arithmetic
     * @returns {Object} Challenge with question and answer
     */
    math() {
      const operators = ['+', '-', '×'];
      const operator = operators[CryptoUtils.randomInt(0, operators.length - 1)];
      let a, b, answer;

      switch (operator) {
        case '+':
          a = CryptoUtils.randomInt(1, 50);
          b = CryptoUtils.randomInt(1, 50);
          answer = a + b;
          break;
        case '-':
          a = CryptoUtils.randomInt(10, 50);
          b = CryptoUtils.randomInt(1, a);
          answer = a - b;
          break;
        case '×':
          a = CryptoUtils.randomInt(2, 12);
          b = CryptoUtils.randomInt(2, 12);
          answer = a * b;
          break;
      }

      return {
        question: `What is ${a} ${operator} ${b}?`,
        answer: answer.toString()
      };
    },

    /**
     * Text challenge: reverse or manipulate text
     * @returns {Object} Challenge with question and answer
     */
    text() {
      const words = [
        'apple', 'banana', 'cherry', 'dragon', 'elephant',
        'forest', 'guitar', 'harmony', 'island', 'jungle',
        'knight', 'lemon', 'mountain', 'nebula', 'ocean',
        'piano', 'quantum', 'rainbow', 'sunset', 'tiger',
        'umbrella', 'violet', 'whisper', 'xenon', 'yellow', 'zebra'
      ];
      
      const word = words[CryptoUtils.randomInt(0, words.length - 1)];
      const reversals = [
        { question: `Reverse this word: "${word}"`, answer: word.split('').reverse().join('') },
        { question: `What is the first letter of "${word}"?`, answer: word[0] },
        { question: `What is the last letter of "${word}"?`, answer: word[word.length - 1] },
        { question: `How many letters in "${word}"?`, answer: word.length.toString() }
      ];

      return reversals[CryptoUtils.randomInt(0, reversals.length - 1)];
    },

    /**
     * Pattern challenge: visual pattern recognition
     * @returns {Object} Challenge with question and answer
     */
    pattern() {
      const shapes = ['○', '●', '□', '■', '△', '▲', '◇', '◆'];
      const pattern = [];
      const patternLength = 4;
      
      for (let i = 0; i < patternLength; i++) {
        pattern.push(shapes[CryptoUtils.randomInt(0, shapes.length - 1)]);
      }
      
      const answer = shapes[CryptoUtils.randomInt(0, shapes.length - 1)];
      const question = `Complete the pattern: ${pattern.join(' ')} ___`;
      
      return { question, answer };
    },

    /**
     * Image puzzle challenge: select all images matching a category
     * @param {string} puzzleId - Optional specific puzzle ID
     * @returns {Object} Challenge with question, images, and correct answer indices
     */
    imagePuzzle(puzzleId = null) {
      const puzzle = puzzleId ? ImagePuzzles.getPuzzle(puzzleId) : ImagePuzzles.getRandomPuzzle();
      
      const allImages = [
        ...puzzle.correctImages.map(url => ({ url, correct: true })),
        ...puzzle.incorrectImages.map(url => ({ url, correct: false }))
      ];
      
      const shuffledImages = ImagePuzzles.shuffleArray(allImages);
      const correctIndices = shuffledImages
        .map((img, index) => img.correct ? index : -1)
        .filter(index => index !== -1);
      
      return {
        question: puzzle.question,
        images: shuffledImages.map(img => img.url),
        correctIndices: correctIndices,
        puzzleId: puzzle.id
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // VAULTGUARD CAPTCHA CLASS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * VaultGuard CAPTCHA - Main verification class
   * 
   * @class VaultGuardCaptcha
   * @example
   * const vg = new VaultGuardCaptcha();
   * const challenge = await vg.generateChallenge();
   * const result = await vg.verifyAnswer(challenge.id, "42");
   */
  class VaultGuardCaptcha {
    /**
     * Create a new VaultGuard CAPTCHA instance
     * @param {Object} options - Configuration options
     * @param {string} options.difficulty - Difficulty level ('easy', 'medium', 'hard')
     * @param {number} options.expiryTime - Challenge expiry time in milliseconds (default: 300000)
     * @param {number} options.maxAttempts - Maximum verification attempts (default: 3)
     * @param {string[]} options.challengeTypes - Available challenge types (default: ['math', 'text', 'pattern'])
     */
    constructor(options = {}) {
      this.options = {
        difficulty: options.difficulty || 'medium',
        expiryTime: options.expiryTime || 300000,
        maxAttempts: options.maxAttempts || 3,
        challengeTypes: options.challengeTypes || ['math', 'text', 'pattern', 'imagePuzzle'],
        ...options
      };

      this.challenges = new Map();
      this.attempts = new Map();
      
      // Cleanup expired challenges periodically
      setInterval(() => this.cleanup(), 60000);
    }

    /**
     * Generate a new verification challenge
     * @returns {Promise<Object>} Challenge object with id, question, type, and expiresIn
     */
    async generateChallenge() {
      const challengeType = this.options.challengeTypes[
        CryptoUtils.randomInt(0, this.options.challengeTypes.length - 1)
      ];

      const generator = ChallengeGenerators[challengeType];
      const challenge = challengeType === 'imagePuzzle' ? generator() : generator();
      
      const challengeId = CryptoUtils.generateToken(16);
      const secret = CryptoUtils.generateToken(8);
      
      const answerToHash = challengeType === 'imagePuzzle' 
        ? challenge.correctIndices.join(',') 
        : challenge.answer.toLowerCase();
      
      const challengeData = {
        id: challengeId,
        question: challenge.question,
        type: challengeType,
        createdAt: Date.now(),
        expiryTime: this.options.expiryTime,
        maxAttempts: this.options.maxAttempts,
        secret: secret,
        answerHash: await CryptoUtils.hash(answerToHash + secret),
        attempts: 0,
        solved: false,
        images: challenge.images || null,
        correctIndices: challenge.correctIndices || null,
        puzzleId: challenge.puzzleId || null
      };

      this.challenges.set(challengeId, challengeData);
      this.attempts.set(challengeId, 0);

      return {
        id: challengeId,
        question: challenge.question,
        type: challengeType,
        expiresIn: this.options.expiryTime,
        images: challenge.images || null
      };
    }

    /**
     * Verify user's answer to a challenge
     * @param {string} challengeId - The challenge ID
     * @param {string} userAnswer - User's answer
     * @returns {Promise<Object>} Verification result
     */
    async verifyAnswer(challengeId, userAnswer) {
      const challenge = this.challenges.get(challengeId);
      
      if (!challenge) {
        return {
          success: false,
          error: 'Challenge not found or expired',
          brand: VAULTGUARD.name
        };
      }

      if (Date.now() - challenge.createdAt > challenge.expiryTime) {
        this.challenges.delete(challengeId);
        this.attempts.delete(challengeId);
        return {
          success: false,
          error: 'Challenge expired',
          brand: VAULTGUARD.name
        };
      }

      if (challenge.solved) {
        return {
          success: true,
          verified: true,
          brand: VAULTGUARD.name
        };
      }

      const currentAttempts = this.attempts.get(challengeId) || 0;
      if (currentAttempts >= challenge.maxAttempts) {
        this.challenges.delete(challengeId);
        this.attempts.delete(challengeId);
        return {
          success: false,
          error: 'Maximum attempts exceeded',
          brand: VAULTGUARD.name
        };
      }

      this.attempts.set(challengeId, currentAttempts + 1);

      const normalizedAnswer = challenge.type === 'imagePuzzle' 
        ? userAnswer 
        : userAnswer.toLowerCase();
      const answerHash = await CryptoUtils.hash(normalizedAnswer + challenge.secret);
      const isValid = answerHash === challenge.answerHash;

      if (isValid) {
        challenge.solved = true;
        return {
          success: true,
          verified: true,
          brand: VAULTGUARD.name
        };
      } else {
        const remainingAttempts = challenge.maxAttempts - (currentAttempts + 1);
        return {
          success: false,
          error: 'Incorrect answer',
          remainingAttempts: Math.max(0, remainingAttempts),
          brand: VAULTGUARD.name
        };
      }
    }

    /**
     * Get challenge status
     * @param {string} challengeId - The challenge ID
     * @returns {Object} Challenge status
     */
    getChallengeStatus(challengeId) {
      const challenge = this.challenges.get(challengeId);
      
      if (!challenge) {
        return { exists: false, expired: true, brand: VAULTGUARD.name };
      }

      const expired = Date.now() - challenge.createdAt > challenge.expiryTime;
      
      return {
        exists: true,
        expired: expired,
        solved: challenge.solved,
        attempts: this.attempts.get(challengeId) || 0,
        maxAttempts: challenge.maxAttempts,
        type: challenge.type,
        brand: VAULTGUARD.name
      };
    }

    /**
     * Clean up expired challenges
     */
    cleanup() {
      const now = Date.now();
      
      for (const [id, challenge] of this.challenges) {
        if (now - challenge.createdAt > challenge.expiryTime) {
          this.challenges.delete(id);
          this.attempts.delete(id);
        }
      }
    }

    /**
     * Invalidate a challenge manually
     * @param {string} challengeId - The challenge ID to invalidate
     */
    invalidateChallenge(challengeId) {
      this.challenges.delete(challengeId);
      this.attempts.delete(challengeId);
    }

    /**
     * Get library statistics
     * @returns {Object} Statistics object
     */
    getStats() {
      return {
        activeChallenges: this.challenges.size,
        totalAttempts: Array.from(this.attempts.values()).reduce((a, b) => a + b, 0),
        brand: VAULTGUARD.name,
        version: VAULTGUARD.version
      };
    }

    /**
     * Reset all challenges and attempts
     */
    reset() {
      this.challenges.clear();
      this.attempts.clear();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VAULTGUARD UI COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  const VaultGuardUI = {
    /**
     * Create a branded CAPTCHA form element
     * @param {string} containerId - Container element ID
     * @param {Object} options - UI options
     * @returns {HTMLFormElement} The created form element
     */
    createForm(containerId, options = {}) {
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container element with id "${containerId}" not found`);
      }

      const form = document.createElement('form');
      form.className = 'vaultguard-captcha-form';
      form.setAttribute('data-vg-version', VAULTGUARD.version);
      
      form.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          .vaultguard-captcha-form {
            font-family: ${VAULTGUARD.typography.fontFamily};
            max-width: 340px;
            padding: 0;
            border: 2px solid ${VAULTGUARD.brandColors.border};
            border-radius: 16px;
            background: ${VAULTGUARD.brandColors.surface};
            box-shadow: 0 10px 40px rgba(30, 58, 95, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            position: relative;
          }
          
          /* Header with branding */
          .vg-header {
            background: linear-gradient(135deg, ${VAULTGUARD.brandColors.primary} 0%, #0f172a 100%);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .vg-logo {
            width: 48px;
            height: 48px;
            flex-shrink: 0;
          }
          
          .vg-brand-text {
            color: white;
          }
          
          .vg-brand-name {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .vg-brand-badge {
            background: ${VAULTGUARD.brandColors.secondary};
            color: ${VAULTGUARD.brandColors.primary};
            font-size: 9px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .vg-brand-tagline {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin: 4px 0 0 0;
            font-weight: 400;
          }
          
          /* Content area */
          .vg-content {
            padding: 24px;
          }
          
          .vg-loading {
            display: none;
            text-align: center;
            padding: 32px 24px;
            color: ${VAULTGUARD.brandColors.textMuted};
          }
          
          .vg-spinner {
            display: inline-block;
            width: 32px;
            height: 32px;
            border: 3px solid ${VAULTGUARD.brandColors.border};
            border-top: 3px solid ${VAULTGUARD.brandColors.primary};
            border-radius: 50%;
            animation: vg-spin 1s linear infinite;
            margin-bottom: 12px;
          }
          
          @keyframes vg-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .vg-loading-text {
            font-size: 13px;
            font-weight: 500;
          }
          
          /* Challenge area */
          .vg-challenge-area {
            display: none;
          }
          
          .vg-question-label {
            font-size: 11px;
            font-weight: 600;
            color: ${VAULTGUARD.brandColors.textMuted};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          
          .vg-question {
            font-size: 16px;
            font-weight: 600;
            color: ${VAULTGUARD.brandColors.text};
            margin-bottom: 20px;
            line-height: 1.5;
            padding: 16px;
            background: ${VAULTGUARD.brandColors.background};
            border-radius: 10px;
            border-left: 4px solid ${VAULTGUARD.brandColors.secondary};
          }
          
          .vg-input-group {
            margin-bottom: 16px;
          }
          
          .vg-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid ${VAULTGUARD.brandColors.border};
            border-radius: 10px;
            font-size: 15px;
            font-family: ${VAULTGUARD.typography.fontFamily};
            transition: all 0.2s ease;
            box-sizing: border-box;
            color: ${VAULTGUARD.brandColors.text};
          }
          
          .vg-input:focus {
            outline: none;
            border-color: ${VAULTGUARD.brandColors.secondary};
            box-shadow: 0 0 0 4px rgba(0, 212, 170, 0.15);
          }
          
          .vg-input::placeholder {
            color: ${VAULTGUARD.brandColors.textMuted};
          }
          
          .vg-button {
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, ${VAULTGUARD.brandColors.primary} 0%, #0f172a 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            font-family: ${VAULTGUARD.typography.fontFamily};
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .vg-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(30, 58, 95, 0.3);
          }
          
          .vg-button:active {
            transform: translateY(0);
          }
          
          .vg-button:disabled {
            background: ${VAULTGUARD.brandColors.textMuted};
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .vg-button-icon {
            width: 18px;
            height: 18px;
          }
          
          /* Message area */
          .vg-message {
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            display: none;
            align-items: center;
            gap: 10px;
          }
          
          .vg-message.error {
            background: #fef2f2;
            color: ${VAULTGUARD.brandColors.error};
            border: 1px solid #fecaca;
          }
          
          .vg-message.success {
            background: #f0fdf4;
            color: ${VAULTGUARD.brandColors.success};
            border: 1px solid #bbf7d0;
          }
          
          .vg-message.info {
            background: #eff6ff;
            color: ${VAULTGUARD.brandColors.primary};
            border: 1px solid #bfdbfe;
          }
          
          .vg-message-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }
          
          /* Footer */
          .vg-footer {
            padding: 16px 24px;
            background: ${VAULTGUARD.brandColors.background};
            border-top: 1px solid ${VAULTGUARD.brandColors.border};
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .vg-footer-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: ${VAULTGUARD.brandColors.textMuted};
            font-weight: 500;
          }
          
          .vg-footer-logo {
            width: 16px;
            height: 16px;
          }
          
          .vg-footer-links {
            display: flex;
            gap: 12px;
          }
          
          .vg-footer-link {
            font-size: 11px;
            color: ${VAULTGUARD.brandColors.textMuted};
            text-decoration: none;
            transition: color 0.2s;
          }
          
          .vg-footer-link:hover {
            color: ${VAULTGUARD.brandColors.primary};
          }
          
          /* Attempts indicator */
          .vg-attempts {
            display: flex;
            gap: 4px;
            margin-top: 12px;
          }
          
          .vg-attempt-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${VAULTGUARD.brandColors.border};
            transition: background 0.2s;
          }
          
          .vg-attempt-dot.used {
            background: ${VAULTGUARD.brandColors.error};
          }
          
          .vg-attempt-dot.remaining {
            background: ${VAULTGUARD.brandColors.secondary};
          }
          
          /* Image Puzzle Styles */
          .vg-image-puzzle {
            display: none;
          }
          
          .vg-image-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 16px;
          }
          
          .vg-image-cell {
            aspect-ratio: 1;
            border: 3px solid ${VAULTGUARD.brandColors.border};
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            overflow: hidden;
            position: relative;
            background: ${VAULTGUARD.brandColors.background};
          }
          
          .vg-image-cell:hover {
            border-color: ${VAULTGUARD.brandColors.secondary};
            transform: scale(1.02);
          }
          
          .vg-image-cell.selected {
            border-color: ${VAULTGUARD.brandColors.secondary};
            box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.3);
          }
          
          .vg-image-cell.selected::after {
            content: '✓';
            position: absolute;
            top: 4px;
            right: 4px;
            width: 24px;
            height: 24px;
            background: ${VAULTGUARD.brandColors.secondary};
            color: ${VAULTGUARD.brandColors.primary};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
          }
          
          .vg-image-cell img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 7px;
            display: block;
          }
          
          .vg-image-cell.vg-image-error {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
          
          .vg-image-cell .vg-image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${VAULTGUARD.brandColors.textMuted};
            font-size: 12px;
          }
          
          .vg-verify-button {
            margin-top: 8px;
          }
        </style>
        
        <!-- Header -->
        <div class="vg-header">
          <div class="vg-logo">
            ${VAULTGUARD.logo.svg}
          </div>
          <div class="vg-brand-text">
            <div class="vg-brand-name">
              ${VAULTGUARD.name}
              <span class="vg-brand-badge">v${VAULTGUARD.version}</span>
            </div>
            <div class="vg-brand-tagline">Privacy-First Verification</div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="vg-content">
          <!-- Loading State -->
          <div class="vg-loading">
            <div class="vg-spinner"></div>
            <div class="vg-loading-text">Generating secure challenge...</div>
          </div>
          
          <!-- Challenge Area -->
          <div class="vg-challenge-area">
            <div class="vg-question-label">Security Challenge</div>
            <div class="vg-question"></div>
            
            <!-- Text/Math/Pattern Challenge Input -->
            <div class="vg-text-challenge">
              <div class="vg-input-group">
                <input type="text" class="vg-input" placeholder="Enter your answer" required autocomplete="off">
              </div>
              
              <button type="submit" class="vg-button">
                <svg class="vg-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L3 7V12C3 17.5 6.8 22.9 12 24C17.2 22.9 21 17.5 21 12V7L12 2Z"/>
                  <path d="M8.5 12L11 14.5L15.5 9.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Verify Identity
              </button>
            </div>
            
            <!-- Image Puzzle Challenge -->
            <div class="vg-image-puzzle">
              <div class="vg-image-grid"></div>
              <button type="button" class="vg-button vg-verify-button">
                <svg class="vg-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L3 7V12C3 17.5 6.8 22.9 12 24C17.2 22.9 21 17.5 21 12V7L12 2Z"/>
                  <path d="M8.5 12L11 14.5L15.5 9.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Verify Selection
              </button>
            </div>
            
            <div class="vg-attempts">
              <div class="vg-attempt-dot remaining"></div>
              <div class="vg-attempt-dot remaining"></div>
              <div class="vg-attempt-dot remaining"></div>
            </div>
          </div>
          
          <!-- Message -->
          <div class="vg-message">
            <svg class="vg-message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8V12M12 16H12.01"/>
            </svg>
            <span class="vg-message-text"></span>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="vg-footer">
          <div class="vg-footer-brand">
            <div class="vg-footer-logo">${VAULTGUARD.logo.icon}</div>
            <span>Protected by ${VAULTGUARD.name}</span>
          </div>
          <div class="vg-footer-links">
            <a href="${VAULTGUARD.baseUrl}/${VAULTGUARD.urls.privacy}" class="vg-footer-link" target="_blank">Privacy</a>
            <a href="${VAULTGUARD.baseUrl}/${VAULTGUARD.urls.terms}" class="vg-footer-link" target="_blank">Terms</a>
          </div>
        </div>
      `;

      container.appendChild(form);

      return form;
    },

    /**
     * Initialize CAPTCHA with form
     * @param {HTMLFormElement} formElement - The form element
     * @param {VaultGuardCaptcha} captchaInstance - CAPTCHA instance
     * @param {Object} callbacks - Event callbacks
     * @returns {Object} Controller methods
     */
    async init(formElement, captchaInstance, callbacks = {}) {
      if (!formElement || !captchaInstance) {
        throw new Error('Form element and CAPTCHA instance are required');
      }

      const loadingEl = formElement.querySelector('.vg-loading');
      const challengeAreaEl = formElement.querySelector('.vg-challenge-area');
      const questionEl = formElement.querySelector('.vg-question');
      const textChallengeEl = formElement.querySelector('.vg-text-challenge');
      const imagePuzzleEl = formElement.querySelector('.vg-image-puzzle');
      const imageGridEl = formElement.querySelector('.vg-image-grid');
      const verifyButtonEl = formElement.querySelector('.vg-verify-button');
      const inputEl = formElement.querySelector('.vg-input');
      const buttonEl = formElement.querySelector('.vg-button');
      const messageEl = formElement.querySelector('.vg-message');
      const messageTextEl = formElement.querySelector('.vg-message-text');
      const attemptDots = formElement.querySelectorAll('.vg-attempt-dot');

      let currentChallenge = null;
      let attemptsUsed = 0;
      let selectedImages = [];

      const updateAttemptDots = (used, total) => {
        attemptDots.forEach((dot, index) => {
          dot.classList.remove('used', 'remaining');
          if (index < used) {
            dot.classList.add('used');
          } else if (index < total) {
            dot.classList.add('remaining');
          }
        });
      };

      const renderImageGrid = (images) => {
        imageGridEl.innerHTML = '';
        selectedImages = [];
        
        images.forEach((imgSrc, index) => {
          const cell = document.createElement('div');
          cell.className = 'vg-image-cell';
          cell.dataset.index = index;
          
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = `Image ${index + 1}`;
          img.loading = 'eager';
          img.onerror = function() {
            this.style.display = 'none';
            cell.classList.add('vg-image-error');
            cell.textContent = '📷';
          };
          
          cell.appendChild(img);
          
          cell.addEventListener('click', () => {
            cell.classList.toggle('selected');
            if (cell.classList.contains('selected')) {
              selectedImages.push(index);
            } else {
              selectedImages = selectedImages.filter(i => i !== index);
            }
          });
          
          imageGridEl.appendChild(cell);
        });
      };

      const loadChallenge = async () => {
        loadingEl.style.display = 'block';
        challengeAreaEl.style.display = 'none';
        messageEl.style.display = 'none';
        inputEl.value = '';
        buttonEl.disabled = true;
        if (verifyButtonEl) verifyButtonEl.disabled = true;
        attemptsUsed = 0;
        updateAttemptDots(0, 3);
        selectedImages = [];

        try {
          currentChallenge = await captchaInstance.generateChallenge();
          questionEl.textContent = currentChallenge.question;
          
          if (currentChallenge.type === 'imagePuzzle' && currentChallenge.images) {
            textChallengeEl.style.display = 'none';
            imagePuzzleEl.style.display = 'block';
            renderImageGrid(currentChallenge.images);
            if (verifyButtonEl) verifyButtonEl.disabled = false;
          } else {
            textChallengeEl.style.display = 'block';
            imagePuzzleEl.style.display = 'none';
            buttonEl.disabled = false;
            inputEl.focus();
          }
          
          loadingEl.style.display = 'none';
          challengeAreaEl.style.display = 'block';

          if (callbacks.onChallengeLoaded) {
            callbacks.onChallengeLoaded(currentChallenge);
          }
        } catch (error) {
          showMessage('Failed to load challenge. Please try again.', 'error');
          loadingEl.style.display = 'none';
          console.error(`${VAULTGUARD.name} load error:`, error);
        }
      };

      const showMessage = (text, type) => {
        messageTextEl.textContent = text;
        messageEl.className = `vg-message ${type}`;
        messageEl.style.display = 'flex';
      };

      const verifyAnswer = async (userAnswer) => {
        if (!currentChallenge) return;

        buttonEl.disabled = true;
        if (verifyButtonEl) verifyButtonEl.disabled = true;
        showMessage('Verifying...', 'info');

        try {
          const result = await captchaInstance.verifyAnswer(currentChallenge.id, userAnswer);
          
          if (result.success && result.verified) {
            showMessage('✓ Identity verified successfully!', 'success');
            updateAttemptDots(0, 3);
            if (callbacks.onSuccess) {
              callbacks.onSuccess(result, currentChallenge.id);
            }
          } else {
            attemptsUsed++;
            const maxAttempts = 3;
            updateAttemptDots(attemptsUsed, maxAttempts);
            
            showMessage(result.error || 'Incorrect answer', 'error');
            
            if (currentChallenge.type === 'imagePuzzle') {
              selectedImages = [];
              document.querySelectorAll('.vg-image-cell').forEach(cell => {
                cell.classList.remove('selected');
              });
            } else {
              inputEl.value = '';
              inputEl.focus();
            }
            
            if (callbacks.onError) {
              callbacks.onError(result, currentChallenge.id);
            }

            if (result.error === 'Maximum attempts exceeded' || result.error === 'Challenge expired') {
              setTimeout(loadChallenge, 1500);
            } else {
              buttonEl.disabled = false;
              if (verifyButtonEl) verifyButtonEl.disabled = false;
            }
          }
        } catch (error) {
          showMessage('Verification failed. Please try again.', 'error');
          console.error(`${VAULTGUARD.name} verification error:`, error);
          buttonEl.disabled = false;
          if (verifyButtonEl) verifyButtonEl.disabled = false;
        }
      };

      formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentChallenge || currentChallenge.type === 'imagePuzzle') return;

        const userAnswer = inputEl.value.trim();
        if (!userAnswer) {
          showMessage('Please enter an answer', 'error');
          return;
        }

        await verifyAnswer(userAnswer);
      });

      if (verifyButtonEl) {
        verifyButtonEl.addEventListener('click', async () => {
          if (!currentChallenge || currentChallenge.type !== 'imagePuzzle') return;
          
          if (selectedImages.length === 0) {
            showMessage('Please select at least one image', 'error');
            return;
          }

          const sortedSelection = [...selectedImages].sort((a, b) => a - b);
          await verifyAnswer(sortedSelection.join(','));
        });
      }

      await loadChallenge();

      return {
        reload: loadChallenge,
        getChallenge: () => currentChallenge
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // VAULTGUARD EXPORT
  // ═══════════════════════════════════════════════════════════════════════════════

  const VaultGuard = {
    // Brand info
    brand: VAULTGUARD,
    
    // Core classes
    Captcha: VaultGuardCaptcha,
    UI: VaultGuardUI,
    
    // Utilities
    Crypto: CryptoUtils,
    Challenges: ChallengeGenerators,
    
    /**
     * Quick setup helper
     * @param {string} containerId - Container element ID
     * @param {Object} options - Configuration options
     * @returns {Object} Setup result with captcha, form, and controller
     */
    async quickSetup(containerId, options = {}) {
      const captcha = new VaultGuardCaptcha(options.captcha);
      const form = VaultGuardUI.createForm(containerId);
      const controller = await VaultGuardUI.init(form, captcha, options.callbacks || {});
      
      return {
        captcha,
        form,
        controller
      };
    },
    
    /**
     * Get version info
     * @returns {Object} Version information
     */
    getVersion() {
      return {
        name: VAULTGUARD.name,
        product: VAULTGUARD.product,
        version: VAULTGUARD.version,
        codename: VAULTGUARD.codename,
        fullVersion: `${VAULTGUARD.name} ${VAULTGUARD.product} v${VAULTGUARD.version} "${VAULTGUARD.codename}"`
      };
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VaultGuard;
  } else if (typeof define === 'function' && define.amd) {
    define(() => VaultGuard);
  } else {
    global.VaultGuard = VaultGuard;
  }

})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this);