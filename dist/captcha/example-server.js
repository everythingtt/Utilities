/**
 * VaultGuard™ CAPTCHA — Example Express Server (v2.0.0)
 *
 * This example demonstrates how to integrate the VaultGuard™ server-side
 * companion library with an Express.js application.
 *
 * The server is the SOURCE OF TRUTH for challenge answers.
 * The client never sees the answer — it only sees the question.
 *
 * Setup:
 *   npm install express express-session
 *   node example-server.js
 *
 * For production with Redis:
 *   npm install redis
 *   const redis = require('redis');
 *   const client = redis.createClient();
 *   app.use(vaultGuard.middleware({ secret: 'your-secret', redis: client }));
 */

'use strict';

const express = require('express');
const session = require('express-session');
const path = require('path');
const vaultGuard = require('./vaultguard-server');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'change-this-to-a-random-string',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

// VaultGuard server middleware — adds req.vaultGuard methods
// For production, add Redis: vaultGuard.middleware({ secret: 'key', redis: redisClient })
app.use(vaultGuard.middleware({
  secret: 'your-secret-key-change-in-production',
  ttl: 300000,
  maxAttempts: 3,
  challengeTypes: ['math', 'text', 'pattern', 'imagePuzzle', 'textIllusion', 'audio', 'visualPath']
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://loremflickr.com data:; connect-src 'self'; frame-ancestors 'none';"
  );
  next();
});

// ═══════════════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// Generate a new challenge
// POST /api/vaultguard/challenge
// Returns: { id, question, type, expiresIn, ... }
app.post('/api/vaultguard/challenge', (req, res) => {
  const clientToken = req.sessionID || null;
  const challenge = req.vaultGuard.generateChallenge(clientToken);
  res.vaultGuardJSON(challenge);
});

// Verify a user's answer
// POST /api/vaultguard/verify
// Body: { challengeId, answer, behavioral }
// Returns: { success, verified, trustScore, error, remainingAttempts }
app.post('/api/vaultguard/verify', (req, res) => {
  const { challengeId, answer, behavioral } = req.body;

  if (!challengeId || answer === undefined) {
    return res.vaultGuardJSON({
      success: false,
      verified: false,
      error: 'Missing challengeId or answer'
    });
  }

  const clientToken = req.sessionID || null;
  const result = req.vaultGuard.verifyAnswer(challengeId, answer, behavioral, clientToken);
  res.vaultGuardJSON(result);
});

// Generate a CSRF token for the session
// POST /api/vaultguard/csrf
app.post('/api/vaultguard/csrf', (req, res) => {
  const token = req.vaultGuard.generateCSRFToken(req.sessionID);
  res.vaultGuardJSON({ token });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC FILES
// ═══════════════════════════════════════════════════════════════════════════════

app.use(express.static(path.join(__dirname, 'dist', 'captcha')));

// ═══════════════════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║  VaultGuard™ CAPTCHA Server v2.0.0 'Aegis'          ║
  ║  Running on http://localhost:${PORT}                   ║
  ║                                                      ║
  ║  Endpoints:                                          ║
  ║    POST /api/vaultguard/challenge  — Get challenge   ║
  ║    POST /api/vaultguard/verify     — Verify answer   ║
  ║    POST /api/vaultguard/csrf       — Get CSRF token  ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
