const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8095;
const WEB_DIR = __dirname;
const REPO_ROOT = path.resolve(__dirname, '..');

// ==========================================================================
// Firebase Admin SDK Initialization (Surakshya-India)
// ==========================================================================
let firebaseAdmin = null;
let firebaseDb = null;
const FIREBASE_DB_URL = 'https://surakshya-india-default-rtdb.asia-southeast1.firebasedatabase.app/';

try {
  const serviceAccountPath = path.join(WEB_DIR, 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    const admin = require('firebase-admin');
    const { getDatabase } = require('firebase-admin/database');
    const serviceAccount = require(serviceAccountPath);
    
    const app = admin.initializeApp({
      credential: admin.cert(serviceAccount),
      databaseURL: FIREBASE_DB_URL
    });

    firebaseAdmin = admin;
    firebaseDb = getDatabase(app);
    console.log('[Firebase] Successfully connected to Surakshya-India Realtime Database!');

    // Initialize root nodes
    firebaseDb.ref('system_status').set({
      connected: true,
      lastOnline: new Date().toISOString(),
      edition: 'Bharat Edition (बाल रक्षक)'
    });
  } else {
    console.warn('[Firebase] serviceAccountKey.json not found in web dir. Running in standalone mode.');
  }
} catch (err) {
  console.error('[Firebase] Initialization error:', err.message);
}

// ==========================================================================
// Twilio SMS Integration (Emergency Alerts to Parents)
// ==========================================================================
const https = require('https');
const querystring = require('querystring');
let twilioConfig = null;

try {
  const twilioConfigPath = path.join(WEB_DIR, 'twilioConfig.json');
  if (fs.existsSync(twilioConfigPath)) {
    twilioConfig = JSON.parse(fs.readFileSync(twilioConfigPath, 'utf8'));
    console.log('[Twilio] SMS Dispatcher initialized for:', twilioConfig.parentNumbers.join(', '));
  }
} catch (e) {
  console.warn('[Twilio] Config error:', e.message);
}

function sendTwilioSMS(to, body) {
  if (!twilioConfig) return;
  const postData = querystring.stringify({
    From: twilioConfig.fromNumber,
    To: to,
    Body: body
  });

  const req = https.request({
    hostname: 'api.twilio.com',
    path: `/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${twilioConfig.accountSid}:${twilioConfig.authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(`[Twilio SMS Sent] To: ${to}, Status: ${res.statusCode}`);
    });
  });
  req.on('error', err => console.error('[Twilio Error]:', err.message));
  req.write(postData);
  req.end();
}

// Automatically dispatch SMS whenever an alert appears in Firebase Realtime Database
if (firebaseDb) {
  firebaseDb.ref('alerts').limitToLast(1).on('child_added', snapshot => {
    const alertData = snapshot.val();
    if (!alertData) return;
    if (Date.now() - (alertData.timestamp || 0) < 120000) {
      console.log('[Firebase Alert Sync]:', alertData.childName, alertData.emergencyType);
      if (twilioConfig && Array.isArray(twilioConfig.parentNumbers)) {
        const childName = alertData.childName || 'Child';
        const lat = alertData.lat ? Number(alertData.lat).toFixed(4) : 'N/A';
        const lng = alertData.lng ? Number(alertData.lng).toFixed(4) : 'N/A';
        const smsText = `🚨 [KID BUDDY SOS ALERT] ${childName} ne Emergency Trigger kiya hai! Live GPS: https://surakshya321.bcastudent321.workers.dev/ (Lat: ${lat}, Lng: ${lng}, Battery: ${alertData.battery || 85}%). Please check immediately!`;
        twilioConfig.parentNumbers.forEach(num => {
          sendTwilioSMS(num, smsText);
        });
      }
      broadcastSSE('emergency_sos', alertData);
    }
  });
}

// ==========================================================================
// In-Memory Real-Time State & SSE Clients (Server-Sent Events)
// ==========================================================================
let sseClients = [];
let latestLocations = {};

function broadcastSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch (e) {
      // client disconnected
    }
  });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.swift': 'text/plain; charset=UTF-8'
};

// ==========================================================================
// HTTP Server & Real-Time API
// ==========================================================================
const server = http.createServer((req, res) => {
  // Enable CORS for mobile browsers & Cloudflare Tunnel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = reqUrl.pathname;

  // 1. API Endpoint: SSE Live Stream (Server-Sent Events)
  if (pathname === '/api/live-stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('event: connected\ndata: {"status":"connected","firebase":' + (firebaseDb ? 'true' : 'false') + '}\n\n');
    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // 2. API Endpoint: POST live GPS coordinates from real smartphone
  if (pathname === '/api/location' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const childId = data.childId || 'child_1';
        data.serverTime = Date.now();
        latestLocations[childId] = data;

        // Sync directly to Firebase Realtime Database
        if (firebaseDb) {
          firebaseDb.ref(`locations/${childId}`).set(data);
          firebaseDb.ref(`history/${childId}/${Date.now()}`).set({
            lat: data.lat,
            lng: data.lng,
            speed: data.speed,
            time: new Date().toLocaleTimeString()
          });
        }

        // Broadcast to all open Parent Dashboards in real time
        broadcastSSE('location_update', data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, syncedToFirebase: !!firebaseDb }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 3. API Endpoint: POST Emergency SOS Alert
  if (pathname === '/api/emergency' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (firebaseDb) {
          firebaseDb.ref(`alerts/${Date.now()}`).set({
            ...data,
            resolved: false,
            timestamp: Date.now()
          });
        }

        // Send Twilio Emergency SOS SMS to Parents
        if (twilioConfig && Array.isArray(twilioConfig.parentNumbers)) {
          const childName = data.childName || 'Child';
          const lat = data.lat ? Number(data.lat).toFixed(4) : '28.6139';
          const lng = data.lng ? Number(data.lng).toFixed(4) : '77.2090';
          const smsText = `🚨 [KID BUDDY 112 SOS ALERT] ${childName} ne Emergency Alert Trigger kiya hai! Live GPS: https://surakshya321.bcastudent321.workers.dev/ (Lat: ${lat}, Lng: ${lng}, Battery: ${data.battery || 85}%). Please check immediately!`;
          twilioConfig.parentNumbers.forEach(num => {
            sendTwilioSMS(num, smsText);
          });
        }

        broadcastSSE('emergency_sos', data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, alertBroadcast: true, smsDispatched: !!twilioConfig }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. API Endpoint: Get Firebase Status & Keys
  if (pathname === '/api/firebase-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      connected: !!firebaseDb,
      databaseURL: FIREBASE_DB_URL,
      projectId: 'surakshya-india'
    }));
  }

  // 5. Static Assets from iOS repo
  if (pathname === '/api/icon') {
    const iconPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'Assets.xcassets', 'AppIcon.appiconset', '1024.png');
    if (fs.existsSync(iconPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(iconPath).pipe(res);
    }
  }

  if (pathname === '/api/person-icon') {
    const personPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'Assets.xcassets', 'person.imageset', 'person.png');
    if (fs.existsSync(personPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(personPath).pipe(res);
    }
  }

  if (pathname === '/api/sound/sos') {
    const soundPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'criticalAlert.wav');
    if (fs.existsSync(soundPath)) {
      const stat = fs.statSync(soundPath);
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      return fs.createReadStream(soundPath).pipe(res);
    }
  }

  // 6. Swift Source Code APIs
  if (pathname === '/api/source-tree') {
    try {
      const getSwiftFiles = (dir, base = '') => {
        let results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'Pods') continue;
          const fullPath = path.join(dir, entry.name);
          const relPath = path.join(base, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(getSwiftFiles(fullPath, relPath));
          } else if (entry.name.endsWith('.swift') || entry.name.endsWith('.plist') || entry.name.endsWith('.md')) {
            results.push({ name: entry.name, path: relPath.replace(/\\/g, '/'), size: fs.statSync(fullPath).size });
          }
        }
        return results;
      };

      const files = getSwiftFiles(path.join(REPO_ROOT, 'Kid Buddy'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(files));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  if (pathname === '/api/source-file') {
    const filePathParam = reqUrl.searchParams.get('file');
    if (!filePathParam || filePathParam.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid file parameter' }));
    }
    const targetPath = path.join(REPO_ROOT, 'Kid Buddy', filePathParam);
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'File not found' }));
    }
  }

  // 7. Routes for Pages
  if (pathname === '/' || pathname === '/index.html') {
    pathname = '/index.html';
  } else if (pathname === '/tracker' || pathname === '/tracker.html') {
    pathname = '/tracker.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(WEB_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Kid Buddy Bharat] Live Server is running on http://localhost:${PORT}`);
  console.log(`[Firebase Status] Connected to: ${FIREBASE_DB_URL}`);
  console.log(`[Mobile Tracker] Open http://localhost:${PORT}/tracker on any smartphone`);
});
