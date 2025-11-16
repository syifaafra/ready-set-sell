
// ============================================
// FILE: src/routes/adminRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const { getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const ResponseHandler = require('../utils/response');

// All admin routes require authentication
router.use(authenticateToken);

// Get all users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await getAllRows(`
    SELECT 
      id, username, kelompok, tanggal_main, waktu_main, 
      is_active, created_at
    FROM users 
    ORDER BY created_at DESC
  `);

  ResponseHandler.success(res, { users, total: users.length }, 'Data users berhasil diambil');
}));

// Get all sessions
router.get('/sessions', asyncHandler(async (req, res) => {
  const sessions = await getAllRows(`
    SELECT 
      g.*,
      u.username,
      u.kelompok
    FROM game_sessions g
    JOIN users u ON g.user_id = u.id
    ORDER BY g.created_at DESC
  `);

  ResponseHandler.success(res, { sessions, total: sessions.length }, 'Data sessions berhasil diambil');
}));

// Get statistics by kelompok
router.get('/stats/:kelompok', asyncHandler(async (req, res) => {
  const kelompok = req.params.kelompok.toUpperCase();
  
  const stats = await getAllRows(`
    SELECT 
      u.kelompok,
      COUNT(DISTINCT u.id) as total_peserta,
      COUNT(DISTINCT g.id) as total_sessions,
      AVG(g.kas_tersedia) as avg_kas,
      MAX(g.kas_tersedia) as max_kas,
      AVG(g.rating_offline) as avg_rating_offline,
      AVG(g.rating_online) as avg_rating_online
    FROM users u
    LEFT JOIN game_sessions g ON u.id = g.user_id
    WHERE u.kelompok = ?
    GROUP BY u.kelompok
  `, [kelompok]);

  ResponseHandler.success(res, { stats: stats[0] || {} }, 'Statistik berhasil diambil');
}));

// Get global leaderboard (all kelompok)
router.get('/leaderboard/global', asyncHandler(async (req, res) => {
  const leaderboard = await getAllRows(`
    SELECT 
      kelompok,
      username,
      total_kuartil,
      kas_tertinggi,
      total_revenue,
      avg_rating_offline,
      avg_rating_online
    FROM leaderboard_cache
    ORDER BY kas_tertinggi DESC, total_revenue DESC
    LIMIT 100
  `);

  ResponseHandler.success(res, { leaderboard, total: leaderboard.length }, 'Global leaderboard berhasil diambil');
}));

module.exports = router;