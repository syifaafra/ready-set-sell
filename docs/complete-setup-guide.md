# 🎮 Ready Set Sell - Complete Setup Guide

Panduan lengkap untuk setup project Ready Set Sell dari awal sampai running.

---

## 📁 STEP 1: Buat Struktur Folder

```bash
# Buat folder utama project
mkdir ready-set-sell
cd ready-set-sell

# Buat struktur backend
mkdir -p backend/src/{config,controllers,middleware,routes,utils}
mkdir -p backend/database
mkdir -p backend/tests

# Buat struktur frontend
mkdir -p frontend/public
mkdir -p frontend/src

# Buat folder dokumentasi
mkdir docs
```

Struktur folder yang terbentuk:

```
ready-set-sell/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── database/
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
└── docs/
```

---

## 📦 STEP 2: Setup Backend

### 2.1 Initialize NPM

```bash
cd backend
npm init -y
```

### 2.2 Install Dependencies

```bash
# Production dependencies
npm install express cors sqlite3 bcryptjs jsonwebtoken dotenv helmet express-rate-limit morgan joi

# Development dependencies
npm install --save-dev nodemon jest supertest
```

### 2.3 Buat File-File Backend

#### File 1: `package.json`
```json
{
  "name": "ready-set-sell-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "morgan": "^1.10.0",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

#### File 2: `.env`
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=ready-set-sell-secret-key-2024
JWT_EXPIRE=24h
DB_PATH=./database/ready-set-sell.db
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

#### File 3: `.gitignore`
```
node_modules/
.env
*.db
*.log
.DS_Store
```

#### File 4: `src/config/database.js`
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database/ready-set-sell.db';
const fs = require('fs');
const dbDir = path.dirname(DB_PATH);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

db.run('PRAGMA foreign_keys = ON');

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          kelompok TEXT NOT NULL CHECK(kelompok IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')),
          tanggal_main DATE NOT NULL,
          waktu_main TIME NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS game_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          kuartil INTEGER NOT NULL CHECK(kuartil BETWEEN 1 AND 8),
          marketing_1 TEXT,
          marketing_2 TEXT,
          marketing_3 TEXT,
          supplier_a INTEGER DEFAULT 0,
          supplier_b INTEGER DEFAULT 0,
          supplier_c INTEGER DEFAULT 0,
          supplier_d INTEGER DEFAULT 0,
          offline_price INTEGER DEFAULT 0,
          online_price INTEGER DEFAULT 0,
          kas_tersedia INTEGER DEFAULT 0,
          rating_offline REAL DEFAULT 0,
          rating_online REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          UNIQUE(user_id, kuartil)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Database tables initialized');
          resolve();
        }
      });
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getAllRows(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { db, initDatabase, runQuery, getRow, getAllRows };
```

Copy semua file dari artifacts sebelumnya untuk:
- `src/config/jwt.js`
- `src/middleware/auth.js`
- `src/middleware/errorHandler.js`
- `src/utils/validation.js`
- `src/utils/response.js`
- `src/controllers/authController.js`
- `src/controllers/gameController.js`
- `src/routes/authRoutes.js`
- `src/routes/gameRoutes.js`
- `src/routes/adminRoutes.js`
- `server.js`

---

## 🎨 STEP 3: Setup Frontend

### 3.1 Buat File HTML

```bash
cd ../frontend
```

Buat file `public/index.html` (copy dari artifact frontend-with-backend)

### 3.2 Test Frontend Langsung

Buka `index.html` di browser atau gunakan Live Server.

---

## 🚀 STEP 4: Jalankan Aplikasi

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

Output yang diharapkan:
```
✅ Connected to SQLite database
✅ Database tables initialized
╔═══════════════════════════════════════════╗
║   🎮 Ready Set Sell - Backend API        ║
║   Port: 3000                              ║
║   URL: http://localhost:3000              ║
║   Status: ✅ Running                      ║
╚═══════════════════════════════════════════╝
```

### Terminal 2 - Frontend (Optional)
```bash
cd frontend
# Jika pakai React:
npm create vite@latest . -- --template react
npm install
npm run dev
```

Atau buka langsung `index.html` di browser.

---

## 🧪 STEP 5: Testing API

### Test dengan cURL

**1. Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "kelompok": "A",
    "tanggal_main": "2024-12-01",
    "waktu_main": "14:00"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

Copy token dari response, lalu:

**3. Save Decision**
```bash
curl -X POST http://localhost:3000/api/game/decision \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "kuartil": 1,
    "marketing_1": "Iklan Radio",
    "marketing_2": "Billboard",
    "marketing_3": "SEO",
    "supplier_a": 10,
    "kas_tersedia": 50000000,
    "rating_offline": 4.2
  }'
```

### Test dengan Postman/Thunder Client

1. Import collection dari docs
2. Set variable `{{baseUrl}}` = `http://localhost:3000/api`
3. Set variable `{{token}}` setelah login
4. Test semua endpoints

---

## 📊 STEP 6: Verifikasi Database

```bash
cd backend/database

# Install SQLite browser (optional)
# Mac: brew install sqlite
# Ubuntu: sudo apt install sqlite3

# Open database
sqlite3 ready-set-sell.db

# Query users
SELECT * FROM users;

# Query sessions
SELECT * FROM game_sessions;

# Exit
.exit
```

---

## 🐛 Troubleshooting

### Error: Cannot find module
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: CORS
Pastikan `CORS_ORIGIN` di `.env` sesuai dengan URL frontend Anda.

### Database locked
```bash
# Stop server dan hapus lock file
rm database/*.db-journal
```

---

## ✅ Checklist Setup

- [ ] Struktur folder dibuat
- [ ] Backend dependencies terinstall
- [ ] File `.env` sudah dikonfigurasi
- [ ] Semua file backend sudah dibuat
- [ ] Database berhasil initialized
- [ ] Server backend running di port 3000
- [ ] API bisa diakses via cURL/Postman
- [ ] Frontend HTML dibuat
- [ ] Frontend bisa connect ke backend
- [ ] Register & login berhasil
- [ ] Save decision berhasil

---

## 🎯 Next Steps

1. ✅ Implement business logic (perhitungan kas, stock, dll)
2. ✅ Tambahkan real-time features dengan WebSocket
3. ✅ Buat admin dashboard
4. ✅ Deploy ke cloud (Railway/Heroku/Vercel)
5. ✅ Setup CI/CD pipeline
6. ✅ Add automated tests
7. ✅ Setup monitoring & logging

---

## 📞 Need Help?

Jika ada error atau pertanyaan:
1. Cek logs di terminal
2. Cek file `.env` sudah benar
3. Pastikan port tidak bentrok
4. Restart server dan browser

Happy coding! 🚀