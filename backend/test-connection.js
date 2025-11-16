require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testConnection() {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Test dengan salah satu sheet ID
        const doc = new GoogleSpreadsheet('YOUR_SHEET_ID_HERE', serviceAccountAuth);
        await doc.loadInfo();
        
        console.log('✅ Connected to:', doc.title);
        console.log('📄 Sheets:', doc.sheetsByIndex.map(s => s.title));
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();