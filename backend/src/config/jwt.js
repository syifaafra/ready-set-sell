// ============================================
// JWT Configuration
// ============================================

require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'ready-set-sell-default-secret-key',
  expiresIn: process.env.JWT_EXPIRE || '24h',
  
  // JWT options
  options: {
    algorithm: 'HS256',
    issuer: 'ready-set-sell-api',
    audience: 'ready-set-sell-users'
  }
};