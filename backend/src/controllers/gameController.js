// ============================================
// Game Controller
// ============================================

const { runQuery, getRow, getAllRows } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const ResponseHandler = require('../utils/response');

// Save or update decision for a quarter
exports.saveDecision = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = req.validatedBody;

  // Check if decision already exists
  const existing = await getRow(
    'SELECT id FROM game_sessions WHERE user_id = ? AND kuartil = ?',
    [userId, data.kuartil]
  );

  let result;
  if (existing) {
    // Update existing decision
    result = await runQuery(
      `UPDATE game_sessions SET
        marketing_1 = ?, marketing_2 = ?, marketing_3 = ?,
        supplier_a = ?, supplier_b = ?, supplier_c = ?, supplier_d = ?,
        offline_price = ?, online_price = ?,
        kas_tersedia = ?, rating_offline = ?, rating_online = ?,
        pembeli_offline = ?, pembeli_online = ?,
        revenue_offline = ?, revenue_online = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND kuartil = ?`,
      [
        data.marketing_1, data.marketing_2, data.marketing_3,
        data.supplier_a, data.supplier_b, data.supplier_c, data.supplier_d,
        data.offline_price, data.online_price,
        data.kas_tersedia, data.rating_offline, data.rating_online,
        data.pembeli_offline, data.pembeli_online,
        data.revenue_offline, data.revenue_online,
        userId, data.kuartil
      ]
    );

    // Update leaderboard cache
    await updateLeaderboardCache(userId);

    ResponseHandler.success(res, {
      session_id: existing.id,
      kuartil: data.kuartil
    }, `Keputusan kuartil ${data.kuartil} berhasil diupdate`);
  } else {
    // Insert new decision
    result = await runQuery(
      `INSERT INTO game_sessions (
        user_id, kuartil,
        marketing_1, marketing_2, marketing_3,
        supplier_a, supplier_b, supplier_c, supplier_d,
        offline_price, online_price,
        kas_tersedia, rating_offline, rating_online,
        pembeli_offline, pembeli_online,
        revenue_offline, revenue_online
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, data.kuartil,
        data.marketing_1, data.marketing_2, data.marketing_3,
        data.supplier_a, data.supplier_b, data.supplier_c, data.supplier_d,
        data.offline_price, data.online_price,
        data.kas_tersedia, data.rating_offline, data.rating_online,
        data.pembeli_offline, data.pembeli_online,
        data.revenue_offline, data.revenue_online
      ]
    );

    // Update leaderboard cache
    await updateLeaderboardCache(userId);

    ResponseHandler.created(res, {
      session_id: result.lastID,
      kuartil: data.kuartil
    }, `Keputusan kuartil ${data.kuartil} berhasil disimpan`);
  }
});

// Get all decisions by user
exports.getAllDecisions = asyncHandler(async (req, res) => {
  const decisions = await getAllRows(
    `SELECT * FROM game_sessions 
     WHERE user_id = ? 
     ORDER BY kuartil ASC`,
    [req.user.id]
  );

  ResponseHandler.success(res, { decisions }, 'Data keputusan berhasil diambil');
});

// Get decision by kuartil
exports.getDecisionByKuartil = asyncHandler(async (req, res) => {
  const kuartil = parseInt(req.params.kuartil);

  if (kuartil < 1 || kuartil > 8) {
    return ResponseHandler.badRequest(res, 'Kuartil harus antara 1-8');
  }

  const decision = await getRow(
    'SELECT * FROM game_sessions WHERE user_id = ? AND kuartil = ?',
    [req.user.id, kuartil]
  );

  if (!decision) {
    return ResponseHandler.notFound(res, `Data kuartil ${kuartil} tidak ditemukan`);
  }

  ResponseHandler.success(res, { decision }, 'Data keputusan berhasil diambil');
});

// Get summary statistics
exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await getRow(
    `SELECT 
      COUNT(DISTINCT kuartil) as kuartil_selesai,
      SUM(supplier_a + supplier_b + supplier_c + supplier_d) as total_pengadaan,
      MAX(kas_tersedia) as kas_tertinggi,
      AVG(rating_offline) as avg_rating_offline,
      AVG(rating_online) as avg_rating_online,
      SUM(pembeli_offline) as total_pembeli_offline,
      SUM(pembeli_online) as total_pembeli_online,
      SUM(revenue_offline + revenue_online) as total_revenue
    FROM game_sessions
    WHERE user_id = ?`,
    [req.user.id]
  );

  ResponseHandler.success(res, { summary }, 'Summary berhasil diambil');
});

// Get leaderboard by kelompok
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const kelompok = req.params.kelompok.toUpperCase();

  if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(kelompok)) {
    return ResponseHandler.badRequest(res, 'Kelompok harus A-H');
  }

  const leaderboard = await getAllRows(
    `SELECT 
      username,
      total_kuartil,
      kas_tertinggi,
      total_revenue,
      avg_rating_offline,
      avg_rating_online,
      updated_at
    FROM leaderboard_cache
    WHERE kelompok = ?
    ORDER BY kas_tertinggi DESC, total_revenue DESC, total_kuartil DESC
    LIMIT 50`,
    [kelompok]
  );

  ResponseHandler.success(res, {
    kelompok,
    leaderboard
  }, 'Leaderboard berhasil diambil');
});

// Delete decision by kuartil
exports.deleteDecision = asyncHandler(async (req, res) => {
  const kuartil = parseInt(req.params.kuartil);

  if (kuartil < 1 || kuartil > 8) {
    return ResponseHandler.badRequest(res, 'Kuartil harus antara 1-8');
  }

  const result = await runQuery(
    'DELETE FROM game_sessions WHERE user_id = ? AND kuartil = ?',
    [req.user.id, kuartil]
  );

  if (result.changes === 0) {
    return ResponseHandler.notFound(res, `Data kuartil ${kuartil} tidak ditemukan`);
  }

  // Update leaderboard cache
  await updateLeaderboardCache(req.user.id);

  ResponseHandler.success(res, null, `Data kuartil ${kuartil} berhasil dihapus`);
});

// Helper function to update leaderboard cache
async function updateLeaderboardCache(userId) {
  // Get user info
  const user = await getRow(
    'SELECT username, kelompok FROM users WHERE id = ?',
    [userId]
  );

  if (!user) return;

  // Calculate statistics
  const stats = await getRow(
    `SELECT 
      COUNT(DISTINCT kuartil) as total_kuartil,
      MAX(kas_tersedia) as kas_tertinggi,
      SUM(revenue_offline + revenue_online) as total_revenue,
      AVG(rating_offline) as avg_rating_offline,
      AVG(rating_online) as avg_rating_online
    FROM game_sessions
    WHERE user_id = ?`,
    [userId]
  );

  // Update or insert leaderboard cache
  await runQuery(
    `INSERT OR REPLACE INTO leaderboard_cache 
     (kelompok, user_id, username, total_kuartil, kas_tertinggi, total_revenue, 
      avg_rating_offline, avg_rating_online, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      user.kelompok,
      userId,
      user.username,
      stats.total_kuartil || 0,
      stats.kas_tertinggi || 0,
      stats.total_revenue || 0,
      stats.avg_rating_offline || 0,
      stats.avg_rating_online || 0
    ]
  );
}