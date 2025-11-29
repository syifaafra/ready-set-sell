// Google Apps Script untuk Ready Set Sell - FIXED VERSION
// Tambahkan logging yang lebih detail untuk debugging

// const SHEET_IDS = {
//   // Easy Level - 5 sheets (AB, CD, EF, GH, IJ)
//   'EASY_AB': '1W9I9iZwjONuKpwifca3tqLuMOkDp95Ii_8vhkFsYh3A',
//   'EASY_CD': '15cNoDweUnjP2W856HwdZwbiu0HYOnOkMfrr_tSJ812U',
//   'EASY_EF': '1UuMHnBgB7nWOBmXFAOhcplLce2yzeBnHOv9QeKjfI8A',
//   'EASY_GH': '1yrH0BnEBUEG-VFnXKixj5Hu4iObIm1kkysF6VC5Szk4',
//   'EASY_IJ': '1sv9zO1gBK7wsvCWYwUb_GkEruiW91W4Aa3cOWpr1Dzg',
  
//   // Medium Level - 5 sheets (AB, CD, EF, GH, IJ)
//   'MEDIUM_AB': '10kEqztFbgS-4J01O4tlnsNsG4eGfgEBwMYFtqSt4_7s',
//   'MEDIUM_CD': '1Eqd3l8WgvTpdIaKB7FigoI7cVy32W0_2Ax-C0_y1w8I',
//   'MEDIUM_EF': '1zAP9kwD37llZSiyBd5pqohCwLTjCFdN6DAAQ91D1QNI',
//   'MEDIUM_GH': '1XFTYpuS6bW903a7HvgLWSkFXpVDrGlAQffXdS5IMlPU',
//   'MEDIUM_IJ': '1lwEboIDh5kvFDZ5YjKtEw1jPREmt0Ri5vAH4VZtB47U'
// };


const SHEET_IDS = {
  // Easy Level - 5 sheets (AB, CD, EF, GH, IJ)
  'EASY_AB': '1crDj0ps9SOPYXH7qZj6yIvSY2QsvpWRD1NRUknR0gaM',
  'EASY_CD': '15cNoDweUnjP2W856HwdZwbiu0HYOnOkMfrr_tSJ812U',
  'EASY_EF': '1UuMHnBgB7nWOBmXFAOhcplLce2yzeBnHOv9QeKjfI8A',
  'EASY_GH': '1yrH0BnEBUEG-VFnXKixj5Hu4iObIm1kkysF6VC5Szk4',
  'EASY_IJ': '1sv9zO1gBK7wsvCWYwUb_GkEruiW91W4Aa3cOWpr1Dzg',
  
  // Medium Level - 5 sheets (AB, CD, EF, GH, IJ)
  'MEDIUM_AB': '10kEqztFbgS-4J01O4tlnsNsG4eGfgEBwMYFtqSt4_7s',
  'MEDIUM_CD': '1Eqd3l8WgvTpdIaKB7FigoI7cVy32W0_2Ax-C0_y1w8I',
  'MEDIUM_EF': '1zAP9kwD37llZSiyBd5pqohCwLTjCFdN6DAAQ91D1QNI',
  'MEDIUM_GH': '1XFTYpuS6bW903a7HvgLWSkFXpVDrGlAQffXdS5IMlPU',
  'MEDIUM_IJ': '1lwEboIDh5kvFDZ5YjKtEw1jPREmt0Ri5vAH4VZtB47U'
};

const KELOMPOK_MAPPING = { 
  // Easy Level
  'EASY_A': { key: 'EASY_AB', player: 'P1', opponent: 'B', level: 'Easy' },
  'EASY_B': { key: 'EASY_AB', player: 'P2', opponent: 'A', level: 'Easy' },
  'EASY_C': { key: 'EASY_CD', player: 'P1', opponent: 'D', level: 'Easy' },
  'EASY_D': { key: 'EASY_CD', player: 'P2', opponent: 'C', level: 'Easy' },
  'EASY_E': { key: 'EASY_EF', player: 'P1', opponent: 'F', level: 'Easy' },
  'EASY_F': { key: 'EASY_EF', player: 'P2', opponent: 'E', level: 'Easy' },
  'EASY_G': { key: 'EASY_GH', player: 'P1', opponent: 'H', level: 'Easy' },
  'EASY_H': { key: 'EASY_GH', player: 'P2', opponent: 'G', level: 'Easy' },
  'EASY_I': { key: 'EASY_IJ', player: 'P1', opponent: 'J', level: 'Easy' },
  'EASY_J': { key: 'EASY_IJ', player: 'P2', opponent: 'I', level: 'Easy' },
  
  // Medium Level
  'MEDIUM_A': { key: 'MEDIUM_AB', player: 'P1', opponent: 'B', level: 'Medium' },
  'MEDIUM_B': { key: 'MEDIUM_AB', player: 'P2', opponent: 'A', level: 'Medium' },
  'MEDIUM_C': { key: 'MEDIUM_CD', player: 'P1', opponent: 'D', level: 'Medium' },
  'MEDIUM_D': { key: 'MEDIUM_CD', player: 'P2', opponent: 'C', level: 'Medium' },
  'MEDIUM_E': { key: 'MEDIUM_EF', player: 'P1', opponent: 'F', level: 'Medium' },
  'MEDIUM_F': { key: 'MEDIUM_EF', player: 'P2', opponent: 'E', level: 'Medium' },
  'MEDIUM_G': { key: 'MEDIUM_GH', player: 'P1', opponent: 'H', level: 'Medium' },
  'MEDIUM_H': { key: 'MEDIUM_GH', player: 'P2', opponent: 'G', level: 'Medium' },
  'MEDIUM_I': { key: 'MEDIUM_IJ', player: 'P1', opponent: 'J', level: 'Medium' },
  'MEDIUM_J': { key: 'MEDIUM_IJ', player: 'P2', opponent: 'I', level: 'Medium' }
};

// Row mappings (tetap sama)
const PEMASARAN_ROW_MAPPING = { 1:5, 2:6, 3:7, 4:8, 5:10, 6:11, 7:12, 8:13 };
const PENGADAAN_A_ROW_MAPPING = { 1:17, 2:18, 3:19, 4:20, 5:22, 6:23, 7:24, 8:25 };
const PENGADAAN_B_ROW_MAPPING = { 5:29, 6:30, 7:31, 8:32 };
const OFFLINE_A_ROW_MAPPING_MEDIUM = { 1:36, 2:37, 3:38, 4:39, 5:40, 6:41, 7:42, 8:43 };
const OFFLINE_A_ROW_MAPPING_EASY = { 1:28, 2:29, 3:30, 4:31, 5:32, 6:33, 7:34, 8:35 };
const OFFLINE_B_ROW_MAPPING = { 5:47, 6:48, 7:49, 8:50 };
const ONLINE_A_ROW_MAPPING_MEDIUM = { 1:54, 2:55, 3:56, 4:57, 5:58, 6:59, 7:60, 8:61 };
const ONLINE_A_ROW_MAPPING_EASY = { 5:39, 6:40, 7:41, 8:42 };
const ONLINE_B_ROW_MAPPING_MEDIUM = { 5:65, 6:66, 7:67, 8:68 };


function createCORSResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return createCORSResponse({ status: 'ok' }); 
}

/* --------- Admin Functions ------------*/
function setAdminPassword() {
  const password = "admin123"; // GANTI
  const hashed = hashPassword(password);

  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty("ADMIN_PASSWORD_HASH", hashed);

  Logger.log("Password admin berhasil disimpan!");
}

function hashPassword(password) {
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );

  return rawHash
    .map(byte => {
      const v = (byte + 256) % 256;
      return ("0" + v.toString(16)).slice(-2);
    })
    .join("");
}

function verifyAdminLogin(inputPassword) {
  const scriptProps = PropertiesService.getScriptProperties();
  const storedHash = scriptProps.getProperty("ADMIN_PASSWORD_HASH");

  if (!storedHash) {
    return { success: false, message: "Admin password belum diset." };
  }

  const inputHash = hashPassword(inputPassword);

  if (inputHash === storedHash) {
    return { success: true, message: "Login admin berhasil!" };
  } else {
    return { success: false, message: "Password salah." };
  }
}

function changeAdminPassword(oldPassword, newPassword) {
  const scriptProps = PropertiesService.getScriptProperties();
  const storedHash = scriptProps.getProperty("ADMIN_PASSWORD_HASH");

  if (!storedHash) {
    return { success: false, message: "Password admin belum diset." };
  }

  // Hash password lama yang diinput
  const oldHash = hashPassword(oldPassword);

  // Cek apakah cocok
  if (oldHash !== storedHash) {
    return { success: false, message: "Password lama salah." };
  }

  // Hash password baru
  const newHash = hashPassword(newPassword);
  scriptProps.setProperty("ADMIN_PASSWORD_HASH", newHash);

  return { success: true, message: "Password admin berhasil diganti!" };
}




/* ---------- Utility Functions ---------- */
function safeOpenById(id, maxRetries = 5) {
  if (!id || String(id).length < 10) {
    throw new Error('Invalid Spreadsheet ID: ' + id);
  }
  var attempt = 0;
  var backoff = 300;
  while (attempt < maxRetries) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      attempt++;
      Logger.log('safeOpenById attempt ' + attempt + ' failed for id=' + id + ' err=' + err);
      if (attempt >= maxRetries) {
        throw new Error('Failed to open spreadsheet after ' + attempt + ' attempts: ' + err.message);
      }
      Utilities.sleep(backoff);
      backoff *= 2;
    }
  }
  throw new Error('safeOpenById: unreachable');
}

function safeSetRowValues(sheet, row, startCol, valuesArray) {
  var attempts = 0;
  var maxAttempts = 5;
  var backoff = 200;
  while (attempts < maxAttempts) {
    try {
      var range = sheet.getRange(row, startCol, 1, valuesArray.length);
      range.setValues([valuesArray]);
      Logger.log('Successfully set values at row=' + row + ' col=' + startCol);
      return;
    } catch (err) {
      attempts++;
      Logger.log('safeSetRowValues attempt ' + attempts + ' failed row=' + row + ' err=' + err);
      Utilities.sleep(backoff);
      backoff *= 2;
    }
  }
  throw new Error('safeSetRowValues failed after retries for row=' + row);
}

function withLock(fn, lockTimeoutMs) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(lockTimeoutMs || 30000); // Increase timeout to 30s
    return fn();
  } finally {
    try { lock.releaseLock(); } catch (e) { 
      Logger.log('Lock release error: ' + e); 
    }
  }
}

function extractSummaryData(summaryData) {
  var dataTim = {
    team1: [],
    team2: []
  };
  
  // Log untuk debugging
  Logger.log('=== EXTRACT SUMMARY DATA ===');
  Logger.log('Total rows: ' + summaryData.length);
  
  // Helper function untuk konversi rating ke format persen
  function formatRating(value) {
    if (!value || value === 0) return '0%';
    
    // Jika sudah string dengan %, return as is
    if (typeof value === 'string' && value.includes('%')) {
      return value;
    }
    
    // Jika angka desimal (seperti 0.48), konversi ke persen
    if (typeof value === 'number') {
      // Jika nilai antara 0 dan 1, anggap sebagai desimal
      if (value > 0 && value <= 1) {
        return (value * 100).toFixed(0) + '%';
      }
      // Jika nilai > 1, anggap sudah dalam bentuk persen
      return value.toFixed(0) + '%';
    }
    
    // Jika string angka tanpa %, coba parse
    if (typeof value === 'string') {
      var numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue > 0 && numValue <= 1) {
          return (numValue * 100).toFixed(0) + '%';
        }
        return numValue.toFixed(0) + '%';
      }
    }
    
    return '0%';
  }
  
  // TEAM 1: Baris 6-13 (index 5-12)
  Logger.log('--- Processing TEAM 1 (rows 6-13) ---');
  for (var i = 5; i <= 12; i++) {
    var row = summaryData[i];
    if (!row) {
      Logger.log('Row ' + (i+1) + ' is null/undefined');
      continue;
    }
    
    // Kolom B (index 1) = Kuartil untuk Team 1
    var kuartil = parseInt(row[1], 10);
    Logger.log('Row ' + (i+1) + ' - Kuartil: ' + kuartil + ', Sudah Berjalan: ' + row[2]);
    
    if (kuartil >= 1 && kuartil <= 8) {
      var sudahBerjalan = row[2] || 'Tidak';
      var cash = row[12] || 0; 
      if (typeof cash === 'string') {
        cash = cash.replace(/[Rp.\s]/g, '').replace(/,/g, '');
        cash = parseInt(cash, 10) || 0;
      } else if (typeof cash === 'number' && isNaN(cash)) {
        cash = 0;
      }
      
      // Format rating menggunakan helper function
      var offlineRating = formatRating(row[10]);
      var onlineRating = formatRating(row[11]);

      dataTim.team1.push({
        kuartil: 'Kuartil ' + kuartil,
        sudahBerjalan: sudahBerjalan,
        cash: cash,
        offlineRating: offlineRating,
        onlineRating: onlineRating
      });
      Logger.log('Team1 Kuartil ' + kuartil + ' added - Cash: ' + cash);
    }
  }

  // TEAM 2: Baris 19-26 (index 18-25)
  Logger.log('--- Processing TEAM 2 (rows 19-26) ---');
  for (var i = 18; i <= 25; i++) {
    var row = summaryData[i];
    if (!row) {
      Logger.log('Row ' + (i+1) + ' is null/undefined');
      continue;
    }
    
    // Kolom B (index 1) = Kuartil untuk Team 2 (SAMA seperti Team 1!)
    var kuartil = parseInt(row[1], 10);
    Logger.log('Row ' + (i+1) + ' - Kuartil: ' + kuartil + ', Sudah Berjalan: ' + row[2]);
    
    if (kuartil >= 1 && kuartil <= 8) {
      var sudahBerjalan = row[2] || 'Tidak';
      var cash = row[12] || 0; 
      if (typeof cash === 'string') {
        cash = cash.replace(/[Rp.\s]/g, '').replace(/,/g, '');
        cash = parseInt(cash, 10) || 0;
      } else if (typeof cash === 'number' && isNaN(cash)) {
        cash = 0;
      }
      
      // Format rating menggunakan helper function
      var offlineRating = formatRating(row[10]);
      var onlineRating = formatRating(row[11]);
      
      dataTim.team2.push({
        kuartil: 'Kuartil ' + kuartil,
        sudahBerjalan: sudahBerjalan,
        cash: cash,
        offlineRating: offlineRating,
        onlineRating: onlineRating
      });
      Logger.log('Team2 Kuartil ' + kuartil + ' added - Cash: ' + cash);
    }
  }
  
  Logger.log('=== SUMMARY ===');
  Logger.log('Team1 entries: ' + dataTim.team1.length);
  Logger.log('Team2 entries: ' + dataTim.team2.length);

  return dataTim;
}

function getSummaryData(sheetId) {
  var ss = safeOpenById(sheetId);
  var sheet = ss.getSheetByName('Ringkasan');
  if (!sheet) throw new Error('Sheet "Ringkasan" not found in spreadsheet.');
  var lastRow = sheet.getLastRow() > 0 ? sheet.getLastRow() : 30;
  var dataRange = sheet.getRange('A1:M' + lastRow).getValues(); 
  return dataRange;
}

const INVENTORY_START_ROW_INDEX = 44; 

function getInventoryData(sheetId, player) {
  var ss = safeOpenById(sheetId);
  var sheetName = player + ' - Model Finansial';
  var sheet = ss.getSheetByName(sheetName);
 
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');
  var data = sheet.getRange("A1:F50").getValues();
  const Q1_COL_INDEX = 3;
  const Q2_COL_INDEX = 4;
  const Q3_COL_INDEX = 5;

  // Index Baris (row - 1) di Sheet Model Finansial:
  // 45 (INVENTORY_START_ROW_INDEX) = Inventori Awal
  // 46 = Transit 1
  // 47 = Transit 2
  // 48 = Transit 3
  
  // Ambil 4 jenis inventaris dari 3 kuartil awal
  var inventoryData = [];
 
  for (let q = 1; q <= 3; q++) {
    const colIndex = q === 1 ? Q1_COL_INDEX : (q === 2 ? Q2_COL_INDEX : Q3_COL_INDEX);
  
    const inventoryA = data[INVENTORY_START_ROW_INDEX] && data[INVENTORY_START_ROW_INDEX][colIndex] || 0;
    const inventoryB = data[INVENTORY_START_ROW_INDEX + 1] && data[INVENTORY_START_ROW_INDEX + 1][colIndex] || 0;
    const inventoryC = data[INVENTORY_START_ROW_INDEX + 2] && data[INVENTORY_START_ROW_INDEX + 2][colIndex] || 0;
    const inventoryD = data[INVENTORY_START_ROW_INDEX + 3] && data[INVENTORY_START_ROW_INDEX + 3][colIndex] || 0;

    inventoryData.push({
      kuartil: q,
      inventory_A: inventoryA, // Inventori Awal (Baris 45)
      inventory_B: inventoryB, // Transit 1 (Baris 46)
      inventory_C: inventoryC, // Transit 2 (Baris 47)
      inventory_D: inventoryD // Transit 3 (Baris 48)
    });
  }

  Logger.log('Inventory Data: ' + JSON.stringify(inventoryData));

  return inventoryData;
}

function getSalesAndMarketingData(sheetId, player, level, kuartil) {
  var ss = safeOpenById(sheetId);
  var sheetName = player + ' - Input Keputusan'; // e.g., "P1 - Input Keputusan"
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

  var result = {
    marketing_strategies: [],
    sales_data: {
      offline: {},
      online: {}
    }
  };

  // 1. AMBIL DATA JUMLAH PEMAKAIAN STRATEGI MARKETING
  // Berdasarkan Gambar 2: Data ada di Range J3:K12
  // Kolom J = Nama Strategi, Kolom K = Jumlah (Kuning)
  var marketingRange = sheet.getRange("J3:K12").getValues();
  
  result.marketing_strategies = marketingRange.map(function(row, index) {
    return {
      code: "P" + (index + 1), // P1, P2, dst
      name: row[0],              // Nama Strategi (Col J)
      count: row[1]              // Jumlah Pemakaian (Col K)
    };
  });

  // 2. AMBIL DATA PENJUALAN (OFFLINE & ONLINE)
  // Berdasarkan Gambar 1 dan Row Mapping yang sudah ada
  
  var isEasy = (level === 'Easy');
  var isMedium = (level === 'Medium');

  // --- Penjualan Offline ---
  var offlineMapping = isEasy ? OFFLINE_A_ROW_MAPPING_EASY : OFFLINE_A_ROW_MAPPING_MEDIUM;
  var rowOffline = offlineMapping[kuartil];

  if (rowOffline) {
    // Mengambil data sebaris penuh untuk row tersebut agar efisien
    // Kita asumsikan data penjualan ada di kolom F s/d L
    // F=6, G=7, H=8, I=9, J=10, K=11, L=12
    var rangeValues = sheet.getRange(rowOffline, 6, 1, 7).getValues()[0];
    
    result.sales_data.offline = {
      pembeli_datang: rangeValues[0],          // Col F
      terlayani: rangeValues[1],               // Col G
      tidak_terlayani_datang: rangeValues[2],  // Col H
      pembeli_tambahan: rangeValues[3],        // Col I
      tambahan_terlayani: rangeValues[4],      // Col J
      total_tidak_terlayani: rangeValues[5],   // Col K (Kuning di gambar)
      rating_toko: rangeValues[6]              // Col L (Kuning di gambar)
    };
  }

  // --- Penjualan Online ---
  // Online A tersedia di Medium (Q1+) atau Easy (Q5+)
  var isOnlineAvailable = (isMedium && kuartil >= 1) || (isEasy && kuartil >= 5);
  
  if (isOnlineAvailable) {
    var onlineMapping = isEasy ? ONLINE_A_ROW_MAPPING_EASY : ONLINE_A_ROW_MAPPING_MEDIUM;
    var rowOnline = onlineMapping[kuartil];
    
    if (rowOnline) {
      var rangeValues = sheet.getRange(rowOnline, 6, 1, 7).getValues()[0];
      
      result.sales_data.online = {
        pembeli_datang: rangeValues[0],
        terlayani: rangeValues[1],
        tidak_terlayani_datang: rangeValues[2],
        pembeli_tambahan: rangeValues[3],
        tambahan_terlayani: rangeValues[4],
        total_tidak_terlayani: rangeValues[5], // Col K
        rating_toko: rangeValues[6]            // Col L
      };
    }
  }

  return result;
}

function generatePdfUrl(sheetId, playerSheetName) {
  if (!sheetId) throw new Error('sheetId is required but was not provided');
  var ss = safeOpenById(sheetId);
  var sheet = ss.getSheetByName(playerSheetName);
  if (!sheet) throw new Error('Sheet "' + playerSheetName + '" not found.');
  var url = ss.getUrl();
  var gid = sheet.getSheetId();
  var exportUrl = url.replace('/edit','') +
    '/export?format=pdf' +
    '&gid=' + gid +
    '&size=A4' +
    '&scale=4' +
    '&horizontal_alignment=CENTER' +
    '&printtitle=false' +
    '&gridlines=false';
  return exportUrl;
}

function getLeaderboardSummary(level, kelompok) {
  // Ubah level dan kelompok menjadi format kunci yang konsisten (huruf besar)
  const levelUpper = level.toUpperCase();
  const kelompokUpper = kelompok.toUpperCase();
  const configKey = levelUpper + '_' + kelompokUpper;

  Logger.log('Executing getLeaderboardSummary for level: ' + levelUpper + ', kelompok: ' + kelompokUpper);

  // Cek apakah konfigurasi untuk kelompok tersebut ada
  const config = KELOMPOK_MAPPING[configKey];
  if (!config) {
    Logger.log('Config not found for ' + configKey);
    return []; // Kembalikan array kosong jika konfigurasi tidak ditemukan
  }

  // Ambil Sheet ID menggunakan kunci dari konfigurasi
  const sheetId = SHEET_IDS[config.key];
  if (!sheetId) {
    Logger.log('Sheet ID not configured for ' + config.key);
    return []; // Kembalikan array kosong jika Sheet ID tidak ditemukan
  }

  try {
    // Tentukan teamKey berdasarkan peran (P1/P2) kelompok di sheet
    // P1 -> team1, P2 -> team2
    const teamKey = config.player === 'P1' ? 'team1' : 'team2';

    // Ambil data mentah dari sheet yang relevan
    // Asumsi: getSummaryData(sheetId) dan extractSummaryData(data) sudah didefinisikan di tempat lain
    const summaryData = getSummaryData(sheetId);
    const processedData = extractSummaryData(summaryData);

    // Pastikan data yang diproses valid dan merupakan array
    if (processedData[teamKey] && Array.isArray(processedData[teamKey])) {
      const teamSummary = {
        kelompok: kelompokUpper,
        summary: processedData[teamKey]
      };
      Logger.log('Summary successfully retrieved for kelompok: ' + kelompokUpper);
      return [teamSummary]; // Kembalikan array dengan satu objek ringkasan
    } else {
      Logger.log('Processed data for ' + kelompokUpper + ' (' + teamKey + ') is invalid or empty.');
      return [];
    }

  } catch (e) {
    Logger.log('Error processing kelompok ' + kelompokUpper + ': ' + e.message);
    return []; // Kembalikan array kosong jika terjadi error
  }
}
function clearQuarterData(sheetId, player, level, kuartil) {
  try {
    var ss = safeOpenById(sheetId);
    var sheetName = player + ' - Input Keputusan';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error('Sheet "' + sheetName + '" tidak ditemukan.');
    }

    var isEasy = (level === 'Easy');
    var isMedium = (level === 'Medium');
    var isProductBAvailable = isMedium && kuartil >= 5 && kuartil <= 8;
    var isOnlineAAvailable = (isMedium && kuartil >= 1) || (isEasy && kuartil >= 5);

    Logger.log('Clearing data for: ' + player + ', Level: ' + level + ', Kuartil: ' + kuartil);

    // 1. HAPUS PEMASARAN (Strategi 1, 2, 3)
    var pemasaranRow = PEMASARAN_ROW_MAPPING[kuartil];
    if (pemasaranRow) {
      Logger.log('Clearing marketing row: ' + pemasaranRow);
      safeSetRowValues(sheet, pemasaranRow, 4, ['', '', '']); // Kolom D, E, F
    }

    // 2. HAPUS PENGADAAN BARANG - PRODUK A (Supplier A, B, C, D)
    var pengadaanA_Row = PENGADAAN_A_ROW_MAPPING[kuartil];
    if (pengadaanA_Row) {
      Logger.log('Clearing Pengadaan A row: ' + pengadaanA_Row);
      safeSetRowValues(sheet, pengadaanA_Row, 4, ['', '', '', '']); // Kolom D, E, F, G
    }

    // 3. HAPUS PENGADAAN BARANG - PRODUK B (jika tersedia)
    if (isProductBAvailable) {
      var pengadaanB_Row = PENGADAAN_B_ROW_MAPPING[kuartil];
      if (pengadaanB_Row) {
        Logger.log('Clearing Pengadaan B row: ' + pengadaanB_Row);
        safeSetRowValues(sheet, pengadaanB_Row, 4, ['', '', '', '']);
      }
    }

    // 4. HAPUS PENJUALAN OFFLINE - PRODUK A
    var offlineARowMapping = isEasy ? OFFLINE_A_ROW_MAPPING_EASY : OFFLINE_A_ROW_MAPPING_MEDIUM;
    var offlineA_Row = offlineARowMapping[kuartil];
    if (offlineA_Row) {
      Logger.log('Clearing Offline A row: ' + offlineA_Row);
      // Harga Offline (D), Pembeli Terlayani (G), Pembeli Tambahan (I), Tambahan Terlayani (J)
      safeSetRowValues(sheet, offlineA_Row, 4, ['']); // Harga
      safeSetRowValues(sheet, offlineA_Row, 7, ['']); // Terlayani
      safeSetRowValues(sheet, offlineA_Row, 9, ['']); // Tambahan
      safeSetRowValues(sheet, offlineA_Row, 10, ['']); // Tambahan Terlayani
    }

    // 5. HAPUS PENJUALAN OFFLINE - PRODUK B (jika tersedia)
    if (isProductBAvailable) {
      var offlineB_Row = OFFLINE_B_ROW_MAPPING[kuartil];
      if (offlineB_Row) {
        Logger.log('Clearing Offline B row: ' + offlineB_Row);
        safeSetRowValues(sheet, offlineB_Row, 4, ['']);
        safeSetRowValues(sheet, offlineB_Row, 7, ['']);
        safeSetRowValues(sheet, offlineB_Row, 9, ['']);
        safeSetRowValues(sheet, offlineB_Row, 10, ['']);
      }
    }

    // 6. HAPUS PENJUALAN ONLINE - PRODUK A (jika tersedia)
    if (isOnlineAAvailable) {
      var onlineARowMapping = isEasy ? ONLINE_A_ROW_MAPPING_EASY : ONLINE_A_ROW_MAPPING_MEDIUM;
      var onlineA_Row = onlineARowMapping[kuartil];
      if (onlineA_Row) {
        Logger.log('Clearing Online A row: ' + onlineA_Row);
        safeSetRowValues(sheet, onlineA_Row, 4, ['']);
        safeSetRowValues(sheet, onlineA_Row, 7, ['']);
        safeSetRowValues(sheet, onlineA_Row, 9, ['']);
        safeSetRowValues(sheet, onlineA_Row, 10, ['']);
      }
    }

    // 7. HAPUS PENJUALAN ONLINE - PRODUK B (jika tersedia)
    if (isProductBAvailable) {
      var onlineB_Row = ONLINE_B_ROW_MAPPING_MEDIUM[kuartil];
      if (onlineB_Row) {
        Logger.log('Clearing Online B row: ' + onlineB_Row);
        safeSetRowValues(sheet, onlineB_Row, 4, ['']);
        safeSetRowValues(sheet, onlineB_Row, 7, ['']);
        safeSetRowValues(sheet, onlineB_Row, 9, ['']);
        safeSetRowValues(sheet, onlineB_Row, 10, ['']);
      }
    }

    SpreadsheetApp.flush();
    Logger.log('Data cleared successfully for Kuartil ' + kuartil);

    return {
      success: true,
      message: 'Data Kuartil ' + kuartil + ' berhasil dihapus untuk ' + player + ' - ' + level
    };

  } catch (error) {
    Logger.log('Error clearing data: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

function clearAllQuarters(level, kelompok) {
  try {
    var kelompokKey = level.toUpperCase() + '_' + kelompok.toUpperCase();
    var config = KELOMPOK_MAPPING[kelompokKey];
    
    if (!config) {
      return {
        success: false,
        error: 'Kelompok tidak ditemukan: ' + kelompokKey
      };
    }
    
    var sheetId = SHEET_IDS[config.key];
    if (!sheetId) {
      return {
        success: false,
        error: 'Sheet ID tidak ditemukan untuk ' + config.key
      };
    }
    
    var results = [];
    
    for (var kuartil = 1; kuartil <= 8; kuartil++) {
      var result = clearQuarterData(sheetId, config.player, config.level, kuartil);
      results.push({
        kuartil: kuartil,
        success: result.success,
        message: result.message || result.error
      });
    }

    return {
      success: true,
      message: 'Semua data (Kuartil 1-8) berhasil dihapus untuk ' + level + ' - Kelompok ' + kelompok,
      kelompok: kelompok,
      level: level,
      details: results
    };

  } catch (error) {
    Logger.log('Error clearing all quarters: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Menghapus semua data untuk SEMUA sheet (Easy & Medium, semua kelompok)
 */
function clearAllSheets() {
  try {
    var results = [];
    var levels = ['EASY', 'MEDIUM'];
    var kelompoks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    for (var i = 0; i < levels.length; i++) {
      for (var j = 0; j < kelompoks.length; j++) {
        var level = levels[i];
        var kelompok = kelompoks[j];
        var configKey = level + '_' + kelompok;
        
        var config = KELOMPOK_MAPPING[configKey];
        if (!config) continue;
        
        var sheetId = SHEET_IDS[config.key];
        if (!sheetId) continue;
        
        Logger.log('Clearing: ' + configKey);
        
        // Hapus semua kuartil untuk kelompok ini
        for (var kuartil = 1; kuartil <= 8; kuartil++) {
          clearQuarterData(sheetId, config.player, config.level, kuartil);
        }
        
        results.push({
          kelompok: configKey,
          success: true,
          message: 'Berhasil dihapus'
        });
      }
    }

    return {
      success: true,
      message: 'Semua data di semua sheet berhasil dihapus!',
      total_cleared: results.length,
      details: results
    };

  } catch (error) {
    Logger.log('Error clearing all sheets: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/* ---------- GET Handler ---------- */
function doGet(e) {
  try {
    var params = e.parameter || {};
    var action = params.action;
    var kelompok = params.kelompok;
    var level = params.level;
    var kuartil = params.kuartil;

    if (!action || !kelompok || !level) {
      var availableLevels = Object.keys(SHEET_IDS).map(function(key) {
        var id = SHEET_IDS[key];
        return { key: key, configured: (id && String(id).length > 10) };
      });
      return createCORSResponse({
        success: true,
        message: 'Ready Set Sell API is running (10 Sheets: Easy & Medium)',
        totalSheets: Object.keys(SHEET_IDS).length,
        sheets: availableLevels,
        timestamp: new Date().toISOString()
      });
    }

    var kelompokKey = (level || '').toUpperCase() + '_' + kelompok;
    var config = KELOMPOK_MAPPING[kelompokKey];
    if (!config) {
      return createCORSResponse({ success:false, error:'Invalid kelompok or level.'});
    }
    var sheetId = SHEET_IDS[config.key];
    if (!sheetId || String(sheetId).length < 10) {
      return createCORSResponse({ success:false, error: 'Spreadsheet ID for ' + config.key + ' not configured/invalid.'});
    }

    if (action === 'get_sales_marketing') {
      if (!kuartil) {
        return createCORSResponse({ success: false, error: 'Parameter kuartil diperlukan.' });
      }
      
      var data = getSalesAndMarketingData(sheetId, config.player, config.level, parseInt(kuartil));
      
      return createCORSResponse({
        success: true,
        message: 'Data Penjualan & Strategi Marketing berhasil diambil.',
        data: data,
        kuartil: kuartil,
        player: config.player
      });
    }

    if (action === 'get_inventory') {
      var inventory = getInventoryData(sheetId, config.player);
      return createCORSResponse({
        success: true,
        inventory: inventory,
        message: 'Inventory data retrieved from ' + config.player + ' - Model Finansial.'
      });
    }

    if (action === 'get_summary') {
      var summaryData = getSummaryData(sheetId);
      var processedData = extractSummaryData(summaryData);
      return createCORSResponse({
        success: true,
        message: 'Summary data retrieved and processed (Kas & Rating).',
        processed_data: processedData,
        timestamp: new Date().toISOString()
      });
    } else if (action === 'download_pdf') {
      var playerSheetName = config.player + ' - Laporan Pemain';
      var pdfUrl = generatePdfUrl(sheetId, playerSheetName);
      return createCORSResponse({
        success: true,
        message: 'PDF generated.',
        pdf_url: pdfUrl,
        note: 'Buka URL di tab baru untuk preview/download'
      });
    } else if (action === 'get_pdf_url') {
      var playerSheetName = config.player + ' - Laporan Pemain';
      var pdfUrl = generatePdfUrl(sheetId, playerSheetName);

      return createCORSResponse({
        success: true,
        pdf_url: pdfUrl
      });
    } else if (action === 'get_leaderboard_summary') { 
      var allTeamsSummary = getLeaderboardSummary(level, kelompok);
      return createCORSResponse({
        success: true,
        message: 'Leaderboard summary data retrieved',
        all_teams_summary: allTeamsSummary,
        timestamp: new Date().toISOString()
      });
    }
    return createCORSResponse({
      success: false,
      error: 'Unknown action or missing parameters'
    });

  } catch (error) {
    Logger.log('doGet error: ' + error);
    Logger.log('Stack: ' + error.stack);
    return createCORSResponse({ 
      success:false, 
      error: error.toString(), 
      stack: error.stack 
    });
  }
}

function doPost(e) {
  // Log raw request untuk debugging
  Logger.log('=== POST REQUEST RECEIVED ===');
  Logger.log('postData.contents: ' + (e.postData ? e.postData.contents : 'NO POST DATA'));
  
  try {
    if (!e.postData || !e.postData.contents) {
      return createCORSResponse({ 
        success: false, 
        error: 'No POST data received' 
      });
    }

    var data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    var action = data.action || 'save_full_decision';

    if (action === "adminLogin") {
      return createCORSResponse(
        verifyAdminLogin(data.password)
      );
    }

    if (action === "changePassword") {
      return createCORSResponse(
        changeAdminPassword(data.oldPassword, data.newPassword)
      );
    }

    if (action === 'clear_all_quarters') {
      return withLock(function() {
        var result = clearAllQuarters(data.level, data.kelompok);
        return createCORSResponse(result);
      }, 60000);
    }

    if (action === 'clear_all_sheets') {
      return withLock(function() {
        return createCORSResponse(clearAllSheets());
      }, 120000); // 120 second timeout untuk operasi besar
    }

    var kelompok = data.kelompok;
    var level = data.level;
    var decision = data.decision || {};

    Logger.log('Action: ' + action);
    Logger.log('Kelompok: ' + kelompok);
    Logger.log('Level: ' + level);
    Logger.log('Kuartil: ' + decision.kuartil);

    if (!kelompok || !level || !decision || !decision.kuartil) {
      return createCORSResponse({ 
        success: false, 
        error: 'Missing required fields: kelompok, level, or decision.kuartil' 
      });
    }

    var kelompokKey = (level || '').toUpperCase() + '_' + kelompok.toUpperCase();
    Logger.log('Looking for kelompokKey: ' + kelompokKey);
    
    var config = KELOMPOK_MAPPING[kelompokKey];
    if (!config) {
      return createCORSResponse({ 
        success: false, 
        error: 'Invalid kelompok or level: ' + kelompokKey 
      });
    }

    var sheetId = SHEET_IDS[config.key];
    if (!sheetId || String(sheetId).length < 10) {
      return createCORSResponse({ 
        success: false, 
        error: 'Spreadsheet ID for ' + config.key + ' not configured/invalid.'
      });
    }

    Logger.log('Using sheetId: ' + sheetId);
    Logger.log('Config: ' + JSON.stringify(config));

    return withLock(function() {
      var ss = safeOpenById(sheetId);
      var sheetName = config.player + ' - Input Keputusan';
      Logger.log('Looking for sheet: ' + sheetName);
      
      var sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
        return createCORSResponse({ 
          success: false, 
          error: 'Sheet not found: ' + sheetName 
        });
      }

      var kuartil = parseInt(decision.kuartil, 10);
      if (!kuartil || kuartil < 1 || kuartil > 8) {
        return createCORSResponse({ 
          success: false, 
          error: 'Invalid kuartil: ' + kuartil 
        });
      }

      var isEasy = config.level === 'Easy';
      var isMedium = config.level === 'Medium';
      var isProductBAvailable_K5_K8 = isMedium && kuartil >= 5 && kuartil <= 8;

      // =========================================================
      // ACTION: SAVE MARKETING ONLY
      // =========================================================
      if (action === 'save_marketing') {
        Logger.log('Executing save_marketing for kuartil ' + kuartil);
        
        var pemasaranRow = PEMASARAN_ROW_MAPPING[kuartil];
        if (pemasaranRow) {
          var marketingVals = [
            decision.marketing_1 || '',
            decision.marketing_2 || '',
            decision.marketing_3 || ''
          ];
          Logger.log('Writing marketing to row ' + pemasaranRow + ': ' + JSON.stringify(marketingVals));
          
          safeSetRowValues(sheet, pemasaranRow, 4, marketingVals);
          SpreadsheetApp.flush(); 
          
          Logger.log('Marketing saved successfully');
          
          return createCORSResponse({
            success: true,
            message: 'Marketing strategies for Kuartil ' + kuartil + ' saved successfully.',
            action: 'save_marketing',
            data_written: marketingVals
          });
        } else {
          return createCORSResponse({ 
            success: false, 
            error: 'Kuartil ' + kuartil + ' is not a valid quarter for marketing input.' 
          });
        }
      }

      // =========================================================
      // ACTION: SAVE FULL DECISION
      // =========================================================
      Logger.log('Executing save_full_decision for kuartil ' + kuartil);

      // 1. PEMASARAN
      var pemasaranRow = PEMASARAN_ROW_MAPPING[kuartil];
      if (pemasaranRow) {
        var marketingVals = [
          decision.marketing_1 || '',
          decision.marketing_2 || '',
          decision.marketing_3 || ''
        ];
        Logger.log('Writing marketing to row ' + pemasaranRow);
        safeSetRowValues(sheet, pemasaranRow, 4, marketingVals);
      }

      // 2. PENGADAAN BARANG - PRODUK A
      var pengadaanA_Row = PENGADAAN_A_ROW_MAPPING[kuartil];
      if (pengadaanA_Row) {
        var supplierA_Vals = [
          parseInt(decision.supplier_a_A, 10) || 0,
          parseInt(decision.supplier_b_A, 10) || 0,
          parseInt(decision.supplier_c_A, 10) || 0,
          parseInt(decision.supplier_d_A, 10) || 0
        ];
        Logger.log('Writing Prod A inventory to row ' + pengadaanA_Row);
        safeSetRowValues(sheet, pengadaanA_Row, 4, supplierA_Vals);
      }

      // 3. PENGADAAN BARANG - PRODUK B
      if (isProductBAvailable_K5_K8) {
        var pengadaanB_Row = PENGADAAN_B_ROW_MAPPING[kuartil];
        if (pengadaanB_Row) {
          var supplierB_Vals = [
            parseInt(decision.supplier_a_B, 10) || 0,
            parseInt(decision.supplier_b_B, 10) || 0,
            parseInt(decision.supplier_c_B, 10) || 0,
            parseInt(decision.supplier_d_B, 10) || 0
          ];
          Logger.log('Writing Prod B inventory to row ' + pengadaanB_Row);
          safeSetRowValues(sheet, pengadaanB_Row, 4, supplierB_Vals);
        }
      } else if (PENGADAAN_B_ROW_MAPPING[kuartil]) { 
        safeSetRowValues(sheet, PENGADAAN_B_ROW_MAPPING[kuartil], 4, [0, 0, 0, 0]);
      }

      // 4. PENJUALAN OFFLINE - PRODUK A
      var offlineARowMapping = isEasy ? OFFLINE_A_ROW_MAPPING_EASY : OFFLINE_A_ROW_MAPPING_MEDIUM;
      var offlineA_Row = offlineARowMapping[kuartil];
      if (offlineA_Row) {
        Logger.log('Writing Offline A sales to row ' + offlineA_Row);
        safeSetRowValues(sheet, offlineA_Row, 4, [parseInt(decision.harga_offline_A, 10) || 0]);
        safeSetRowValues(sheet, offlineA_Row, 7, [parseInt(decision.pembeli_datang_terlayani_offline_A, 10) || 0]);
        safeSetRowValues(sheet, offlineA_Row, 9, [parseInt(decision.pembeli_tambahan_offline_A, 10) || 0]);
        safeSetRowValues(sheet, offlineA_Row, 10, [parseInt(decision.pembeli_tambahan_terlayani_offline_A, 10) || 0]);
      }

      // 5. PENJUALAN OFFLINE - PRODUK B
      if (isProductBAvailable_K5_K8) {
        var offlineB_Row = OFFLINE_B_ROW_MAPPING[kuartil];
        if (offlineB_Row) {
          Logger.log('Writing Offline B sales to row ' + offlineB_Row);
          safeSetRowValues(sheet, offlineB_Row, 4, [parseInt(decision.harga_offline_B, 10) || 0]);
          safeSetRowValues(sheet, offlineB_Row, 7, [parseInt(decision.pembeli_datang_terlayani_offline_B, 10) || 0]);
          safeSetRowValues(sheet, offlineB_Row, 9, [parseInt(decision.pembeli_tambahan_offline_B, 10) || 0]);
          safeSetRowValues(sheet, offlineB_Row, 10, [parseInt(decision.pembeli_tambahan_terlayani_offline_B, 10) || 0]);
        }
      } else if (OFFLINE_B_ROW_MAPPING[kuartil]) {
        safeSetRowValues(sheet, OFFLINE_B_ROW_MAPPING[kuartil], 4, [0]);
        safeSetRowValues(sheet, OFFLINE_B_ROW_MAPPING[kuartil], 7, [0]);
        safeSetRowValues(sheet, OFFLINE_B_ROW_MAPPING[kuartil], 9, [0]);
        safeSetRowValues(sheet, OFFLINE_B_ROW_MAPPING[kuartil], 10, [0]);
      }

      // 6. PENJUALAN ONLINE
      var isOnlineAAvailable = (isMedium && kuartil >= 1) || (isEasy && kuartil >= 5);

      if (isOnlineAAvailable) {
        var onlineARow = isEasy ? ONLINE_A_ROW_MAPPING_EASY[kuartil] : ONLINE_A_ROW_MAPPING_MEDIUM[kuartil];
        if (onlineARow) {
          Logger.log('Writing Online A sales to row ' + onlineARow);
          safeSetRowValues(sheet, onlineARow, 4, [parseInt(decision.harga_online_A, 10) || 0]);
          safeSetRowValues(sheet, onlineARow, 7, [parseInt(decision.pembeli_datang_terlayani_online_A, 10) || 0]);
          safeSetRowValues(sheet, onlineARow, 9, [parseInt(decision.pembeli_tambahan_online_A, 10) || 0]);
          safeSetRowValues(sheet, onlineARow, 10, [parseInt(decision.pembeli_tambahan_terlayani_online_A, 10) || 0]);
        }
      }

      if (isProductBAvailable_K5_K8) {
        var onlineBRow = ONLINE_B_ROW_MAPPING_MEDIUM[kuartil];
        if (onlineBRow) {
          Logger.log('Writing Online B sales to row ' + onlineBRow);
          safeSetRowValues(sheet, onlineBRow, 4, [parseInt(decision.harga_online_B, 10) || 0]);
          safeSetRowValues(sheet, onlineBRow, 7, [parseInt(decision.pembeli_datang_terlayani_online_B, 10) || 0]);
          safeSetRowValues(sheet, onlineBRow, 9, [parseInt(decision.pembeli_tambahan_online_B, 10) || 0]);
          safeSetRowValues(sheet, onlineBRow, 10, [parseInt(decision.pembeli_tambahan_terlayani_online_B, 10) || 0]);
        }
      } else if (isMedium && ONLINE_B_ROW_MAPPING_MEDIUM[kuartil]) {
        safeSetRowValues(sheet, ONLINE_B_ROW_MAPPING_MEDIUM[kuartil], 4, [0]);
        safeSetRowValues(sheet, ONLINE_B_ROW_MAPPING_MEDIUM[kuartil], 7, [0]);
        safeSetRowValues(sheet, ONLINE_B_ROW_MAPPING_MEDIUM[kuartil], 9, [0]);
        safeSetRowValues(sheet, ONLINE_B_ROW_MAPPING_MEDIUM[kuartil], 10, [0]);
      }

      SpreadsheetApp.flush();
      Logger.log('All data written successfully');

      return createCORSResponse({
        success: true,
        message: 'Decision for ' + config.level + ' - Kelompok ' + kelompok + ' - Kuartil ' + kuartil + ' saved successfully',
        sheet: sheetName,
        kelompok: kelompok,
        level: config.level,
        kuartil: kuartil,
        timestamp: new Date().toISOString()
      });

    }, 30000); // 30 second lock timeout

  } catch (error) {
    Logger.log('=== DOPOST ERROR ===');
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return createCORSResponse({ 
      success: false, 
      error: error.toString(), 
      stack: error.stack 
    });
  }
}