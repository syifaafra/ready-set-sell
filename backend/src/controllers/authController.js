// ============================================
// Authentication Controller
// ============================================

const { runQuery, getRow } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const ResponseHandler = require('../utils/response');

// Register new user
exports.register = asyncHandler(async (req, res) => {
  const { username, kelompok, tanggal_main, waktu_main } = req.validatedBody;

  // Check if username already exists
  const existingUser = await getRow(
    'SELECT id FROM users WHERE username = ?',
    [username]
  );

  if (existingUser) {
    return ResponseHandler.conflict(res, 'Username sudah digunakan');
  }

  // Insert new user
  const result = await runQuery(
    `INSERT INTO users (username, kelompok, tanggal_main, waktu_main) 
     VALUES (?, ?, ?, ?)`,
    [username, kelompok.toUpperCase(), tanggal_main, waktu_main]
  );

  // Generate JWT token
  const token = generateToken({
    id: result.lastID,
    username,
    kelompok: kelompok.toUpperCase()
  });

  // Return user data and token
  ResponseHandler.created(res, {
    user: {
      id: result.lastID,
      username,
      kelompok: kelompok.toUpperCase(),
      tanggal_main,
      waktu_main
    },
    token
  }, 'Registrasi berhasil');
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const { username } = req.validatedBody;

  // Find user
  const user = await getRow(
    `SELECT id, username, kelompok, tanggal_main, waktu_main, is_active 
     FROM users WHERE username = ?`,
    [username]
  );

  if (!user) {
    return ResponseHandler.notFound(res, 'Username tidak ditemukan');
  }

  if (!user.is_active) {
    return ResponseHandler.forbidden(res, 'Akun tidak aktif');
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    username: user.username,
    kelompok: user.kelompok
  });

  // Return user data and token
  ResponseHandler.success(res, {
    user: {
      id: user.id,
      username: user.username,
      kelompok: user.kelompok,
      tanggal_main: user.tanggal_main,
      waktu_main: user.waktu_main
    },
    token
  }, 'Login berhasil');
});

// Get user profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await getRow(
    `SELECT id, username, kelompok, tanggal_main, waktu_main, created_at 
     FROM users WHERE id = ?`,
    [req.user.id]
  );

  if (!user) {
    return ResponseHandler.notFound(res, 'User tidak ditemukan');
  }

  ResponseHandler.success(res, { user }, 'Profile berhasil diambil');
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { tanggal_main, waktu_main } = req.body;

  const result = await runQuery(
    `UPDATE users 
     SET tanggal_main = COALESCE(?, tanggal_main),
         waktu_main = COALESCE(?, waktu_main),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [tanggal_main, waktu_main, req.user.id]
  );

  if (result.changes === 0) {
    return ResponseHandler.notFound(res, 'User tidak ditemukan');
  }

  // Get updated user data
  const user = await getRow(
    'SELECT id, username, kelompok, tanggal_main, waktu_main FROM users WHERE id = ?',
    [req.user.id]
  );

  ResponseHandler.success(res, { user }, 'Profile berhasil diupdate');
});

// Deactivate account
exports.deactivateAccount = asyncHandler(async (req, res) => {
  const result = await runQuery(
    'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.user.id]
  );

  if (result.changes === 0) {
    return ResponseHandler.notFound(res, 'User tidak ditemukan');
  }

  ResponseHandler.success(res, null, 'Akun berhasil dinonaktifkan');
});