/**
 * VaultGuard™ CAPTCHA — httpbin.org Demo Server
 *
 * This demo server enables the httpbin.org proxy mode for transparent
 * request/response inspection. All challenge and verify requests are
 * echoed through httpbin.org/post so developers can see exactly what
 * data is exchanged between client and server.
 *
 * Setup:
 *   npm install express express-session
 *   node demo-server.js
 *
 * Then open: http://localhost:3000/demo-httpbin.html
 *
 * The network inspector panel (bottom-right) shows all request/response
 * payloads in real-time, including the httpbin.org echo data.
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
  secret: 'vaultguard-demo-secret-change-me',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

// VaultGuard server middleware with demo mode + httpbin.org enabled
app.use(vaultGuard.middleware({
  secret: 'demo-secret-key',
  ttl: 300000,
  maxAttempts: 3,
  challengeTypes: ['math', 'text', 'pattern', 'imagePuzzle', 'textIllusion', 'audio', 'visualPath'],
  rateLimit: true,
  rateLimitWindowMs: 60000,
  rateLimitMaxChallenge: 20,
  rateLimitMaxVerify: 10,
  rateLimitBanThreshold: 5,
  rateLimitBanDurationMs: 300000,
  pow: true,
  powDifficulty: 2,
  adaptivePow: true,
  demoMode: true,
  httpbinUrl: 'https://httpbin.org'
}));

// Security headers (relaxed for demo)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARD API ENDPOINTS (non-demo, for comparison)
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/vaultguard/challenge', (req, res) => {
  const clientToken = req.sessionID || null;
  const challenge = req.vaultGuard.generateChallenge(clientToken);
  res.vaultGuardJSON(challenge);
});

app.post('/api/vaultguard/verify', (req, res) => {
  const { challengeId, answer, behavioral } = req.body;
  if (!challengeId || answer === undefined) {
    return res.vaultGuardJSON({ success: false, verified: false, error: 'Missing challengeId or answer' });
  }
  const clientToken = req.sessionID || null;
  const result = req.vaultGuard.verifyAnswer(challengeId, answer, behavioral, clientToken);
  res.vaultGuardJSON(result);
});

app.post('/api/vaultguard/csrf', (req, res) => {
  const token = req.vaultGuard.generateCSRFToken(req.sessionID);
  res.vaultGuardJSON({ token });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO API ENDPOINTS (httpbin.org proxy mode)
// ═══════════════════════════════════════════════════════════════════════════════

const demoRouter = req.vaultGuard.demoRouter();
app.use('/api/vaultguard/demo', demoRouter);

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC FILES
// ═══════════════════════════════════════════════════════════════════════════════

app.use(express.static(__dirname));

// ═══════════════════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════════════╗
  ║  VaultGuard™ CAPTCHA Demo Server v2.0.0 'Aegis'                  ║
  ║  Running on http://localhost:${PORT}                                ║
  ║                                                                   ║
  ║  🌐 Demo Mode: httpbin.org proxy ENABLED                          ║
  ║                                                                   ║
  ║  Endpoints:                                                       ║
  ║    Standard (no httpbin):                                         ║
  ║      POST /api/vaultguard/challenge  — Generate challenge         ║
  ║      POST /api/vaultguard/verify     — Verify answer              ║
  ║      POST /api/vaultguard/csrf       — Get CSRF token             ║
  ║                                                                   ║
  ║  Demo (httpbin.org echo):                                         ║
  ║      POST /api/vaultguard/demo/challenge  — Challenge via httpbin ║
  ║      POST /api/vaultguard/demo/verify     — Verify via httpbin    ║
  ║      GET  /api/vaultguard/demo/inspect    — Request log           ║
  ║      GET  /api/vaultguard/demo/status     — Server status         ║
  ║                                                                   ║
  ║  Pages:                                                           ║
  ║      http://localhost:${PORT}/demo-httpbin.html  — Demo page        ║
  ║      http://localhost:${PORT}/index.html         — Standard demo    ║
  ╚═══════════════════════════════════════════════════════════════════╝
  `);
});
