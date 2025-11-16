// // ============================================
// // READY SET SELL - MAIN SERVER
// // ============================================

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');

// // Import configurations
// const { initDatabase, closeDatabase } = require('./src/config/database');
// const { notFound, errorHandler } = require('./src/middleware/errorHandler');

// // Import routes
// const authRoutes = require('./src/routes/authRoutes');
// const gameRoutes = require('./src/routes/gameRoutes');
// const adminRoutes = require('./src/routes/adminRoutes');

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // ============================================
// // MIDDLEWARE
// // ============================================

// // Security headers
// app.use(helmet());

// // CORS configuration
// const corsOptions = {
//   origin: process.env.CORS_ORIGIN?.split(',') || '*',
//   credentials: true,
//   optionsSuccessStatus: 200
// };
// // app.use(cors(corsOptions));
// // CORS - Allow all origins for development
// app.use(cors({
//   origin: ['http://127.0.0.1:8080', 'http://localhost:5173'],
//   credentials: true,
//   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
//   message: 'Terlalu banyak request dari IP ini, coba lagi nanti',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use('/api/', limiter);

// // ============================================
// // ROUTES
// // ============================================

// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Ready Set Sell API is running',
//     environment: process.env.NODE_ENV,
//     timestamp: new Date().toISOString()
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/game', gameRoutes);
// app.use('/api/admin', adminRoutes);

// // 404 handler
// app.use(notFound);

// // Error handler
// app.use(errorHandler);

// // ============================================
// // START SERVER
// // ============================================

// async function startServer() {
//   try {
//     // Initialize database
//     await initDatabase();

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`
// ╔═══════════════════════════════════════════╗
// ║   🎮 Ready Set Sell - Backend API        ║
// ║                                           ║
// ║   Environment: ${process.env.NODE_ENV?.padEnd(27) || 'development'.padEnd(27)} ║
// ║   Port: ${PORT.toString().padEnd(33)} ║
// ║   URL: http://localhost:${PORT}${' '.repeat(18)} ║
// ║                                           ║
// ║   Status: ✅ Running                      ║
// ╚═══════════════════════════════════════════╝
//       `);
//     });
//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// }

// // ============================================
// // GRACEFUL SHUTDOWN
// // ============================================

// async function gracefulShutdown(signal) {
//   console.log(`\n${signal} received. Starting graceful shutdown...`);
  
//   try {
//     await closeDatabase();
//     console.log('✅ Graceful shutdown completed');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error during shutdown:', error);
//     process.exit(1);
//   }
// }

// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('❌ Uncaught Exception:', error);
//   gracefulShutdown('UNCAUGHT_EXCEPTION');
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown('UNHANDLED_REJECTION');
// });

// // Start the server
// startServer();

// module.exports = app;

// server.js - Node.js Express Backend untuk Ready Set Sell
// Install: npm install express cors google-spreadsheet dotenv

const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Google Sheets Configuration
const SHEET_IDS = {
    'AB': 'https://bit.ly/rss-medium-ab',
    'CD': 'https://bit.ly/rss-medium-cd',
    'EF': 'https://bit.ly/rss-medium-ef',
    'GH': 'https://bit.ly/rss-medium-gh'
};


// Mapping kelompok ke sheet ID dan player
const KELOMPOK_MAPPING = {
    'A': { pair: 'AB', player: 'P1', opponent: 'B' },
    'B': { pair: 'AB', player: 'P2', opponent: 'A' },
    'C': { pair: 'CD', player: 'P1', opponent: 'D' },
    'D': { pair: 'CD', player: 'P2', opponent: 'C' },
    'E': { pair: 'EF', player: 'P1', opponent: 'F' },
    'F': { pair: 'EF', player: 'P2', opponent: 'E' },
    'G': { pair: 'GH', player: 'P1', opponent: 'H' },
    'H': { pair: 'GH', player: 'P2', opponent: 'G' }
};

// Initialize Google Sheets client
async function getGoogleSheet(kelompok) {
    const config = KELOMPOK_MAPPING[kelompok];
    const sheetId = SHEET_IDS[config.pair];

    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    return { doc, config };
}

// Row mapping untuk setiap kuartil (berdasarkan screenshot)
const ROW_MAPPING = {
    // Tahun 1
    1: 5,   // Row 5 untuk Kuartil 1
    2: 6,   // Row 6 untuk Kuartil 2
    3: 7,   // Row 7 untuk Kuartil 3
    4: 8,   // Row 8 untuk Kuartil 4
    // Tahun 2
    5: 10,  // Row 10 untuk Kuartil 5
    6: 11,  // Row 11 untuk Kuartil 6
    7: 12,  // Row 12 untuk Kuartil 7
    8: 13   // Row 13 untuk Kuartil 8
};

// Column mapping untuk sheet "P1 - Input Keputusan" / "P2 - Input Keputusan"
const COLUMN_MAPPING = {
    // PEMASARAN (kolom B-D, row sesuai kuartil)
    marketing_1: 'D',
    marketing_2: 'E',
    marketing_3: 'F',
    
    // PENGADAAN BARANG (kolom E-H)
    supplier_a: 'D',
    supplier_b: 'E',
    supplier_c: 'F',
    supplier_d: '',
    
    // PENJUALAN OFFLINE (row 28-34 untuk tahun 1)
    // Harga Offline di kolom C
    // Pembeli Datang Terlayani di kolom E
    // Pembeli Tambahan di kolom G
    // Pembeli Tambahan Terlayani di kolom H
    offline_harga_col: 'D',
    offline_datang_col: 'G',
    offline_tambahan_col: 'I',
    offline_tambahan_terlayani_col: 'J',
    
    // PENJUALAN ONLINE (row 39-42 untuk tahun 2, kuartil 5-8)
    // Harga Online di kolom C
    // Pembeli Datang Terlayani di kolom E
    // Pembeli Tambahan di kolom G
    // Pembeli Tambahan Terlayani di kolom H
    online_harga_col: 'D',
    online_datang_col: 'G',
    online_tambahan_col: 'I',
    online_tambahan_terlayani_col: 'J'
};

// Row mapping untuk penjualan offline/online
const SALES_ROW_MAPPING = {
    // Offline (Tahun 1 - Kuartil 1-4)
    offline: {
        1: 28,  // Kuartil 1
        2: 29,  // Kuartil 2
        3: 30,  // Kuartil 3
        4: 31,  // Kuartil 4
        5: 32,  // Kuartil 5
        6: 33,  // Kuartil 6
        7: 34,  // Kuartil 7
        8: 35   // Kuartil 8
    },
    // Online (Tahun 2 - Kuartil 5-8)
    online: {
        5: 39,  // Kuartil 5
        6: 40,  // Kuartil 6
        7: 41,  // Kuartil 7
        8: 42   // Kuartil 8
    }
};

// API: POST - Save decision to Google Sheets
app.post('/api/sheets/save-decision', async (req, res) => {
    try {
        const { kelompok, decision } = req.body;
        const { doc, config } = await getGoogleSheet(kelompok);
        
        const sheetName = `${config.player} - Input Keputusan`;
        const sheet = doc.sheetsByTitle[sheetName];
        
        if (!sheet) {
            return res.status(404).json({ error: 'Sheet not found' });
        }

        await sheet.loadCells();
        
        const kuartil = decision.kuartil;
        const marketingRow = ROW_MAPPING[kuartil];
        const offlineRow = SALES_ROW_MAPPING.offline[kuartil];
        
        // 1. Save Marketing Strategies
        const cellMarketing1 = sheet.getCellByA1(`${COLUMN_MAPPING.marketing_1}${marketingRow}`);
        const cellMarketing2 = sheet.getCellByA1(`${COLUMN_MAPPING.marketing_2}${marketingRow}`);
        const cellMarketing3 = sheet.getCellByA1(`${COLUMN_MAPPING.marketing_3}${marketingRow}`);
        
        cellMarketing1.value = decision.marketing_1;
        cellMarketing2.value = decision.marketing_2;
        cellMarketing3.value = decision.marketing_3;
        
        // 2. Save Supplier Data
        const cellSupplierA = sheet.getCellByA1(`${COLUMN_MAPPING.supplier_a}${marketingRow}`);
        const cellSupplierB = sheet.getCellByA1(`${COLUMN_MAPPING.supplier_b}${marketingRow}`);
        const cellSupplierC = sheet.getCellByA1(`${COLUMN_MAPPING.supplier_c}${marketingRow}`);
        const cellSupplierD = sheet.getCellByA1(`${COLUMN_MAPPING.supplier_d}${marketingRow}`);
        
        cellSupplierA.value = decision.supplier_a;
        cellSupplierB.value = decision.supplier_b;
        cellSupplierC.value = decision.supplier_c;
        cellSupplierD.value = decision.supplier_d;
        
        // 3. Save Offline Sales Data
        const cellOfflineHarga = sheet.getCellByA1(`${COLUMN_MAPPING.offline_harga_col}${offlineRow}`);
        const cellOfflineDatang = sheet.getCellByA1(`${COLUMN_MAPPING.offline_datang_col}${offlineRow}`);
        const cellOfflineTambahan = sheet.getCellByA1(`${COLUMN_MAPPING.offline_tambahan_col}${offlineRow}`);
        const cellOfflineTambahanTerlayani = sheet.getCellByA1(`${COLUMN_MAPPING.offline_tambahan_terlayani_col}${offlineRow}`);
        
        cellOfflineHarga.value = decision.harga_offline;
        cellOfflineDatang.value = decision.pembeli_datang_terlayani_offline;
        cellOfflineTambahan.value = decision.pembeli_tambahan_offline;
        cellOfflineTambahanTerlayani.value = decision.pembeli_tambahan_terlayani_offline;
        
        // 4. Save Online Sales Data (only for kuartil 5-8)
        if (kuartil >= 5) {
            const onlineRow = SALES_ROW_MAPPING.online[kuartil];
            
            const cellOnlineHarga = sheet.getCellByA1(`${COLUMN_MAPPING.online_harga_col}${onlineRow}`);
            const cellOnlineDatang = sheet.getCellByA1(`${COLUMN_MAPPING.online_datang_col}${onlineRow}`);
            const cellOnlineTambahan = sheet.getCellByA1(`${COLUMN_MAPPING.online_tambahan_col}${onlineRow}`);
            const cellOnlineTambahanTerlayani = sheet.getCellByA1(`${COLUMN_MAPPING.online_tambahan_terlayani_col}${onlineRow}`);
            
            cellOnlineHarga.value = decision.harga_online;
            cellOnlineDatang.value = decision.pembeli_datang_terlayani_online;
            cellOnlineTambahan.value = decision.pembeli_tambahan_online;
            cellOnlineTambahanTerlayani.value = decision.pembeli_tambahan_terlayani_online;
        }
        
        // Save all changes
        await sheet.saveUpdatedCells();
        
        res.json({ 
            success: true, 
            message: `Decision for Kuartil ${kuartil} saved successfully`,
            sheet: sheetName
        });
        
    } catch (error) {
        console.error('Error saving decision:', error);
        res.status(500).json({ error: error.message });
    }
});

// API: GET - Read Ringkasan sheet
app.get('/api/sheets/ringkasan', async (req, res) => {
    try {
        const { kelompok } = req.query;
        const { doc, config } = await getGoogleSheet(kelompok);
        
        const sheet = doc.sheetsByTitle['Ringkasan'];
        if (!sheet) {
            return res.status(404).json({ error: 'Ringkasan sheet not found' });
        }

        await sheet.loadCells();
        
        // Read data for both players
        const tim1Data = [];
        const tim2Data = [];
        
        for (let kuartil = 1; kuartil <= 8; kuartil++) {
            const row = kuartil + 3; // Adjust based on actual sheet
            tim1Data.push({
                kuartil,
                sudahBerjalan: sheet.getCellByA1(`B${row}`).value,
                kasTersedia: sheet.getCellByA1(`K${row}`).value
            });
            
            tim2Data.push({
                kuartil,
                sudahBerjalan: sheet.getCellByA1(`L${row}`).value,
                kasTersedia: sheet.getCellByA1(`U${row}`).value
            });
        }
        
        res.json({
            success: true,
            tim1: tim1Data,
            tim2: tim2Data,
            kelompok: kelompok,
            opponent: config.opponent
        });
        
    } catch (error) {
        console.error('Error reading ringkasan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});