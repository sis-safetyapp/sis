/* Sis — working prototype. Vanilla JS + Supabase (database, live updates) + Leaflet (OpenStreetMap). */
'use strict';

/* ---------------- icons & helpers ---------------- */
const P = {
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sun:'<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shieldok:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="8.5 12 11 14.5 15.5 9.5"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  car:'<path d="M5 17h14v-5l-2-5H7l-2 5z"/><path d="M5 12h14"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  nav:'<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  locate:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/>',
  end:'<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/>'
};
const ic = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const LOGO = (w = 34, h = 24) => `<svg viewBox="0 0 34 24" width="${w}" height="${h}" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--accent)"/><circle cx="22" cy="12" r="10" fill="var(--green)" opacity=".88"/></svg>`;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const COLORS = ['#C2557A', '#3E8E8A', '#7B5CC4', '#D0843A', '#4F76C9', '#B4536A', '#5B9A55', '#9A6A3E', '#6A3FD0'];
const colorFor = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
const avatar = (name, cls = '') => `<span class="av ${cls}" style="background:${colorFor(name)}">${esc((name || '?').trim()[0]?.toUpperCase() || '?')}</span>`;
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--';
const mmss = (s) => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function ago(ts) { if (!ts) return ''; const m = Math.round((Date.now() - new Date(ts)) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`; }
const ls = {
  get(k) { try { return localStorage.getItem('sis.' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('sis.' + k, v); } catch (e) { /* storage blocked */ } }
};
const mapsLink = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;
function distM(a, b) { const R = 6371e3, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r; const x = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); }

/* ---------------- state ---------------- */
const CFG = window.SIS_CONFIG || {};
let sb = null;
const S = {
  user: null, name: '', phone: '', mode: 'day', auto: true, tab: 'home',
  groups: [], gid: null, group: null, members: [],
  places: [], placeFilter: 'All', q: '', circles: [], trips: [], seg: 'circles',
  watchId: null, lastSent: null, alerted: new Set(), wake: null, addMode: false, review: null
};
const GOOD_TAGS = ['Staff responsive', 'Well-lit street', 'Taxi or transport nearby', 'Angel Shot available', 'Women-friendly crowd', 'Security at door'];
const BAD_TAGS = ['Poorly lit street', 'Staff ignored a complaint', 'Crowded exit', 'Pushy guests', 'Long walk to transport'];
const TALLINN = [59.437, 24.7453];

/* ---------------- sunset (NOAA approximation) for Tallinn ---------------- */
function sunTime(date, rise, lat = 59.437, lng = 24.7536) {
  const r = Math.PI / 180, start = new Date(date.getFullYear(), 0, 0), N = Math.floor((date - start) / 864e5), lh = lng / 15;
  const t = N + (((rise ? 6 : 18) - lh) / 24), M = 0.9856 * t - 3.289;
  const L = (M + 1.916 * Math.sin(M * r) + 0.02 * Math.sin(2 * M * r) + 282.634 + 360) % 360;
  let RA = (Math.atan(0.91764 * Math.tan(L * r)) / r + 360) % 360;
  RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
  const sd = 0.39782 * Math.sin(L * r), cd = Math.cos(Math.asin(sd));
  const ch = (Math.cos(90.833 * r) - sd * Math.sin(lat * r)) / (cd * Math.cos(lat * r));
  if (ch > 1 || ch < -1) return null;
  let H = Math.acos(ch) / r; H = (rise ? 360 - H : H) / 15;
  const UT = ((H + RA - 0.06571 * t - 6.622 - lh) % 24 + 24) % 24;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + UT * 36e5);
}
function autoMode() { const n = new Date(), ss = sunTime(n, false), sr = sunTime(n, true); if (!ss || !sr) return 'day'; return (n > ss || n < sr) ? 'night' : 'day'; }

/* ---------------- UI primitives ---------------- */
let toastT;
function toast(msg, icon = 'check') { const t = $('#toast'); t.innerHTML = ic(icon) + `<span>${esc(msg)}</span>`; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3000); }
function openSheet(html) { if (window.sisStopNearbyDemo) window.sisStopNearbyDemo(); $('#sheet').innerHTML = '<div class="grab"></div>' + html; $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); $('#sheet').scrollTop = 0; }
function closeSheet() { if (window.sisStopNearbyDemo) window.sisStopNearbyDemo(); $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on'); S.addMode = false; }
const sheetHead = (title) => `<div class="row between"><h2>${title}</h2><button class="btn ghost sm" data-act="close" aria-label="Close">${ic('x')}</button></div>`;
function fail(e) { console.error(e); toast(e?.message ? `Something went wrong: ${e.message}` : 'Something went wrong. Try again.', 'alert'); }

/* ---------------- demo data: opens without sign-up (add ?live=1 for the real database) ---------------- */
const LIVE = /[?&](live|join)=/.test(location.search);
function demoDb() {
  const now = Date.now(), iso = (min) => new Date(now + min * 60000).toISOString();
  const at = (north, east) => ({ lat: 59.4372 + north / 111320, lng: 24.7454 + east / 56640 });
  const member = (gid, uid, name, extra) => ({ group_id: gid, user_id: uid, name, phone: null, status: 'out', place: null, walk_to: null, walk_deadline: null, sos: false, sos_at: null, lat: null, lng: null, accuracy: null, located_at: null, sharing: false, updated_at: iso(-5), ...extra });
  const review = (place_id, author, feel, good, bad, body, min) => ({ id: 'r' + Math.random().toString(36).slice(2, 9), place_id, user_id: 'u-' + author.toLowerCase(), author, feel, good, bad, body, created_at: iso(-min) });
  const place = (id, name, kind, area, north, east) => ({ id, name, kind, area, ...at(north, east), created_at: iso(-60 * 24 * 7) });
  const T = {
    profiles: [{ id: 'me', name: ls.get('name') || 'Jana', phone: null }],
    groups: [
      { id: 'g1', code: 'DEMO01', name: 'My sisters', ends_at: null, created_by: 'me' },
      { id: 'g2', code: 'NIGHT7', name: 'Friday night out', ends_at: iso(300), created_by: 'u-eva' }
    ],
    group_members: [
      member('g1', 'me', ls.get('name') || 'Jana', {}),
      member('g1', 'u-reem', 'Reem', { status: 'on_way', walk_to: 'Home', walk_deadline: iso(38), sharing: true, ...at(120, -90), accuracy: 12, located_at: iso(-1) }),
      member('g1', 'u-swathi', 'Swathi', { place: 'Old Town', sharing: true, ...at(-180, 160), accuracy: 15, located_at: iso(-3) }),
      member('g2', 'me', ls.get('name') || 'Jana', {}),
      member('g2', 'u-swathi', 'Swathi', { place: 'Kuu Bar', sharing: true, ...at(-30, 40), accuracy: 15, located_at: iso(-2) })
    ],
    places: [
      place('p1', 'Café Lumi', 'Café', 'Kalamaja', 650, -1150),
      place('p2', 'Kuu Bar', 'Bar', 'Old Town', -20, 30),
      place('p3', 'Northlight Club', 'Club', 'Rotermann', 300, 600),
      place('p4', 'Velvet Lounge', 'Bar', 'Kesklinn', -350, 380),
      place('p5', 'Moonrise Bistro', 'Restaurant', 'Kadriorg', 150, 2500),
      place('p6', 'Harbour promenade', 'Street', 'Kesklinn', 1050, 500),
      place('p7', 'Hotel Tähe', 'Hotel', 'Kesklinn', -580, 250),
      place('p8', 'Telliskivi tram stop', 'Transport', 'Kalamaja', 300, -1500)
    ],
    reviews: [
      review('p1', 'Mari', 'safe', ['Staff responsive', 'Women-friendly crowd'], [], 'Cosy and calm, staff walked me to the door when it got late.', 300),
      review('p1', 'Kadri', 'safe', ['Well-lit street', 'Women-friendly crowd'], [], 'My go-to place to work alone in the evening.', 2000),
      review('p1', 'Sofia', 'safe', ['Staff responsive'], [], '', 5000),
      review('p2', 'Eva', 'safe', ['Angel Shot available', 'Security at door'], [], 'Ask for the Angel Shot at the bar, they know what it means.', 90),
      review('p2', 'Liis', 'safe', ['Security at door', 'Taxi or transport nearby'], [], '', 1500),
      review('p2', 'Katrin', 'mixed', ['Staff responsive'], ['Crowded exit'], 'Great staff, but the exit gets packed after midnight.', 4000),
      review('p3', 'Anna', 'mixed', ['Security at door'], ['Pushy guests'], 'Fun music. Go with friends and stay together.', 600),
      review('p3', 'Maria', 'unsafe', [], ['Pushy guests', 'Long walk to transport'], 'Someone kept following me around the dance floor.', 3000),
      review('p3', 'Kristi', 'mixed', ['Security at door'], ['Long walk to transport'], '', 6000),
      review('p4', 'Liis', 'safe', ['Taxi or transport nearby', 'Staff responsive'], [], 'Taxis wait right outside.', 800),
      review('p4', 'Sofia', 'safe', ['Women-friendly crowd'], [], '', 2500),
      review('p5', 'Mari', 'safe', ['Well-lit street', 'Staff responsive'], [], 'Lovely for a first date, very visible spot.', 1200),
      review('p5', 'Kadri', 'safe', ['Women-friendly crowd'], [], '', 4500),
      review('p5', 'Eva', 'safe', ['Taxi or transport nearby'], [], '', 7000),
      review('p6', 'Anna', 'mixed', ['Women-friendly crowd'], ['Poorly lit street'], 'Beautiful in daylight, dark stretch after 22:00.', 1000),
      review('p6', 'Katrin', 'mixed', [], ['Poorly lit street'], '', 3500),
      review('p7', 'Maria', 'safe', ['Security at door', 'Staff responsive'], [], 'Night reception is very helpful.', 2200),
      review('p8', 'Kristi', 'mixed', ['Taxi or transport nearby'], ['Poorly lit street'], 'Wait inside the café across the street.', 400)
    ],
    circles: [
      { id: 'c1', emoji: '🌿', name: 'New in Tallinn', description: "Moved here recently? Let's explore the city together.", next_meetup: 'Thu 18:30 · Old Town', created_at: iso(-90000) },
      { id: 'c2', emoji: '🏃‍♀️', name: 'Morning Runners', description: 'Easy 5 km along the seaside, all paces welcome.', next_meetup: 'Sat 09:00 · Kadriorg Park', created_at: iso(-80000) },
      { id: 'c3', emoji: '📚', name: 'Book Club', description: 'One book a month, tea or wine.', next_meetup: 'Wed 19:00 · Café Lumi', created_at: iso(-70000) },
      { id: 'c4', emoji: '💻', name: 'Women in Tech', description: 'Meetups, mentoring and job tips.', next_meetup: 'Tue 18:00 · Ülemiste City', created_at: iso(-60000) },
      { id: 'c5', emoji: '🎨', name: 'Sunday Sketching', description: 'Bring a pencil, we bring the coffee.', next_meetup: 'Sun 12:00 · Telliskivi', created_at: iso(-50000) }
    ],
    circle_members: [],
    trips: [
      { id: 't1', user_id: 'u-kati', author: 'Kati', destination: 'Lisbon', dates: '12–16 Nov', note: 'Looking for someone to share dinners and sunset walks.', created_at: iso(-120) },
      { id: 't2', user_id: 'u-maria', author: 'Maria', destination: 'Riga', dates: 'Weekend, 22–23 Nov', note: 'Christmas market and a spa day?', created_at: iso(-600) },
      { id: 't3', user_id: 'u-sofia', author: 'Sofia', destination: 'Helsinki', dates: 'Day trip, 30 Oct', note: 'Morning ferry, design museums, back by night.', created_at: iso(-1500) },
      { id: 't4', user_id: 'u-liis', author: 'Liis', destination: 'Barcelona', dates: '5–9 Dec', note: 'First solo trip, would love a buddy for evenings.', created_at: iso(-3000) }
    ]
  };
  ['p1', 'p2', 'p5', 'p7'].forEach((id) => { T.places.find((x) => x.id === id).badge = true; });
  [['c1', 23, true], ['c2', 14], ['c3', 9, true], ['c4', 31], ['c5', 7]].forEach(([cid, n, mine]) => {
    for (let i = 0; i < n; i++) T.circle_members.push({ circle_id: cid, user_id: 'u-' + cid + i });
    if (mine) T.circle_members.push({ circle_id: cid, user_id: 'me' });
  });
  let seq = 0;
  const newId = () => 'x' + (++seq) + Math.random().toString(36).slice(2, 6);
  const code = () => Math.random().toString(16).slice(2, 8).toUpperCase();
  function expand(table, row, sel) {
    const r = { ...row };
    if (table === 'group_members' && /groups\(/.test(sel)) r.groups = T.groups.find((g) => g.id === row.group_id) || null;
    if (table === 'places' && /reviews/.test(sel)) r.reviews = T.reviews.filter((x) => x.place_id === row.id).map((x) => ({ ...x }));
    if (table === 'circles' && /circle_members/.test(sel)) r.circle_members = T.circle_members.filter((x) => x.circle_id === row.id).map((x) => ({ user_id: x.user_id }));
    return r;
  }
  function run(st) {
    const match = (row) => st.filters.every(([k, v]) => row[k] === v);
    const rows = T[st.table] || (T[st.table] = []);
    let out;
    if (st.op === 'insert') {
      out = [].concat(st.payload).map((p) => ({ id: newId(), created_at: new Date().toISOString(), user_id: 'me', ...p }));
      rows.push(...out);
    } else if (st.op === 'update') {
      out = rows.filter(match); out.forEach((r) => Object.assign(r, st.payload));
    } else if (st.op === 'upsert') {
      out = [].concat(st.payload).map((p) => {
        const found = rows.find((r) => st.conflict.every((k) => r[k] === p[k]));
        if (found) return Object.assign(found, p);
        const row = { id: newId(), created_at: new Date().toISOString(), ...p }; rows.push(row); return row;
      });
    } else if (st.op === 'delete') {
      out = rows.filter(match); T[st.table] = rows.filter((r) => !match(r));
    } else {
      if (st.table === 'group_members') {
        const reem = rows.find((r) => r.user_id === 'u-reem' && r.status === 'on_way');
        if (reem) { reem.lat -= 0.00004; reem.lng += 0.00006; reem.located_at = new Date().toISOString(); }
      }
      out = rows.filter(match);
    }
    if (st.order) { const [k, asc] = st.order; out = [...out].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (asc ? 1 : -1)); }
    if (st.limit) out = out.slice(0, st.limit);
    out = out.map((r) => expand(st.table, r, st.sel || ''));
    return { data: st.single || st.maybe ? (out[0] || null) : out, error: null };
  }
  function from(table) {
    const st = { table, op: 'select', filters: [], sel: '*' };
    const b = {
      select(sel) { st.sel = sel || '*'; return b; },
      insert(p) { st.op = 'insert'; st.payload = p; return b; },
      update(p) { st.op = 'update'; st.payload = p; return b; },
      upsert(p, o) { st.op = 'upsert'; st.payload = p; st.conflict = ((o && o.onConflict) || 'id').split(','); return b; },
      delete() { st.op = 'delete'; return b; },
      eq(k, v) { st.filters.push([k, v]); return b; },
      order(k, o) { st.order = [k, !o || o.ascending !== false]; return b; },
      limit(n) { st.limit = n; return b; },
      single() { st.single = true; return b; },
      maybeSingle() { st.maybe = true; return b; },
      then(ok, bad) { return Promise.resolve().then(() => run(st)).then(ok, bad); }
    };
    return b;
  }
  const session = { user: { id: 'me' } };
  const offsets = { 'u-reem': [120, -90], 'u-swathi': [-180, 160] };
  return {
    from,
    demoAnchor(o) {
      const cos = Math.max(0.001, Math.abs(Math.cos(o.lat * Math.PI / 180)));
      T.group_members.forEach((m) => {
        const off = offsets[m.user_id];
        if (!off || m.lat == null) return;
        m.lat = o.lat + off[0] / 111320; m.lng = o.lng + off[1] / (111320 * cos);
      });
    },
    async rpc(name, a) {
      if (name === 'create_group') {
        const g = { id: newId(), code: code(), name: a.p_name, ends_at: a.p_hours ? new Date(Date.now() + a.p_hours * 3600e3).toISOString() : null, created_by: 'me' };
        T.groups.push(g); T.group_members.push(member(g.id, 'me', a.p_member_name, {}));
        return { data: { ...g }, error: null };
      }
      if (name === 'join_group') {
        const g = T.groups.find((x) => x.code === String(a.p_code).toUpperCase());
        if (!g) return { data: null, error: { message: 'code not found' } };
        if (!T.group_members.some((m) => m.group_id === g.id && m.user_id === 'me')) T.group_members.push(member(g.id, 'me', a.p_member_name, {}));
        return { data: { ...g }, error: null };
      }
      return { data: null, error: { message: 'Unknown action' } };
    },
    auth: {
      async getSession() { return { data: { session } }; },
      async signInAnonymously() { return { data: { session }, error: null }; },
      async signOut() { return { error: null }; }
    },
    channel() { return { on() { return this; }, subscribe() { return this; } }; },
    removeChannel() {}
  };
}

/* ---------------- start ---------------- */
async function init() {
  $('#logo').innerHTML = LOGO();
  S.auto = ls.get('auto') !== '0';
  S.mode = S.auto ? autoMode() : (ls.get('mode') || 'day');
  applyMode();
  if (!LIVE) {
    if (document.readyState === 'loading') await new Promise((r) => document.addEventListener('DOMContentLoaded', r));
    sb = demoDb(); return afterAuth({ id: 'me' }).catch(fail);
  }
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey || !window.supabase) return renderSetup();
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return renderWelcome();
    await afterAuth(session.user);
  } catch (e) { fail(e); renderWelcome(); }
}

function renderSetup() {
  $('#main').innerHTML = `<section class="screen"><h1>Almost there</h1>
  <p>Sis needs its database. Open <b>config.js</b> and paste your Supabase project URL and anon key, then upload the folder again.</p>
  <pre class="code">window.SIS_CONFIG = {
  supabaseUrl: "https://xxxx.supabase.co",
  supabaseAnonKey: "eyJ..."
};</pre><p class="small muted">The setup guide (SETUP.md) walks through it step by step.</p></section>`;
}

function renderWelcome() {
  $('#tabs').hidden = true;
  $('#main').innerHTML = `<section class="screen" style="padding-top:12px">
    <div class="logo-big">${LOGO(120, 86)}</div>
    <div class="stack"><p class="eyebrow">Sis · your sisterhood</p><h1>Step out bravely, with people you trust</h1>
    <p class="muted">Check in on each other, pick places other women rate as safe, and find your circle. Day and night.</p></div>
    <div class="field"><label for="wName">Your first name</label><input id="wName" maxlength="40" autocomplete="given-name" placeholder="e.g. Jana" value="${esc(ls.get('name') || '')}"></div>
    <div class="field"><label for="wPhone">Phone (optional, so your sisters can call you)</label><input id="wPhone" type="tel" maxlength="30" autocomplete="tel" placeholder="+372 ..."></div>
    <button class="btn block" data-act="welcome">Continue</button>
    <div class="note info">${ic('shieldok')}<span>Prototype: anyone with the link can join. Verification with Smart-ID comes in the next version.</span></div>
  </section>`;
}

async function doWelcome() {
  const name = $('#wName').value.trim(), phone = $('#wPhone').value.trim() || null;
  if (!name) return toast('Add your first name', 'alert');
  const btn = document.querySelector('[data-act="welcome"]'); btn.disabled = true;
  try {
    let { data: { session } } = await sb.auth.getSession();
    if (!session) {
      const { data, error } = await sb.auth.signInAnonymously();
      if (error) throw new Error(error.message.includes('nonymous') ? 'Anonymous sign-ins are off. Turn them on in Supabase (Authentication → Sign In / Providers).' : error.message);
      session = data.session;
    }
    const { error } = await sb.from('profiles').upsert({ id: session.user.id, name, phone });
    if (error) throw error;
    ls.set('name', name);
    await afterAuth(session.user);
  } catch (e) { fail(e); btn.disabled = false; }
}

async function afterAuth(user) {
  S.user = user;
  const { data: p, error } = await sb.from('profiles').select('name, phone').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (!p) return renderWelcome();
  S.name = p.name; S.phone = p.phone || '';
  await loadGroups();
  const join = new URLSearchParams(location.search).get('join');
  if (join) { history.replaceState(null, '', location.pathname); await joinGroup(join); }
  $('#tabs').hidden = false;
  render();
  const me = myRow();
  if (me && me.sharing) startSharing(true);
  setInterval(tick, 1000);
  setInterval(() => { if (S.gid) fetchMembers(); }, 15000);
}

/* ---------------- groups & members ---------------- */
let chan = null;
async function loadGroups() {
  const { data, error } = await sb.from('group_members').select('group_id, groups(id, code, name, ends_at, created_by)').eq('user_id', S.user.id);
  if (error) return fail(error);
  S.groups = (data || []).map((r) => r.groups).filter(Boolean);
  const saved = ls.get('gid');
  await selectGroup(S.groups.find((g) => g.id === saved) ? saved : (S.groups[0]?.id || null));
}
async function selectGroup(id) {
  if (chan) { sb.removeChannel(chan); chan = null; }
  S.gid = id; S.group = S.groups.find((g) => g.id === id) || null; S.members = [];
  ls.set('gid', id || '');
  if (!id) return;
  await fetchMembers();
  chan = sb.channel('group-' + id)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: 'group_id=eq.' + id }, () => fetchMembers())
    .subscribe();
}
async function fetchMembers() {
  if (!S.gid) return;
  const gid = S.gid;
  const { data, error } = await sb.from('group_members').select('*').eq('group_id', gid);
  if (error || gid !== S.gid) return;
  S.members = data || [];
  checkAlerts(); refreshLive();
}
const myRow = () => S.members.find((m) => m.user_id === S.user?.id);
const others = () => S.members.filter((m) => m.user_id !== S.user?.id);
const groupEnded = () => !!(S.group?.ends_at && Date.now() > new Date(S.group.ends_at).getTime());

async function createGroup(name, hours) {
  const { data, error } = await sb.rpc('create_group', { p_name: name, p_member_name: S.name, p_phone: S.phone || null, p_hours: hours });
  if (error) return fail(error);
  S.groups.push(data); await selectGroup(data.id); closeSheet(); render();
  toast(`Created. Invite code ${data.code}`, 'users');
  inviteSheet();
}
async function joinGroup(code) {
  const { data, error } = await sb.rpc('join_group', { p_code: code, p_member_name: S.name, p_phone: S.phone || null });
  if (error) { toast(error.message.includes('code not found') ? 'That code does not exist. Check it with your friend.' : error.message, 'alert'); return; }
  if (!S.groups.find((g) => g.id === data.id)) S.groups.push(data);
  await selectGroup(data.id); closeSheet(); render(); toast(`You joined ${data.name}`, 'users');
}
async function leaveGroup(id) {
  if (id === S.gid) stopSharing(true);
  const { error } = await sb.from('group_members').delete().eq('group_id', id).eq('user_id', S.user.id);
  if (error) return fail(error);
  S.groups = S.groups.filter((g) => g.id !== id);
  if (id === S.gid) await selectGroup(S.groups[0]?.id || null);
  render(); toast('You left the group');
}
async function updateMe(patch) {
  if (!S.gid || !S.user) return false;
  const gid = S.gid, uid = S.user.id;
  try {
    const { data, error } = await sb.from('group_members')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('group_id', gid).eq('user_id', uid)
      .select('user_id').maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Could not update your group status. Rejoin and try again.');
    if (gid === S.gid) {
      const me = myRow();
      if (me) Object.assign(me, patch);
      refreshLive();
    }
    return true;
  } catch (error) {
    fail(error);
    return false;
  }
}
function needGroup() { if (S.gid && !groupEnded()) return false; groupSheet(); return true; }

/* ---------------- location ---------------- */
function startSharing(silent) {
  if (!S.gid) return;
  if (!('geolocation' in navigator)) { toast('Location is not available on this device', 'alert'); return; }
  if (S.watchId != null) return;
  S.watchId = navigator.geolocation.watchPosition(sendPos, (err) => {
    toast(err.code === 1 ? 'Location is blocked. Allow it for this site in your browser settings.' : 'Could not get your location', 'alert');
    if (err.code === 1) stopSharing(false);
  }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 });
  keepAwake(true);
  if (!silent) toast('Finding your GPS position. Sharing begins when a location is available.', 'locate');
}
async function sendPos(pos) {
  if (S.watchId == null) return;
  const { latitude: lat, longitude: lng, accuracy } = pos.coords, now = Date.now();
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  if (S.lastSent && now - S.lastSent.t < 15000 && distM(S.lastSent, { lat, lng }) < 25) return;
  const ok = await updateMe({ lat, lng, accuracy: Math.round(accuracy), located_at: new Date().toISOString(), sharing: true });
  if (ok && S.watchId != null) S.lastSent = { t: now, lat, lng };
}
function stopSharing(clear) {
  if (S.watchId != null) navigator.geolocation.clearWatch(S.watchId);
  S.watchId = null; S.lastSent = null; keepAwake(false);
  if (S.gid) updateMe({ sharing: false, lat: null, lng: null, accuracy: null, located_at: null });
}
function locateOnce() {
  return new Promise((res) => {
    if (!('geolocation' in navigator)) return res(null);
    navigator.geolocation.getCurrentPosition((p) => res({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }), () => res(null), { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 });
  });
}
async function keepAwake(on) {
  try {
    if (on && !S.wake && navigator.wakeLock) { S.wake = await navigator.wakeLock.request('screen'); S.wake.addEventListener('release', () => { S.wake = null; }); }
    if (!on && S.wake) { await S.wake.release(); S.wake = null; }
  } catch (e) { S.wake = null; }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.watchId != null) keepAwake(true); });

/* ---------------- alerts ---------------- */
const overdue = (m) => !!(m.walk_deadline && Date.now() > new Date(m.walk_deadline).getTime() + 60000);
function alertsList() {
  const out = [];
  for (const m of others()) {
    if (m.sos) out.push({ kind: 'sos', key: `sos:${m.user_id}:${m.sos_at}`, m });
    else if (overdue(m)) out.push({ kind: 'late', key: `late:${m.user_id}:${m.walk_deadline}`, m });
  }
  return out;
}
let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0.25, audioCtx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.25); o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.3); });
  } catch (e) { /* sound unavailable */ }
}
function checkAlerts() {
  for (const a of alertsList()) {
    if (S.alerted.has(a.key)) continue;
    S.alerted.add(a.key);
    const title = a.kind === 'sos' ? `${a.m.name} sent an SOS` : `${a.m.name} hasn't checked in`;
    const body = a.kind === 'sos' ? 'Open Sis to see where she is and call her.' : `She was due by ${fmtTime(a.m.walk_deadline)}${a.m.walk_to ? ' (' + a.m.walk_to + ')' : ''}.`;
    toast(title, 'alert');
    // Native SOS sound is possible while Sis is open and detects this group's
    // event. This is NOT push while the app is terminated or the phone is offline.
    const nightSos = a.kind === 'sos' && S.mode === 'night';
    const freshSos = a.m.sos_at && Date.now() >= Date.parse(a.m.sos_at) &&
      Date.now() - Date.parse(a.m.sos_at) < 5 * 60000;
    const nativeSos = nightSos && freshSos &&
      window.SisNativeNotifications && typeof window.SisNativeNotifications.groupSos === 'function';
    if (nativeSos) {
      try { window.SisNativeNotifications.groupSos(a.m.name || 'A group member'); }
      catch (e) { console.warn('Native SOS notification failed:', e); beep(); }
    } else if (a.kind !== 'sos' || nightSos) {
      beep();
    }
    if (a.kind !== 'sos' || nightSos) {
      try { navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) { /* unavailable */ }
      if (!nativeSos) {
        try { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: 'icon.svg', tag: a.key, requireInteraction: true }); } catch (e) { /* notifications unavailable */ }
      }
    }
  }
}
function bannersHTML() {
  return alertsList().map(({ kind, m }) => {
    const loc = m.lat != null ? `<a class="btn sm ${kind === 'sos' ? 'white' : ''}" href="${mapsLink(m.lat, m.lng)}" target="_blank" rel="noopener">${ic('pin')}Open her location</a>` : '<span class="small">No location shared</span>';
    const call = m.phone ? `<a class="btn sm ${kind === 'sos' ? 'white' : 'ghost'}" href="tel:${esc(m.phone)}">${ic('phone')}Call ${esc(m.name)}</a>` : '';
    return `<div class="banner ${kind === 'late' ? 'late' : ''}" role="alert">
      <div class="row">${ic('alert')}<b>${kind === 'sos' ? `${esc(m.name)} sent an SOS` : `${esc(m.name)} hasn't checked in`}</b></div>
      <span class="small">${kind === 'sos' ? `${ago(m.sos_at)}${m.located_at ? ' · location updated ' + ago(m.located_at) : ''}` : `Due by ${fmtTime(m.walk_deadline)}${m.walk_to ? ' · ' + esc(m.walk_to) : ''}`}</span>
      <div class="row" style="flex-wrap:wrap">${loc}${call}</div></div>`;
  }).join('');
}

/* ---------------- maps ---------------- */
const maps = {};
function destroyMaps() { for (const k of Object.keys(maps)) { maps[k].map.remove(); delete maps[k]; } }
function mountMap(key, el) {
  if (!el || !window.L) return null;
  const map = L.map(el, { zoomControl: false, attributionControl: true }).setView(TALLINN, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
  const layer = L.layerGroup().addTo(map);
  maps[key] = { map, layer, fitted: false };
  setTimeout(() => { if (maps[key] && maps[key].map === map) map.invalidateSize(); }, 150);
  return maps[key];
}
function personIcon(name, color, sos) {
  return L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="mk ${sos ? 'sos' : ''}"><span class="pd" style="background:${color}">${esc(name[0]?.toUpperCase() || '?')}</span><span class="pl">${esc(name)}</span></div>` });
}
function updateGroupMap() {
  const M = maps.group; if (!M) return;
  M.layer.clearLayers();
  const pts = [];
  for (const m of S.members) {
    if (m.lat == null) continue;
    const mine = m.user_id === S.user.id;
    L.marker([m.lat, m.lng], { icon: personIcon(mine ? 'You' : m.name, mine ? 'var(--accent)' : colorFor(m.name), m.sos) }).addTo(M.layer);
    if (m.accuracy && m.accuracy < 500) L.circle([m.lat, m.lng], { radius: m.accuracy, color: colorFor(m.name), weight: 1, fillOpacity: 0.08 }).addTo(M.layer);
    pts.push([m.lat, m.lng]);
  }
  if (pts.length && !M.fitted) { M.map.fitBounds(pts, { padding: [40, 40], maxZoom: 16 }); M.fitted = true; }
}
function placeColor(p) { const s = placeScore(p); return s == null ? '#8A84A0' : s >= 4.5 ? '#2E8B66' : s >= 3.5 ? '#C98A12' : '#CF3540'; }
function updatePlacesMap() {
  const M = maps.places; if (!M) return;
  M.layer.clearLayers();
  for (const p of filteredPlaces()) {
    const s = placeScore(p);
    const icon = L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="mk"><span class="pd" style="background:${placeColor(p)};width:28px;height:28px;font-size:10px">${s == null ? '–' : s.toFixed(1)}</span></div>` });
    L.marker([p.lat, p.lng], { icon, title: p.name }).on('click', () => placeSheet(p.id)).addTo(M.layer);
  }
  if (!M.clickBound) {
    M.clickBound = true;
    M.map.on('click', (e) => { if (S.addMode) { S.addMode = false; addPlaceSheet(e.latlng.lat, e.latlng.lng); } });
  }
}

/* ---------------- screens ---------------- */
function statusPill(m) {
  if (m.sos) return `<span class="pill danger"><span class="dot live"></span>SOS</span>`;
  if (overdue(m)) return `<span class="pill danger">${ic('alert')}Not checked in</span>`;
  if (m.status === 'home') return `<span class="pill safe">${ic('check')}Home</span>`;
  if (m.status === 'on_way') return `<span class="pill warn"><span class="dot live"></span>On the way</span>`;
  return `<span class="pill acc">Out</span>`;
}
function memberSub(m) {
  const bits = [];
  if (m.place) bits.push(esc(m.place));
  if (m.walk_deadline) bits.push(`${m.walk_to ? esc(m.walk_to) + ', ' : ''}check-in by ${fmtTime(m.walk_deadline)}`);
  bits.push(m.lat != null ? `location ${ago(m.located_at)}` : 'location off');
  return bits.join(' · ');
}
function membersHTML() {
  if (!S.members.length) return '<p class="muted small">Loading…</p>';
  const sorted = [...S.members].sort((a, b) => (b.user_id === S.user.id) - (a.user_id === S.user.id) || a.name.localeCompare(b.name));
  return sorted.map((m) => {
    const mine = m.user_id === S.user.id;
    return `<div class="item">${avatar(m.name, 'sm')}<span class="grow"><span class="t">${mine ? 'You' : esc(m.name)}</span><br><span class="s">${memberSub(m)}</span></span>${statusPill(m)}
      ${!mine && m.phone ? `<a class="btn sm ghost" href="tel:${esc(m.phone)}" aria-label="Call ${esc(m.name)}">${ic('phone')}</a>` : ''}
      ${!mine && m.lat != null ? `<a class="btn sm ghost" href="${mapsLink(m.lat, m.lng)}" target="_blank" rel="noopener" aria-label="Open ${esc(m.name)} in maps">${ic('pin')}</a>` : ''}</div>`;
  }).join('') + (S.members.length === 1 ? `<div class="item"><span class="grow small muted">Nobody else here yet. Send the invite link to your friends.</span><button class="btn sm" data-act="invite">${ic('link')}Invite</button></div>` : '');
}
function groupCardHTML(withMap) {
  if (!S.group) return `<div class="card stack"><div class="row">${ic('users')}<h2>Your circle of trust</h2></div>
    <p class="small muted">Create a group for tonight or for your closest friends. They join with a code and see each other's check-ins.</p>
    <div class="row"><button class="btn" style="flex:1" data-act="group-new">${ic('plus')}Create</button><button class="btn ghost" style="flex:1" data-act="group-join">Join with code</button></div></div>`;
  const ended = groupEnded();
  return `<div class="card stack">
    <div class="row between"><div class="grow"><p class="eyebrow">${S.group.ends_at ? (ended ? 'Ended' : 'Night out · ends ' + fmtTime(S.group.ends_at)) : 'Circle of trust'}</p><h2>${esc(S.group.name)}</h2></div>
      <button class="btn sm ghost" data-act="invite">${ic('link')}Invite</button></div>
    ${ended ? `<p class="small muted">This night out has ended and location sharing is off.</p><button class="btn ghost" data-act="group-new">${ic('plus')}Start a new one</button>` : ''}
    ${withMap ? '<div class="map" id="groupMap"></div>' : ''}
    <div class="list" id="memberList" style="box-shadow:none">${membersHTML()}</div>
    ${S.groups.length > 1 ? `<button class="link" style="align-self:flex-start" data-act="tab:me">Switch group</button>` : ''}
  </div>`;
}
function myCardHTML() {
  const me = myRow(); if (!me) return '';
  if (me.sos) return `<div class="card stack alertcard"><div class="row" style="color:var(--danger)">${ic('alert')}<h2>SOS is on</h2></div>
    <p class="small">Your sisters see your live location.</p>
    <button class="btn danger block" data-act="call-112">${ic('phone')}Call 112</button>
    <button class="btn safe block" data-act="sos-cancel">${ic('check')}I'm safe now</button></div>`;
  if (!me.walk_deadline) return '';
  const dl = new Date(me.walk_deadline).getTime(), now = Date.now();
  if (now < dl) {
    return `<div class="card stack" id="walkCard"><div class="row between"><span class="pill acc"><span class="dot live"></span>${me.status === 'on_way' ? 'On my way' : 'Check-in set'}</span><span class="small muted">${esc(me.walk_to || '')}</span></div>
      <div class="timer" id="walkTime">${mmss((dl - now) / 1000)}</div>
      <div class="row"><button class="btn safe" style="flex:1" data-act="${me.status === 'on_way' ? 'home' : 'ok'}">${ic('check')}${me.status === 'on_way' ? "I'm home" : "I'm OK"}</button><button class="btn ghost" data-act="add5">+5 min</button></div></div>`;
  }
  if (now < dl + 60000) return `<div class="card stack alertcard" id="walkCard"><div class="row" style="color:var(--danger)">${ic('alert')}<h2>Are you OK, ${esc(S.name)}?</h2></div>
      <p>Confirm you're safe or your group gets an alert in <b id="confirmTime">${mmss((dl + 60000 - now) / 1000)}</b>.</p>
      <div class="row"><button class="btn safe" style="flex:1" data-act="${me.status === 'on_way' ? 'home' : 'ok'}">${ic('check')}I'm OK</button><button class="btn ghost" data-act="add5">5 more min</button></div></div>`;
  return `<div class="card stack alertcard" id="walkCard"><div class="row" style="color:var(--danger)">${ic('bell')}<h2>Your group was alerted</h2></div>
      <p class="small">They can see your last location and may call you.</p><button class="btn safe block" data-act="${me.status === 'on_way' ? 'home' : 'ok'}">${ic('check')}I'm safe, tell them</button></div>`;
}
function notifyPromptHTML() {
  if (!('Notification' in window) || Notification.permission !== 'default' || !S.gid) return '';
  return `<button class="note info" data-act="notify" style="text-align:left">${ic('bell')}<span>Turn on alerts so you hear it when a sister needs you</span></button>`;
}

function homeDay() {
  const ss = sunTime(new Date(), false);
  const h = new Date().getHours(), greet = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  return `<section class="screen">
    <div><p class="eyebrow">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1>${greet}, ${esc(S.name)}</h1>
      <span class="sunset">${ic('moon')}Sunset ${fmtTime(ss)} · ${S.auto ? 'night mode switches on by itself' : 'auto switch paused'}</span></div>
    <div id="banners" class="stack">${bannersHTML()}</div>
    <div id="myCard">${myCardHTML()}</div>
    <div class="qa">
      <button data-act="arrived"><span class="ic">${ic('pin')}</span><span><b>I've arrived</b><span class="small">Tell your group you got there</span></span></button>
      <button data-act="date"><span class="ic">${ic('heart')}</span><span><b>Date check-in</b><span class="small">Your group checks on you</span></span></button>
      <button data-act="ride"><span class="ic">${ic('car')}</span><span><b>Share my ride</b><span class="small">Live location until you arrive</span></span></button>
      <button data-act="trip"><span class="ic">${ic('globe')}</span><span><b>Plan a trip</b><span class="small">Find a travel buddy</span></span></button>
    </div>
    ${notifyPromptHTML()}
    ${window.sisNearbyHome ? window.sisNearbyHome.card() : ''}
  </section>`;
}
function homeNight() {
  const me = myRow(), sharing = !!me?.sharing;
  return `<section class="screen">
    <div><p class="eyebrow">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1>Your sisters are near, ${esc(S.name)}</h1>
      <span class="sunset">${ic('moon')}Sunset ${fmtTime(sunTime(new Date(), false))} · sunrise ${fmtTime(sunTime(new Date(Date.now() + (new Date().getHours() >= 12 ? 864e5 : 0)), true))}</span></div>
    <div id="banners" class="stack">${bannersHTML()}</div>
    <div id="myCard">${myCardHTML()}</div>
    ${notifyPromptHTML()}
    ${window.sisNearbyHome ? window.sisNearbyHome.card() : ''}
    <div class="big2">
      <button class="btn safe" data-act="home">${ic('home')}I'm home</button>
      <button class="btn" data-act="walk">${ic('nav')}Walk me home</button>
      <button class="btn ghost" data-act="safe-places">${ic('shieldok')}Safe places</button>
      <button class="btn ghost" data-act="fakecall">${ic('phone')}Fake call</button>
    </div>
  </section>`;
}

function placeScore(p) { const r = p.reviews || []; if (!r.length) return null; const v = r.reduce((a, x) => a + (x.feel === 'safe' ? 1 : x.feel === 'mixed' ? 0.5 : 0), 0) / r.length; return Math.round((1 + 4 * v) * 10) / 10; }
function placeLevel(s) { return s == null ? ['plain', 'No notes yet'] : s >= 4.5 ? ['safe', 'Felt safe'] : s >= 3.5 ? ['warn', 'Mostly safe'] : ['danger', 'Mixed reports']; }
function tagCounts(p) { const g = {}, b = {}; for (const r of p.reviews || []) { (r.good || []).forEach((t) => g[t] = (g[t] || 0) + 1); (r.bad || []).forEach((t) => b[t] = (b[t] || 0) + 1); } return [g, b]; }
function filteredPlaces() {
  const q = S.q.toLowerCase();
  return S.places.filter((p) => (S.placeFilter === 'All' || tagCounts(p)[0][S.placeFilter]) && (`${p.name} ${p.area || ''} ${p.kind || ''}`).toLowerCase().includes(q));
}
function placeListHTML() {
  const l = filteredPlaces();
  if (!S.places.length) return `<div class="empty">${ic('pin')}<b>No places yet</b><span class="small">Add the first bar, café or street and say how safe it felt.</span><button class="btn sm" data-act="add-place">${ic('plus')}Add a place</button></div>`;
  if (!l.length) return '<p class="muted">Nothing matches. Try another tag.</p>';
  return l.map((p) => {
    const s = placeScore(p), [k, lab] = placeLevel(s), [g, b] = tagCounts(p);
    const top = Object.entries(g).sort((a, c) => c[1] - a[1]).slice(0, 2), neg = Object.entries(b).sort((a, c) => c[1] - a[1]).slice(0, 1);
    return `<button class="card stack" style="text-align:left;width:100%" data-act="place:${p.id}">
      <span class="row between" style="width:100%"><span class="grow"><h3>${esc(p.name)}</h3><span class="small muted">${esc([p.kind, p.area].filter(Boolean).join(' · ') || 'Tallinn')} · ${(p.reviews || []).length} notes</span>${p.badge ? `<br><span class="pill safe" style="margin-top:6px">${ic('shieldok')}Trained staff</span>` : ''}</span>
      <span style="text-align:right"><span class="score" style="color:var(--${k === 'plain' ? 'muted' : k})">${s == null ? '–' : s.toFixed(1)}</span><br><span class="pill ${k}">${lab}</span></span></span>
      ${top.length || neg.length ? `<span class="tags">${top.map(([t, n]) => `<span class="pill plain">${esc(t)} · ${n}</span>`).join('')}${neg.map(([t, n]) => `<span class="pill warn">${esc(t)} · ${n}</span>`).join('')}</span>` : ''}</button>`;
  }).join('');
}
function placesScreen() {
  return `<section class="screen">
    <div><div class="row between"><h1>Places</h1><button class="btn sm" data-act="add-place">${ic('plus')}Add</button></div>
      <p class="muted" style="margin-top:4px">Rated by women on how safe they felt, not on the cocktails.</p></div>
    <label class="search">${ic('search')}<input id="q" placeholder="Search a bar, café, area" value="${esc(S.q)}" autocomplete="off"></label>
    <div class="chips">${['All', ...GOOD_TAGS].map((f) => `<button class="chip ${S.placeFilter === f ? 'on' : ''}" data-act="filter:${esc(f)}">${esc(f)}</button>`).join('')}</div>
    <div class="map tall" id="placesMap"></div>
    <div id="placeList" class="stack">${placeListHTML()}</div>
  </section>`;
}

function sisterhoodScreen() {
  let body = '';
  if (S.seg === 'circles') {
    body = S.circles.length ? S.circles.map((c) => {
      const n = (c.circle_members || []).length, mine = (c.circle_members || []).some((x) => x.user_id === S.user.id);
      return `<div class="card circle-card"><span class="circle-ic">${esc(c.emoji || '💜')}</span><span class="grow"><h3>${esc(c.name)}</h3>
        ${c.description ? `<p class="small muted">${esc(c.description)}</p>` : ''}${c.next_meetup ? `<p class="small" style="margin-top:6px"><b>Next:</b> ${esc(c.next_meetup)}</p>` : ''}
        <p class="small muted">${n} ${n === 1 ? 'member' : 'members'}</p></span>
        ${mine ? `<button class="pill safe" data-act="leave-circle:${c.id}">${ic('check')}Joined</button>` : `<button class="btn sm" data-act="join-circle:${c.id}">Join</button>`}</div>`;
    }).join('') : '<p class="muted">No circles yet.</p>';
    body += `<button class="btn ghost block" data-act="new-circle">${ic('plus')}Start your own circle</button>`;
  } else {
    body = (S.trips.length ? S.trips.map((t) => `<div class="card stack"><div class="row">${avatar(t.author)}<span class="grow"><b>${esc(t.author)}</b> → ${esc(t.destination)}<br><span class="small muted">${esc(t.dates || '')}</span></span>
      ${t.user_id === S.user.id ? `<button class="btn sm ghost" data-act="del-trip:${t.id}" aria-label="Delete trip">${ic('x')}</button>` : ''}</div>${t.note ? `<p class="small">${esc(t.note)}</p>` : ''}</div>`).join('')
      : `<div class="empty">${ic('globe')}<b>No trips yet</b><span class="small">Post where you're going and find a travel buddy.</span></div>`)
      + `<button class="btn block" data-act="post-trip">${ic('plus')}Post my trip</button>`;
  }
  return `<section class="screen">
    <div><h1>Sisterhood</h1><p class="muted" style="margin-top:4px">Your women, your city. Meet in person.</p></div>
    <div class="seg">${[['circles', 'Circles'], ['trips', 'Travel']].map(([k, l]) => `<button class="${S.seg === k ? 'on' : ''}" data-act="seg:${k}">${l}</button>`).join('')}</div>
    <div class="stack">${body}</div></section>`;
}

const SHARE_RULES = [
  { k: 'trips', t: 'During Walk me home and rides', s: 'Starts with the timer, stops when you check in', on: true },
  { k: 'night', t: 'Every night after sunset', s: 'Turns on by itself in night mode', on: false },
  { k: 'sos', t: 'When I send an SOS', s: 'Your circle sees where you are', locked: true }
];
function shareRule(k) { const r = SHARE_RULES.find((x) => x.k === k); if (!r) return false; if (r.locked) return true; const v = ls.get('share.' + k); return v == null ? r.on : v === '1'; }
function meScreen() {
  const notif = 'Notification' in window ? Notification.permission : 'unsupported';
  return `<section class="screen">
    <div class="row">${avatar(S.name)}<div class="grow"><h1 style="font-size:26px">${esc(S.name)}</h1><p class="small muted">${esc(S.phone || 'No phone added')}</p></div><button class="btn sm ghost" data-act="edit-profile">Edit</button></div>
    <div class="stack"><div class="sec-head"><h2>My groups</h2><div class="row"><button class="link" data-act="group-join">Join</button><button class="link" data-act="group-new">+ New</button></div></div>
      ${S.groups.length ? `<div class="list">${S.groups.map((g) => `<div class="item"><button class="grow" style="text-align:left" data-act="select-group:${g.id}"><span class="t">${esc(g.name)}</span><br><span class="s">Code ${esc(g.code)}${g.ends_at ? ' · ends ' + new Date(g.ends_at).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span></button>
        ${g.id === S.gid ? `<span class="pill acc">Active</span>` : ''}<button class="btn sm ghost" data-act="leave-group:${g.id}">Leave</button></div>`).join('')}</div>` : '<p class="muted small">No groups yet.</p>'}</div>
    <div class="stack"><h2>Location sharing</h2><div class="list">
      <button class="item" data-act="share"><span class="grow"><span class="t">Share my location now</span><br><span class="s">${S.group ? 'Only your circle can see it' : 'Join a group first'}</span></span><span class="toggle ${S.watchId != null || myRow()?.sharing ? 'on' : ''}" role="switch" aria-checked="${S.watchId != null || !!myRow()?.sharing}"></span></button>
      ${SHARE_RULES.map((r) => `<button class="item" data-act="${r.locked ? 'noop' : 'share-rule:' + r.k}"><span class="grow"><span class="t">${r.t}</span><br><span class="s">${r.s}</span></span>${r.locked ? `<span class="pill safe">${ic('check')}Always</span>` : `<span class="toggle ${shareRule(r.k) ? 'on' : ''}" role="switch" aria-checked="${shareRule(r.k)}"></span>`}</button>`).join('')}
    </div><p class="small muted">${ic('lock')} Sharing stops when you tap "I'm home" and your location is deleted.</p></div>
    <div class="stack"><h2>Settings</h2><div class="list">
      <button class="item" data-act="toggle-auto"><span class="grow"><span class="t">Night mode at sunset</span><br><span class="s">Switches on by itself after dark</span></span><span class="toggle ${S.auto ? 'on' : ''}" role="switch" aria-checked="${S.auto}"></span></button>
      <button class="item" data-act="notify"><span class="grow"><span class="t">Alerts</span><br><span class="s">${notif === 'granted' ? 'On. You get a notification while Sis is open.' : notif === 'denied' ? 'Blocked in browser settings.' : notif === 'unsupported' ? 'Not supported in this browser. Add Sis to your home screen.' : 'Tap to turn on.'}</span></span>${notif === 'granted' ? `<span class="pill safe">${ic('check')}On</span>` : ''}</button>
    </div></div>
    ${LIVE ? '<button class="btn ghost block" data-act="signout">Sign out on this device</button>' : ''}
  </section>`;
}

/* ---------------- render ---------------- */
function applyMode() {
  document.body.classList.toggle('night', S.mode === 'night');
  $('#mDay').innerHTML = ic('sun') + 'Day'; $('#mNight').innerHTML = ic('moon') + 'Night';
  $('#mDay').classList.toggle('on', S.mode === 'day'); $('#mNight').classList.toggle('on', S.mode === 'night');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', S.mode === 'night' ? '#121022' : '#F7F5F2');
}
function render() {
  if (!S.user) return;
  applyMode(); destroyMaps();
  if (S.mode === 'night' && shareRule('night') && S.gid && S.watchId == null && !S.nightShared) { S.nightShared = true; startSharing(true); }
  const m = $('#main');
  m.innerHTML = S.tab === 'home' ? (S.mode === 'night' ? homeNight() : homeDay()) : S.tab === 'places' ? placesScreen() : S.tab === 'sisterhood' ? sisterhoodScreen() : meScreen();
  renderTabs();
  if (S.tab === 'home' && $('#groupMap')) { mountMap('group', $('#groupMap')); updateGroupMap(); }
  if (S.tab === 'home' && window.sisNearbyHome) window.sisNearbyHome.mount();
  if (S.tab === 'places') {
    mountMap('places', $('#placesMap')); updatePlacesMap();
    $('#q').oninput = (e) => { S.q = e.target.value; $('#placeList').innerHTML = placeListHTML(); updatePlacesMap(); };
  }
  bindSOS();
}
function renderTabs() {
  const t = $('#tabs'), alert = alertsList().length > 0;
  if (!t.querySelector('.tab-sos')) {
    const tab = (k, i, l) => `<button data-tab="${k}" data-act="tab:${k}">${ic(i)}${l}</button>`;
    t.innerHTML = tab('home', 'home', 'Home') + tab('places', 'pin', 'Places') +
      '<button class="tab-sos" id="sos" aria-label="Hold for 2 seconds to send SOS"><span class="sos-core"><span class="fill" id="sosFill"></span><b>SOS</b></span></button>' +
      tab('sisterhood', 'users', 'Sisterhood') + tab('me', 'user', 'Me');
    bindSOS();
  }
  t.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
  const home = t.querySelector('[data-tab="home"]'), badge = home.querySelector('.badge');
  if (alert && !badge) home.insertAdjacentHTML('beforeend', '<span class="badge"></span>');
  else if (!alert && badge) badge.remove();
}
function refreshLive() {
  if (S.tab !== 'home') { renderTabs(); return; }
  const b = $('#banners'); if (b) b.innerHTML = bannersHTML();
  const ml = $('#memberList'); if (ml) ml.innerHTML = membersHTML();
  const mc = $('#myCard'); if (mc && !mc.contains(document.activeElement)) mc.innerHTML = myCardHTML();
  const sh = $('#shareBtn'); if (sh) sh.innerHTML = ic('locate') + (myRow()?.sharing ? 'Stop sharing' : 'Share location');
  updateGroupMap(); renderTabs();
}
async function go(tab) {
  S.tab = tab; render(); $('#main').scrollTop = 0;
  if (tab === 'places') await loadPlaces();
  if (tab === 'sisterhood') await loadSisterhood();
}

/* ---------------- data: places & sisterhood ---------------- */
async function loadPlaces() {
  const { data, error } = await sb.from('places').select('*, reviews(id, user_id, author, feel, good, bad, body, created_at)').order('created_at', { ascending: false }).limit(500);
  if (error) return fail(error);
  S.places = data || [];
  if (S.tab === 'places') { $('#placeList').innerHTML = placeListHTML(); updatePlacesMap(); }
}
async function loadSisterhood() {
  const [c, t] = await Promise.all([
    sb.from('circles').select('*, circle_members(user_id)').order('created_at'),
    sb.from('trips').select('*').order('created_at', { ascending: false }).limit(100)
  ]);
  if (c.error) return fail(c.error);
  if (t.error) return fail(t.error);
  S.circles = c.data || []; S.trips = t.data || [];
  if (S.tab === 'sisterhood') render();
}

/* ---------------- sheets ---------------- */
function groupSheet() {
  openSheet(`${sheetHead('Your circle of trust')}
    <p class="small muted">Check-ins, walks home and SOS go to the people in your active group.</p>
    <button class="btn block" data-act="group-new">${ic('plus')}Create a group</button>
    <button class="btn ghost block" data-act="group-join">Join with a code</button>`);
}
function newGroupSheet() {
  openSheet(`${sheetHead('Create a group')}
    <div class="field"><label for="gName">Name</label><input id="gName" maxlength="60" value="${esc(S.mode === 'night' ? 'Friday night out' : 'My sisters')}"></div>
    <div class="field"><span class="lab">How long?</span><div class="pick" id="gHours">
      <button data-act="pick-one" data-v="8">Tonight (8 h)</button><button data-act="pick-one" data-v="24">24 hours</button><button class="on" data-act="pick-one" data-v="">Keep it (trusted circle)</button></div></div>
    <p class="small muted">A night out ends by itself, and location sharing stops with it.</p>
    <button class="btn block" data-act="group-create">${ic('users')}Create and invite</button>`);
}
function joinSheet() {
  openSheet(`${sheetHead('Join a group')}
    <div class="field"><label for="jCode">Invite code</label><input id="jCode" maxlength="6" autocapitalize="characters" placeholder="e.g. 7F3A9C" style="text-transform:uppercase;letter-spacing:.15em;font-weight:700"></div>
    <button class="btn block" data-act="group-join-go">Join</button>`);
}
function inviteSheet() {
  if (!S.group) return;
  const link = `${location.origin}${location.pathname}?join=${S.group.code}`;
  openSheet(`${sheetHead('Invite your sisters')}
    <p>Send this link. Friends open it, add their name and join <b>${esc(S.group.name)}</b>.</p>
    <div class="row between"><span class="codebox">${esc(S.group.code)}</span><span class="small muted">or share the code</span></div>
    <input id="inviteLink" readonly value="${esc(link)}" style="padding:12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);width:100%">
    <div class="row"><button class="btn" style="flex:1" data-act="share-link">${ic('link')}Share link</button><button class="btn ghost" style="flex:1" data-act="copy-link">Copy</button></div>`);
}
function walkSheet() {
  openSheet(`${sheetHead('Walk me home')}
    <p class="small muted">Your group sees your live location until you tap "I'm home". If you don't check in on time, Sis asks if you're OK, then alerts them.</p>
    <div class="field"><label for="wTo">Going to</label><input id="wTo" maxlength="80" value="Home"></div>
    <div class="field"><span class="lab">How long will it take?</span><div class="pick" id="wMin">${[10, 15, 20, 30, 45].map((m) => `<button class="${m === 15 ? 'on' : ''}" data-act="pick-one" data-v="${m}">${m} min</button>`).join('')}</div></div>
    <button class="btn block" data-act="walk-go">${ic('nav')}Start walking</button>`);
}
function arrivedSheet() {
  openSheet(`${sheetHead("I've arrived")}
    <div class="field"><label for="aPlace">Where are you?</label><input id="aPlace" maxlength="100" placeholder="e.g. Office, Rotermann"></div>
    <label class="row small"><input type="checkbox" id="aLoc" checked> Share my location once</label>
    <button class="btn safe block" data-act="arrived-go">${ic('check')}Tell my group</button>`);
}
function dateSheet() {
  const t = new Date(Date.now() + 2 * 3600e3); const hh = String(t.getHours()).padStart(2, '0'), mm = String(Math.floor(t.getMinutes() / 5) * 5).padStart(2, '0');
  openSheet(`${sheetHead('Date check-in')}
    <p class="small muted">Only your group sees this. If you don't tap "I'm OK" by the time you set, they get an alert.</p>
    <div class="field"><label for="dWho">Who are you meeting?</label><input id="dWho" maxlength="40" placeholder="First name"></div>
    <div class="field"><label for="dWhere">Where?</label><input id="dWhere" maxlength="60" placeholder="Place"></div>
    <div class="field"><label for="dTime">Check on me at</label><input id="dTime" type="time" value="${hh}:${mm}"></div>
    <label class="row small"><input type="checkbox" id="dLoc"> Share my live location too</label>
    <button class="btn block" data-act="date-go">${ic('heart')}Start check-in</button>`);
}
function rideSheet() {
  openSheet(`${sheetHead('Share my ride')}
    <div class="field"><label for="rPlate">Car plate</label><input id="rPlate" maxlength="12" placeholder="512 BKT" style="text-transform:uppercase"></div>
    <div class="field"><label for="rTo">Going to</label><input id="rTo" maxlength="60" value="Home"></div>
    <div class="field"><span class="lab">Ride time</span><div class="pick" id="rMin">${[10, 15, 20, 30, 45].map((m) => `<button class="${m === 20 ? 'on' : ''}" data-act="pick-one" data-v="${m}">${m} min</button>`).join('')}</div></div>
    <button class="btn block" data-act="ride-go">${ic('car')}Share ride with my group</button>`);
}
function placeSheet(id) {
  const p = S.places.find((x) => x.id === id); if (!p) return;
  const s = placeScore(p), [k, lab] = placeLevel(s), [g, b] = tagCounts(p), max = Math.max(1, ...Object.values(g), ...Object.values(b));
  const reviews = [...(p.reviews || [])].sort((a, c) => new Date(c.created_at) - new Date(a.created_at));
  const mine = reviews.find((r) => r.user_id === S.user.id);
  openSheet(`<div class="row between"><div class="grow"><h2 style="font-size:22px">${esc(p.name)}</h2><p class="small muted">${esc([p.kind, p.area].filter(Boolean).join(' · ') || 'Tallinn')}</p></div><button class="btn ghost sm" data-act="close" aria-label="Close">${ic('x')}</button></div>
    <div class="row"><span class="score" style="color:var(--${k === 'plain' ? 'muted' : k});font-size:34px">${s == null ? '–' : s.toFixed(1)}</span><span><span class="pill ${k}">${lab}</span><br><span class="small muted">${reviews.length} safety notes from women</span></span></div>
    ${Object.keys(g).length + Object.keys(b).length ? `<div class="stack">${Object.entries(g).sort((a, c) => c[1] - a[1]).map(([t, n]) => `<div class="bar"><span>${esc(t)}</span><b>${n}</b><span class="track"><i style="width:${100 * n / max}%"></i></span></div>`).join('')}
    ${Object.entries(b).sort((a, c) => c[1] - a[1]).map(([t, n]) => `<div class="bar"><span>${esc(t)}</span><b>${n}</b><span class="track"><i class="neg" style="width:${100 * n / max}%"></i></span></div>`).join('')}</div>` : ''}
    ${reviews.length ? `<h3>What women say</h3>${reviews.map((r) => `<div class="review"><div class="row" style="margin-bottom:6px">${avatar(r.author, 'sm')}<b class="grow">${esc(r.author)}</b><span class="pill ${r.feel === 'safe' ? 'safe' : r.feel === 'mixed' ? 'warn' : 'danger'}">${r.feel === 'safe' ? 'Felt safe' : r.feel === 'mixed' ? 'Mixed' : 'Felt unsafe'}</span></div>${r.body ? `<p class="small">${esc(r.body)}</p>` : ''}<p class="small muted" style="margin-top:4px">${ago(r.created_at)}</p></div>`).join('')}` : '<p class="muted small">No notes yet. Be the first.</p>'}
    <a class="btn ghost" href="${mapsLink(p.lat, p.lng)}" target="_blank" rel="noopener">${ic('pin')}Open in maps</a>
    <button class="btn block" data-act="review:${p.id}">${ic('plus')}${mine ? 'Update my safety note' : 'Add my safety note'}</button>`);
}
function reviewSheet(id) {
  const p = S.places.find((x) => x.id === id); if (!p) return;
  const mine = (p.reviews || []).find((r) => r.user_id === S.user.id);
  S.review = { id, feel: mine?.feel || null, good: new Set(mine?.good || []), bad: new Set(mine?.bad || []) };
  openSheet(`${sheetHead(`How did ${esc(p.name)} feel?`)}
    <div class="feel">${[['safe', '😌', 'Felt safe'], ['mixed', '😐', 'Mixed'], ['unsafe', '😟', 'Felt unsafe']].map(([v, e, l]) => `<button class="${S.review.feel === v ? 'on' : ''}" data-act="feel:${v}"><span class="e">${e}</span>${l}</button>`).join('')}</div>
    <div class="field"><span class="lab">What was good</span><div class="pick">${GOOD_TAGS.map((t) => `<button class="${S.review.good.has(t) ? 'on' : ''}" data-act="rtag-good:${esc(t)}">${esc(t)}</button>`).join('')}</div></div>
    <div class="field"><span class="lab">What to watch out for</span><div class="pick">${BAD_TAGS.map((t) => `<button class="${S.review.bad.has(t) ? 'on' : ''}" data-act="rtag-bad:${esc(t)}">${esc(t)}</button>`).join('')}</div></div>
    <div class="field"><label for="rText">Anything else? (optional)</label><textarea id="rText" rows="3" maxlength="500" placeholder="e.g. Ask for the Angel Shot at the bar">${esc(mine?.body || '')}</textarea></div>
    <p class="small muted">${ic('lock')} Posted with your first name.</p>
    <button class="btn block" data-act="review-save">Post safety note</button>`);
}
function addPlaceSheet(lat, lng) {
  S.pendingPlace = lat != null ? { lat, lng } : null;
  const d = S.draftPlace || {};
  openSheet(`${sheetHead('Add a place')}
    <div class="field"><label for="pName">Name</label><input id="pName" maxlength="80" placeholder="e.g. a bar, café, street, bus stop" value="${esc(d.name || '')}"></div>
    <div class="row"><div class="field grow"><label for="pKind">Type</label><select id="pKind"><option>Bar</option><option>Café</option><option>Club</option><option>Restaurant</option><option>Street</option><option>Transport</option><option>Hotel</option><option>Other</option></select></div>
      <div class="field grow"><label for="pArea">Area</label><input id="pArea" maxlength="60" placeholder="e.g. Kalamaja" value="${esc(d.area || '')}"></div></div>
    <div class="field"><span class="lab">Where is it?</span>
      <p class="small" id="pWhere">${S.pendingPlace ? `${ic('check')} Spot picked on the map` : 'Not set yet'}</p>
      <div class="row"><button class="btn ghost sm" data-act="place-here">${ic('locate')}I'm here now</button><button class="btn ghost sm" data-act="place-pick">${ic('pin')}Pick on map</button></div></div>
    <button class="btn block" data-act="place-save">Add place</button>`);
  if (d.kind) $('#pKind').value = d.kind;
}
function newCircleSheet() {
  openSheet(`${sheetHead('Start a circle')}
    <div class="field"><span class="lab">Icon</span><div class="pick" id="cEmoji">${['💜', '📚', '🏃‍♀️', '🧘‍♀️', '🎨', '🍷', '🌿', '💻', '🍼', '✈️'].map((e, i) => `<button class="${i === 0 ? 'on' : ''}" data-act="pick-one" data-v="${e}" style="font-size:18px">${e}</button>`).join('')}</div></div>
    <div class="field"><label for="cName">Name</label><input id="cName" maxlength="60" placeholder="e.g. Sunday Sketching"></div>
    <div class="field"><label for="cDesc">What is it about?</label><input id="cDesc" maxlength="200"></div>
    <div class="field"><label for="cNext">Next meetup (optional)</label><input id="cNext" maxlength="120" placeholder="e.g. Sun 12:00 · Kadriorg Park"></div>
    <button class="btn block" data-act="circle-save">Create circle</button>`);
}
function postTripSheet() {
  openSheet(`${sheetHead('Post my trip')}
    <div class="field"><label for="tTo">Where to?</label><input id="tTo" maxlength="80" placeholder="e.g. Lisbon"></div>
    <div class="field"><label for="tWhen">When?</label><input id="tWhen" maxlength="60" placeholder="e.g. 12–16 May"></div>
    <div class="field"><label for="tNote">What are you looking for?</label><input id="tNote" maxlength="300" placeholder="Someone to share dinners and walks"></div>
    <p class="small muted">Other sisters see your first name. Meet in public first.</p>
    <button class="btn block" data-act="trip-save">Post trip</button>`);
}
function profileSheet() {
  openSheet(`${sheetHead('Edit profile')}
    <div class="field"><label for="eName">First name</label><input id="eName" maxlength="40" value="${esc(S.name)}"></div>
    <div class="field"><label for="ePhone">Phone (optional)</label><input id="ePhone" type="tel" maxlength="30" value="${esc(S.phone)}"></div>
    <button class="btn block" data-act="profile-save">Save</button>`);
}
async function safePlacesSheet() {
  if (!S.places.length) await loadPlaces();
  const here = (await Promise.race([locateOnce(), new Promise((r) => setTimeout(() => r(null), 3000))])) || { lat: TALLINN[0], lng: TALLINN[1] };
  const list = S.places.filter((p) => p.badge).map((p) => ({ p, d: distM(here, p) })).sort((a, b) => a.d - b.d);
  openSheet(`${sheetHead('Safe places')}
    <p class="small muted">Venues whose staff completed Sis safety training. Ask staff for help any time.</p>
    <div class="list">${list.map(({ p, d }) => `<div class="item"><span class="grow"><span class="t">${esc(p.name)}</span><br><span class="s">${esc([p.kind, p.area].filter(Boolean).join(' · '))} · ${d < 1000 ? Math.round(d) + ' m' : (d / 1000).toFixed(1) + ' km'}</span></span>
      <span class="pill safe">${ic('shieldok')}Trained</span><a class="btn sm ghost" href="${mapsLink(p.lat, p.lng)}" target="_blank" rel="noopener" aria-label="Directions to ${esc(p.name)}">${ic('nav')}</a></div>`).join('') || '<p class="small muted" style="padding:14px">No safe places yet.</p>'}</div>
    <button class="btn ghost block" data-act="tab:places">${ic('pin')}All places</button>`);
}
const picked = (sel) => document.querySelector(`${sel} .on`)?.dataset.v;

/* ---------------- SOS & fake call ---------------- */
let sosRaf = null, sosStart = null;
function bindSOS() {
  const b = $('#sos'); if (!b) return;
  const fill = $('#sosFill');
  const stop = () => { if (sosRaf && sosStart && performance.now() - sosStart < 600) toast('Hold SOS for 2 seconds', 'alert'); cancelAnimationFrame(sosRaf); sosRaf = null; sosStart = null; fill.style.transform = 'scale(0)'; };
  const step = (t) => { if (!sosStart) sosStart = t; const p = Math.min(1, (t - sosStart) / 2000); fill.style.transform = `scale(${p})`; if (p >= 1) { stop(); sendSOS(); return; } sosRaf = requestAnimationFrame(step); };
  b.onpointerdown = (e) => { e.preventDefault(); if (!sosRaf) sosRaf = requestAnimationFrame(step); };
  b.onpointerup = b.onpointerleave = b.onpointercancel = stop;
  b.onkeydown = (e) => { if ((e.key === ' ' || e.key === 'Enter') && !sosRaf && !e.repeat) { e.preventDefault(); sosRaf = requestAnimationFrame(step); } };
  b.onkeyup = stop;
  b.oncontextmenu = (e) => e.preventDefault();
}
async function sendSOS() {
  if (needGroup()) {
    toast('Create or join a group to send an SOS.', 'alert');
    return;
  }
  const saved = await updateMe({ sos: true, sos_at: new Date().toISOString() });
  if (!saved) {
    toast('SOS was not saved. Call 112 if you are in danger.', 'alert');
    return;
  }
  try { navigator.vibrate && navigator.vibrate(80); } catch (e) { /* unavailable */ }
  startSharing(true);
  toast('SOS saved to your group. They can see where you are.', 'alert');
  render();
  if (typeof openSheet === 'function') sosSheet();
}
function sosSheet() {
  const names = others().map((m) => m.name);
  openSheet(`<div class="banner" role="alert"><div class="row">${ic('alert')}<b style="font-size:18px">SOS sent</b></div>
      <span>${names.length ? esc(names.join(', ')) + ' can' : 'Your circle can'} see your live location.</span></div>
    <button class="btn danger block" data-act="call-112" style="padding:18px;font-size:17px">${ic('phone')}Call 112 · police & ambulance</button>
    <button class="btn ghost block" data-act="fakecall">${ic('phone')}Fake call to leave</button>
    <button class="btn safe block" data-act="sos-safe">${ic('check')}I'm safe now</button>`);
}
let callT;
function fakeCall() {
  toast('Incoming call in 5 seconds. Put your phone away.', 'phone');
  setTimeout(() => {
    $('#callLayer').innerHTML = `<div class="call"><p style="opacity:.7">Incoming call…</p><div><span class="av">M</span><div class="who">Mom</div><p style="opacity:.7;margin-top:4px">mobile</p></div>
      <div class="acts"><button data-act="call-end"><span class="c" style="background:#e5484d">${ic('end')}</span>Decline</button><button data-act="call-accept"><span class="c" style="background:#30a46c">${ic('phone')}</span>Accept</button></div></div>`;
    try { navigator.vibrate && navigator.vibrate([600, 400, 600, 400, 600]); } catch (e) { /* no vibration */ }
  }, 5000);
}
function callAccept() {
  let s = 0;
  $('#callLayer').innerHTML = `<div class="call"><p style="opacity:.7" id="callT">00:00</p><div><span class="av">M</span><div class="who">Mom</div><p style="opacity:.8;margin-top:10px;max-width:260px">Hold the phone to your ear and say "I'm coming now".</p></div>
    <div class="acts"><button data-act="call-end"><span class="c" style="background:#e5484d">${ic('end')}</span>End call</button></div></div>`;
  clearInterval(callT); callT = setInterval(() => { s++; const e = $('#callT'); if (e) e.textContent = mmss(s); }, 1000);
}

/* ---------------- actions ---------------- */
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const [a, arg] = el.dataset.act.split(/:(.*)/s);
  try {
    switch (a) {
      case 'welcome': return doWelcome();
      case 'mode': if (S.mode !== arg) { S.mode = arg; S.auto = false; ls.set('auto', '0'); ls.set('mode', arg); applyMode(); render(); toast(arg === 'night' ? 'Night mode on. Safety tools come first.' : 'Day mode on.', arg === 'night' ? 'moon' : 'sun'); } return;
      case 'tab': closeSheet(); return go(arg);
      case 'close': return closeSheet();
      case 'pick-one': el.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === el)); return;
      case 'group-new': return newGroupSheet();
      case 'group-join': return joinSheet();
      case 'group-create': { const n = $('#gName').value.trim(); if (!n) return toast('Give the group a name', 'alert'); const h = picked('#gHours'); return createGroup(n, h ? +h : null); }
      case 'group-join-go': { const c = $('#jCode').value.trim(); if (c.length < 6) return toast('The code has 6 characters', 'alert'); return joinGroup(c); }
      case 'invite': return inviteSheet();
      case 'copy-link': { const v = $('#inviteLink').value; try { await navigator.clipboard.writeText(v); toast('Link copied'); } catch (err) { $('#inviteLink').select(); toast('Select and copy the link', 'link'); } return; }
      case 'share-link': { const v = $('#inviteLink').value; if (navigator.share) { try { await navigator.share({ title: 'Join me on Sis', text: `Join "${S.group.name}" on Sis so we can look out for each other.`, url: v }); } catch (err) { /* share cancelled */ } } else { try { await navigator.clipboard.writeText(v); toast('Link copied'); } catch (err) { $('#inviteLink').select(); } } return; }
      case 'select-group': await selectGroup(arg); S.tab = 'home'; render(); return;
      case 'leave-group': return leaveGroup(arg);
      case 'home': if (needGroup()) return; if (!await updateMe({ status: 'home', walk_deadline: null, walk_to: null, sos: false, place: null })) return; stopSharing(true); render(); toast("Home status saved to your group", 'home'); return;
      case 'ok': if (!await updateMe({ walk_deadline: null, walk_to: null })) return; render(); toast("OK status saved to your group"); return;
      case 'add5': { const me = myRow(); const base = Math.max(Date.now(), new Date(me.walk_deadline).getTime()); if (!await updateMe({ walk_deadline: new Date(base + 5 * 60000).toISOString() })) return; render(); toast('Added 5 minutes', 'clock'); return; }
      case 'walk': if (needGroup()) return; return walkSheet();
      case 'walk-go': { const min = +(picked('#wMin') || 15), to = $('#wTo').value.trim() || 'Home'; closeSheet(); await updateMe({ status: 'on_way', walk_to: to, place: null, walk_deadline: new Date(Date.now() + min * 60000).toISOString() }); if (shareRule('trips')) startSharing(true); render(); $('#main').scrollTop = 0; toast('Your group is with you', 'nav'); return; }
      case 'share': if (needGroup()) return; if (myRow()?.sharing || S.watchId != null) { stopSharing(true); toast('Location sharing is off', 'lock'); } else startSharing(false); if (S.tab === 'me') render(); return;
      case 'share-rule': ls.set('share.' + arg, shareRule(arg) ? '0' : '1'); if (arg === 'night') S.nightShared = false; return render();
      case 'noop': return;
      case 'call-112': toast('Demo: in the real app this calls 112', 'phone'); return;
      case 'sos-safe': closeSheet(); if (!await updateMe({ sos: false })) return; render(); toast("Your group can see you're safe"); return;
      case 'sos-cancel': if (!await updateMe({ sos: false })) return; render(); toast("Your group can see you're safe"); return;
      case 'nearby': return sisDemoStart();
      case 'safe-places': return safePlacesSheet();
      case 'fakecall': return fakeCall();
      case 'call-accept': return callAccept();
      case 'call-end': clearInterval(callT); $('#callLayer').innerHTML = ''; return;
      case 'notify': if ('Notification' in window && Notification.permission === 'default') { const r = await Notification.requestPermission(); toast(r === 'granted' ? 'Alerts are on' : 'Alerts stay off', r === 'granted' ? 'bell' : 'alert'); render(); } else if (!('Notification' in window)) toast('Add Sis to your home screen to get alerts', 'bell'); return;
      case 'arrived': if (needGroup()) return; return arrivedSheet();
      case 'arrived-go': { const place = $('#aPlace').value.trim() || 'Arrived safely', withLoc = $('#aLoc').checked; closeSheet(); let patch = { status: 'out', place, walk_deadline: null, walk_to: null }; if (withLoc) { const p = await locateOnce(); if (p) patch = { ...patch, ...p, located_at: new Date().toISOString() }; else toast('Could not get your location', 'alert'); } await updateMe(patch); render(); toast('Your group knows you arrived'); return; }
      case 'date': if (needGroup()) return; return dateSheet();
      case 'date-go': { const who = $('#dWho').value.trim(), where = $('#dWhere').value.trim(), [hh, mm] = ($('#dTime').value || '22:00').split(':').map(Number); const d = new Date(); d.setHours(hh, mm, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); const live = $('#dLoc').checked; closeSheet(); await updateMe({ status: 'out', place: where || null, walk_to: `Date${who ? ' with ' + who : ''}`, walk_deadline: d.toISOString() }); if (live) startSharing(true); render(); toast(`Check-in set for ${fmtTime(d)}`, 'heart'); return; }
      case 'ride': if (needGroup()) return; return rideSheet();
      case 'ride-go': { const plate = $('#rPlate').value.trim().toUpperCase(), to = $('#rTo').value.trim() || 'Home', min = +(picked('#rMin') || 20); closeSheet(); await updateMe({ status: 'on_way', place: plate ? `Taxi ${plate}` : 'In a taxi', walk_to: to, walk_deadline: new Date(Date.now() + min * 60000).toISOString() }); if (shareRule('trips')) startSharing(true); render(); toast('Your group is following your ride', 'car'); return; }
      case 'trip': S.seg = 'trips'; return go('sisterhood');
      case 'filter': S.placeFilter = arg; document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.act === 'filter:' + arg)); $('#placeList').innerHTML = placeListHTML(); updatePlacesMap(); return;
      case 'place': return placeSheet(arg);
      case 'add-place': return addPlaceSheet();
      case 'place-here': { $('#pWhere').textContent = 'Finding you…'; const p = await locateOnce(); if (!p) { $('#pWhere').textContent = 'Could not get your location. Pick on the map instead.'; return; } S.pendingPlace = p; $('#pWhere').innerHTML = `${ic('check')} Your current spot`; return; }
      case 'place-pick': { S.draftPlace = { name: $('#pName').value, kind: $('#pKind').value, area: $('#pArea').value }; closeSheet(); if (S.tab !== 'places') await go('places'); S.addMode = true; toast('Tap the map where the place is', 'pin'); return; }
      case 'place-save': {
        const name = $('#pName').value.trim(); if (!name) return toast('Add the name', 'alert'); if (!S.pendingPlace) return toast('Set where it is', 'alert');
        const { data, error } = await sb.from('places').insert({ name, kind: $('#pKind').value, area: $('#pArea').value.trim() || null, lat: S.pendingPlace.lat, lng: S.pendingPlace.lng }).select('*, reviews(*)').single();
        if (error) return fail(error);
        S.places.unshift(data); S.pendingPlace = null; S.draftPlace = null; if (S.tab === 'places') { $('#placeList').innerHTML = placeListHTML(); updatePlacesMap(); }
        toast('Place added. Now add your safety note.', 'pin'); return reviewSheet(data.id);
      }
      case 'review': return reviewSheet(arg);
      case 'feel': S.review.feel = arg; el.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === el)); return;
      case 'rtag-good': case 'rtag-bad': { const set = a === 'rtag-good' ? S.review.good : S.review.bad; el.classList.toggle('on'); set.has(arg) ? set.delete(arg) : set.add(arg); return; }
      case 'review-save': {
        if (!S.review.feel) return toast('Pick how it felt first', 'alert');
        const { error } = await sb.from('reviews').upsert({ place_id: S.review.id, user_id: S.user.id, author: S.name, feel: S.review.feel, good: [...S.review.good], bad: [...S.review.bad], body: $('#rText').value.trim() || null }, { onConflict: 'place_id,user_id' });
        if (error) return fail(error);
        const id = S.review.id; await loadPlaces(); placeSheet(id); toast('Thank you. You just helped other women choose.', 'heart'); return;
      }
      case 'seg': S.seg = arg; return render();
      case 'join-circle': { const { error } = await sb.from('circle_members').insert({ circle_id: arg, user_id: S.user.id }); if (error) return fail(error); await loadSisterhood(); toast('Welcome to the circle!', 'users'); return; }
      case 'leave-circle': { const { error } = await sb.from('circle_members').delete().eq('circle_id', arg).eq('user_id', S.user.id); if (error) return fail(error); await loadSisterhood(); toast('You left the circle'); return; }
      case 'new-circle': return newCircleSheet();
      case 'circle-save': {
        const name = $('#cName').value.trim(); if (!name) return toast('Give the circle a name', 'alert');
        const { data, error } = await sb.from('circles').insert({ name, emoji: picked('#cEmoji') || '💜', description: $('#cDesc').value.trim() || null, next_meetup: $('#cNext').value.trim() || null }).select().single();
        if (error) return fail(error);
        await sb.from('circle_members').insert({ circle_id: data.id, user_id: S.user.id }); closeSheet(); await loadSisterhood(); toast('Circle created', 'users'); return;
      }
      case 'post-trip': return postTripSheet();
      case 'trip-save': {
        const to = $('#tTo').value.trim(); if (!to) return toast('Where are you going?', 'alert');
        const { error } = await sb.from('trips').insert({ author: S.name, destination: to, dates: $('#tWhen').value.trim() || null, note: $('#tNote').value.trim() || null });
        if (error) return fail(error); closeSheet(); await loadSisterhood(); toast('Trip posted', 'globe'); return;
      }
      case 'del-trip': { const { error } = await sb.from('trips').delete().eq('id', arg); if (error) return fail(error); await loadSisterhood(); return; }
      case 'edit-profile': return profileSheet();
      case 'profile-save': {
        const name = $('#eName').value.trim(), phone = $('#ePhone').value.trim() || null; if (!name) return toast('Add your first name', 'alert');
        const { error } = await sb.from('profiles').update({ name, phone }).eq('id', S.user.id); if (error) return fail(error);
        await sb.from('group_members').update({ name, phone }).eq('user_id', S.user.id);
        S.name = name; S.phone = phone || ''; ls.set('name', name); closeSheet(); await fetchMembers(); render(); toast('Saved'); return;
      }
      case 'toggle-auto': S.auto = !S.auto; ls.set('auto', S.auto ? '1' : '0'); if (S.auto) S.mode = autoMode(); return render();
      case 'signout': if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to sign out. Your groups stay, but this device forgets you.'; return; } stopSharing(true); await sb.auth.signOut(); location.reload(); return;
    }
  } catch (err) { fail(err); }
});

/* ---------------- ticking: timers, overdue checks, auto mode ---------------- */
let lastPhase = null;
function tick() {
  const me = myRow();
  if (me?.walk_deadline) {
    const dl = new Date(me.walk_deadline).getTime(), now = Date.now();
    const phase = now < dl ? 'walking' : now < dl + 60000 ? 'confirm' : 'alerted';
    if (phase !== lastPhase) { lastPhase = phase; if (phase === 'confirm') { beep(); try { navigator.vibrate && navigator.vibrate([400, 200, 400]); } catch (e) { /* no vibration */ } } refreshLive(); }
    const t = $('#walkTime'); if (t) t.textContent = mmss((dl - now) / 1000);
    const c = $('#confirmTime'); if (c) c.textContent = mmss((dl + 60000 - now) / 1000);
  } else lastPhase = null;
  if (Date.now() % 5000 < 1000) { checkAlerts(); if (S.tab === 'home') { const bn = $('#banners'); if (bn) bn.innerHTML = bannersHTML(); } renderTabs(); }
  if (groupEnded() && S.watchId != null) { stopSharing(true); toast('Night out ended. Location sharing is off.', 'lock'); render(); }
  if (S.auto && Date.now() % 30000 < 1000) { const m = autoMode(); if (m !== S.mode) { S.mode = m; render(); } }
}

init();
