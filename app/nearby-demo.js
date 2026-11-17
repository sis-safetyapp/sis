/* Sis GPS demonstration: REAL device location + SYNTHETIC helper markers.
   Never publishes coordinates, calls phone numbers, or writes demo people to Supabase. */
(function () {
  'use strict';

  const demoHelpers = [
    { id: 'anna', name: 'Anna', north: 450, east: 320 },
    { id: 'mari', name: 'Mari', north: -1300, east: 1500 },
    { id: 'liis', name: 'Liis', north: 3800, east: -2300 },
    { id: 'kristi', name: 'Kristi', north: -5700, east: -4700 },
    { id: 'eva', name: 'Eva', north: 10900, east: 5300 } // outside 10 km; intentionally filtered
  ];
  const radiusMeters = 10000;
  let active = false;
  let watchId = null;
  let runId = 0;
  let map = null;
  let userMarker = null;
  let ring = null;
  let mockMarkers = [];
  let anchor = null;
  let helpers = [];
  let firstFix = true;
  let mapFallback = false;
  let latestFix = null;
  let fallbackFix = null;
  let demoOptions = null;
  let tileFailures = 0;

  function atOffset(origin, north, east) {
    const latitude = Math.max(-89.99, Math.min(89.99, origin.lat + north / 111320));
    const cos = Math.max(0.001, Math.abs(Math.cos(origin.lat * Math.PI / 180)));
    const longitude = ((origin.lng + east / (111320 * cos) + 540) % 360) - 180;
    return { lat: latitude, lng: longitude };
  }

  function demoContacts(origin) {
    return demoHelpers.map(function (person) {
      const position = atOffset(origin, person.north, person.east);
      return {
        id: person.id,
        name: demoOptions && demoOptions.sosContact && person.id === 'anna' ?
          demoOptions.sosContact : person.name,
        lat: position.lat,
        lng: position.lng
      };
    });
  }

  function removeMap() {
    if (map) {
      try { map.remove(); } catch (e) { console.warn('Map cleanup:', e); }
    }
    map = null;
    userMarker = null;
    ring = null;
    mockMarkers = [];
  }

  function stopDemo() {
    active = false;
    runId += 1;
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    anchor = null;
    helpers = [];
    firstFix = true;
    latestFix = null;
    fallbackFix = null;
    mapFallback = false;
    tileFailures = 0;
    demoOptions = null;
    removeMap();
  }

  window.sisStopNearbyDemo = stopDemo;

  function showError(message) {
    const status = document.getElementById('sisDemoStatus');
    if (status) {
      status.textContent = message;
      status.classList.add('gps-error');
    }
    const help = document.getElementById('sisDemoContacts');
    if (help && !anchor) {
      help.innerHTML = '<p class="small muted">Demo contacts are hidden until your phone provides a real GPS position. Enable Location in Android and allow location access for Sis.</p>';
    }
  }

  function mapMessage(message, warning) {
    const status = document.getElementById('sisDemoMapStatus');
    if (status) {
      status.textContent = message;
      status.classList.toggle('gps-error', !!warning);
    }
  }

  function realStreetMapUrl(pos) {
    // A user-initiated external fallback to the exact REAL device position.
    return 'https://www.openstreetmap.org/?mlat=' + pos.lat.toFixed(6) +
      '&mlon=' + pos.lng.toFixed(6) +
      '#map=15/' + pos.lat.toFixed(6) + '/' + pos.lng.toFixed(6);
  }

  function embeddedStreetMapUrl(pos) {
    const latSpan = radiusMeters / 111320;
    const lngSpan = latSpan / Math.max(0.001, Math.abs(Math.cos(pos.lat * Math.PI / 180)));
    const bounds = [
      pos.lng - lngSpan, pos.lat - latSpan,
      pos.lng + lngSpan, pos.lat + latSpan
    ].map(function(v) { return v.toFixed(6); }).join('%2C');
    return 'https://www.openstreetmap.org/export/embed.html?bbox=' + bounds +
      '&layer=mapnik&marker=' + pos.lat.toFixed(6) + '%2C' + pos.lng.toFixed(6);
  }

  function refreshMapLink(pos) {
    const link = document.getElementById('sisDemoMapLink');
    if (link) link.href = realStreetMapUrl(pos);
  }

  function showEmbeddedMap(pos, reason) {
    if (!active) return;
    const holder = document.getElementById('sisDemoMap');
    if (!holder) return;
    removeMap();
    mapFallback = true;
    fallbackFix = pos;
    // OpenStreetMap iframe offers an actual geographic map when Leaflet or its
    // tile layers cannot initialize. Fallback contains only the REAL GPS marker.
    holder.innerHTML = '<iframe title="OpenStreetMap street map with your REAL GPS marker" ' +
      'loading="eager" referrerpolicy="strict-origin-when-cross-origin" ' +
      'src="' + esc(embeddedStreetMapUrl(pos)) + '"></iframe>';
    mapMessage(reason + ' Showing OpenStreetMap with your real GPS marker; simulated helpers remain listed below.', true);
    refreshMapLink(pos);
  }

  function createMap(position) {
    const holder = document.getElementById('sisDemoMap');
    if (!holder || map || mapFallback) return;
    if (!window.L || typeof L.map !== 'function') {
      showEmbeddedMap(position, 'Interactive map library unavailable.');
      return;
    }
    try {
      let receivedTile = false;
      tileFailures = 0;
      map = L.map(holder, { zoomControl: true });
      // Start at street level (not a zoomed-out 20 km view), so the actual
      // roads around the phone are visible immediately.
      map.setView([position.lat, position.lng], 15);
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      if (tiles.on) {
        tiles.on('load', function() {
          if (!active || !map || mapFallback) return;
          receivedTile = true;
          mapMessage('Street map loaded. Blue marker = real GPS; purple markers = simulated people.', false);
        });
        tiles.on('tileerror', function() {
          if (!active || mapFallback || !map) return;
          tileFailures++;
          if (tileFailures >= 3 && !receivedTile) {
            showEmbeddedMap(latestFix || position, 'Map tiles failed to load in the app.');
          } else if (tileFailures > 0) {
            mapMessage('Some map tiles failed. Checking alternative map view…', true);
          }
        });
      }
      tiles.addTo(map);
      ring = L.circle([position.lat, position.lng], {
        radius: radiusMeters,
        color: '#6A3FD0',
        fillColor: '#6A3FD0',
        fillOpacity: 0.04,
        weight: 2
      }).addTo(map);
      userMarker = L.circleMarker([position.lat, position.lng], {
        radius: 10,
        color: '#fff',
        weight: 3,
        fillColor: '#2176D2',
        fillOpacity: 1
      }).addTo(map).bindPopup('YOUR REAL live GPS location');
      for (const person of helpers) {
        if (distM(position, person) > radiusMeters) continue;
        const simulatedSos = !!(demoOptions && demoOptions.sosContact && person.id === 'anna');
        const marker = L.circleMarker([person.lat, person.lng], {
          radius: simulatedSos ? 10 : 7,
          weight: 2,
          color: '#fff',
          fillColor: simulatedSos ? '#e5484d' : '#6A3FD0',
          fillOpacity: 0.95
        }).addTo(map).bindPopup(esc(person.name) +
          (simulatedSos ? ' — SIMULATED SOS location (not a real incident)' : ' — SIMULATED helper'));
        mockMarkers.push(marker);
      }
      mapMessage('Loading OpenStreetMap street tiles…', false);
      const thisMap = map;
      const thisRun = runId;
      setTimeout(function () {
        if (active && map === thisMap && thisRun === runId) map.invalidateSize();
      }, 250);
      setTimeout(function () {
        if (active && map === thisMap && !receivedTile && thisRun === runId) {
          showEmbeddedMap(latestFix || position, 'Street tiles did not finish loading.');
        }
      }, 9000);
    } catch (error) {
      console.error('Could not render real street map', error);
      showEmbeddedMap(position, 'Interactive street map could not initialize.');
    }
  }

  function centerOnGps(showRadius) {
    if (!latestFix) {
      toast('Waiting for your real GPS position.', 'alert');
      return;
    }
    if (!map) {
      showEmbeddedMap(latestFix, 'Using embedded street map.');
      return;
    }
    try {
      if (showRadius && ring) map.fitBounds(ring.getBounds(), { padding: [18, 18] });
      else map.setView([latestFix.lat, latestFix.lng], 15);
      map.invalidateSize();
    } catch (error) {
      console.error('Could not move map', error);
      showEmbeddedMap(latestFix, 'Map navigation failed.');
    }
  }

  function liveFix(pos) {
    if (!active) return;
    const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) {
      showError('GPS reported invalid coordinates. Try again.');
      return;
    }
    if (!anchor) {
      anchor = position;
      helpers = demoContacts(anchor);
    }
    latestFix = position;
    refreshMapLink(position);
    const accuracy = Math.round(pos.coords.accuracy);
    const time = new Date(pos.timestamp || Date.now()).toLocaleTimeString('en-GB');
    const status = document.getElementById('sisDemoStatus');
    if (status) {
      status.classList.remove('gps-error');
      status.innerHTML = '<b class="gps-live">● LIVE GPS</b> · ' + position.lat.toFixed(5) + ', ' +
        position.lng.toFixed(5) + '<br><span class="small muted">Accuracy ±' +
        (Number.isFinite(accuracy) ? accuracy : '?') + ' m · Last position: ' + esc(time) + '</span>';
    }

    const within = helpers.map(function (person) {
      return Object.assign({}, person, { distanceMeters: distM(position, person) });
    }).filter(function (person) {
      return person.distanceMeters <= radiusMeters;
    }).sort(function (a, b) {
      return a.distanceMeters - b.distanceMeters;
    });

    const count = document.getElementById('sisDemoCount');
    if (count) count.textContent = within.length + ' simulated helpers in 10 km';
    const list = document.getElementById('sisDemoContacts');
    if (list) {
      list.innerHTML = within.map(function (person) {
        return '<div class="item">' + avatar(person.name, 'sm') +
          '<span class="grow"><span class="t">' + esc(person.name) +
          ' <span class="pill acc">DEMO</span></span><br><span class="s">' +
          (person.distanceMeters < 1000
            ? Math.round(person.distanceMeters) + ' m'
            : (person.distanceMeters / 1000).toFixed(1) + ' km') +
          ' from your current GPS location</span></span>' +
          '<button class="btn sm" data-act="sis-demo-call:' + esc(person.id) + '">' +
          ic('phone') + 'Test call</button></div>';
      }).join('') || '<p class="muted small" style="padding:14px">No simulated helper is currently within 10 km.</p>';
    }

    if (!map && !mapFallback) createMap(position);
    if (map && userMarker && ring) {
      userMarker.setLatLng([position.lat, position.lng]);
      ring.setLatLng([position.lat, position.lng]);
      // Keep the blue marker on the streets as GPS changes; avoid resetting zoom.
      if (!firstFix && map.panTo) map.panTo([position.lat, position.lng], { animate: false });
    } else if (mapFallback && (!fallbackFix || distM(fallbackFix, position) > 150)) {
      showEmbeddedMap(position, 'Refreshing embedded map to follow your live GPS.');
    }
    firstFix = false;
  }

  window.sisDemoStart = function (options) {
    stopDemo();
    openSheet(sheetHead('Nearby Sisters · real street map') +
      '<div class="note info"><span><b>DEMONSTRATION ONLY.</b> Your position comes from your device’s real GPS. Other people and call buttons are simulated; no one is contacted.</span></div>' +
      '<div class="card stack"><div class="row between"><h3>Your live location</h3><span class="pill safe">GPS</span></div>' +
      '<div id="sisDemoStatus" role="status" aria-live="polite">Waiting for GPS permission and your real location…</div></div>' +
      '<div class="map tall" id="sisDemoMap" aria-label="Real street map of your GPS location and simulated helpers"></div>' +
      '<p id="sisDemoMapStatus" class="small muted" role="status">Waiting for GPS before loading street map…</p>' +
      '<div class="row sis-demo-map-controls">' +
      '<button class="btn ghost sm" type="button" data-act="sis-demo-map-center">My GPS</button>' +
      '<button class="btn ghost sm" type="button" data-act="sis-demo-map-radius">Show 10 km radius</button>' +
      '<a class="btn ghost sm" id="sisDemoMapLink" target="_blank" rel="noopener" href="https://www.openstreetmap.org/">Full map</a>' +
      '</div>' +
      '<div class="stack"><div class="row between"><h3>10 km radius</h3><span class="pill acc" id="sisDemoCount">Waiting for GPS</span></div>' +
      '<div class="list" id="sisDemoContacts"><p class="small muted" style="padding:14px">Finding your position…</p></div></div>' +
      '<p class="small muted">The street map uses OpenStreetMap. Blue dot and its movement are real phone GPS. Other people are fictional, with a red example SOS marker when opened from the demo alert. In fallback mode only your real marker appears.</p>' +
      '<button class="btn ghost block" data-act="sis-demo-retry">' + ic('locate') + 'Restart live GPS</button>' +
      (S.groups.length ? '<button class="btn ghost block" data-act="sis-demo-real">' + ic('users') + 'View real group contacts</button>' : '') +
      '<p class="small muted">DEMO: no emergency call is placed. For a real emergency, call 112 manually.</p>' +
      '<p class="small muted">This prototype does not send emergency alerts or make real calls to helpers.</p>');

    demoOptions = options && typeof options.sosContact === 'string'
      ? { sosContact: String(options.sosContact).slice(0, 40) } : null;
    active = true;
    const thisRun = ++runId;
    if (!navigator.geolocation) {
      showError('Your browser does not support location. Open Sis in Chrome or check Android WebView.');
      return;
    }
    try {
      watchId = navigator.geolocation.watchPosition(
        function (position) {
          if (thisRun === runId && active) liveFix(position);
        },
        function (error) {
          if (thisRun !== runId || !active) return;
          showError(error.code === 1
            ? 'Location permission denied. Enable location for Safety & Sisterhood in Android settings.'
            : error.code === 2
              ? 'Location temporarily unavailable. Try outdoors or enable precise location.'
              : 'GPS timed out. Check Location settings and try Restart live GPS.');
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
      );
    } catch (error) {
      showError('Could not start location tracking: ' + error.message);
    }
  };

  function demoCall(personId) {
    const person = demoHelpers.find(function (p) { return p.id === personId; });
    if (!person || !active) return;
    const layer = document.getElementById('callLayer');
    if (!layer) return;
    layer.innerHTML = '<div class="call" role="dialog" aria-modal="true">' +
      '<p style="font-weight:700;letter-spacing:.06em">DEMO CALL — SIMULATION ONLY</p>' +
      '<div>' + avatar(person.name) + '<div class="who">' + esc(person.name) + '</div>' +
      '<p>No telephone call or notification is being sent.</p></div>' +
      '<div class="acts"><button data-act="sis-demo-endcall">' +
      '<span class="c" style="background:#e5484d">' + ic('end') +
      '</span>End demo call</button></div></div>';
  }

  document.addEventListener('click', function (e) {
    const element = e.target.closest('[data-act]');
    if (!element) return;
    const action = element.dataset.act;
    if (action === 'sis-demo-retry') window.sisDemoStart(demoOptions);
    else if (action === 'sis-demo-map-center') centerOnGps(false);
    else if (action === 'sis-demo-map-radius') centerOnGps(true);
    else if (action === 'sis-demo-real') nearbySistersSheet();
    else if (action === 'sis-demo-endcall') {
      document.getElementById('callLayer').innerHTML = '';
    } else if (action && action.indexOf('sis-demo-call:') === 0) {
      demoCall(action.substring('sis-demo-call:'.length));
    }
  });
})();

/* Home screen map: switch between My circle and Sisters nearby. */
(function () {
  'use strict';

  const RADIUS = 1000;
  const CENTER = { lat: 59.4372, lng: 24.7454 };
  const sisters = [
    { id: 'kadri', name: 'Kadri', north: 70, east: -55 },
    { id: 'sofia', name: 'Sofia', north: -210, east: 190 },
    { id: 'maria', name: 'Maria', north: 330, east: -260 },
    { id: 'katrin', name: 'Katrin', north: -520, east: -560 },
    { id: 'helena', name: 'Helena', north: 880, east: 300 },
    { id: 'laura', name: 'Laura', north: -1500, east: 900 }
  ];
  const MESSAGES = ['Can you walk with me?', 'I feel uneasy, can you call me?', 'Can we meet up? I am close by.'];
  let fix = null;
  let asked = false;
  let recipients = [];

  function view() { return ls.get('homeMap') === 'nearby' ? 'nearby' : 'circle'; }
  function here() { return fix || CENTER; }
  function atOffset(origin, north, east) {
    const cos = Math.max(0.001, Math.abs(Math.cos(origin.lat * Math.PI / 180)));
    return { lat: origin.lat + north / 111320, lng: origin.lng + east / (111320 * cos) };
  }
  function dist(m) { return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(1) + ' km'; }
  function nearby() {
    const o = here();
    return sisters.map(function (person) {
      const pos = atOffset(o, person.north, person.east);
      return { id: person.id, name: person.name, lat: pos.lat, lng: pos.lng, distance: distM(o, pos) };
    }).filter(function (person) { return person.distance <= RADIUS; })
      .sort(function (a, b) { return a.distance - b.distance; });
  }
  function circle() {
    const o = here();
    return others().map(function (m) {
      return { id: m.user_id, name: m.name, lat: m.lat, lng: m.lng, sos: !!m.sos,
        distance: m.lat != null ? distM(o, { lat: m.lat, lng: m.lng }) : null };
    });
  }
  function refresh() { if (S.tab === 'home') render(); }

  function circleTop() {
    if (!S.group) return '<div class="row">' + ic('users') + '<h2>My circle</h2></div>';
    const ended = groupEnded();
    return '<div class="row between"><div class="grow"><p class="eyebrow">' +
      (S.group.ends_at ? (ended ? 'Ended' : 'Night out · ends ' + fmtTime(S.group.ends_at)) : 'Circle of trust') +
      '</p><h2>' + esc(S.group.name) + '</h2></div>' +
      '<button class="btn sm ghost" data-act="invite">' + ic('link') + 'Invite</button></div>';
  }

  function card() {
    const v = view();
    let body;
    if (v === 'circle') {
      if (!S.group) {
        body = circleTop() +
          '<p class="small muted">Create a group for tonight or for your closest friends. They join with a code and see each other\'s check-ins.</p>' +
          '<div class="row"><button class="btn" style="flex:1" data-act="group-new">' + ic('plus') + 'Create</button>' +
          '<button class="btn ghost" style="flex:1" data-act="group-join">Join with code</button></div>';
      } else {
        const ended = groupEnded(), list = circle(), on = list.filter(function (p) { return p.lat != null; }).length;
        body = (ended ? '<p class="small muted">This night out has ended and location sharing is off.</p>' +
            '<button class="btn ghost" data-act="group-new">' + ic('plus') + 'Start a new one</button>' : '') +
          '<div class="map" id="nearbyHomeMap" style="height:220px"></div>' +
          '<p class="small muted">' + on + ' of ' + list.length + ' sharing location</p>' +
          (ended ? '' : '<button class="btn block" data-act="circle-checkin">' + ic('check') + 'Check in with my circle</button>');
      }
    } else {
      const near = nearby();
      body = '<div class="map" id="nearbyHomeMap" style="height:220px"></div>' +
        '<p class="small muted"><b>' + near.length + ' verified sister' + (near.length === 1 ? '' : 's') + ' within 1 km</b>' +
        (near.length ? ' · ' + near.map(function (p) { return esc(p.name) + ' ' + dist(p.distance); }).join(', ') : '') + '</p>' +
        '<button class="btn block" data-act="nearby-text"' + (near.length ? '' : ' disabled') + '>' + ic('users') + 'Text a sister nearby</button>';
    }
    return '<section class="card stack nearby-home" aria-label="Map">' +
      '<div class="seg" role="tablist" aria-label="Map">' +
      '<button type="button" role="tab" class="' + (v === 'circle' ? 'on' : '') + '" aria-selected="' + (v === 'circle') + '" data-act="home-map:circle">My circle</button>' +
      '<button type="button" role="tab" class="' + (v === 'nearby' ? 'on' : '') + '" aria-selected="' + (v === 'nearby') + '" data-act="home-map:nearby">Sisters nearby</button>' +
      '</div>' + body + '</section>';
  }

  const CHECKINS = [
    { v: 'ok', label: "I'm OK", patch: { status: 'out', walk_deadline: null, walk_to: null } },
    { v: 'way', label: 'On my way home', patch: { status: 'on_way', walk_to: 'Home' } },
    { v: 'arrived', label: "I've arrived", patch: { status: 'out', place: 'Arrived safely', walk_deadline: null, walk_to: null } },
    { v: 'home', label: "I'm home", patch: { status: 'home', place: null, walk_deadline: null, walk_to: null } }
  ];
  function checkinSheet() {
    const mine = others().slice().sort(function (x, y) { return x.name.localeCompare(y.name); });
    openSheet('<div class="row between"><div class="grow"><p class="eyebrow">' + esc(S.group ? S.group.name : '') + '</p>' +
      '<h2>Check in with my circle</h2></div><button class="btn ghost sm" data-act="close" aria-label="Close">' + ic('x') + '</button></div>' +
      '<div class="field"><span class="lab">My status</span><div class="pick">' + CHECKINS.map(function (c) {
        return '<button data-act="circle-status:' + c.v + '">' + esc(c.label) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="sec-head"><h3>My circle</h3><button class="link" data-act="invite">' + ic('link') + 'Invite</button></div>' +
      '<div class="list">' + mine.map(function (m) {
        return '<div class="item">' + avatar(m.name, 'sm') + '<span class="grow"><span class="t">' + esc(m.name) +
          '</span><br><span class="s">' + memberSub(m) + '</span></span>' + statusPill(m) +
          '<button class="btn sm" data-act="circle-text:' + esc(m.user_id) + '">Text</button></div>';
      }).join('') + '</div>' +
      (S.groups.length > 1 ? '<button class="link" style="align-self:flex-start" data-act="tab:me">Switch group</button>' : ''));
  }
  async function checkin(v) {
    const c = CHECKINS.find(function (x) { return x.v === v; });
    if (!c) return;
    closeSheet();
    if (await updateMe(c.patch)) { render(); toast('Check-in sent: ' + c.label, 'check'); }
  }

  function locate(manual) {
    if (!navigator.geolocation) { if (manual) toast('Location is not available on this device', 'alert'); return; }
    if (asked && !manual) return;
    asked = true;
    if (manual) toast('Finding your location…', 'locate');
    navigator.geolocation.getCurrentPosition(function (pos) {
      fix = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (sb && typeof sb.demoAnchor === 'function') { sb.demoAnchor(fix); fetchMembers().then(refresh); return; }
      refresh();
    }, function (err) {
      if (manual || err.code === 1) toast(err.code === 1 ? 'Allow location for Sis to see where you are' : 'Could not get your location', 'alert');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
  }

  function dot(name, color) {
    return L.divIcon({ className: '', iconSize: [0, 0], html: '<div class="mk"><span class="pd" style="background:' +
      color + '">' + esc(name[0]) + '</span></div>' });
  }

  function mount() {
    locate();
    const el = document.getElementById('nearbyHomeMap');
    if (!el || !window.L) return;
    const M = mountMap('nearbyHome', el);
    if (!M) return;
    const o = here();
    M.map.options.zoomSnap = 0.25;
    L.control.zoom({ position: 'topright' }).addTo(M.map);
    const Locate = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const b = L.DomUtil.create('a', 'leaflet-bar map-locate');
        b.href = '#'; b.title = 'My location'; b.setAttribute('role', 'button'); b.setAttribute('aria-label', 'Show my location');
        b.innerHTML = ic('locate');
        L.DomEvent.on(b, 'click', function (e) { L.DomEvent.stop(e); locate(true); });
        return b;
      }
    });
    new Locate().addTo(M.map);
    L.circleMarker([o.lat, o.lng], {
      radius: 8, color: '#fff', weight: 3, fillColor: '#2176D2', fillOpacity: 1
    }).addTo(M.layer).bindPopup(fix ? 'You are here' : 'Your location is off');
    if (view() === 'circle') {
      const pts = [[o.lat, o.lng]];
      circle().forEach(function (p) {
        if (p.lat == null) return;
        L.marker([p.lat, p.lng], { icon: personIcon(p.name, colorFor(p.name), p.sos) }).addTo(M.layer);
        pts.push([p.lat, p.lng]);
      });
      if (pts.length > 1) M.map.fitBounds(pts, { paddingTopLeft: [40, 40], paddingBottomRight: [64, 50], maxZoom: 16, animate: false });
      else M.map.setView([o.lat, o.lng], 15);
    } else {
      const ring = L.circle([o.lat, o.lng], {
        radius: RADIUS, color: '#6A3FD0', fillColor: '#6A3FD0', fillOpacity: 0.08, weight: 2
      }).addTo(M.layer);
      nearby().forEach(function (p) {
        L.marker([p.lat, p.lng], { icon: dot(p.name, colorFor(p.name)), title: p.name })
          .addTo(M.layer).bindPopup(esc(p.name) + ' · ' + dist(p.distance));
      });
      M.map.fitBounds(ring.getBounds(), { padding: [10, 10], animate: false });
    }
  }

  function textSheet(title, list, sub) {
    recipients = list;
    openSheet(sheetHead(title) +
      '<div class="field"><span class="lab">Message</span><div class="pick" id="nearbyMsg">' + MESSAGES.map(function (m, i) {
        return '<button class="' + (i === 0 ? 'on' : '') + '" data-act="pick-one" data-v="' + esc(m) + '">' + esc(m) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="list">' + list.map(function (p) {
        return '<div class="item">' + avatar(p.name, 'sm') + '<span class="grow"><span class="t">' + esc(p.name) +
          '</span><br><span class="s">' + sub(p) + '</span></span>' +
          '<button class="btn sm" data-act="nearby-send:' + esc(p.id) + '">' + (list.length === 1 ? 'Send' : 'Text') + '</button></div>';
      }).join('') + '</div>' +
      (list.length > 1 ? '<button class="btn ghost block" data-act="nearby-send:all">Text all ' + list.length + '</button>' : ''));
  }

  function send(id) {
    const to = id === 'all' ? recipients : recipients.filter(function (p) { return p.id === id; });
    if (!to.length) return;
    closeSheet();
    toast(to.length === 1 ? 'Sent to ' + to[0].name : 'Sent to ' + to.length + ' sisters', 'check');
  }

  if (typeof window.addEventListener === 'function') window.addEventListener('click', function (e) {
    const el = e.target.closest && e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'nearby-text') {
      textSheet('Text a sister nearby', nearby(), function (p) { return dist(p.distance) + ' away · verified'; });
    } else if (act.indexOf('circle-text:') === 0) {
      const id = act.substring('circle-text:'.length);
      const one = circle().filter(function (p) { return p.id === id; });
      if (one.length) textSheet('Text ' + one[0].name, one, function (p) { return p.distance != null ? dist(p.distance) + ' away' : 'location off'; });
    } else if (act === 'circle-checkin') {
      checkinSheet();
    } else if (act.indexOf('circle-status:') === 0) {
      checkin(act.substring('circle-status:'.length));
    } else if (act.indexOf('nearby-send:') === 0) {
      send(act.substring('nearby-send:'.length));
    } else if (act.indexOf('home-map:') === 0) {
      ls.set('homeMap', act.substring('home-map:'.length));
      refresh();
    }
  });

  window.sisNearbyHome = { card: card, mount: mount };
})();
