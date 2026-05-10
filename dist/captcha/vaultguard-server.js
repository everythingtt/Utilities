/**
 * VaultGuard™ CAPTCHA Server — v2.0.0 'Aegis'
 *
 * Server-side companion library for VaultGuard™ CAPTCHA.
 * This module is the SOURCE OF TRUTH for challenge answers.
 *
 * Architecture:
 *   1. Client requests a challenge → Server generates it, stores answer in session/Redis, returns question only
 *   2. Client renders the challenge UI and collects user's answer
 *   3. Client submits answer → Server compares against stored answer
 *   4. Server returns pass/fail + behavioral trust score
 *
 * This eliminates the "Client-Side CAPTCHA Fallacy" where the answer
 * was previously stored in the browser and could be read by bots.
 *
 * Usage (Express):
 *   const vaultGuard = require('./vaultguard-server');
 *   app.use(vaultGuard.middleware({ secret: 'your-secret-key' }));
 *   app.get('/vaultguard/challenge', (req, res) => res.json(req.vaultGuard.generateChallenge()));
 *   app.post('/vaultguard/verify', (req, res) => res.json(req.vaultGuard.verifyAnswer(req.body)));
 *
 * Usage (standalone):
 *   const vg = vaultGuard.create({ secret: 'your-secret-key' });
 *   const challenge = vg.generateChallenge();
 *   // ... later ...
 *   const result = vg.verifyAnswer(challenge.id, userAnswer);
 *
 * @license MIT
 * @author VaultGuard™ Team
 */

'use strict';

const crypto = require('crypto');

const VAULTGUARD_SERVER = {
  name: 'VaultGuard™ Server',
  version: '2.0.0',
  codename: 'Aegis'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CRYPTO UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const ServerCrypto = {
  randomInt(min, max) {
    const range = max - min + 1;
    const bytes = crypto.randomBytes(4);
    const value = bytes.readUInt32BE(0);
    return min + (value % range);
  },

  generateToken(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  },

  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  hmac(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGE GENERATORS (Server-Side)
// These produce the SAME challenge types as the client, but the answer
// is generated HERE and stored server-side. The client never sees the answer.
// ═══════════════════════════════════════════════════════════════════════════════

const ServerChallengeGenerators = {
  math() {
    const ops = ['+', '-', '×'];
    const op = ops[ServerCrypto.randomInt(0, ops.length - 1)];
    let a, b, answer;

    switch (op) {
      case '+':
        a = ServerCrypto.randomInt(2, 40);
        b = ServerCrypto.randomInt(2, 40);
        answer = (a + b).toString();
        break;
      case '-':
        a = ServerCrypto.randomInt(10, 50);
        b = ServerCrypto.randomInt(2, a - 1);
        answer = (a - b).toString();
        break;
      case '×':
        a = ServerCrypto.randomInt(2, 12);
        b = ServerCrypto.randomInt(2, 12);
        answer = (a * b).toString();
        break;
    }

    return {
      question: `What is ${a} ${op} ${b}?`,
      answer: answer,
      type: 'math'
    };
  },

  text() {
    const words = [
      'apple', 'brave', 'cloud', 'dance', 'eagle', 'flame', 'grape',
      'heart', 'ivory', 'jewel', 'knight', 'lemon', 'maple', 'noble',
      'ocean', 'pearl', 'quest', 'river', 'storm', 'tiger', 'unity',
      'vivid', 'wheat', 'xenon', 'yacht', 'zebra', 'amber', 'blaze',
      'crisp', 'drift', 'ember', 'frost', 'gleam', 'haven', 'index'
    ];
    const word = words[ServerCrypto.randomInt(0, words.length - 1)];
    return {
      question: `Type the word: ${word}`,
      answer: word.toLowerCase(),
      type: 'text'
    };
  },

  pattern() {
    const patterns = [
      { seq: [2, 4, 6, 8, '?'], answer: '10', hint: 'Even numbers' },
      { seq: [1, 1, 2, 3, 5, '?'], answer: '8', hint: 'Fibonacci' },
      { seq: [1, 4, 9, 16, '?'], answer: '25', hint: 'Perfect squares' },
      { seq: [3, 6, 12, 24, '?'], answer: '48', hint: 'Double each time' },
      { seq: [1, 3, 6, 10, '?'], answer: '15', hint: 'Add increasing numbers' },
      { seq: [2, 6, 18, 54, '?'], answer: '162', hint: 'Triple each time' },
      { seq: [100, 81, 64, 49, '?'], answer: '36', hint: 'Descending squares' },
      { seq: [1, 2, 4, 7, 11, '?'], answer: '16', hint: 'Add increasing by 1' }
    ];
    const p = patterns[ServerCrypto.randomInt(0, patterns.length - 1)];
    return {
      question: `What comes next? ${p.seq.join(', ')} — ${p.hint}`,
      answer: p.answer,
      type: 'pattern'
    };
  },

  imagePuzzle() {
    const puzzles = [
      {
        id: 'cars',
        question: 'Select all images with cars',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      },
      {
        id: 'crosswalks',
        question: 'Select all images with crosswalks',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      },
      {
        id: 'traffic-lights',
        question: 'Select all images with traffic lights',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      },
      {
        id: 'stop-signs',
        question: 'Select all images with stop signs',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      },
      {
        id: 'fire-hydrants',
        question: 'Select all images with fire hydrants',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      },
      {
        id: 'bicycles',
        question: 'Select all images with bicycles',
        correctCount: ServerCrypto.randomInt(3, 5),
        incorrectCount: ServerCrypto.randomInt(3, 5)
      }
    ];

    const puzzle = puzzles[ServerCrypto.randomInt(0, puzzles.length - 1)];
    const totalImages = puzzle.correctCount + puzzle.incorrectCount;
    const indices = Array.from({ length: totalImages }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = ServerCrypto.randomInt(0, i);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const correctIndices = indices.slice(0, puzzle.correctCount);

    return {
      question: puzzle.question,
      answer: correctIndices.sort((a, b) => a - b).join(','),
      type: 'imagePuzzle',
      puzzleId: puzzle.id,
      imageCount: totalImages,
      correctIndices: correctIndices.sort((a, b) => a - b)
    };
  },

  textIllusion() {
    const words = [
      'shield', 'guard', 'safe', 'lock', 'vault', 'armor', 'fort',
      'tower', 'gate', 'bar', 'key', 'code', 'pass', 'ward',
      'aegis', 'bastion', 'citadel', 'rampart', 'bulwark', 'keep'
    ];
    const word = words[ServerCrypto.randomInt(0, words.length - 1)];
    return {
      question: 'Type the hidden word you see in the image',
      answer: word.toLowerCase(),
      type: 'textIllusion',
      word: word
    };
  },

  audio() {
    const digitCount = 4;
    const digits = [];
    for (let i = 0; i < digitCount; i++) {
      digits.push(ServerCrypto.randomInt(0, 9).toString());
    }
    const answer = digits.join('');
    return {
      question: `Type the ${digitCount} digits you hear`,
      answer: answer,
      type: 'audio',
      digitCount: digitCount
    };
  },

  visualPath() {
    const pathTypes = ['curve', 'zigzag', 'spiral', 'wave'];
    const pathType = pathTypes[ServerCrypto.randomInt(0, pathTypes.length - 1)];
    return {
      question: 'Trace the line from Start (S) to End (E) with your mouse or finger',
      answer: 'path',
      type: 'visualPath',
      pathType: pathType,
      tolerance: 25,
      minTracePoints: 20
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGE STORE — Pluggable storage backend
// ═══════════════════════════════════════════════════════════════════════════════

class MemoryStore {
  constructor(ttlMs = 300000) {
    this._store = new Map();
    this._ttl = ttlMs;
    this._cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  set(key, value) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + this._ttl
    });
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  delete(key) {
    this._store.delete(key);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now > entry.expiresAt) {
        this._store.delete(key);
      }
    }
  }

  destroy() {
    clearInterval(this._cleanupInterval);
    this._store.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REDIS STORE — For production deployments
// ═══════════════════════════════════════════════════════════════════════════════

class RedisStore {
  constructor(redisClient, ttlMs = 300000) {
    this._redis = redisClient;
    this._ttl = Math.floor(ttlMs / 1000);
    this._prefix = 'vg:';
  }

  async set(key, value) {
    await this._redis.setex(this._prefix + key, this._ttl, JSON.stringify(value));
  }

  async get(key) {
    const data = await this._redis.get(this._prefix + key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key) {
    await this._redis.del(this._prefix + key);
  }

  cleanup() {}
  destroy() {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITER — Sliding window counter
// ═══════════════════════════════════════════════════════════════════════════════

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000;
    this.maxRequests = options.maxRequests || 30;
    this.maxVerifyRequests = options.maxVerifyRequests || 10;
    this.maxChallengeRequests = options.maxChallengeRequests || 20;
    this.banThreshold = options.banThreshold || 5;
    this.banDurationMs = options.banDurationMs || 300000;
    this._requests = new Map();
    this._bans = new Map();
    this._violations = new Map();
    this._cleanupInterval = setInterval(() => this.cleanup(), 30000);
  }

  _getClientKey(req) {
    const forwarded = req.headers && req.headers['x-forwarded-for'];
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : (req.connection && req.connection.remoteAddress)
        || (req.socket && req.socket.remoteAddress)
        || (req.ip)
        || 'unknown';
    return ip.replace(/^::ffff:/, '');
  }

  _isBanned(clientKey) {
    const banExpiry = this._bans.get(clientKey);
    if (!banExpiry) return false;
    if (Date.now() > banExpiry) {
      this._bans.delete(clientKey);
      this._violations.delete(clientKey);
      return false;
    }
    return true;
  }

  _recordViolation(clientKey) {
    const count = (this._violations.get(clientKey) || 0) + 1;
    this._violations.set(clientKey, count);
    if (count >= this.banThreshold) {
      this._bans.set(clientKey, Date.now() + this.banDurationMs);
      this._violations.delete(clientKey);
    }
  }

  check(req, endpointType = 'default') {
    const clientKey = this._getClientKey(req);

    if (this._isBanned(clientKey)) {
      const banExpiry = this._bans.get(clientKey);
      const retryAfter = Math.ceil((banExpiry - Date.now()) / 1000);
      return {
        allowed: false,
        banned: true,
        retryAfter: retryAfter,
        limit: 0,
        remaining: 0
      };
    }

    const now = Date.now();
    const windowStart = now - this.windowMs;
    const key = `${clientKey}:${endpointType}`;

    if (!this._requests.has(key)) {
      this._requests.set(key, []);
    }

    const timestamps = this._requests.get(key);
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }

    let maxAllowed;
    switch (endpointType) {
      case 'verify':
        maxAllowed = this.maxVerifyRequests;
        break;
      case 'challenge':
        maxAllowed = this.maxChallengeRequests;
        break;
      default:
        maxAllowed = this.maxRequests;
    }

    const currentCount = timestamps.length;

    if (currentCount >= maxAllowed) {
      this._recordViolation(clientKey);
      const oldestInWindow = timestamps[0];
      const retryAfter = Math.ceil((oldestInWindow + this.windowMs - now) / 1000);
      return {
        allowed: false,
        banned: false,
        retryAfter: Math.max(1, retryAfter),
        limit: maxAllowed,
        remaining: 0
      };
    }

    timestamps.push(now);

    return {
      allowed: true,
      banned: false,
      retryAfter: 0,
      limit: maxAllowed,
      remaining: maxAllowed - currentCount - 1
    };
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, timestamps] of this._requests) {
      while (timestamps.length > 0 && timestamps[0] <= windowStart) {
        timestamps.shift();
      }
      if (timestamps.length === 0) {
        this._requests.delete(key);
      }
    }

    for (const [key, expiry] of this._bans) {
      if (now > expiry) {
        this._bans.delete(key);
        this._violations.delete(key);
      }
    }
  }

  destroy() {
    clearInterval(this._cleanupInterval);
    this._requests.clear();
    this._bans.clear();
    this._violations.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VAULTGUARD SERVER — Main class
// ═══════════════════════════════════════════════════════════════════════════════

class VaultGuardServer {
  constructor(options = {}) {
    this.secret = options.secret || ServerCrypto.generateToken(32);
    this.ttl = options.ttl || 300000;
    this.maxAttempts = options.maxAttempts || 3;
    this.challengeTypes = options.challengeTypes || [
      'math', 'text', 'pattern', 'imagePuzzle',
      'textIllusion', 'audio', 'visualPath'
    ];

    if (options.redis) {
      this.store = new RedisStore(options.redis, this.ttl);
      this._async = true;
    } else {
      this.store = new MemoryStore(this.ttl);
      this._async = false;
    }

    this._sessionBindings = new Map();

    this._powConfig = {
      enabled: options.pow !== false,
      difficulty: options.powDifficulty || 3,
      adaptivePow: options.adaptivePow !== false
    };

    if (options.rateLimit !== false) {
      this._rateLimiter = new RateLimiter({
        windowMs: options.rateLimitWindowMs || 60000,
        maxRequests: options.rateLimitMax || 30,
        maxChallengeRequests: options.rateLimitMaxChallenge || 20,
        maxVerifyRequests: options.rateLimitMaxVerify || 10,
        banThreshold: options.rateLimitBanThreshold || 5,
        banDurationMs: options.rateLimitBanDurationMs || 300000
      });
    } else {
      this._rateLimiter = null;
    }
  }

  /**
   * Generate a new challenge. The answer is stored server-side and NEVER sent to the client.
   * @param {string} clientToken - Optional client token for session binding
   * @returns {Object} Challenge data safe to send to the client
   */
  generateChallenge(clientToken = null) {
    const challengeType = this.challengeTypes[
      ServerCrypto.randomInt(0, this.challengeTypes.length - 1)
    ];

    const generator = ServerChallengeGenerators[challengeType];
    const challenge = generator();

    const challengeId = ServerCrypto.generateToken(16);
    const secret = ServerCrypto.generateToken(8);

    const challengeData = {
      id: challengeId,
      type: challengeType,
      answer: challenge.answer,
      secret: secret,
      question: challenge.question,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.ttl,
      attempts: 0,
      maxAttempts: this.maxAttempts,
      solved: false,
      puzzleId: challenge.puzzleId || null,
      imageCount: challenge.imageCount || null,
      correctIndices: challenge.correctIndices || null,
      word: challenge.word || null,
      digitCount: challenge.digitCount || null,
      pathType: challenge.pathType || null,
      tolerance: challenge.tolerance || null,
      minTracePoints: challenge.minTracePoints || null
    };

    this.store.set(challengeId, challengeData);

    if (clientToken) {
      this._sessionBindings.set(challengeId, clientToken);
    }

    let powChallenge = null;
    if (this._powConfig.enabled) {
      const powSecret = ServerCrypto.generateToken(16);
      const powDifficulty = this._powConfig.difficulty;
      powChallenge = {
        challenge: powSecret,
        difficulty: powDifficulty
      };
      this.store.set('pow_' + challengeId, {
        secret: powSecret,
        difficulty: powDifficulty,
        createdAt: Date.now(),
        expiresAt: Date.now() + this.ttl
      });
    }

    const result = {
      id: challengeId,
      question: challenge.question,
      type: challengeType,
      expiresIn: this.ttl,
      imageCount: challenge.imageCount || null,
      puzzleId: challenge.puzzleId || null,
      word: challenge.word || null,
      digitCount: challenge.digitCount || null,
      pathType: challenge.pathType || null,
      tolerance: challenge.tolerance || null,
      minTracePoints: challenge.minTracePoints || null,
      pow: powChallenge
    };

    return result;
  }

  /**
   * Verify a user's answer against the server-stored answer.
   * This is the CRITICAL security boundary — the server is the source of truth.
   *
   * @param {string} challengeId - The challenge ID
   * @param {string} userAnswer - The user's answer
   * @param {Object} behavioralData - Optional behavioral analysis data from client
   * @param {string} clientToken - Optional client token for session binding verification
   * @returns {Object} Verification result
   */
  verifyAnswer(challengeId, userAnswer, behavioralData = null, clientToken = null) {
    const challenge = this.store.get(challengeId);

    if (!challenge) {
      return {
        success: false,
        verified: false,
        error: 'Challenge expired or invalid'
      };
    }

    if (challenge.solved) {
      return {
        success: false,
        verified: false,
        error: 'Challenge already solved'
      };
    }

    if (Date.now() > challenge.expiresAt) {
      this.store.delete(challengeId);
      return {
        success: false,
        verified: false,
        error: 'Challenge expired'
      };
    }

    if (clientToken) {
      const boundToken = this._sessionBindings.get(challengeId);
      if (boundToken && boundToken !== clientToken) {
        this.store.delete(challengeId);
        return {
          success: false,
          verified: false,
          error: 'Session binding mismatch'
        };
      }
    }

    if (this._powConfig.enabled) {
      const powData = this.store.get('pow_' + challengeId);
      if (powData) {
        const powResult = this._verifyPoW(powData, behavioralData);
        if (!powResult.valid) {
          this.store.delete(challengeId);
          this.store.delete('pow_' + challengeId);
          return {
            success: false,
            verified: false,
            error: powResult.error || 'Proof-of-Work verification failed'
          };
        }
      }
      this.store.delete('pow_' + challengeId);
    }

    challenge.attempts++;

    if (challenge.attempts > challenge.maxAttempts) {
      this.store.delete(challengeId);
      return {
        success: false,
        verified: false,
        error: 'Maximum attempts exceeded'
      };
    }

    let isCorrect = false;

    if (challenge.type === 'imagePuzzle') {
      const normalizedUser = userAnswer.split(',').map(s => s.trim()).sort().join(',');
      const normalizedAnswer = challenge.answer.split(',').map(s => s.trim()).sort().join(',');
      isCorrect = normalizedUser === normalizedAnswer;
    } else if (challenge.type === 'visualPath') {
      isCorrect = this._verifyPathChallenge(challenge, userAnswer, behavioralData);
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === challenge.answer.toLowerCase().trim();
    }

    if (isCorrect) {
      challenge.solved = true;
      this.store.set(challengeId, challenge);

      const trustScore = this._calculateTrustScore(behavioralData);

      return {
        success: true,
        verified: true,
        trustScore: trustScore,
        challengeId: challengeId
      };
    } else {
      const remaining = challenge.maxAttempts - challenge.attempts;

      if (remaining <= 0) {
        this.store.delete(challengeId);
        return {
          success: false,
          verified: false,
          error: 'Maximum attempts exceeded'
        };
      }

      this.store.set(challengeId, challenge);
      return {
        success: false,
        verified: false,
        error: `Incorrect answer. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
        remainingAttempts: remaining
      };
    }
  }

  /**
   * Verify a path challenge using behavioral analysis.
   * The server validates the trace data sent from the client.
   */
  _verifyPathChallenge(challenge, userAnswer, behavioralData) {
    try {
      const traceData = JSON.parse(userAnswer);

      if (!traceData.points || traceData.points.length < (challenge.minTracePoints || 20)) {
        return false;
      }

      const duration = (traceData.endTime || 0) - (traceData.startTime || 0);
      if (duration < 500) return false;

      const points = traceData.points;
      let totalDistance = 0;
      let directionChanges = 0;

      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);

        if (i >= 2) {
          const dx1 = points[i - 1].x - points[i - 2].x;
          const dy1 = points[i - 1].y - points[i - 2].y;
          const dx2 = points[i].x - points[i - 1].x;
          const dy2 = points[i].y - points[i - 1].y;
          const cross = dx1 * dy2 - dy1 * dx2;
          if (Math.abs(cross) > 5) directionChanges++;
        }
      }

      const directionChangeRate = directionChanges / Math.max(points.length - 2, 1);
      if (directionChangeRate < 0.02) return false;

      const intervals = [];
      for (let i = 1; i < points.length; i++) {
        intervals.push(points[i].t - points[i - 1].t);
      }
      if (intervals.length > 1) {
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
        const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
        if (cv < 0.05) return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Calculate a trust score from behavioral data sent by the client.
   * This supplements the challenge verification with passive signals.
   */
  _calculateTrustScore(behavioralData) {
    if (!behavioralData) return 0.5;

    let score = 0.5;

    if (behavioralData.mouseMovements && behavioralData.mouseMovements.length > 10) {
      score += 0.15;
    }

    if (behavioralData.timeOnPage && behavioralData.timeOnPage > 3000) {
      score += 0.1;
    }

    if (behavioralData.interactionCount && behavioralData.interactionCount > 5) {
      score += 0.1;
    }

    if (behavioralData.keyPresses && behavioralData.keyPresses.length > 0) {
      score += 0.05;
    }

    if (behavioralData.linearity && behavioralData.linearity < 0.9) {
      score += 0.1;
    }

    return Math.min(Math.max(score, 0), 1);
  }

  _verifyPoW(powData, behavioralData) {
    if (!behavioralData || !behavioralData.pow || behavioralData.pow.nonce === undefined) {
      return { valid: false, error: 'Missing Proof-of-Work solution' };
    }

    const nonce = parseInt(behavioralData.pow.nonce, 10);
    if (isNaN(nonce) || nonce < 0) {
      return { valid: false, error: 'Invalid Proof-of-Work nonce' };
    }

    const data = powData.secret + nonce.toString();
    const hash = ServerCrypto.hash(data);
    const target = '0'.repeat(powData.difficulty);

    if (!hash.startsWith(target)) {
      return { valid: false, error: 'Proof-of-Work hash does not meet difficulty target' };
    }

    if (behavioralData.pow.elapsedMs !== undefined) {
      const minTime = Math.pow(16, powData.difficulty) * 0.0005;
      if (behavioralData.pow.elapsedMs < minTime) {
        return { valid: false, error: 'Proof-of-Work solved too quickly — possible pre-computation' };
      }
    }

    return { valid: true };
  }

  _calculateAdaptiveDifficulty(behavioralData) {
    if (!this._powConfig.adaptivePow) return this._powConfig.difficulty;

    const trustScore = this._calculateTrustScore(behavioralData);

    if (trustScore >= 0.8) return Math.max(1, this._powConfig.difficulty - 1);
    if (trustScore >= 0.5) return this._powConfig.difficulty;
    if (trustScore >= 0.3) return this._powConfig.difficulty + 1;
    return this._powConfig.difficulty + 2;
  }

  /**
   * Generate a CSRF token bound to the current session.
   */
  generateCSRFToken(sessionId) {
    const token = ServerCrypto.generateToken(16);
    const hash = ServerCrypto.hmac(token, this.secret);
    this.store.set('csrf_' + hash, { sessionId, createdAt: Date.now() });
    return token;
  }

  /**
   * Validate a CSRF token.
   */
  validateCSRFToken(token, sessionId) {
    const hash = ServerCrypto.hmac(token, this.secret);
    const stored = this.store.get('csrf_' + hash);

    if (!stored) return false;
    if (stored.sessionId !== sessionId) return false;
    if (Date.now() - stored.createdAt > 3600000) {
      this.store.delete('csrf_' + hash);
      return false;
    }

    return true;
  }

  /**
   * Invalidate a challenge (cleanup after verification or abandonment).
   */
  invalidateChallenge(challengeId) {
    this.store.delete(challengeId);
    this._sessionBindings.delete(challengeId);
  }

  /**
   * Create Express middleware that adds VaultGuard methods to req/res.
   */
  middleware() {
    const self = this;

    return function vaultGuardMiddleware(req, res, next) {
      let rateLimitInfo = null;

      if (self._rateLimiter) {
        const endpointType = req.path.includes('verify') ? 'verify'
          : req.path.includes('challenge') ? 'challenge'
            : 'default';
        rateLimitInfo = self._rateLimiter.check(req, endpointType);

        res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimitInfo.remaining));

        if (!rateLimitInfo.allowed) {
          res.setHeader('Retry-After', rateLimitInfo.retryAfter);
          res.status(429).json({
            success: false,
            error: rateLimitInfo.banned
              ? 'Too many requests. You have been temporarily banned.'
              : 'Rate limit exceeded. Please slow down.',
            retryAfter: rateLimitInfo.retryAfter,
            banned: rateLimitInfo.banned
          });
          return;
        }
      }

      req.vaultGuard = {
        generateChallenge: (clientToken) => self.generateChallenge(clientToken),
        verifyAnswer: (challengeId, answer, behavioral, token) =>
          self.verifyAnswer(challengeId, answer, behavioral, token),
        generateCSRFToken: (sessionId) => self.generateCSRFToken(sessionId),
        validateCSRFToken: (token, sessionId) => self.validateCSRFToken(token, sessionId),
        invalidateChallenge: (id) => self.invalidateChallenge(id),
        getRateLimitInfo: () => rateLimitInfo
      };

      res.vaultGuardJSON = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        if (rateLimitInfo) {
          res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
          res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimitInfo.remaining));
        }
        res.json(data);
      };

      next();
    };
  }

  /**
   * Destroy the server instance and cleanup resources.
   */
  destroy() {
    this.store.destroy();
    this._sessionBindings.clear();
    if (this._rateLimiter) this._rateLimiter.destroy();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

function create(options = {}) {
  return new VaultGuardServer(options);
}

function middleware(options = {}) {
  const instance = new VaultGuardServer(options);
  const mw = instance.middleware();
  mw.instance = instance;
  return mw;
}

module.exports = {
  create,
  middleware,
  VaultGuardServer,
  MemoryStore,
  RedisStore,
  RateLimiter,
  ServerCrypto,
  ServerChallengeGenerators,
  VAULTGUARD_SERVER
};
