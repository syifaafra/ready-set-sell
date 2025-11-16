// ============================================
// Authentication Middleware
// ============================================

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token diperlukan'
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({
          success: false,
          error: 'Token sudah kadaluarsa'
        });
      }
      return res.status(403).json({
        success: false,
        error: 'Token tidak valid'
      });
    }

    req.user = user;
    next();
  });
}

// Optional authentication (for public endpoints that can benefit from user context)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

// Check if user belongs to specific kelompok
function checkKelompok(allowedKelompok) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    if (!allowedKelompok.includes(req.user.kelompok)) {
      return res.status(403).json({
        success: false,
        error: 'Akses ditolak untuk kelompok ini'
      });
    }

    next();
  };
}

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(
    payload,
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
      ...jwtConfig.options
    }
  );
}

module.exports = {
  authenticateToken,
  optionalAuth,
  checkKelompok,
  generateToken
};