/**
 * Kid Buddy Bharat (बाल रक्षक) — Indian Edition Live Simulator & Command Center
 * Features:
 * - Real-Time Tracking in Indian Cities (Bengaluru, Delhi, Mumbai)
 * - School Bus / Van Live Route Tracker (KA-01-F-4589, Driver Ramesh Bhaiya)
 * - 112 National Emergency ERSS & 1098 Childline India integration
 * - Safe Zones (School, Home, Tuition/Coaching, Metro)
 * - Movement History & Route Replay
 * - Indian Family In-App Chat with Desi Auto-Responses
 * - Multi-language support (English / हिंदी)
 */

// City Configurations
const CITIES = {
  bengaluru: {
    name: 'Bengaluru (Indiranagar)',
    center: [12.9756, 77.6402],
    carrier: 'Jio True 5G',
    schoolName: 'National Public School (NPS) Indiranagar',
    homeName: 'Shanti Niwas (100 Feet Rd, Indiranagar)',
    busNumber: 'KA-01-F-4589',
    waypoints: [
      { lat: 12.9719, lng: 77.6412, speed: 0.0, loc: 'Shanti Niwas, 100 Feet Rd' },
      { lat: 12.9735, lng: 77.6418, speed: 22.0, loc: '12th Main Junction, Indiranagar' },
      { lat: 12.9750, lng: 77.6425, speed: 28.0, loc: 'Near CMH Road Metro' },
      { lat: 12.9765, lng: 77.6410, speed: 25.0, loc: 'HAL 2nd Stage Road' },
      { lat: 12.9756, lng: 77.6402, speed: 15.0, loc: 'NPS School Gate 3 Arrival' }
    ],
    places: [
      { id: 'p1', name: 'National Public School (NPS) Indiranagar', emoji: '🏫', lat: 12.9756, lng: 77.6402, radius: 250, desc: 'School Campus • 08:00 AM - 03:00 PM' },
      { id: 'p2', name: 'Shanti Niwas (Home)', emoji: '🏠', lat: 12.9719, lng: 77.6412, radius: 150, desc: 'Residence • 24/7 Safe Zone' },
      { id: 'p3', name: 'Aakash Coaching Institute', emoji: '📚', lat: 12.9740, lng: 77.6425, radius: 200, desc: 'Maths & Science Tuition' },
      { id: 'p4', name: 'Swami Vivekananda Metro Station', emoji: '🚇', lat: 12.9784, lng: 77.6387, radius: 180, desc: 'Purple Line Metro' },
      { id: 'p5', name: 'Decathlon Sports Ground', emoji: '🏏', lat: 12.9702, lng: 77.6440, radius: 250, desc: 'Cricket & Football Academy' }
    ]
  },
  delhi: {
    name: 'Delhi NCR (Connaught Place)',
    center: [28.6139, 77.2090],
    carrier: 'Airtel 5G Plus',
    schoolName: 'Delhi Public School (DPS) R.K. Puram',
    homeName: 'Gulmohar Niketan, Lodhi Colony',
    busNumber: 'DL-01-E-7821',
    waypoints: [
      { lat: 28.5850, lng: 77.2150, speed: 0.0, loc: 'Gulmohar Niketan, Lodhi Colony' },
      { lat: 28.5780, lng: 77.1950, speed: 32.0, loc: 'Safdarjung Ring Road' },
      { lat: 28.5665, lng: 77.1767, speed: 18.0, loc: 'DPS R.K. Puram Sector 12 Gate' }
    ],
    places: [
      { id: 'p1', name: 'Delhi Public School (DPS) R.K. Puram', emoji: '🏫', lat: 28.5665, lng: 77.1767, radius: 300, desc: 'Campus Safe Zone' },
      { id: 'p2', name: 'Gulmohar Niketan (Home)', emoji: '🏠', lat: 28.5850, lng: 77.2150, radius: 150, desc: 'Lodhi Estate Safe Zone' },
      { id: 'p3', name: 'Khan Market Study Hub', emoji: '📚', lat: 28.6000, lng: 77.2270, radius: 200, desc: 'Tuition & Bookstores' }
    ]
  },
  mumbai: {
    name: 'Mumbai (Bandra West)',
    center: [19.0596, 72.8295],
    carrier: 'Jio True 5G',
    schoolName: "St. Stanislaus High School Bandra",
    homeName: 'Sea Breeze Apt, Carter Road',
    busNumber: 'MH-02-B-9912',
    waypoints: [
      { lat: 19.0640, lng: 72.8280, speed: 0.0, loc: 'Carter Road Promenade' },
      { lat: 19.0610, lng: 72.8310, speed: 20.0, loc: 'Pali Hill Junction' },
      { lat: 12.9756, lng: 77.6402, speed: 14.0, loc: 'Hill Road School Gate' }
    ],
    places: [
      { id: 'p1', name: 'St. Stanislaus High School', emoji: '🏫', lat: 19.0580, lng: 72.8330, radius: 250, desc: 'Bandra West Campus' },
      { id: 'p2', name: 'Sea Breeze Apt (Home)', emoji: '🏠', lat: 19.0640, lng: 72.8280, radius: 150, desc: 'Carter Road Safe Zone' }
    ]
  }
};

// Global App State
const state = {
  activeRole: 'parent',
  activeTab: 'tracking',
  viewMode: 'phone',
  mapType: 'standard',
  currentCityKey: 'bengaluru',
  currentLang: 'en', // 'en' | 'hi'
  isSimulatingMove: false,
  simInterval: null,
  simStep: 0,
  isReplayingRoute: false,
  replayInterval: null,
  trackedChildId: 'child_1',

  children: [
    {
      id: 'child_1',
      name: 'Arpit Kaur',
      age: 9,
      relation: 'Beti (Daughter)',
      school: 'National Public School (NPS) Indiranagar, Class 4B',
      avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      lat: 12.9756,
      lng: 77.6402,
      battery: 88,
      isCharging: false,
      speed: 26,
      accuracy: 3.2,
      locationName: 'Near NPS Indiranagar Gate 3',
      status: 'School Me Hai (In School)',
      online: true,
      history: [
        { time: '07:45 AM', desc: 'Home Departed (Ghar Se Nikli)', lat: 12.9719, lng: 77.6412, loc: '100 Feet Rd, Indiranagar' },
        { time: '08:02 AM', desc: 'Boarded School Bus #14B', lat: 12.9735, lng: 77.6418, loc: '12th Main Stop' },
        { time: '08:24 AM', desc: 'Reached NPS Indiranagar', lat: 12.9756, lng: 77.6402, loc: 'School Campus' },
        { time: '11:15 AM', desc: 'Recess & Lunch Break', lat: 12.9758, lng: 77.6400, loc: 'School Sports Field' },
        { time: '01:45 PM', desc: 'Science Exhibition Prep', lat: 12.9754, lng: 77.6405, loc: 'Science Block' },
        { time: '03:10 PM', desc: 'Awaiting Bus for Return', lat: 12.9756, lng: 77.6402, loc: 'Gate 3 Bus Bay' }
      ],
      chatMessages: [
        { sender: 'child', text: 'Namaste Mummy, school bus me baith gayi! Sunita didi is here.', time: '08:05 AM' },
        { sender: 'parent', text: 'Shabash Arpit beta! Class me dhyan dena aur lunch zaroor khana ❤️', time: '08:08 AM' },
        { sender: 'child', text: 'Haan Mummy, Maths me 20/20 mila test me! 🎉', time: '11:20 AM' },
        { sender: 'parent', text: 'Wah Arpit beta! Papa ko batati hoon, he will be so proud!', time: '11:35 AM' }
      ]
    },
    {
      id: 'child_2',
      name: 'Alisha',
      age: 12,
      relation: 'Beti (Daughter)',
      school: 'Bishop Cotton Girls School, Class 7A',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      lat: 12.9740,
      lng: 77.6425,
      battery: 64,
      isCharging: false,
      speed: 0.0,
      accuracy: 2.8,
      locationName: 'Aakash Coaching Institute, Indiranagar',
      status: 'Tuition Class Active',
      online: true,
      history: [
        { time: '08:00 AM', desc: 'School Arrival', lat: 12.9720, lng: 77.6350, loc: 'St. Mark\'s Rd' },
        { time: '03:45 PM', desc: 'Arrived at Aakash Tuition', lat: 12.9740, lng: 77.6425, loc: 'Indiranagar Center' }
      ],
      chatMessages: [
        { sender: 'parent', text: 'Alisha, tuition khatam hone ke baad call karna.', time: '03:50 PM' },
        { sender: 'child', text: 'Haan Mummy, Ramesh bhaiya will pick me at 5:15 PM.', time: '03:52 PM' }
      ]
    },
    {
      id: 'child_3',
      name: 'Neerja Thakur',
      age: 7,
      relation: 'Chhoti Beti (Daughter)',
      school: 'EuroKids Preschool, Class 2',
      avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&auto=format&fit=crop&q=80',
      lat: 12.9719,
      lng: 77.6412,
      battery: 95,
      isCharging: true,
      speed: 0.0,
      accuracy: 4.5,
      locationName: 'Shanti Niwas (Home with Dadi)',
      status: 'Ghar Par Hai (At Home)',
      online: true,
      history: [
        { time: '12:30 PM', desc: 'Arrived Home from School', lat: 12.9719, lng: 77.6412, loc: 'Indiranagar 100ft Rd' }
      ],
      chatMessages: [
        { sender: 'parent', text: 'Neerja beta, doodh piya?', time: '01:00 PM' },
        { sender: 'child', text: 'Haan mummy, Dadi ne kheer bhi banayi! 🥣', time: '01:15 PM' }
      ]
    }
  ],

  busStops: [
    { stop: 'Indiranagar 100ft Rd (Shanti Niwas)', time: '07:45 AM', status: 'Completed (चली गई)', active: false },
    { stop: '12th Main Crossing Stop', time: '07:58 AM', status: 'Completed (चली गई)', active: false },
    { stop: 'CMH Road Metro Station', time: '08:12 AM', status: 'Completed (चली गई)', active: false },
    { stop: 'HAL 2nd Stage Police Chowki', time: '08:20 AM', status: 'Arriving Now (आ रही है)', active: true },
    { stop: 'NPS Indiranagar School Gate 3', time: '08:26 AM', status: 'ETA: 6 Mins', active: false }
  ]
};

// Maps references
let trackingMap = null;
let placesMap = null;
let historyMap = null;
let trackingMarker = null;
let trackingTileLayer = null;
let placesCircles = [];
let historyPolyline = null;
let historyMarkers = [];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initRealClock();
  initChildrenCarousel();
  initTelemetryChildSelect();
  renderPlacesList();
  renderHistoryTimeline();
  renderBusStopsList();
  renderChatMessages();
  updateChildQuickSheet();
  initMaps();
  initLiveStreamSSE();
  logEvent('Kid Buddy Bharat Initialized. Connected to Firebase (surakshya-india) & 112 ERSS.');
});

// Real-Time IST Clock
function initRealClock() {
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const clockEl = document.getElementById('status-clock');
    if (clockEl) clockEl.innerText = timeStr;
    const istEl = document.getElementById('current-ist-time');
    if (istEl) istEl.innerText = `${timeStr} IST`;
  }
  updateTime();
  setInterval(updateTime, 10000);
}

// Get active child helper
function getActiveChild() {
  return state.children.find(c => c.id === state.trackedChildId) || state.children[0];
}

// Render Children Horizontal Carousel
function initChildrenCarousel() {
  const container = document.getElementById('children-carousel');
  if (!container) return;
  container.innerHTML = '';

  state.children.forEach(child => {
    const card = document.createElement('div');
    card.className = `child-card-chip ${child.id === state.trackedChildId ? 'active' : ''}`;
    card.id = `chip-${child.id}`;
    card.onclick = () => selectChild(child.id);
    card.innerHTML = `
      <img src="${child.avatar}" class="chip-avatar" alt="${child.name}" onerror="this.src='/api/person-icon';">
      <div style="min-width:0;">
        <div class="chip-name">${child.name.split(' ')[0]}</div>
        <div class="chip-sub">🔋 ${child.battery}% • ${child.relation.split(' ')[0]}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function selectChild(childId) {
  state.trackedChildId = childId;
  initChildrenCarousel();
  updateChildQuickSheet();
  updateTelemetryPanel();
  renderChatMessages();
  renderHistoryTimeline();

  const child = getActiveChild();
  logEvent(`Switched tracking target to ${child.name}.`);

  if (trackingMap && trackingMarker) {
    trackingMarker.setLatLng([child.lat, child.lng]);
    trackingMap.setView([child.lat, child.lng], 15);
  }
  if (historyMap) {
    updateHistoryMap();
  }
}

function initTelemetryChildSelect() {
  const select = document.getElementById('telemetry-child-select');
  if (!select) return;
  select.innerHTML = '';
  state.children.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.innerText = `${c.name} (${c.relation})`;
    if (c.id === state.trackedChildId) opt.selected = true;
    select.appendChild(opt);
  });
}

function onChildSelectionChange(id) {
  selectChild(id);
}

// Update Child Quick Sheet & Dynamic Island
function updateChildQuickSheet() {
  const child = getActiveChild();
  document.getElementById('sheet-avatar').src = child.avatar;
  document.getElementById('sheet-child-name').innerText = child.name;
  document.getElementById('sheet-child-loc').innerText = `📍 ${child.locationName}`;
  document.getElementById('sheet-battery').innerText = `🔋 ${child.battery}% Battery`;
  document.getElementById('sheet-speed').innerText = `🚶 ${child.speed} km/h`;

  const islandText = document.getElementById('island-text');
  if (islandText) {
    islandText.innerText = `${child.name.split(' ')[0]} • ${child.status}`;
  }

  const childViewAvatar = document.getElementById('child-view-avatar');
  if (childViewAvatar) childViewAvatar.src = child.avatar;
  const childGreeting = document.getElementById('child-hero-greeting');
  if (childGreeting) childGreeting.innerText = `Hi ${child.name.split(' ')[0]}! Beta`;

  const chatAvatar = document.getElementById('chat-nav-avatar');
  if (chatAvatar) chatAvatar.src = child.avatar;
  const chatName = document.getElementById('chat-nav-name');
  if (chatName) chatName.innerText = child.name.split(' ')[0];

  const histTitle = document.getElementById('history-screen-title');
  if (histTitle) histTitle.innerText = `${child.name.split(' ')[0]}'s History`;

  updateTelemetryPanel();
}

function updateTelemetryPanel() {
  const child = getActiveChild();
  document.getElementById('tel-lat').innerText = child.lat.toFixed(6);
  document.getElementById('tel-lng').innerText = child.lng.toFixed(6);
  document.getElementById('tel-speed').innerText = `${child.speed} km/h (Safe)`;
  document.getElementById('tel-acc').innerText = `± ${child.accuracy} m (IRNSS/NavIC)`;
  document.getElementById('tel-battery').innerText = `${child.battery}% (Jio 5G)`;
  document.getElementById('tel-place').innerText = child.locationName;
}

// Switch iOS Tab Bar
function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
  const activeTabBtn = document.getElementById(`tab-${tabId}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');

  document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
  const activeScreen = document.getElementById(`screen-${tabId}`);
  if (activeScreen) activeScreen.classList.add('active');

  setTimeout(() => {
    if (tabId === 'tracking' && trackingMap) trackingMap.invalidateSize();
    if (tabId === 'places' && placesMap) placesMap.invalidateSize();
    if (tabId === 'history' && historyMap) historyMap.invalidateSize();
  }, 200);
}

// Switch Role (Parent vs Baccha)
function switchAppRole(role) {
  state.activeRole = role;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-mode-${role}`).classList.add('active');

  const tabBar = document.getElementById('ios-tab-bar');

  if (role === 'child') {
    tabBar.style.display = 'none';
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-child-device').classList.add('active');
    logEvent('Switched to Baccha (Child) Device screen.');
  } else {
    tabBar.style.display = 'flex';
    switchTab(state.activeTab || 'tracking');
    logEvent('Switched to Parivaar (Parent) Dashboard.');
  }
}

// Switch City
function switchCity(cityKey) {
  if (!CITIES[cityKey]) return;
  state.currentCityKey = cityKey;
  const city = CITIES[cityKey];

  document.getElementById('status-carrier').innerText = city.carrier;
  document.getElementById('nav-location-tag').innerText = city.name;

  const child = getActiveChild();
  child.lat = city.center[0];
  child.lng = city.center[1];
  child.locationName = `Near ${city.schoolName}`;

  if (trackingMap) {
    trackingMap.setView(city.center, 15);
    if (trackingMarker) trackingMarker.setLatLng(city.center);
  }

  logEvent(`Switched tracking map to ${city.name}.`);
  updateChildQuickSheet();
}

// Toggle Language (English <-> Hindi)
function toggleLanguage() {
  state.currentLang = state.currentLang === 'en' ? 'hi' : 'en';
  const langText = document.getElementById('current-lang-text');

  if (state.currentLang === 'hi') {
    if (langText) langText.innerText = 'हिंदी (Hindi Active)';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS.hi[key]) el.innerText = TRANSLATIONS.hi[key];
    });
    logEvent('Language changed to Hindi (हिंदी).');
  } else {
    if (langText) langText.innerText = 'English / हिंदी';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS.en[key]) el.innerText = TRANSLATIONS.en[key];
    });
    logEvent('Language changed to English.');
  }
}

const TRANSLATIONS = {
  en: {
    parent_mode: 'Parent Mode',
    child_mode: 'Baccha (Child) Mode',
    bus_mode: 'School Bus Track',
    app_title: 'Kid Buddy Bharat',
    safe_zones_title: 'Safe Zones (सुरक्षित क्षेत्र)',
    active_zones_label: 'ACTIVE GEOFENCED ZONES',
    auto_alerts_title: 'Smart SMS & WhatsApp Notifications',
    auto_alerts_desc: 'Mummy & Papa will receive immediate alerts whenever Arpit Kaur enters or leaves school, tuition, or home.',
    today_route: "Aaj Ka Route (Today's Route)",
    timeline_label: 'LOCATION TIMELINE (AAJ KA DIN)',
    tab_tracking: 'Tracking',
    tab_bus: 'School Bus',
    tab_places: 'Places',
    tab_history: 'History',
    tab_chat: 'Chat',
    tab_safety: 'Suraksha',
    telemetry_header: 'Bharat GPS Telemetry & Controls'
  },
  hi: {
    parent_mode: 'माता-पिता (Parent)',
    child_mode: 'बच्चा (Child Mode)',
    bus_mode: 'स्कूल बस ट्रैकर',
    app_title: 'बाल रक्षक (Kid Buddy)',
    safe_zones_title: 'सुरक्षित क्षेत्र (Safe Zones)',
    active_zones_label: 'सक्रिय सुरक्षित क्षेत्र',
    auto_alerts_title: 'व्हाट्सएप एवं SMS अलर्ट सक्रिय',
    auto_alerts_desc: 'जैसे ही अर्पित कौर स्कूल, ट्यूशन या घर पहुँचेगी या निकलेगी, तुरंत मैसेज आएगा।',
    today_route: 'आज की दिनचर्या व यात्रा',
    timeline_label: 'समय अनुसार स्थिति',
    tab_tracking: 'लाइव ट्रैकिंग',
    tab_bus: 'स्कूल बस',
    tab_places: 'सुरक्षित क्षेत्र',
    tab_history: 'इतिहास',
    tab_chat: 'बातचीत',
    tab_safety: 'सुरक्षा',
    telemetry_header: 'लाइव जीपीएस एवं नियंत्रण'
  }
};

// Set View Mode
function setViewMode(mode) {
  state.viewMode = mode;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-view-${mode}`).classList.add('active');

  if (mode === 'desktop') {
    document.body.classList.add('fullscreen-view');
  } else {
    document.body.classList.remove('fullscreen-view');
  }

  setTimeout(() => {
    if (trackingMap) trackingMap.invalidateSize();
  }, 300);
}

// Initialize Leaflet Maps
function initMaps() {
  const child = getActiveChild();
  const city = CITIES[state.currentCityKey];

  if (typeof L !== 'undefined' && document.getElementById('tracking-map')) {
    trackingMap = L.map('tracking-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([child.lat, child.lng], 15);

    setTileLayer('standard');

    const markerHtml = `
      <div class="child-map-marker">
        <div class="marker-avatar-halo">
          <img src="${child.avatar}" class="marker-avatar-img" onerror="this.src='/api/person-icon';">
        </div>
        <div class="marker-callout-pill">${child.name.split(' ')[0]} 🇮🇳</div>
      </div>
    `;
    const icon = L.divIcon({
      html: markerHtml,
      className: 'custom-leaflet-marker',
      iconSize: [44, 60],
      iconAnchor: [22, 50]
    });

    trackingMarker = L.marker([child.lat, child.lng], { icon }).addTo(trackingMap);

    city.places.forEach(p => {
      L.circle([p.lat, p.lng], {
        radius: p.radius,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(trackingMap).bindPopup(`<b>${p.name}</b><br>Suraksha Zone (${p.radius}m)`);
    });
  }

  if (typeof L !== 'undefined' && document.getElementById('places-map')) {
    placesMap = L.map('places-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([child.lat, child.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(placesMap);
    renderPlacesOnMap();
  }

  if (typeof L !== 'undefined' && document.getElementById('history-map')) {
    historyMap = L.map('history-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([child.lat, child.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(historyMap);
    updateHistoryMap();
  }
}

function toggleMapType() {
  state.mapType = state.mapType === 'standard' ? 'satellite' : 'standard';
  setTileLayer(state.mapType);
  document.getElementById('map-type-label').innerText = state.mapType === 'standard' ? 'Standard Map' : 'Satellite Hybrid';
  logEvent(`Switched map layer to ${state.mapType.toUpperCase()}.`);
}

function setTileLayer(type) {
  if (!trackingMap) return;
  if (trackingTileLayer) trackingMap.removeLayer(trackingTileLayer);

  if (type === 'satellite') {
    trackingTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(trackingMap);
  } else {
    trackingTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(trackingMap);
  }
}

function centerOnTrackedChild() {
  const child = getActiveChild();
  if (trackingMap) {
    trackingMap.flyTo([child.lat, child.lng], 16, { duration: 1.2 });
  }
}

// Render Places on Map
function renderPlacesOnMap() {
  if (!placesMap) return;
  placesCircles.forEach(c => placesMap.removeLayer(c));
  placesCircles = [];

  const city = CITIES[state.currentCityKey];
  city.places.forEach(p => {
    const circle = L.circle([p.lat, p.lng], {
      radius: p.radius,
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 0.25,
      weight: 2
    }).addTo(placesMap).bindPopup(`<strong>${p.emoji} ${p.name}</strong><br>Radius: ${p.radius}m`);

    placesCircles.push(circle);
  });
}

// Render Places List
function renderPlacesList() {
  const list = document.getElementById('places-list');
  if (!list) return;
  list.innerHTML = '';
  const city = CITIES[state.currentCityKey];
  document.getElementById('places-count').innerText = `${city.places.length} Places`;

  city.places.forEach(p => {
    const item = document.createElement('div');
    item.className = 'place-item';
    item.innerHTML = `
      <div class="place-left">
        <div class="place-emoji">${p.emoji}</div>
        <div>
          <div class="place-title">${p.name}</div>
          <div class="place-meta">${p.radius}m radius • ${p.desc}</div>
        </div>
      </div>
      <div class="place-actions">
        <button class="nav-icon-btn text-btn" onclick="focusPlaceOnMap(${p.lat}, ${p.lng})">Dekhein</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function focusPlaceOnMap(lat, lng) {
  if (placesMap) placesMap.setView([lat, lng], 16);
}

// Render School Bus Stops Timeline
function renderBusStopsList() {
  const list = document.getElementById('bus-stops-list');
  if (!list) return;
  list.innerHTML = '';

  state.busStops.forEach((bs, idx) => {
    const item = document.createElement('div');
    item.className = `bus-stop-item ${bs.active ? 'active-stop' : ''}`;
    item.innerHTML = `
      <div class="stop-left">
        <div class="stop-idx">${idx + 1}</div>
        <div>
          <div class="stop-name">${bs.stop}</div>
          <div class="stop-eta">${bs.time} • ${bs.status}</div>
        </div>
      </div>
      <div>${bs.active ? '🟡 Live' : '✓'}</div>
    `;
    list.appendChild(item);
  });
}

// Movement History Timeline
function renderHistoryTimeline() {
  const child = getActiveChild();
  const list = document.getElementById('timeline-list');
  if (!list) return;
  list.innerHTML = '';
  document.getElementById('history-count').innerText = `${child.history.length} Waypoints`;

  child.history.forEach(pt => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-time">${pt.time}</div>
        <div class="timeline-desc">${pt.desc}</div>
        <div class="timeline-loc">📍 ${pt.loc}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

// Update History Map Route & Polyline
function updateHistoryMap() {
  if (!historyMap) return;
  const child = getActiveChild();

  if (historyPolyline) historyMap.removeLayer(historyPolyline);
  historyMarkers.forEach(m => historyMap.removeLayer(m));
  historyMarkers = [];

  const points = child.history.map(h => [h.lat, h.lng]);
  if (points.length === 0) return;

  historyPolyline = L.polyline(points, {
    color: '#f97316',
    weight: 4,
    opacity: 0.85,
    dashArray: '3, 6'
  }).addTo(historyMap);

  points.forEach((pt, i) => {
    const marker = L.circleMarker(pt, {
      radius: i === points.length - 1 ? 8 : 5,
      color: '#ea580c',
      fillColor: i === points.length - 1 ? '#f97316' : '#fff',
      fillOpacity: 1,
      weight: 2
    }).addTo(historyMap).bindPopup(`<b>${child.history[i].time}</b><br>${child.history[i].desc}`);
    historyMarkers.push(marker);
  });

  historyMap.fitBounds(historyPolyline.getBounds(), { padding: [20, 20] });
}

function toggleRouteReplay() {
  const btn = document.getElementById('btn-replay');
  if (state.isReplayingRoute) {
    clearInterval(state.replayInterval);
    state.isReplayingRoute = false;
    btn.innerText = '▶ Play Route';
    return;
  }

  state.isReplayingRoute = true;
  btn.innerText = '⏸ Pause';

  const child = getActiveChild();
  let index = 0;
  const slider = document.getElementById('replay-slider');

  state.replayInterval = setInterval(() => {
    if (index >= child.history.length) {
      clearInterval(state.replayInterval);
      state.isReplayingRoute = false;
      btn.innerText = '↺ Replay';
      return;
    }

    const pt = child.history[index];
    slider.value = Math.round((index / (child.history.length - 1)) * 100);

    if (historyMarkers[index]) {
      historyMarkers[index].openPopup();
      historyMap.panTo([pt.lat, pt.lng]);
    }

    index++;
  }, 1200);
}

function onReplayScrub(val) {
  const child = getActiveChild();
  const index = Math.round((val / 100) * (child.history.length - 1));
  const pt = child.history[index];
  if (pt && historyMarkers[index]) {
    historyMarkers[index].openPopup();
    historyMap.panTo([pt.lat, pt.lng]);
  }
}

function clearHistoryPoints() {
  const child = getActiveChild();
  child.history = [];
  renderHistoryTimeline();
  updateHistoryMap();
  logEvent(`Cleared movement history for ${child.name}.`);
}

// Live GPS Walking & Bus Movement Simulation
function toggleMovementSimulation() {
  const btn = document.getElementById('btn-toggle-sim');
  const hud = document.getElementById('sim-hud');
  const city = CITIES[state.currentCityKey];

  if (state.isSimulatingMove) {
    clearInterval(state.simInterval);
    state.isSimulatingMove = false;
    if (btn) btn.innerText = '▶ Start Bus Route';
    if (hud) hud.classList.remove('active');
    logEvent('Paused School Bus GPS simulation.');
    return;
  }

  state.isSimulatingMove = true;
  if (btn) btn.innerText = '⏸ Pause Bus';
  if (hud) hud.classList.add('active');
  logEvent(`Started School Bus live route simulation in ${city.name}.`);

  state.simInterval = setInterval(() => {
    const child = getActiveChild();
    const wp = city.waypoints[state.simStep % city.waypoints.length];

    child.lat = wp.lat;
    child.lng = wp.lng;
    child.speed = wp.speed;
    child.locationName = wp.loc;

    checkGeofenceTriggers(child);

    if (trackingMarker && trackingMap) {
      trackingMarker.setLatLng([child.lat, child.lng]);
      trackingMap.panTo([child.lat, child.lng]);
    }

    updateChildQuickSheet();
    state.simStep++;
  }, 2400);
}

function checkGeofenceTriggers(child) {
  const city = CITIES[state.currentCityKey];
  city.places.forEach(place => {
    const dist = calculateDistance(child.lat, child.lng, place.lat, place.lng);
    if (dist <= place.radius) {
      if (!child.currentGeofence || child.currentGeofence !== place.id) {
        child.currentGeofence = place.id;
        showPushNotification(`स्कूल / सेफ ज़ोन अलर्ट`, `${child.name.split(' ')[0]} has safely reached ${place.name}.`);
        logEvent(`[SURAKSHA ALERT] ${child.name} entered ${place.name} (Within ${Math.round(dist)}m).`);
      }
    }
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function showPushNotification(title, body) {
  const banner = document.getElementById('ios-push-notification');
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  document.getElementById('push-title').innerText = title;
  document.getElementById('push-body').innerText = body;
  document.getElementById('push-time').innerText = timeStr;

  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 5000);
}

function simulateGeofenceEvent() {
  const child = getActiveChild();
  showPushNotification('School Arrival Notification', `${child.name.split(' ')[0]} has safely arrived at NPS Indiranagar.`);
  logEvent(`Simulated WhatsApp & SMS notification sent to Mummy & Papa.`);
}

// In-App Chat
function renderChatMessages() {
  const child = getActiveChild();
  const container = document.getElementById('chat-messages-container');
  if (!container) return;
  container.innerHTML = '';

  child.chatMessages.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender}`;
    bubble.innerHTML = `
      <div>${msg.text}</div>
      <div class="bubble-meta">${msg.time}</div>
    `;
    container.appendChild(bubble);
  });

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const child = getActiveChild();
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  child.chatMessages.push({
    sender: 'parent',
    text: text,
    time: timeStr
  });

  input.value = '';
  renderChatMessages();
  logEvent(`Mummy sent message to ${child.name}: "${text}"`);

  // Desi automated responses
  setTimeout(() => {
    const responses = [
      "Haan Mummy, bus me baith gaya. Sunita didi is with us! 😊",
      "Theek hai Mummy! Class ke baad call karta hoon.",
      "Lunch dhang se khaya, paneer paratha bohot tasty tha! 😋",
      "Teacher gave homework in Hindi and Maths.",
      "Ramesh bhaiya driving properly, 10 min me ghar pahunch jaunga! ❤️"
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];

    child.chatMessages.push({
      sender: 'child',
      text: reply,
      time: timeStr
    });
    renderChatMessages();
    showPushNotification(`${child.name.split(' ')[0]} ka message`, reply);
    logEvent(`${child.name} replied: "${reply}"`);
  }, 1600);
}

function sendQuickMessage(text) {
  document.getElementById('chat-input').value = text;
  sendChatMessage();
}

function simulateSendPhoto() {
  const child = getActiveChild();
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  child.chatMessages.push({
    sender: 'parent',
    text: '📷 [Photo Sent: School Bus Stop Landmark]',
    time: timeStr
  });
  renderChatMessages();
  logEvent('Parent shared photo in chat.');
}

function callChildSimulator() {
  const child = getActiveChild();
  alert(`Connecting encrypted Jio 5G voice call to ${child.name}'s Kid Buddy smartwatch... 📞`);
}

function callDriverSimulator() {
  alert(`Calling School Bus Driver Ramesh Bhaiya (+91 98765 43212) on Bus KA-01-F-4589... 📞`);
}

function callBusDriver() {
  callDriverSimulator();
}

function callNational112() {
  alert('Connecting to India 112 National Emergency Response Support System (ERSS)... 🚨');
}

function callChildline1098() {
  alert('Connecting to 1098 Childline India Foundation 24/7 Helpline... 🧒');
}

// Emergency SOS with 112 ERSS
function triggerEmergencyAlert(source) {
  const child = getActiveChild();
  const modal = document.getElementById('emergency-modal');
  const audio = document.getElementById('audio-sos');

  document.getElementById('emergency-child-name').innerText = child.name;
  document.getElementById('emergency-child-avatar').src = child.avatar;
  document.getElementById('emergency-coords').innerText = `${child.lat.toFixed(6)}, ${child.lng.toFixed(6)}`;
  document.getElementById('emergency-address').innerText = child.locationName;

  const now = new Date();
  document.getElementById('emergency-time').innerText = now.toLocaleTimeString();

  modal.classList.add('active');

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio autoplay prevented by browser policy:', e));
  }

  showPushNotification('🚨 112 CRITICAL SOS ALERT', `${child.name.toUpperCase()} has triggered emergency panic in Bengaluru!`);
  logEvent(`[CRITICAL 112 SOS] Emergency triggered by ${child.name} at (${child.lat.toFixed(4)}, ${child.lng.toFixed(4)}). Dispatching to 112 ERSS.`);
}

function dismissEmergencyAlert() {
  const modal = document.getElementById('emergency-modal');
  const audio = document.getElementById('audio-sos');
  modal.classList.remove('active');
  if (audio) audio.pause();
  logEvent('Emergency alert acknowledged by guardian (सुरक्षित हैं).');
}

function childQuickCheckIn() {
  const child = getActiveChild();
  showPushNotification(`Check-in Aaya`, `${child.name.split(' ')[0]} ne "Main Theek Hoon" tap kiya.`);
  logEvent(`${child.name} completed "Main Theek Hoon" check-in.`);
  alert("Badhiya! Mummy-Papa ko message chala gaya ki aap safe hain. 👍");
}

function triggerGeofenceArrival() {
  const child = getActiveChild();
  showPushNotification(`School Arrival`, `${child.name.split(' ')[0]} confirmed safe arrival at school.`);
  logEvent(`${child.name} reported arrival at school.`);
}

function expandDynamicIsland() {
  const child = getActiveChild();
  alert(`Dynamic Island Activity:\n\nActive Target: ${child.name}\nStatus: ${child.status}\nBattery: ${child.battery}%\nBus Route: KA-01-F-4589 (Safe speed 26 km/h)`);
}

// Modals
function openAddPlaceModal() {
  document.getElementById('modal-add-place').classList.add('active');
}
function closeAddPlaceModal() {
  document.getElementById('modal-add-place').classList.remove('active');
}
function selectPlaceEmoji(emoji, el) {
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  window.selectedEmoji = emoji;
}
function saveNewObservedPlace() {
  const name = document.getElementById('input-place-name').value;
  const radius = parseInt(document.getElementById('input-place-radius').value, 10);
  const coords = document.getElementById('input-place-coords').value.split(',');
  const lat = parseFloat(coords[0]);
  const lng = parseFloat(coords[1]);
  const emoji = window.selectedEmoji || '📚';
  const city = CITIES[state.currentCityKey];

  city.places.push({
    id: `p_${Date.now()}`,
    name,
    emoji,
    lat,
    lng,
    radius,
    desc: 'Newly Added Suraksha Zone'
  });

  renderPlacesList();
  renderPlacesOnMap();
  closeAddPlaceModal();
  logEvent(`Added safe zone: ${name} (${radius}m).`);
}

function openAddChildModal() {
  document.getElementById('modal-add-child').classList.add('active');
}
function closeAddChildModal() {
  document.getElementById('modal-add-child').classList.remove('active');
}
function confirmAddChild() {
  const name = document.getElementById('input-child-name').value;
  const age = parseInt(document.getElementById('input-child-age').value, 10);
  const school = document.getElementById('input-child-school').value;
  const newId = `child_${state.children.length + 1}`;

  state.children.push({
    id: newId,
    name: `${name} Sharma`,
    age: age,
    relation: 'Baccha',
    school: school,
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    lat: 12.9730,
    lng: 77.6410,
    battery: 100,
    isCharging: false,
    speed: 0.0,
    accuracy: 3.5,
    locationName: 'Indiranagar',
    status: 'Device Connected',
    online: true,
    history: [{ time: 'Just now', desc: 'Device Paired', lat: 12.9730, lng: 77.6410, loc: 'Home' }],
    chatMessages: [{ sender: 'parent', text: `Kid Buddy Bharat me swagat hai, ${name}!`, time: 'Now' }]
  });

  initChildrenCarousel();
  initTelemetryChildSelect();
  selectChild(newId);
  closeAddChildModal();
  logEvent(`Paired new child smartwatch: ${name} (Age ${age}).`);
}

function showPairingOTP() {
  const code = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('current-otp').innerText = `${String(code).slice(0,3)} ${String(code).slice(3)}`;
  document.getElementById('otp-display-code').innerText = `${String(code).slice(0,3)} ${String(code).slice(3)}`;
  openAddChildModal();
}

// Swift Source Code Inspector
function toggleCodeInspector() {
  const drawer = document.getElementById('code-inspector-drawer');
  drawer.classList.toggle('active');
  if (drawer.classList.contains('active')) {
    loadSourceFile('Controllers/TrackingViewController.swift', document.querySelector('.file-item.active'));
  }
}

function loadSourceFile(filePath, el) {
  if (el) {
    document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
    el.classList.add('active');
  }

  document.getElementById('code-filepath-bar').innerText = `Kid Buddy/${filePath}`;
  const codeDisplay = document.getElementById('code-display');
  codeDisplay.innerText = 'Fetching Swift source code from repository...';

  fetch(`/api/source-file?file=${encodeURIComponent(filePath)}`)
    .then(r => r.text())
    .then(code => {
      codeDisplay.innerText = code;
    })
    .catch(err => {
      codeDisplay.innerText = `Error loading file: ${err.message}`;
    });
}

function copyCurrentCode() {
  const code = document.getElementById('code-display').innerText;
  navigator.clipboard.writeText(code).then(() => {
    alert('Swift code copied to clipboard!');
  });
}

// Activity Logger
function logEvent(text) {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  const row = document.createElement('div');
  row.className = 'event-row';
  row.innerHTML = `<span class="event-time">${timeStr} IST</span> <span>${text}</span>`;

  feed.prepend(row);
  while (feed.children.length > 25) {
    feed.removeChild(feed.lastChild);
  }
}

function clearEventLog() {
  const feed = document.getElementById('activity-feed');
  if (feed) feed.innerHTML = '';
}

// ==========================================================================
// Real-Time SSE Listener (Syncs Real Phone GPS & Firebase to Dashboard)
// ==========================================================================
function applyLocationUpdate(data) {
  if (!data || !data.childId || !data.lat || !data.lng) return;
  const child = state.children.find(c => c.id === data.childId);
  if (child) {
    if (Math.abs(child.lat - data.lat) < 0.00001 && Math.abs(child.lng - data.lng) < 0.00001) return;

    child.lat = data.lat;
    child.lng = data.lng;
    if (data.speed !== undefined) child.speed = data.speed;
    if (data.accuracy !== undefined) child.accuracy = data.accuracy;
    if (data.battery !== undefined) child.battery = data.battery;
    child.locationName = `Real Mobile GPS: ${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`;

    if (state.trackedChildId === child.id) {
      if (trackingMarker && trackingMap) {
        trackingMarker.setLatLng([child.lat, child.lng]);
        trackingMap.setView([child.lat, child.lng], Math.max(trackingMap.getZoom(), 15));
      }
      updateChildQuickSheet();
      updateTelemetryPanel();
      checkGeofenceTriggers(child);
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    child.history.unshift({
      time: timeStr,
      desc: 'Live Phone Coordinate Stream',
      lat: data.lat,
      lng: data.lng,
      loc: `Live Accuracy ±${data.accuracy || 5}m`
    });
    if (child.history.length > 20) child.history.pop();
    renderHistoryTimeline();

    logEvent(`[REAL GPS SYNC] ${child.name}: (${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}) • ${data.speed || 0} km/h • 🔋${child.battery}%`);
  }
}

function initLiveStreamSSE() {
  if (typeof EventSource !== 'undefined') {
    const es = new EventSource('/api/live-stream');

    es.addEventListener('connected', e => {
      logEvent('🟢 Real-time Gateway connected to Firebase (surakshya-india).');
    });

    es.addEventListener('location_update', e => {
      try {
        applyLocationUpdate(JSON.parse(e.data));
      } catch (err) {
        console.error('SSE Location Error:', err);
      }
    });

    es.addEventListener('emergency_sos', e => {
      try {
        const data = JSON.parse(e.data);
        triggerEmergencyAlert('real_phone');
        logEvent(`🚨 CRITICAL 112 SOS received from real smartphone for ${data.childName}!`);
      } catch (err) {
        console.error('SSE Alert Error:', err);
      }
    });

    es.onerror = () => {
      // Auto-reconnect handled by browser EventSource
    };
  }

  // Direct Firebase RTDB sync (makes Cloudflare deployment 100% serverless)
  setInterval(async () => {
    try {
      // 1. Sync live coordinates
      const res = await fetch('https://surakshya-india-default-rtdb.asia-southeast1.firebasedatabase.app/locations.json');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          Object.keys(data).forEach(id => {
            applyLocationUpdate(data[id]);
          });
        }
      }

      // 2. Sync emergency alerts
      const alertRes = await fetch('https://surakshya-india-default-rtdb.asia-southeast1.firebasedatabase.app/alerts.json');
      if (alertRes.ok) {
        const alerts = await alertRes.json();
        if (alerts) {
          const keys = Object.keys(alerts);
          const latestKey = keys[keys.length - 1];
          const latestAlert = alerts[latestKey];
          if (latestAlert && (Date.now() - (latestAlert.timestamp || 0) < 20000)) {
            if (!window.lastAlertSeen || window.lastAlertSeen !== latestAlert.timestamp) {
              window.lastAlertSeen = latestAlert.timestamp;
              triggerEmergencyAlert('real_phone');
              logEvent(`🚨 CRITICAL 112 SOS from ${latestAlert.childName}!`);
            }
          }
        }
      }
    } catch (e) {
      // silent network fallback
    }
  }, 2000);
}

function openPairPhoneModal() {
  const modal = document.getElementById('modal-pair-phone');
  if (modal) {
    modal.classList.add('active');
    try {
      const host = window.location.host;
      const protocol = window.location.protocol;
      const trackerUrl = `${protocol}//${host}/tracker`;
      const input = document.getElementById('phone-tracker-url');
      if (input) input.value = trackerUrl;
      const qrImg = document.getElementById('qr-code-img');
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackerUrl)}`;
      }
    } catch (e) {
      console.warn('QR update error:', e);
    }
  }
}

function closePairPhoneModal() {
  const modal = document.getElementById('modal-pair-phone');
  if (modal) modal.classList.remove('active');
}

