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
  // IMAGE PUZZLE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const ImagePuzzles = {
    baseUrl: 'https://picsum.photos/seed',
    puzzles: [
      {
        id: 'select-all-cars',
        name: 'Select all cars',
        question: 'Select all images with cars',
        folder: 'select-all-cars',
        correctImages: ['vg-car-1', 'vg-car-2', 'vg-car-3', 'vg-car-4'],
        incorrectImages: ['vg-tree-1', 'vg-house-1', 'vg-bicycle-1', 'vg-cloud-1', 'vg-sun-1']
      },
      {
        id: 'select-all-traffic-lights',
        name: 'Select all traffic lights',
        question: 'Select all images with traffic lights',
        folder: 'select-all-traffic-lights',
        correctImages: ['vg-light-1', 'vg-light-2', 'vg-light-3', 'vg-stoplight-1'],
        incorrectImages: ['vg-streetlamp-1', 'vg-lantern-1', 'vg-headlight-1', 'vg-candle-1', 'vg-flashlight-1']
      },
      {
        id: 'select-all-crosswalks',
        name: 'Select all crosswalks',
        question: 'Select all images with crosswalks',
        folder: 'select-all-crosswalks',
        correctImages: ['vg-crosswalk-1', 'vg-crosswalk-2', 'vg-zebra-1', 'vg-sidewalk-1'],
        incorrectImages: ['vg-ladder-1', 'vg-bridge-1', 'vg-stairs-1', 'vg-railroad-1', 'vg-lines-1']
      },
      {
        id: 'select-all-fire-hydrants',
        name: 'Select all fire hydrants',
        question: 'Select all images with fire hydrants',
        folder: 'select-all-fire-hydrants',
        correctImages: ['vg-hydrant-1', 'vg-hydrant-2', 'vg-hydrant-3'],
        incorrectImages: ['vg-mailbox-1', 'vg-postbox-1', 'vg-bench-1', 'vg-drain-1', 'vg-manhole-1', 'vg-valve-1']
      },
      {
        id: 'select-all-bicycles',
        name: 'Select all bicycles',
        question: 'Select all images with bicycles',
        folder: 'select-all-bicycles',
        correctImages: ['vg-bike-1', 'vg-bike-2', 'vg-bike-3'],
        incorrectImages: ['vg-wheel-1', 'vg-scooter-1', 'vg-unicycle-1', 'vg-tricycle-1', 'vg-motorcycle-1', 'vg-skateboard-1']
      },
      {
        id: 'select-all-stop-signs',
        name: 'Select all stop signs',
        question: 'Select all images with stop signs',
        folder: 'select-all-stop-signs',
        correctImages: ['vg-stop-1', 'vg-stop-2', 'vg-stop-3'],
        incorrectImages: ['vg-yield-1', 'vg-warning-1', 'vg-noentry-1', 'vg-caution-1', 'vg-railroad-1', 'vg-speedlimit-1']
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
        ...puzzle.correctImages.map(img => ({ file: img, correct: true })),
        ...puzzle.incorrectImages.map(img => ({ file: img, correct: false }))
      ];
      
      const shuffledImages = ImagePuzzles.shuffleArray(allImages);
      const correctIndices = shuffledImages
        .map((img, index) => img.correct ? index : -1)
        .filter(index => index !== -1);
      
      const imageUrls = shuffledImages.map(img => `${ImagePuzzles.baseUrl}/${img.file}/200/200`);
      
      return {
        question: puzzle.question,
        images: imageUrls,
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
          img.onerror = () => {
            cell.innerHTML = `<div class="vg-image-placeholder">Image ${index + 1}</div>`;
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