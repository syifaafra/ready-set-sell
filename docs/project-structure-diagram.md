# 📊 Ready Set Sell - Project Structure

## 🗂️ Complete File Tree

```
ready-set-sell/
│
├── 📂 backend/                          # Backend API Server
│   │
│   ├── 📂 src/                          # Source Code
│   │   │
│   │   ├── 📂 config/                   # Configuration Files
│   │   │   ├── database.js              # SQLite setup & helpers
│   │   │   └── jwt.js                   # JWT configuration
│   │   │
│   │   ├── 📂 controllers/              # Business Logic Layer
│   │   │   ├── authController.js        # Auth: register, login, profile
│   │   │   └── gameController.js        # Game: save, get, delete decisions
│   │   │
│   │   ├── 📂 middleware/               # Express Middleware
│   │   │   ├── auth.js                  # JWT authentication
│   │   │   └── errorHandler.js          # Global error handling
│   │   │
│   │   ├── 📂 routes/                   # API Routes Definition
│   │   │   ├── authRoutes.js            # /api/auth/* endpoints
│   │   │   ├── gameRoutes.js            # /api/game/* endpoints
│   │   │   └── adminRoutes.js           # /api/admin/* endpoints
│   │   │
│   │   └── 📂 utils/                    # Helper Functions
│   │       ├── validation.js            # Joi schemas
│   │       └── response.js              # Standard responses
│   │
│   ├── 📂 database/                     # Database Storage
│   │   └── ready-set-sell.db            # SQLite database (auto-created)
│   │
│   ├── 📂 tests/                        # Unit & Integration Tests
│   │   ├── auth.test.js                 # Auth tests
│   │   └── game.test.js                 # Game tests
│   │
│   ├── 📄 server.js                     # Main Entry Point ⭐
│   ├── 📄 package.json                  # Dependencies & Scripts
│   ├── 📄 .env                          # Environment Variables
│   ├── 📄 .env.example                  # Example env file
│   ├── 📄 .gitignore                    # Git ignore rules
│   └── 📄 README.md                     # Backend documentation
│
├── 📂 frontend/                         # Frontend Web App
│   │
│   ├── 📂 public/                       # Static Files
│   │   ├── index.html                   # Main HTML ⭐
│   │   └── 📂 assets/                   # Images, icons
│   │       ├── 📂 images/
│   │       └── 📂 icons/
│   │
│   └── 📂 src/                          # React Source (Optional)
│       ├── 📂 components/               # React Components
│       ├── 📂 services/                 # API Calls
│       ├── 📂 utils/                    # Helpers
│       └── App.jsx                      # Main App
│
├── 📂 docs/                             # Documentation
│   ├── API.md                           # API Documentation
│   ├── SETUP.md                         # Setup Guide
│   └── DEPLOYMENT.md                    # Deployment Guide
│
├── 📄 README.md                         # Project Overview ⭐
├── 📄 .gitignore                        # Root gitignore
└── 📄 LICENSE                           # License

```

---

## 🔄 Data Flow Architecture

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ HTTP Request
       │ (JSON)
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Middleware Layer            │  │
│  │  • CORS                      │  │
│  │  • Helmet (Security)         │  │
│  │  • Rate Limiting             │  │
│  │  • Body Parser               │  │
│  │  • Morgan (Logging)          │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Authentication Middleware   │  │
│  │  • Verify JWT Token          │  │
│  │  • Extract User Info         │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Routes                      │  │
│  │  • /api/auth/*               │  │
│  │  • /api/game/*               │  │
│  │  • /api/admin/*              │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Validation Layer (Joi)      │  │
│  │  • Validate Input            │  │
│  │  • Sanitize Data             │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Controllers                 │  │
│  │  • Business Logic            │  │
│  │  • Process Request           │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Database Layer (SQLite)     │  │
│  │  • Query Execution           │  │
│  │  • Data Persistence          │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│  ┌──────────▼───────────────────┐  │
│  │  Response Handler            │  │
│  │  • Format Response           │  │
│  │  • Send JSON                 │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
       │
       │ HTTP Response
       │ (JSON)
       ▼
┌─────────────┐
│   Browser   │
│  (Display)  │
└─────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────┐
│           USERS TABLE               │
├─────────────────────────────────────┤
│ id            INTEGER PK AUTO       │
│ username      TEXT UNIQUE           │
│ kelompok      TEXT (A-H)            │
│ tanggal_main  DATE                  │
│ waktu_main    TIME                  │
│ is_active     INTEGER               │
│ created_at    DATETIME              │
└─────────────────────────────────────┘
                 │
                 │ 1:N
                 │
                 ▼
┌─────────────────────────────────────┐
│       GAME_SESSIONS TABLE           │
├─────────────────────────────────────┤
│ id              INTEGER PK AUTO     │
│ user_id         INTEGER FK          │
│ kuartil         INTEGER (1-8)       │
│ marketing_1     TEXT                │
│ marketing_2     TEXT                │
│ marketing_3     TEXT                │
│ supplier_a      INTEGER             │
│ supplier_b      INTEGER             │
│ supplier_c      INTEGER             │
│ supplier_d      INTEGER             │
│ offline_price   INTEGER             │
│ online_price    INTEGER             │
│ kas_tersedia    INTEGER             │
│ rating_offline  REAL                │
│ rating_online   REAL                │
│ created_at      DATETIME            │
└─────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. POST /api/auth/register
     │    {username, kelompok, ...}
     │
     ▼
┌──────────────┐
│   Server     │
│ Validate     │
│ Input        │
└────┬─────────┘
     │
     │ 2. Create User in DB
     │
     ▼
┌──────────────┐
│   Database   │
│ INSERT user  │
└────┬─────────┘
     │
     │ 3. Generate JWT Token
     │
     ▼
┌──────────────┐
│   Server     │
│ jwt.sign()   │
└────┬─────────┘
     │
     │ 4. Return Token + User
     │    {user, token}
     │
     ▼
┌──────────┐
│  Client  │
│ Store    │
│ Token    │
└────┬─────┘
     │
     │ 5. Subsequent Requests
     │    Headers: Authorization: Bearer <token>
     │
     ▼
┌──────────────┐
│   Server     │
│ Verify Token │
│ Extract User │
└──────────────┘
```

---

## 🎮 Game Decision Flow

```
User fills form → Frontend validates
                       ↓
              POST /api/game/decision
              Authorization: Bearer <token>
                       ↓
              Server: Auth Middleware
              (Verify JWT)
                       ↓
              Server: Validation Middleware
              (Joi schema validation)
                       ↓
              Controller: gameController.saveDecision
                       ↓
              Check if kuartil exists
              ├─ Yes: UPDATE game_sessions
              └─ No:  INSERT game_sessions
                       ↓
              Update leaderboard cache
                       ↓
              Return success response
                       ↓
              Frontend: Show success message
              Frontend: Increment kuartil
```

---

## 📊 API Endpoint Map

```
/api
├── /auth
│   ├── POST   /register          (Public)
│   ├── POST   /login             (Public)
│   ├── GET    /profile           (Protected)
│   ├── PUT    /profile           (Protected)
│   └── POST   /deactivate        (Protected)
│
├── /game
│   ├── POST   /decision          (Protected)
│   ├── GET    /decisions         (Protected)
│   ├── GET    /decision/:kuartil (Protected)
│   ├── DELETE /decision/:kuartil (Protected)
│   ├── GET    /summary           (Protected)
│   └── GET    /leaderboard/:kelompok (Protected)
│
└── /admin
    ├── GET    /users             (Protected)
    ├── GET    /sessions          (Protected)
    ├── GET    /stats/:kelompok   (Protected)
    └── GET    /leaderboard/global (Protected)
```

---

## 🔑 Key Files Explanation

### **server.js** (Main Entry)
- Initialize Express app
- Setup middleware
- Connect routes
- Start server
- Handle graceful shutdown

### **database.js** (Database Config)
- Create SQLite connection
- Initialize tables
- Provide query helpers
- Handle errors

### **authController.js** (Auth Logic)
- Register new users
- Login existing users
- Get/update profile
- Token generation

### **gameController.js** (Game Logic)
- Save decisions per kuartil
- Get all decisions
- Calculate summary
- Update leaderboard

### **auth.js** (Middleware)
- Verify JWT tokens
- Extract user info
- Protect routes

### **validation.js** (Input Validation)
- Define Joi schemas
- Validate requests
- Sanitize inputs

---

## 📦 Dependencies Purpose

### Production
- **express** - Web framework
- **cors** - Cross-origin requests
- **sqlite3** - Database
- **jsonwebtoken** - Authentication
- **joi** - Validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **morgan** - Logging

### Development
- **nodemon** - Auto-restart server

---

## 🚀 Deployment Flow

```
Local Development
       ↓
   Git Commit
       ↓
   Git Push
       ↓
   GitHub Repository
       ↓
   Deploy to Cloud
   (Railway/Heroku)
       ↓
   Production Server
   (With Environment Variables)
       ↓
   Public URL
   (https://api.readysetsell.com)
```