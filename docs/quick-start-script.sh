#!/bin/bash

# ============================================
# Ready Set Sell - Quick Setup Script
# ============================================

echo "╔═══════════════════════════════════════════╗"
echo "║  🎮 Ready Set Sell - Quick Setup         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
mkdir -p ready-set-sell/backend/src/{config,controllers,middleware,routes,utils}
mkdir -p ready-set-sell/backend/database
mkdir -p ready-set-sell/backend/tests
mkdir -p ready-set-sell/frontend/public
mkdir -p ready-set-sell/docs

cd ready-set-sell

echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# Step 2: Setup Backend
echo -e "${YELLOW}📦 Setting up backend...${NC}"
cd backend

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "ready-set-sell-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
EOF

echo -e "${GREEN}✅ package.json created${NC}"

# Create .env file
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
JWT_SECRET=ready-set-sell-secret-key-2024-change-this
JWT_EXPIRE=24h
DB_PATH=./database/ready-set-sell.db
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ .env created${NC}"

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.db
*.db-journal
*.log
.DS_Store
EOF

echo -e "${GREEN}✅ .gitignore created${NC}"

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies (this may take a while)...${NC}"
npm install express cors sqlite3 bcryptjs jsonwebtoken dotenv helmet express-rate-limit morgan joi --save 2>/dev/null
npm install nodemon --save-dev 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo -e "${YELLOW}Please run manually: npm install${NC}"
fi

echo ""

# Step 3: Create README
cd ..
cat > README.md << 'EOF'
# 🎮 Ready Set Sell

Backend API untuk game simulasi bisnis Ready Set Sell.

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

Server akan berjalan di: http://localhost:3000

### Frontend
Buka `frontend/public/index.html` di browser

## 📚 Documentation
- API Docs: http://localhost:3000/health
- Setup Guide: docs/SETUP.md

## 🧪 Test API
```bash
curl http://localhost:3000/health
```
EOF

echo -e "${GREEN}✅ README.md created${NC}"
echo ""

# Step 4: Display next steps
echo "╔═══════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                       ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Copy all backend files from artifacts to backend/src/"
echo "   - src/config/database.js"
echo "   - src/config/jwt.js"
echo "   - src/middleware/auth.js"
echo "   - src/middleware/errorHandler.js"
echo "   - src/utils/validation.js"
echo "   - src/utils/response.js"
echo "   - src/controllers/authController.js"
echo "   - src/controllers/gameController.js"
echo "   - src/routes/authRoutes.js"
echo "   - src/routes/gameRoutes.js"
echo "   - src/routes/adminRoutes.js"
echo "   - server.js"
echo ""
echo "2. Copy frontend HTML to frontend/public/index.html"
echo ""
echo "3. Start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Open frontend:"
echo "   Open frontend/public/index.html in browser"
echo ""
echo "5. Test API:"
echo "   curl http://localhost:3000/health"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"