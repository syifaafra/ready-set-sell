// ============================================
// Database Configuration
// ============================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database/ready-set-sell.db';

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Table: Users
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          kelompok TEXT NOT NULL CHECK(kelompok IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')),
          tanggal_main DATE NOT NULL,
          waktu_main TIME NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Table: Game Sessions
      db.run(`
        CREATE TABLE IF NOT EXISTS game_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          kuartil INTEGER NOT NULL CHECK(kuartil BETWEEN 1 AND 8),
          
          -- Marketing Strategy
          marketing_1 TEXT,
          marketing_2 TEXT,
          marketing_3 TEXT,
          
          -- Procurement
          supplier_a INTEGER DEFAULT 0,
          supplier_b INTEGER DEFAULT 0,
          supplier_c INTEGER DEFAULT 0,
          supplier_d INTEGER DEFAULT 0,
          total_procurement INTEGER GENERATED ALWAYS AS (supplier_a + supplier_b + supplier_c + supplier_d) VIRTUAL,
          
          -- Pricing
          offline_price INTEGER DEFAULT 0,
          online_price INTEGER DEFAULT 0,
          
          -- Performance Metrics
          kas_tersedia INTEGER DEFAULT 0,
          rating_offline REAL DEFAULT 0,
          rating_online REAL DEFAULT 0,
          
          -- Sales Data
          pembeli_offline INTEGER DEFAULT 0,
          pembeli_online INTEGER DEFAULT 0,
          revenue_offline INTEGER DEFAULT 0,
          revenue_online INTEGER DEFAULT 0,
          total_revenue INTEGER GENERATED ALWAYS AS (revenue_offline + revenue_online) VIRTUAL,
          
          -- Timestamps
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(user_id, kuartil)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Table: Leaderboard Cache (for performance)
      db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          kelompok TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          username TEXT NOT NULL,
          total_kuartil INTEGER DEFAULT 0,
          kas_tertinggi INTEGER DEFAULT 0,
          total_revenue INTEGER DEFAULT 0,
          avg_rating_offline REAL DEFAULT 0,
          avg_rating_online REAL DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(kelompok, user_id)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Database tables initialized');
          resolve();
        }
      });

      // Create indexes for better performance
      db.run('CREATE INDEX IF NOT EXISTS idx_users_kelompok ON users(kelompok)');
      db.run('CREATE INDEX IF NOT EXISTS idx_sessions_user_kuartil ON game_sessions(user_id, kuartil)');
      db.run('CREATE INDEX IF NOT EXISTS idx_leaderboard_kelompok ON leaderboard_cache(kelompok, kas_tertinggi DESC)');
    });
  });
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper function to get all rows
function getAllRows(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Graceful shutdown
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Database connection closed');
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  initDatabase,
  runQuery,
  getRow,
  getAllRows,
  closeDatabase
};