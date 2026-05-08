/**
 * Compact CAPTCHA Verification Library
 * A privacy-focused, secure CAPTCHA solution in a single file
 * 
 * Features:
 * - No external dependencies
 * - No tracking or fingerprinting
 * - Time-limited challenges
 * - Multiple challenge types
 * - Cryptographic validation
 */

(function(global) {
  'use strict';

  const CryptoUtils = {
    // Generate cryptographic hash using Web Crypto API
    async hash(data) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Generate secure random token
    generateToken(length = 32) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    },

    // Generate random number in range
    randomInt(min, max) {
      const range = max - min + 1;
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return min + (array[0] % range);
    }
  };

  const ChallengeGenerators = {
    // Math challenge: simple arithmetic
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

    // Text challenge: reverse or manipulate text
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

    // Pattern challenge: visual pattern recognition
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
    }
  };

  // Main CAPTCHA class
  class Captcha {
    constructor(options = {}) {
      this.options = {
        difficulty: options.difficulty || 'medium',
        expiryTime: options.expiryTime || 300000, // 5 minutes
        maxAttempts: options.maxAttempts || 3,
        challengeTypes: options.challengeTypes || ['math', 'text', 'pattern'],
        ...options
      };

      this.challenges = new Map();
      this.attempts = new Map();
      
      // Cleanup expired challenges periodically
      setInterval(() => this.cleanup(), 60000);
    }

    // Generate a new challenge
    async generateChallenge() {
      const challengeType = this.options.challengeTypes[
        CryptoUtils.randomInt(0, this.options.challengeTypes.length - 1)
      ];

      const generator = ChallengeGenerators[challengeType];
      const challenge = generator();
      
      const challengeId = CryptoUtils.generateToken(16);
      const secret = CryptoUtils.generateToken(8);
      
      // Create challenge data
      const challengeData = {
        id: challengeId,
        question: challenge.question,
        type: challengeType,
        createdAt: Date.now(),
        expiryTime: this.options.expiryTime,
        maxAttempts: this.options.maxAttempts,
        secret: secret,
        answerHash: await CryptoUtils.hash(challenge.answer.toLowerCase() + secret),
        attempts: 0,
        solved: false
      };

      // Store challenge (in production, this would be server-side)
      this.challenges.set(challengeId, challengeData);
      this.attempts.set(challengeId, 0);

      // Return challenge to client (without answer or secret)
      return {
        id: challengeId,
        question: challenge.question,
        type: challengeType,
        expiresIn: this.options.expiryTime
      };
    }

    // Verify user's answer
    async verifyAnswer(challengeId, userAnswer) {
      const challenge = this.challenges.get(challengeId);
      
      // Check if challenge exists
      if (!challenge) {
        return {
          success: false,
          error: 'Challenge not found or expired'
        };
      }

      // Check if challenge is expired
      if (Date.now() - challenge.createdAt > challenge.expiryTime) {
        this.challenges.delete(challengeId);
        this.attempts.delete(challengeId);
        return {
          success: false,
          error: 'Challenge expired'
        };
      }

      // Check if already solved
      if (challenge.solved) {
        return {
          success: true,
          verified: true
        };
      }

      // Check attempt limit
      const currentAttempts = this.attempts.get(challengeId) || 0;
      if (currentAttempts >= challenge.maxAttempts) {
        this.challenges.delete(challengeId);
        this.attempts.delete(challengeId);
        return {
          success: false,
          error: 'Maximum attempts exceeded'
        };
      }

      // Increment attempt counter
      this.attempts.set(challengeId, currentAttempts + 1);

      // Verify answer using hash comparison
      const answerHash = await CryptoUtils.hash(userAnswer.toLowerCase() + challenge.secret);
      const isValid = answerHash === challenge.answerHash;

      if (isValid) {
        challenge.solved = true;
        return {
          success: true,
          verified: true
        };
      } else {
        const remainingAttempts = challenge.maxAttempts - (currentAttempts + 1);
        return {
          success: false,
          error: 'Incorrect answer',
          remainingAttempts: Math.max(0, remainingAttempts)
        };
      }
    }

    // Get challenge status
    getChallengeStatus(challengeId) {
      const challenge = this.challenges.get(challengeId);
      
      if (!challenge) {
        return { exists: false, expired: true };
      }

      const expired = Date.now() - challenge.createdAt > challenge.expiryTime;
      
      return {
        exists: true,
        expired: expired,
        solved: challenge.solved,
        attempts: this.attempts.get(challengeId) || 0,
        maxAttempts: challenge.maxAttempts,
        type: challenge.type
      };
    }

    // Clean up expired challenges
    cleanup() {
      const now = Date.now();
      
      for (const [id, challenge] of this.challenges) {
        if (now - challenge.createdAt > challenge.expiryTime) {
          this.challenges.delete(id);
          this.attempts.delete(id);
        }
      }
    }

    // Invalidate a challenge (for manual cleanup)
    invalidateChallenge(challengeId) {
      this.challenges.delete(challengeId);
      this.attempts.delete(challengeId);
    }

    // Get statistics (for monitoring)
    getStats() {
      return {
        activeChallenges: this.challenges.size,
        totalAttempts: Array.from(this.attempts.values()).reduce((a, b) => a + b, 0)
      };
    }

    // Reset everything
    reset() {
      this.challenges.clear();
      this.attempts.clear();
    }
  }

  // Browser integration helper
  const CaptchaUI = {
    // Create a simple CAPTCHA form element
    createForm(containerId, options = {}) {
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container element with id "${containerId}" not found`);
      }

      const form = document.createElement('form');
      form.className = 'captcha-form';
      form.innerHTML = `
        <style>
          .captcha-form {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 300px;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .captcha-question {
            font-size: 14px;
            margin-bottom: 12px;
            color: #333;
          }
          .captcha-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 12px;
            box-sizing: border-box;
          }
          .captcha-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
          }
          .captcha-button {
            width: 100%;
            padding: 10px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .captcha-button:hover {
            background: #357abd;
          }
          .captcha-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .captcha-message {
            margin-top: 12px;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
          }
          .captcha-message.error {
            background: #ffe6e6;
            color: #d32f2f;
            border: 1px solid #ffcdd2;
          }
          .captcha-message.success {
            background: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
          }
          .captcha-message.info {
            background: #e3f2fd;
            color: #1976d2;
            border: 1px solid #bbdefb;
          }
          .captcha-loading {
            display: none;
            text-align: center;
            padding: 12px;
            color: #666;
          }
          .captcha-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #4a90e2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="captcha-loading">
          <div class="captcha-spinner"></div>
          Loading challenge...
        </div>
        <div class="captcha-content" style="display: none;">
          <div class="captcha-question"></div>
          <input type="text" class="captcha-input" placeholder="Enter your answer" required>
          <button type="submit" class="captcha-button">Verify</button>
        </div>
        <div class="captcha-message"></div>
      `;

      container.appendChild(form);

      return form;
    },

    // Initialize CAPTCHA with form
    async init(formElement, captchaInstance, callbacks = {}) {
      if (!formElement || !captchaInstance) {
        throw new Error('Form element and CAPTCHA instance are required');
      }

      const loadingEl = formElement.querySelector('.captcha-loading');
      const contentEl = formElement.querySelector('.captcha-content');
      const questionEl = formElement.querySelector('.captcha-question');
      const inputEl = formElement.querySelector('.captcha-input');
      const buttonEl = formElement.querySelector('.captcha-button');
      const messageEl = formElement.querySelector('.captcha-message');

      let currentChallenge = null;

      // Load new challenge
      const loadChallenge = async () => {
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
        messageEl.style.display = 'none';
        inputEl.value = '';
        buttonEl.disabled = true;

        try {
          currentChallenge = await captchaInstance.generateChallenge();
          questionEl.textContent = currentChallenge.question;
          loadingEl.style.display = 'none';
          contentEl.style.display = 'block';
          buttonEl.disabled = false;
          inputEl.focus();

          if (callbacks.onChallengeLoaded) {
            callbacks.onChallengeLoaded(currentChallenge);
          }
        } catch (error) {
          showMessage('Failed to load challenge. Please try again.', 'error');
          loadingEl.style.display = 'none';
          console.error('CAPTCHA load error:', error);
        }
      };

      // Show message
      const showMessage = (text, type) => {
        messageEl.textContent = text;
        messageEl.className = `captcha-message ${type}`;
        messageEl.style.display = 'block';
      };

      // Form submit handler
      formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentChallenge) return;

        const userAnswer = inputEl.value.trim();
        if (!userAnswer) {
          showMessage('Please enter an answer', 'error');
          return;
        }

        buttonEl.disabled = true;
        showMessage('Verifying...', 'info');

        try {
          const result = await captchaInstance.verifyAnswer(currentChallenge.id, userAnswer);
          
          if (result.success && result.verified) {
            showMessage('Verification successful!', 'success');
            if (callbacks.onSuccess) {
              callbacks.onSuccess(result, currentChallenge.id);
            }
          } else {
            showMessage(result.error || 'Incorrect answer', 'error');
            inputEl.value = '';
            inputEl.focus();
            
            if (callbacks.onError) {
              callbacks.onError(result, currentChallenge.id);
            }

            // Load new challenge if attempts exceeded or expired
            if (result.error === 'Maximum attempts exceeded' || result.error === 'Challenge expired') {
              setTimeout(loadChallenge, 1500);
            }
          }
        } catch (error) {
          showMessage('Verification failed. Please try again.', 'error');
          console.error('CAPTCHA verification error:', error);
        } finally {
          buttonEl.disabled = false;
        }
      });

      // Load initial challenge
      await loadChallenge();

      // Return control methods
      return {
        reload: loadChallenge,
        getChallenge: () => currentChallenge
      };
    }
  };

  // Export library
  const CaptchaLib = {
    Captcha,
    CaptchaUI,
    CryptoUtils,
    ChallengeGenerators,
    
    // Quick setup helper
    async quickSetup(containerId, options = {}) {
      const captcha = new Captcha(options.captcha);
      const form = CaptchaUI.createForm(containerId);
      const controller = await CaptchaUI.init(form, captcha, options.callbacks || {});
      
      return {
        captcha,
        form,
        controller
      };
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CaptchaLib;
  } else if (typeof define === 'function' && define.amd) {
    define(() => CaptchaLib);
  } else {
    global.CaptchaLib = CaptchaLib;
  }

})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this);
