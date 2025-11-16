# ============================================
# FILE: .gitignore
# ============================================

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.db-journal
database/*.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Build
dist/
build/
```

# ============================================
# FILE: README.md
# ============================================

# 🎮 Ready Set Sell - Backend API

Backend API untuk game simulasi bisnis Ready Set Sell. Dibangun dengan Node.js, Express, dan SQLite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

- ✅ **Authentication System** - JWT-based authentication
- ✅ **Game Management** - Save & track game decisions per quarter
- ✅ **Leaderboard** - Real-time ranking by group
- ✅ **Statistics** - Performance metrics and analytics
- ✅ **Admin Panel** - Monitor all users and sessions
- ✅ **Rate Limiting** - Prevent API abuse
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Validation** - Input validation using Joi
- ✅ **Security** - Helmet, CORS, secure headers

## 🛠 Tech Stack

- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan

## 📦 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ready-set-sell/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file sesuai kebutuhan:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h
DB_PATH=./database/ready-set-sell.db
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 4. Initialize Database

```bash
npm run init-db
```

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | Token expiration | `24h` |
| `DB_PATH` | Database path | `./database/ready-set-sell.db` |
| `CORS_ORIGIN` | Allowed origins | `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "kelompok": "A",
  "tanggal_main": "2024-12-01",
  "waktu_main": "14:00"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Game Endpoints

#### Save Decision
```http
POST /api/game/decision
Authorization: Bearer <token>
Content-Type: application/json

{
  "kuartil": 1,
  "marketing_1": "Iklan Radio",
  "marketing_2": "Billboard",
  "marketing_3": "SEO",
  "supplier_a": 10,
  "supplier_b": 20,
  "supplier_c": 30,
  "supplier_d": 40,
  "offline_price": 50000,
  "online_price": 45000,
  "kas_tersedia": 58000000,
  "rating_offline": 4.2,
  "rating_online": 4.5
}
```

#### Get All Decisions
```http
GET /api/game/decisions
Authorization: Bearer <token>
```

#### Get Summary
```http
GET /api/game/summary
Authorization: Bearer <token>
```

#### Get Leaderboard
```http
GET /api/game/leaderboard/:kelompok
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### Get All Sessions
```http
GET /api/admin/sessions
Authorization: Bearer <token>
```

#### Get Global Leaderboard
```http
GET /api/admin/leaderboard/global
Authorization: Bearer <token>
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── jwt.js               # JWT configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── gameController.js    # Game logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── gameRoutes.js        # Game endpoints
│   │   └── adminRoutes.js       # Admin endpoints
│   └── utils/
│       ├── validation.js        # Input validation
│       └── response.js          # Response utilities
├── database/
│   └── ready-set-sell.db        # SQLite database
├── server.js                    # Main entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── README.md                    # This file
```

## 🔧 Development

### Run Tests

```bash
npm test
```

### Seed Sample Data

```bash
npm run seed
```

### Backup Database

```bash
npm run backup
```

### Code Style

Project menggunakan standard JavaScript code style. Pastikan code Anda:
- Menggunakan camelCase untuk variables
- Menggunakan PascalCase untuk classes
- Menggunakan 2 spaces untuk indentation
- Menggunakan semicolons

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Set environment variables:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
```

5. Deploy:
```bash
railway up
```

### Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create ready-set-sell-api`
4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
```
5. Deploy: `git push heroku main`

## 🔒 Security

- JWT tokens expire after 24 hours
- Rate limiting: 100 requests per 15 minutes
- CORS enabled for specified origins only
- Helmet for security headers
- Input validation using Joi
- SQL injection prevention

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributors

- Your Name - Initial work

## 📞 Support

For support, email support@readysetsell.com or create an issue in the repository.