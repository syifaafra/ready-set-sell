// ============================================
// FILE: src/routes/gameRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken } = require('../middleware/auth');
const { validate, decisionSchema } = require('../utils/validation');

// All game routes require authentication
router.use(authenticateToken);

// Game session routes
router.post('/decision', validate(decisionSchema), gameController.saveDecision);
router.get('/decisions', gameController.getAllDecisions);
router.get('/decision/:kuartil', gameController.getDecisionByKuartil);
router.delete('/decision/:kuartil', gameController.deleteDecision);

// Statistics routes
router.get('/summary', gameController.getSummary);
router.get('/leaderboard/:kelompok', gameController.getLeaderboard);

module.exports = router;
