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
function ago(ts) { if (!ts) return ''; const m = Math.round((Date.now() - new Date(ts)) / 60000); if (m < 1) return 'just now'; if (m < 60) return `${m} min ago`; const h = Math.round(m / 60); if (h < 24) return `${h} h ago`; const d = Math.floor(m / 1440); if (d === 1) return 'yesterday'; if (d < 7) return `${d} days ago`; return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
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
  places: [], placeFilter: 'All', q: '', events: [], threads: [], seg: 'events', admin: false, adminChecked: false,
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
function openSheet(html) { if (window.sisStopNearbyDemo) window.sisStopNearbyDemo(); $('#sheet').innerHTML = '<div class="grab"></div>' + html; $('#sheet').classList.toggle('full', html.includes('class="chat"')); $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); $('#sheet').scrollTop = 0; }
function closeSheet() { clearInterval(S.chatT); const wasChat = !!S.chat; S.chat = null; if (wasChat) setTimeout(() => { try { render(); } catch (e) { /* ignore */ } }, 0); if (window.sisStopNearbyDemo) window.sisStopNearbyDemo(); $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on'); S.addMode = false; }
const sheetHead = (title) => `<div class="row between"><h2>${title}</h2><button class="btn ghost sm" data-act="close" aria-label="Close">${ic('x')}</button></div>`;
function fail(e) { console.error(e); toast(e?.message ? `Something went wrong: ${e.message}` : 'Something went wrong. Try again.', 'alert'); }

/* ---------------- demo data: opens without sign-up (add ?live=1 for the real database) ---------------- */
// config.js mode: 'demo' (the public demo, never signs in) or 'live' (the tester app with Google sign-in).
const SIS_MODE = (window.SIS_CONFIG || {}).mode;
const LIVE = SIS_MODE === 'live' || (SIS_MODE !== 'demo' && /[?&](live|join)=/.test(location.search));
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
      member('g1', 'u-reem', 'Nika', { status: 'on_way', walk_to: 'Home', walk_deadline: iso(38), sharing: true, ...at(120, -90), accuracy: 12, located_at: iso(-1) }),
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
    events: [
      { id: 'e1', created_by: 'u-kati', organizer: 'Kati', title: 'Sunday walk in Kadriorg', kind: 'walk', starts_at: iso(2 * 1440), place: 'Kadriorg Park, main entrance', capacity: 10, description: 'Easy 5 km, all paces welcome. Coffee afterwards.', created_at: iso(-300) },
      { id: 'e2', created_by: 'u-liis', organizer: 'Liis', title: 'Book club: first meeting', kind: 'meetup', starts_at: iso(4 * 1440), place: 'Café Lumi, Kalamaja', capacity: 8, description: 'One book a month, tea or wine.', created_at: iso(-200) },
      { id: 'e3', created_by: 'u-kati', organizer: 'Kati', title: 'Weekend in Riga', kind: 'trip', starts_at: iso(9 * 1440), place: 'Riga, bus from Tallinn', capacity: null, description: 'Christmas market and a spa day. Looking for company.', created_at: iso(-100) }
    ],
    event_members: [],
    threads: [
      { id: 'th1', created_by: 'u-kati', author: 'Kati', title: 'Safe ways to get home after a late event?', body: 'What do you do when the last tram is gone? Taxi apps, walking with a friend, something else?', created_at: iso(-1500), last_reply_at: iso(-200) },
      { id: 'th2', created_by: 'u-liis', author: 'Liis', title: 'New in Tallinn: where do you meet people?', body: null, created_at: iso(-3000), last_reply_at: iso(-2600) }
    ],
    thread_replies: [
      { id: 'tr1', thread_id: 'th1', created_by: 'u-maria', author: 'Maria', body: 'I share my ride with my group and text when I am home.', created_at: iso(-900) },
      { id: 'tr2', thread_id: 'th1', created_by: 'u-sofia', author: 'Sofia', body: 'Walk me home with a friend on the phone works for me.', created_at: iso(-200) },
      { id: 'tr3', thread_id: 'th2', created_by: 'u-kati', author: 'Kati', body: 'The Sunday walk in Kadriorg is a good start.', created_at: iso(-2600) }
    ],
    hazards: [
      { id: 'hz1', kind: 'lighting', note: 'Street lamps out behind the park', ...at(250, -120), created_at: iso(-60 * 24 * 3), expires_at: iso(60 * 24 * 27) },
      { id: 'hz2', kind: 'group', note: 'Loud group outside the bar', ...at(-60, 140), created_at: iso(-40), expires_at: iso(140) },
      { id: 'hz3', kind: 'empty', note: 'Very quiet after 22:00', ...at(320, 260), created_at: iso(-60 * 24 * 10), expires_at: iso(60 * 24 * 20) },
      { id: 'hz4', kind: 'following', note: null, ...at(-300, -200), created_at: iso(-25), expires_at: iso(155) }
    ],
    hazard_votes: []
  };
  ['p1', 'p2', 'p5', 'p7'].forEach((id) => { T.places.find((x) => x.id === id).badge = true; });
  [['e1', ['Kati', 'Maria', 'Sofia']], ['e2', ['Liis']], ['e3', ['Kati']]].forEach(([eid, names]) => names.forEach((n) => T.event_members.push({ event_id: eid, user_id: 'u-' + n.toLowerCase() + eid, name: n })));

  /* richer demo data: a lived-in account */
  const myName = ls.get('name') || 'Jana';
  T.group_members.push(
    member('g1', 'u-mia', 'Mia', { place: 'Café Lumi', sharing: true, ...at(90, 170), accuracy: 14, located_at: iso(-2) }),
    member('g1', 'u-sofia', 'Sofia', { place: 'Gym' }),
    member('g2', 'u-mia', 'Mia', { place: 'Kuu Bar', sharing: true, ...at(-10, 60), accuracy: 12, located_at: iso(-4) })
  );
  T.places.push(place('p9', 'Balti jaam station', 'Transport', 'Kalamaja', 290, -500), place('p10', 'Noblessner promenade', 'Street', 'Kalamaja', 520, -1250), place('p11', 'Café Kohv & Raamat', 'Café', 'Rotermann', 380, 720));
  T.reviews.push(
    review('p9', 'Mari', 'safe', ['Well-lit street', 'Taxi or transport nearby'], [], 'Busy and bright until late, felt calm even at 21:00.', 500),
    review('p9', 'Anna', 'mixed', ['Taxi or transport nearby'], ['Crowded exit'], 'Watch your bag in rush hour.', 2600),
    review('p10', 'Kadri', 'safe', ['Well-lit street', 'Women-friendly crowd'], [], 'Lovely evening walk by the sea, lots of people around.', 1700),
    review('p11', 'Liis', 'safe', ['Staff responsive', 'Women-friendly crowd'], [], 'Calm corner for a book, staff were really kind.', 900),
    review('p11', 'Sofia', 'safe', ['Well-lit street'], [], '', 3300)
  );
  ['p9', 'p10'].forEach((id) => { T.places.find((x) => x.id === id).badge = true; });
  T.events.push(
    { id: 'e4', created_by: 'u-mia', organizer: 'Mia', title: 'Evening walk, Kalamaja', kind: 'walk', starts_at: iso(26 * 60), place: 'Balti jaam, main entrance', capacity: 8, description: 'Tea at the market, then a slow walk through Kalamaja. We walk home together after.', created_at: iso(-400) },
    { id: 'e5', created_by: 'u-nika', organizer: 'Nika', title: 'Yoga in the park', kind: 'meetup', starts_at: iso(3 * 1440 + 600), place: 'Kadriorg, rose garden', capacity: 12, description: 'Beginners welcome, bring a mat.', created_at: iso(-700) },
    { id: 'e6', created_by: 'u-anna', organizer: 'Anna', title: 'Board games night', kind: 'meetup', starts_at: iso(6 * 1440 + 300), place: 'Café Lumi, Kalamaja', capacity: 10, description: 'Snacks, games and good company.', created_at: iso(-90) }
  );
  [['e1', ['Anna', 'Nika']], ['e4', ['Mia', 'Sofia', 'Anna', 'Kati']], ['e5', ['Nika', 'Mari']], ['e6', ['Anna', 'Liis', 'Kadri']]].forEach(([eid, names]) => names.forEach((n) => T.event_members.push({ event_id: eid, user_id: 'u-' + n.toLowerCase() + eid, name: n })));
  ['e1', 'e4'].forEach((eid) => T.event_members.push({ event_id: eid, user_id: 'me', name: myName }));
  const em = (id, eid, by, author, body, min, reply) => ({ id, event_id: eid, created_by: by, author, body, reply_to: reply || null, created_at: iso(-min) });
  T.event_messages = [
    em('em1', 'e4', 'u-mia', 'Mia', 'We meet at the main entrance at 19:00. Who is bringing tea?', 300),
    em('em2', 'e4', 'u-sofia', 'Sofia', 'I will! Thermos for everyone.', 280),
    em('em3', 'e4', 'me', myName, 'Perfect, I will bring cookies.', 250, 'em1'),
    em('em4', 'e4', 'u-anna', 'Anna', 'Walking home together after? I live near Telliskivi.', 120),
    em('em5', 'e4', 'u-mia', 'Mia', 'Yes! We will share our walks in sis. so everyone gets home safe.', 90, 'em4'),
    em('em6', 'e4', 'u-kati', 'Kati', 'Count me in, see you there.', 30),
    em('em7', 'e1', 'u-kati', 'Kati', 'Easy pace, we stop for coffee at the Kadriorg café.', 600),
    em('em8', 'e1', 'u-nika', 'Nika', 'Can I bring my dog?', 400),
    em('em9', 'e1', 'u-kati', 'Kati', 'Of course, dogs are very welcome.', 380, 'em8'),
    em('em10', 'e1', 'u-anna', 'Anna', 'Weather looks good for Sunday!', 60)
  ];
  T.threads.push(
    { id: 'th3', created_by: 'u-mari', author: 'Mari', title: 'Favourite cafés that stay open late?', body: 'Looking for calm places to sit with a book after 21:00.', created_at: iso(-500), last_reply_at: iso(-60) },
    { id: 'th4', created_by: 'u-nika', author: 'Nika', title: 'Self-defence classes in Tallinn', body: null, created_at: iso(-4000), last_reply_at: iso(-1000) }
  );
  T.thread_replies.push(
    { id: 'tr4', thread_id: 'th3', created_by: 'u-kadri', author: 'Kadri', body: 'Café Lumi is open until 23:00 and the staff are lovely.', created_at: iso(-300) },
    { id: 'tr5', thread_id: 'th3', created_by: 'u-liis', author: 'Liis', body: 'Seconded! The window seats are the best.', created_at: iso(-60) },
    { id: 'tr6', thread_id: 'th4', created_by: 'u-sofia', author: 'Sofia', body: 'I went to a beginners class near Telliskivi, it was great.', created_at: iso(-1000) }
  );
  T.thread_pins = [{ thread_id: 'th3', user_id: 'me' }];
  T.hazards.push(
    { id: 'hz5', kind: 'lighting', note: 'Dark underpass near the station', ...at(150, -380), created_at: iso(-60 * 24 * 2), expires_at: iso(60 * 24 * 28) },
    { id: 'hz6', kind: 'group', note: null, ...at(210, 310), created_at: iso(-70), expires_at: iso(110) }
  );
  T.dm_threads = [{ id: 'd1', other: 'u-kati', other_name: 'Kati' }, { id: 'd2', other: 'u-nika', other_name: 'Nika' }];
  const dmm = (id, dm, by, body, min) => ({ id, dm_id: dm, created_by: by, body, reply_to: null, created_at: iso(-min) });
  T.dm_messages = [
    dmm('dm1', 'd1', 'u-kati', 'Hi! Are you joining the Kadriorg walk on Sunday?', 180),
    dmm('dm2', 'd1', 'me', 'Yes, see you at the entrance!', 170),
    dmm('dm3', 'd1', 'u-kati', 'Wonderful, I will save you a coffee.', 160),
    dmm('dm4', 'd2', 'u-nika', 'Home safe, thank you for walking with me.', 1500),
    dmm('dm5', 'd2', 'me', 'Sleep well!', 1490)
  ];
  let seq = 0;
  const newId = () => 'x' + (++seq) + Math.random().toString(36).slice(2, 6);
  const code = () => Math.random().toString(16).slice(2, 8).toUpperCase();
  function expand(table, row, sel) {
    const r = { ...row };
    if (table === 'group_members' && /groups\(/.test(sel)) r.groups = T.groups.find((g) => g.id === row.group_id) || null;
    if (table === 'places' && /reviews/.test(sel)) r.reviews = T.reviews.filter((x) => x.place_id === row.id).map((x) => ({ ...x }));
    if (table === 'threads' && /thread_replies/.test(sel)) r.thread_replies = T.thread_replies.filter((x) => x.thread_id === row.id).map((x) => ({ id: x.id }));
    if (table === 'events' && /event_members/.test(sel)) r.event_members = T.event_members.filter((x) => x.event_id === row.id).map((x) => ({ user_id: x.user_id, name: x.name }));
    return r;
  }
  function run(st) {
    const match = (row) => st.filters.every(([k, v]) => row[k] === v);
    const rows = T[st.table] || (T[st.table] = []);
    let out;
    if (st.op === 'insert') {
      out = [].concat(st.payload).map((p) => ({ id: newId(), created_at: new Date().toISOString(), user_id: 'me', ...p }));
      rows.push(...out);
      if (st.table === 'hazards') out.forEach((r) => { r.expires_at = new Date(Date.now() + (['lighting', 'empty'].includes(r.kind) ? 30 * 864e5 : 3 * 36e5)).toISOString(); });
      if (st.table === 'thread_replies') out.forEach((r) => { const th = T.threads.find((x) => x.id === r.thread_id); if (th) th.last_reply_at = r.created_at; });
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
    if (st.table === 'hazard_votes' && st.op === 'upsert') out.forEach((v) => { if (T.hazard_votes.filter((x) => x.hazard_id === v.hazard_id && x.still === false).length >= 2) T.hazards = T.hazards.filter((h) => h.id !== v.hazard_id); });
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
  const offsets = { 'u-reem': [120, -90], 'u-swathi': [-180, 160], 'u-mia': [90, 170] };
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
      if (name === 'join_event') {
        const ev = T.events.find((x) => x.id === a.p_event);
        if (!ev) return { data: null, error: { message: 'event not found' } };
        const there = T.event_members.some((m) => m.event_id === ev.id && m.user_id === 'me');
        if (!there && ev.capacity && T.event_members.filter((m) => m.event_id === ev.id).length >= ev.capacity) return { data: null, error: { message: 'event is full' } };
        if (!there) T.event_members.push({ event_id: ev.id, user_id: 'me', name: a.p_name });
        return { data: null, error: null };
      }
      if (name === 'my_dms') {
        const rows = T.dm_threads.map((t) => { const ms = T.dm_messages.filter((m) => m.dm_id === t.id).sort((x, y) => (x.created_at > y.created_at ? 1 : -1)); const l = ms[ms.length - 1]; return { id: t.id, other: t.other, other_name: t.other_name, last_body: l ? l.body : null, last_at: l ? l.created_at : new Date().toISOString() }; });
        rows.sort((x, y) => (x.last_at < y.last_at ? 1 : -1));
        return { data: rows, error: null };
      }
      if (name === 'search_people') {
        const q = String(a.p_q || '').trim().toLowerCase(), seen = {};
        [...T.event_members, ...T.group_members].forEach((m) => { if (m.user_id && m.user_id !== 'me' && m.name && !Object.values(seen).includes(m.name)) seen[m.user_id] = m.name; });
        return { data: q.length < 2 ? [] : Object.entries(seen).filter(([, n]) => n.toLowerCase().includes(q)).slice(0, 10).map(([id, n]) => ({ id, name: n })), error: null };
      }
      if (name === 'start_dm') {
        let t = T.dm_threads.find((x) => x.other === a.p_other);
        if (!t) { const nm = String(a.p_other).replace(/^u-/, '').replace(/e\d+$/, ''); t = { id: newId(), other: a.p_other, other_name: nm.charAt(0).toUpperCase() + nm.slice(1) }; T.dm_threads.push(t); }
        return { data: t.id, error: null };
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

function renderWelcome(user) {
  $('#tabs').hidden = true;
  const head = `<div class="logo-big">${LOGO(120, 86)}</div>
    <div class="stack"><p class="eyebrow">Sis · beta</p><h1>Step out bravely, with people you trust</h1>
    <p class="muted">Check in on each other, pick places other women rate as safe, and find your circle. Day and night.</p></div>`;
  const beta = `<div class="note info">${ic('shieldok')}<span>This is a test version. sis. is not an emergency service: if you are in danger, call 112.</span></div><p class="small muted">By continuing you agree to our <a href="../privacy/" target="_blank" rel="noopener">privacy policy</a>.</p>`;
  if (!user) {
    $('#main').innerHTML = `<section class="screen" style="padding-top:12px">${head}
    <button class="btn block" data-act="google">Continue with Google</button>${beta}</section>`;
    return;
  }
  const meta = user.user_metadata || {};
  const guess = ls.get('name') || String(meta.full_name || meta.name || '').split(' ')[0];
  $('#main').innerHTML = `<section class="screen" style="padding-top:12px">${head}
    <div class="field"><label for="wName">Your first name</label><input id="wName" maxlength="40" autocomplete="given-name" placeholder="e.g. Jana" value="${esc(guess)}"></div>
    <div class="field"><label for="wPhone">Phone (optional, so your sisters can call you)</label><input id="wPhone" type="tel" maxlength="30" autocomplete="tel" placeholder="+372 ..."></div>
    <button class="btn block" data-act="welcome">Continue</button>${beta}
  </section>`;
}

async function doGoogle() {
  const join = new URLSearchParams(location.search).get('join');
  if (join) ls.set('pendingJoin', join);
  const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}${location.pathname}?live=1` } });
  if (error) fail(error);
}

async function doWelcome() {
  const name = $('#wName').value.trim(), phone = $('#wPhone').value.trim() || null;
  if (!name) return toast('Add your first name', 'alert');
  const btn = document.querySelector('[data-act="welcome"]'); btn.disabled = true;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return renderWelcome();
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
  if (!p) return renderWelcome(user);
  S.name = p.name; S.phone = p.phone || '';
  await loadGroups();
  const join = new URLSearchParams(location.search).get('join') || ls.get('pendingJoin');
  ls.set('pendingJoin', '');
  if (LIVE) history.replaceState(null, '', `${location.pathname}?live=1`);
  if (join) await joinGroup(join);
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
/* ---------------- auto "I'm home" when you reach your saved Home spot ---------------- */
const HOME_RADIUS_M = 75;
function checkArrivedHome(lat, lng, accuracy, speed) {
  const me = myRow();
  if (!me || me.status !== 'on_way' || !me.walk_deadline) { S.homeIn = null; return; }
  if (S.homeAsk || Date.now() < (S.homeSnooze || 0)) return;
  let home = null; try { home = JSON.parse(ls.get('home') || 'null'); } catch (e) { /* no home saved */ }
  if (!home || !Number.isFinite(home.lat) || !Number.isFinite(home.lng)) { S.homeIn = null; return; }
  if (!(accuracy <= 50)) return;
  if (distM({ lat, lng }, home) > HOME_RADIUS_M || (Number.isFinite(speed) && speed > 1.5)) { S.homeIn = null; return; }
  const now = Date.now();
  if (!S.homeIn) S.homeIn = { t: now, n: 0 };
  S.homeIn.n++;
  if (S.homeIn.n >= 3 && now - S.homeIn.t >= 25000) showHomeAsk();
}
function showHomeAsk() {
  const ph = document.getElementById('phone'); if (!ph || S.homeAsk) return;
  const el = document.createElement('div'); el.id = 'homeAsk'; el.className = 'homeask';
  let left = 30;
  const paint = () => { el.innerHTML = `<b>Looks like you're home</b><p class="small muted">Sharing stops and your circle is told in <b>${left}</b> s.</p><div class="row"><button class="btn safe" style="flex:1" data-act="home-now">I'm home</button><button class="btn ghost" data-act="home-wait">Not yet</button></div>`; };
  paint(); ph.appendChild(el);
  try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* no vibration */ }
  S.homeAsk = setInterval(() => {
    const me = myRow();
    if (!me || me.status !== 'on_way') { closeHomeAsk(); return; }
    left--; if (left <= 0) { arriveHome(true); return; }
    paint();
  }, 1000);
}
function closeHomeAsk() { clearInterval(S.homeAsk); S.homeAsk = null; S.homeIn = null; const el = document.getElementById('homeAsk'); if (el) el.remove(); }
async function arriveHome(auto) {
  closeHomeAsk();
  if (needGroup()) return;
  if (!await updateMe({ status: 'home', walk_deadline: null, walk_to: null, sos: false, place: null })) return;
  stopSharing(true); render();
  toast(auto ? "Looks like you're home. Your circle knows." : 'Home status saved to your group', 'home');
}
async function sendPos(pos) {
  if (S.watchId == null) return;
  const { latitude: lat, longitude: lng, accuracy } = pos.coords, now = Date.now();
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  checkArrivedHome(lat, lng, accuracy, pos.coords.speed);
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
function dismissedAlerts() { try { return new Set(JSON.parse(ls.get('dismissed') || '[]')); } catch (e) { return new Set(); } }
function dismissAlert(key) { const s = dismissedAlerts(); s.add(key); ls.set('dismissed', JSON.stringify([...s].slice(-50))); }
function alertsList() {
  const out = [], gone = dismissedAlerts();
  for (const m of others()) {
    let a = null;
    if (m.sos) a = { kind: 'sos', key: `sos:${m.user_id}:${m.sos_at}`, m };
    else if (overdue(m) && Date.now() < new Date(m.walk_deadline).getTime() + 6 * 3600000) a = { kind: 'late', key: `late:${m.user_id}:${m.walk_deadline}`, m };
    if (a && !gone.has(a.key)) out.push(a);
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
  return alertsList().map(({ kind, key, m }) => {
    const seen = m.lat != null ? `<button class="btn sm ${kind === 'sos' ? 'white' : ''}" data-act="see-member:${m.user_id}">${ic('pin')}See on map</button>` : '<span class="small">No location shared</span>';
    const call = m.phone ? `<a class="btn sm ${kind === 'sos' ? 'white' : 'ghost'}" href="tel:${esc(m.phone)}">${ic('phone')}Call ${esc(m.name)}</a>` : '';
    const ext = m.lat != null ? `<a class="tiny" href="${mapsLink(m.lat, m.lng)}" target="_blank" rel="noopener">Open in Maps</a>` : '';
    return `<div class="banner ${kind === 'late' ? 'late' : ''}" role="alert">
      <div class="row">${ic('alert')}<b>${kind === 'sos' ? `${esc(m.name)} sent an SOS` : `${esc(m.name)} hasn't checked in`}</b></div>
      <span class="small">${kind === 'sos' ? `${ago(m.sos_at)}${m.located_at ? ' · location updated ' + ago(m.located_at) : ''}` : `Due by ${fmtTime(m.walk_deadline)}${m.walk_to ? ' · ' + esc(m.walk_to) : ''}`}</span>
      <div class="row" style="flex-wrap:wrap">${seen}${call}</div>
      <div class="row" style="gap:14px">${ext}<button class="tiny" data-act="alert-hide:${esc(key)}">Dismiss</button></div></div>`;
  }).join('');
}

/* ---------------- maps ---------------- */
const maps = {};
function destroyMaps() { for (const k of Object.keys(maps)) { maps[k].map.remove(); delete maps[k]; } }
function mountMap(key, el) {
  if (!el || !window.L) return null;
  const map = L.map(el, { zoomControl: false, attributionControl: true }).setView(TALLINN, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
  el.classList.add('carto');
  const layer = L.layerGroup().addTo(map);
  maps[key] = { map, layer, fitted: false };
  setTimeout(() => { if (maps[key] && maps[key].map === map) map.invalidateSize(); }, 150);
  return maps[key];
}
function personIcon(name, color, sos) {
  return L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="mk ${sos ? 'sos' : ''}"><span class="pd" style="background:${color}">${esc(name[0]?.toUpperCase() || '?')}</span><span class="pl">${esc(name)}</span></div>` });
}
function updateGroupMap() {
  if (maps.around) updateHzMap();
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
/* ---------------- web push: alerts even when the app is closed ---------------- */
const VAPID_PUBLIC = (window.SIS_CONFIG || {}).vapidPublicKey || '';
const b64uToBytes = (s) => { const raw = atob((s + '='.repeat((4 - (s.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(raw, (c) => c.charCodeAt(0)); };
async function pushEnable() {
  if (!LIVE || !VAPID_PUBLIC || !S.user || !('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window) || Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker.register('sw.js');
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(VAPID_PUBLIC) });
    const j = sub.toJSON();
    const { error } = await sb.from('push_subscriptions').upsert({ user_id: S.user.id, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: 'endpoint' });
    if (error) throw error;
    return true;
  } catch (e) { console.warn('Push setup failed:', e); return false; }
}
function notifyPromptHTML() {
  if (!('Notification' in window) || Notification.permission !== 'default' || !S.gid) return '';
  return `<button class="note info" data-act="notify" style="text-align:left">${ic('bell')}<span>Turn on alerts so you hear it when a sister needs you</span></button>`;
}

/* ---------------- hazard marks (Waze-style) ---------------- */
const HZ = {
  lighting: { label: 'Bad lighting', color: '#C98A12', icon: 'moon' },
  group: { label: 'Drunk or aggressive group', color: '#CF3540', icon: 'users' },
  following: { label: 'Following or harassment', color: '#CF3540', icon: 'alert' },
  empty: { label: 'Empty street', color: '#6A3FD0', icon: 'pin' },
  other: { label: 'Something else', color: '#8A84A0', icon: 'bell' }
};
const hzLive = () => (S.hz || []).filter((h) => new Date(h.expires_at).getTime() > Date.now());
function hzLeft(h) {
  const m = Math.max(1, Math.round((new Date(h.expires_at).getTime() - Date.now()) / 60000));
  return m >= 2880 ? Math.round(m / 1440) + ' days' : m >= 90 ? Math.round(m / 60) + ' hours' : m + ' min';
}
async function loadHazards() {
  const [h, v] = await Promise.all([
    sb.from('hazards').select('id, kind, note, lat, lng, created_at, expires_at').limit(300),
    sb.from('hazard_votes').select('hazard_id, still').eq('user_id', S.user.id)
  ]);
  if (h.error) return console.error(h.error);
  S.hz = h.data || []; S.hzVotes = {};
  (v.data || []).forEach((x) => { S.hzVotes[x.hazard_id] = x.still; });
  if (LIVE && !S.adminChecked) { const a = await sb.rpc('is_admin'); S.admin = a.data === true; S.adminChecked = true; }
  updateHzMap();
}
async function hzLocate(quiet) {
  const p = await locateOnce(); if (!p) return null;
  S.hzMe = p; const M = maps.around;
  if (M && !quiet) M.map.setView([p.lat, p.lng], 15);
  updateHzMap(); return p;
}
function updateHzMap() {
  const M = maps.around; if (!M) return;
  M.layer.clearLayers();
  if (S.hzMe) L.circle([S.hzMe.lat, S.hzMe.lng], { radius: 300, color: '#7C4DFF', weight: 1.5, dashArray: '6 6', fillColor: '#7C4DFF', fillOpacity: 0.05, interactive: false }).addTo(M.layer);
  if (S.hzMe) L.circleMarker([S.hzMe.lat, S.hzMe.lng], { radius: 8, color: '#fff', weight: 2, fillColor: '#7C4DFF', fillOpacity: 1 }).addTo(M.layer);
  for (const m of others()) { if (m.lat != null) L.marker([m.lat, m.lng], { icon: personIcon(m.name, colorFor(m.name), m.sos), title: m.name, interactive: false }).addTo(M.layer); }
  const hm = getHome();
  if (hm) L.marker([hm.lat, hm.lng], { icon: L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="mk"><span class="pd hzpin" style="background:var(--accent)">${ic('home')}</span></div>` }), interactive: false }).addTo(M.layer);
  for (const h of hzLive()) {
    const k = HZ[h.kind] || HZ.other;
    const icon = L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="mk"><span class="pd hzpin" style="background:${k.color}">${ic(k.icon)}</span></div>` });
    L.marker([h.lat, h.lng], { icon, title: k.label }).on('click', () => hzInfoSheet(h.id)).addTo(M.layer);
  }
}
function hzMount() {
  const M = mountMap('around', $('#aroundMap')); if (!M) return;
  M.map.setView(S.hzMe ? [S.hzMe.lat, S.hzMe.lng] : TALLINN, 15);
  if (!S.hzMe && !S.hzAsked) { S.hzAsked = true; hzLocate(); }
  M.map.on('click', (e) => { if (S.homePick) { S.homePick = false; ls.set('home', JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })); updateHzMap(); toast('Home saved on this phone only', 'home'); return; } if (S.hzPick && S.hzDraft) { S.hzPick = false; S.hzDraft.pt = { lat: e.latlng.lat, lng: e.latlng.lng }; hzSheet(); } });
  updateHzMap(); loadHazards();
}
function hzSheet() {
  const d = S.hzDraft || (S.hzDraft = { kind: null, note: '', pt: null });
  openSheet(`${sheetHead('Report something')}
    <p class="small muted">Tell other sisters what to watch out for. Marks fade on their own and show no names.</p>
    <div class="hzkinds">${Object.entries(HZ).map(([k, v]) => `<button class="hzk${d.kind === k ? ' on' : ''}" data-act="hz-kind:${k}"><span class="hzdot" style="background:${v.color}"></span>${v.label}</button>`).join('')}</div>
    <div class="field"><label for="hzNote">A few words (optional)</label><input id="hzNote" maxlength="80" placeholder="e.g. near the bus stop" value="${esc(d.note)}"></div>
    <div class="field"><span class="lab">Where?</span><p class="small" id="hzWhere">${d.pt ? ic('check') + ' Spot set' : 'Not set yet'}</p>
      <div class="row"><button class="btn ghost sm" data-act="hz-here">${ic('locate')}I'm here now</button><button class="btn ghost sm" data-act="hz-pick">${ic('pin')}Pick on map</button></div></div>
    <p class="small muted">Please don't write names or describe individuals. In an emergency call 112 or your local number: sis. does not replace emergency services.</p>
    <button class="btn block" data-act="hz-save">Add to the map</button>`);
}
function hzInfoSheet(id) {
  const h = (S.hz || []).find((x) => x.id === id); if (!h) return;
  const k = HZ[h.kind] || HZ.other, mine = (S.hzVotes || {})[id];
  openSheet(`${sheetHead(esc(k.label))}
    <p class="small muted">Reported ${ago(h.created_at)} · fades in ${hzLeft(h)}</p>
    ${h.note ? `<p>${esc(h.note)}</p>` : ''}
    <p><b>Is it still there?</b></p>
    <div class="row"><button class="btn grow${mine === true ? '' : ' ghost'}" data-act="hz-vote:${id}:1">Still here</button><button class="btn grow${mine === false ? '' : ' ghost'}" data-act="hz-vote:${id}:0">Gone now</button></div>
    <div class="row"><button class="btn ghost sm" data-act="report:hazard:${id}">Report</button>${S.admin ? `<button class="btn ghost sm" data-act="mod-del:hazard:${id}">Remove (moderator)</button>` : ''}</div>
    <p class="small muted">In an emergency call 112 or your local number.</p>`);
}
function aroundCardHTML() {
  return `<div class="card hzcard"><div class="hzmap"><div class="map big" id="aroundMap"></div>
    <button class="hzloc" data-act="around-locate" aria-label="Show my location">${ic('locate')}</button>
    <div class="hzbar${ls.get('hzcol') === '1' ? ' col' : ''}">
      <div class="hzmore">
        <button data-act="hz-new" aria-label="Report a hazard" title="Report">${ic('plus')}<span>Report</span></button>
        <button data-act="date" aria-label="Date check-in" title="Date check-in">${ic('heart')}<span>Date</span></button>
        <button data-act="ride" aria-label="Share my ride" title="Share my ride">${ic('car')}<span>Ride</span></button>
        <button data-act="fakecall" aria-label="Fake call" title="Fake call">${ic('phone')}<span>Fake call</span></button>
      </div>
      <button class="hzt" data-act="hz-fold" aria-label="Show or hide buttons"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <button class="hzwalk" data-act="walk">${ic('nav')}<span>Walk me home</span></button>
  </div></div>`;
}
function homeScreen() {
  return `<section class="screen homemap">
    <div id="banners" class="stack">${bannersHTML()}</div>
    <div id="myCard">${myCardHTML()}</div>
    ${aroundCardHTML()}
    ${notifyPromptHTML()}
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

function fmtWhen(d) { return new Date(d).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
const EVENT_KINDS = { meetup: 'Meetup', walk: 'Walk', trip: 'Trip' };
function upcomingEvents() { const cut = Date.now() - 3 * 3600e3; return S.events.filter((e) => new Date(e.starts_at).getTime() >= cut).sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)); }
function eventSpotsLeft(e) { return e.capacity ? Math.max(0, e.capacity - (e.event_members || []).length) : null; }
function eventCountLine(e) { const n = (e.event_members || []).length, left = eventSpotsLeft(e); return `${n} going${left !== null ? ` · ${left} ${left === 1 ? 'spot' : 'spots'} left` : ''}`; }
const STAR = (on) => `<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
/* ---------------- chat list: archive, delete, full-screen chats ---------------- */
const chatState = {
  get() { try { return JSON.parse(ls.get('chatstate') || '{}'); } catch (e) { return {}; } },
  set(o) { ls.set('chatstate', JSON.stringify(o)); }
};
function chatSt(id) { return chatState.get()[id] || {}; }
function chatPut(id, patch) { const o = chatState.get(); o[id] = { ...(o[id] || {}), ...patch }; chatState.set(o); }
function chatWhen(ts) {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) return fmtTime(d);
  const days = (now - d) / 864e5;
  if (days < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
const BACK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
const chatHead = (title, sub, who, extra) => `<div class="chathead"><button class="btn ghost sm" data-act="close" aria-label="Back">${BACK}</button>${who ? avatar(who) : ''}<div class="grow"><b>${title}</b>${sub ? `<span class="small muted">${sub}</span>` : ''}</div>${extra || ''}</div>`;
function chatRows() {
  const out = [];
  (S.dms || []).forEach((d) => {
    const st = chatSt(d.id), at = d.last_at ? new Date(d.last_at).getTime() : 0;
    if (st.d && at <= st.d) return;
    out.push({ key: d.id, kind: 'dm', act: `dm-open:${d.id}:${d.other}:${esc(d.other_name || 'Sister')}`, name: d.other_name || 'Sister', preview: d.last_body || 'Say hello', at, when: at ? chatWhen(at) : '', av: avatar(d.other_name || 'S'), unread: !!at && (st.s ? at > st.s : Date.now() - at < 864e5), archived: !!(st.a && at <= st.a) });
  });
  S.events.filter((e) => (e.event_members || []).some((x) => x.user_id === S.user.id)).forEach((e) => {
    const st = chatSt(e.id), t = new Date(e.starts_at);
    out.push({ key: e.id, kind: 'event', act: `event-chat:${e.id}`, name: e.title, preview: eventCountLine(e), at: 0, when: t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), av: `<div class="datebox"><b>${t.getDate()}</b><span>${t.toLocaleDateString('en-GB', { month: 'short' })}</span></div>`, unread: false, archived: !!st.a });
  });
  return out.sort((x, y) => (y.at || 0) - (x.at || 0));
}
function chatRowHTML(r) {
  return `<div class="crow" style="--w:${r.kind === 'dm' ? 168 : 84}px"><div class="cacts"><button class="ca arch" data-act="chat-arch:${r.key}">${r.archived ? 'Unarchive' : 'Archive'}</button>${r.kind === 'dm' ? `<button class="ca del" data-act="chat-del-row:${r.key}">Delete</button>` : ''}</div>
    <div class="cmain card ev" data-act="${r.act}" role="button" tabindex="0">${r.av}<div class="grow stack"><div class="row between"><h3>${esc(r.name)}</h3><span class="small muted">${r.when}</span></div><div class="row between"><p class="small muted cprev">${esc(r.preview)}</p>${r.unread ? '<span class="dot"></span>' : ''}</div></div><button class="more" data-act="chat-more" aria-label="Chat options">&middot;&middot;&middot;</button></div></div>`;
}
(function () {
  let row = null, x0 = 0, y0 = 0, dx = 0, lock = '';
  const W = () => (row ? row.parentNode.querySelector('.cacts').offsetWidth : 0);
  document.addEventListener('touchstart', (e) => {
    const m = e.target.closest && e.target.closest('.cmain');
    document.querySelectorAll('.crow.open').forEach((r) => { if (!m || r !== m.parentNode) r.classList.remove('open'); });
    if (!m) { row = null; return; }
    row = m; const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; dx = 0; lock = ''; row.classList.add('drag');
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!row) return; const t = e.touches[0], ddx = t.clientX - x0, ddy = t.clientY - y0;
    if (!lock && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) lock = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
    if (lock !== 'x') return; dx = ddx;
    const base = row.parentNode.classList.contains('open') ? -W() : 0;
    row.style.transform = `translateX(${Math.max(-W(), Math.min(0, base + dx))}px)`;
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!row) return; row.classList.remove('drag');
    if (lock === 'x') { const base = row.parentNode.classList.contains('open') ? -W() : 0; row.parentNode.classList.toggle('open', base + dx < -W() / 2); window.__swiped = Date.now(); }
    row.style.transform = ''; row = null;
  });
  document.addEventListener('click', (e) => {
    if (window.__swiped && Date.now() - window.__swiped < 400 && e.target.closest('.cmain')) { e.stopPropagation(); e.preventDefault(); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey || !e.target) return;
    const btn = { chatMsg: '[data-act="chat-send"]', bugMsg: '[data-act="bug-send"]', thReply: '[data-act^="reply-send"]' }[e.target.id];
    if (btn) { e.preventDefault(); const b = $('#sheet').querySelector(btn); if (b) b.click(); }
  });
})();
function sisterhoodScreen() {
  const seg = ['threads', 'chats'].includes(S.seg) ? S.seg : 'events', pins = S.pins || new Set();
  let body;
  if (seg === 'threads') {
    const ths = [...S.threads].sort((x, y) => (pins.has(y.id) ? 1 : 0) - (pins.has(x.id) ? 1 : 0));
    body = ths.length ? ths.map((th) => {
      const n = (th.thread_replies || []).length, on = pins.has(th.id);
      return `<div class="card ev" data-act="thread-open:${th.id}" role="button" tabindex="0"><div>${avatar(th.author)}</div>
        <div class="grow stack"><h3>${esc(th.title)}</h3>${th.body ? `<p class="small muted">${esc(th.body.length > 100 ? th.body.slice(0, 100) + '…' : th.body)}</p>` : ''}
        <p class="small muted">${esc(th.author)} · ${n ? `${n} ${n === 1 ? 'reply' : 'replies'}` : 'no replies yet'} · ${ago(th.last_reply_at)}</p></div>
        <button class="star${on ? ' on' : ''}" data-act="pin:${th.id}" aria-label="${on ? 'Remove from favourites' : 'Add to favourites'}">${STAR(on)}</button></div>`;
    }).join('') : `<div class="empty">${ic('users')}<b>It is quiet here</b><span class="small">Ask something, share a tip, say hi. Everyone here is kind.</span><button class="btn sm" data-act="new-thread">${ic('plus')}Start a topic</button></div>`;
  } else if (seg === 'chats') {
    const rows = chatRows(), live = rows.filter((r) => !r.archived), arch = rows.filter((r) => r.archived);
    body = '<button class="btn block" data-act="dm-new">' + ic('plus') + 'New chat</button>' +
      (arch.length ? `<button class="item archrow" data-act="chat-arch-show"><span class="grow"><span class="t">Archived chats</span><br><span class="s">${arch.length} ${S.showArch ? '· tap to hide' : '· tap to show'}</span></span></button>${S.showArch ? arch.map(chatRowHTML).join('') : ''}` : '') +
      (live.length ? live.map(chatRowHTML).join('') : `<div class="empty">${ic('users')}<b>No chats yet</b><span class="small">Tap New chat to message a sister privately. Event chats show up here when you join an event.</span></div>`);
  } else {
    const list = upcomingEvents();
    body = list.length ? list.map((e) => {
      const mine = (e.event_members || []).some((x) => x.user_id === S.user.id), left = eventSpotsLeft(e);
      const d = new Date(e.starts_at);
      const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const join = mine ? `<button class="pill safe" data-act="event-leave:${e.id}">${ic('check')}I'm in</button>`
        : left === 0 ? '<span class="pill">Full</span>' : `<button class="btn sm" data-act="event-join:${e.id}">I'm in</button>`;
      return `<div class="card ev" data-act="event-open:${e.id}" role="button" tabindex="0"><div class="datebox"><b>${d.getDate()}</b><span>${d.toLocaleDateString('en-GB', { month: 'short' })}</span></div>
        <div class="grow stack"><h3>${esc(e.title)}</h3><p class="small muted">${time}${e.place ? ' · ' + esc(e.place) : ''}</p>
        <div class="row between"><span class="small muted">${eventCountLine(e)}</span>${join}</div></div></div>`;
    }).join('') : `<div class="empty">${ic('users')}<b>No events yet</b><span class="small">Planning a walk, a coffee or a trip? Invite the others.</span><button class="btn sm" data-act="new-event:meetup">${ic('plus')}Add an event</button></div>`;
  }
  const act = seg === 'threads' ? ['new-thread', 'Topic'] : seg === 'events' ? ['new-event:meetup', 'Event'] : null;
  return `<section class="screen">
    <div><h1>Community</h1><p class="muted" style="margin-top:4px">Meet other women in person, or just talk.</p></div>
    <div class="seg">${[['events', 'Events'], ['threads', 'Topics'], ['chats', 'Chats']].map(([k, l]) => `<button class="${seg === k ? 'on' : ''}" data-act="seg:${k}">${l}</button>`).join('')}</div>
    <div class="stack">${body}</div>${act ? `<button class="fab" data-act="${act[0]}" aria-label="${act[1]}">${ic('plus')}</button>` : ''}</section>`;
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
      <div class="item"><span class="grow"><span class="t">Theme</span><br><span class="s">${S.auto ? 'Following sunset' : S.mode === 'night' ? 'Dark, set by you' : 'Light, set by you'}</span></span><span class="row"><button class="btn ghost sm" data-act="mode:day">Light</button><button class="btn ghost sm" data-act="mode:night">Dark</button></span></div>
      <div class="item"><span class="grow"><span class="t">Home</span><br><span class="s">${getHome() ? 'Saved on this phone only' : 'Suggests your walking time. Stays on this phone.'}</span></span><span class="row"><button class="btn ghost sm" data-act="home-here">I'm here</button><button class="btn ghost sm" data-act="home-pick">On map</button>${getHome() ? '<button class="btn ghost sm" data-act="home-clear">Clear</button>' : ''}</span></div>
      <button class="item" data-act="notify"><span class="grow"><span class="t">Alerts</span><br><span class="s">${notif === 'granted' ? 'On. You get a notification while Sis is open.' : notif === 'denied' ? 'Blocked in browser settings.' : notif === 'unsupported' ? 'Not supported in this browser. Add Sis to your home screen.' : 'Tap to turn on.'}</span></span>${notif === 'granted' ? `<span class="pill safe">${ic('check')}On</span>` : ''}</button>
    </div></div>
    <div class="list">
      <a class="item" href="../privacy/" target="_blank" rel="noopener"><span class="grow"><span class="t">Privacy policy</span><br><span class="s">What we keep and how to delete it</span></span></a>
      ${LIVE ? '<button class="item" data-act="bug-open"><span class="grow"><span class="t">Tester chat</span><br><span class="s">Report a bug and share a screenshot</span></span></button>' : ''}
      <a class="item" href="https://tally.so/r/4a7DrO" target="_blank" rel="noopener"><span class="grow"><span class="t">Tell us what you think</span><br><span class="s">Short and optional, it helps us a lot</span></span></a>
      <a class="item" href="mailto:sis.safetyapp@gmail.com"><span class="grow"><span class="t">Contact us</span><br><span class="s">sis.safetyapp@gmail.com</span></span></a>
    </div>
    ${LIVE ? '<button class="btn ghost block" data-act="signout">Sign out on this device</button><button class="btn ghost block" data-act="delete-account">Delete my account and data</button>' : ''}
  </section>`;
}

/* ---------------- tester chat: bugs and screenshots (live app only) ---------------- */
const BUG_BUCKET = 'bug-shots';
async function fetchBugs() {
  const r = await sb.from('bug_messages').select('*').order('created_at', { ascending: false }).limit(60);
  if (r.error) { fail(r.error); return null; }
  const rows = (r.data || []).reverse(), urls = {};
  const paths = rows.map((m) => m.image_path).filter(Boolean);
  if (paths.length) { const s = await sb.storage.from(BUG_BUCKET).createSignedUrls(paths, 3600); (s.data || []).forEach((x) => { if (x && x.signedUrl) urls[x.path] = x.signedUrl; }); }
  S.bugRows = rows;
  return { rows, urls };
}
function renderBugs(d, toEnd) {
  const draft = $('#bugMsg') ? $('#bugMsg').value : '', keep = $('#sheet').scrollTop;
  const list = d.rows.map((m) => {
    const mine = m.created_by === S.user.id, u = m.image_path ? d.urls[m.image_path] : null;
    const img = m.image_path ? (u ? `<a href="${esc(u)}" target="_blank" rel="noopener"><img class="bugimg" src="${esc(u)}" alt="Screenshot"></a>` : '<p class="small muted">Screenshot unavailable</p>') : '';
    const act = mine ? `<button class="tiny" data-act="bug-del:${m.id}">Delete</button>` : S.admin ? `<button class="tiny" data-act="bug-del:${m.id}">Remove (moderator)</button>` : '';
    return `<div class="bub${mine ? ' me' : ''}"><div class="who">${esc(mine ? 'You' : m.author || 'Tester')} · ${ago(m.created_at)}</div>${img}${m.body ? `<p>${esc(m.body)}</p>` : ''}${act}</div>`;
  }).join('');
  openSheet(`${chatHead('Tester chat', 'Report a bug, add a screenshot')}
    <p class="small muted">Found a bug or something confusing? Tell us and add a screenshot. Every tester and the team can see this chat, so please hide anything private.</p>
    <div class="chat">${list || '<p class="small muted" style="text-align:center">Nothing yet. Be the first.</p>'}</div>
    <div class="composer"><button class="btn ghost" data-act="bug-attach" aria-label="Add a screenshot">${ic('plus')}</button><input id="bugMsg" maxlength="500" placeholder="What happened?" aria-label="Message"><button class="btn" data-act="bug-send">Send</button></div>
    <p class="small muted" id="bugFile">${S.bugFile ? 'Screenshot added: ' + esc(S.bugFile.name) : ''}</p><input type="file" id="bugPick" accept="image/*" hidden>`);
  const inp = $('#bugMsg'); if (inp && draft) inp.value = draft;
  S.bugSig = d.rows.map((m) => m.id).join(',');
  $('#sheet').scrollTop = toEnd ? $('#sheet').scrollHeight : keep;
}
async function shrinkImage(file) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), 'image/jpeg', 0.82));
}
document.addEventListener('change', (e) => {
  if (!e.target || e.target.id !== 'bugPick') return;
  S.bugFile = (e.target.files && e.target.files[0]) || null;
  const f = $('#bugFile'); if (f) f.textContent = S.bugFile ? 'Screenshot added: ' + S.bugFile.name : '';
});

/* ---------------- render ---------------- */
function applyMode() {
  document.body.classList.toggle('night', S.mode === 'night');
  const gEl = document.getElementById('greet');
  if (gEl) { const h = new Date().getHours(); const w = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; const n = String(S.name || '').trim().split(' ')[0]; gEl.textContent = S.tab !== 'home' ? '' : n ? `${w}, ${n}` : w; }
  document.querySelector('meta[name="theme-color"]').setAttribute('content', S.mode === 'night' ? '#121022' : '#F7F5F2');
}
function render() {
  if (!S.user) return;
  applyMode(); destroyMaps();
  if (!S.pushTried) { S.pushTried = true; pushEnable(); }
  if (S.mode === 'night' && shareRule('night') && S.gid && S.watchId == null && !S.nightShared) { S.nightShared = true; startSharing(true); }
  const m = $('#main');
  m.innerHTML = S.tab === 'home' ? (homeScreen()) : S.tab === 'places' ? placesScreen() : S.tab === 'sisterhood' ? sisterhoodScreen() : meScreen();
  renderTabs();
  if (S.tab === 'home' && $('#groupMap')) { mountMap('group', $('#groupMap')); updateGroupMap(); }
  if (S.tab === 'home' && !LIVE && window.sisNearbyHome) window.sisNearbyHome.mount();
  if (S.tab === 'home' && $('#aroundMap')) hzMount();
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
      tab('sisterhood', 'users', 'Community') + tab('me', 'user', 'Me');
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
  const [e, th] = await Promise.all([
    sb.from('events').select('*, event_members(user_id, name)').order('starts_at').limit(100),
    sb.from('threads').select('*, thread_replies(id)').order('last_reply_at', { ascending: false }).limit(100)
  ]);
  if (e.error) return fail(e.error);
  if (th.error) return fail(th.error);
  S.events = e.data || []; S.threads = th.data || [];
  const pn = await sb.from('thread_pins').select('thread_id'); S.pins = new Set((pn.data || []).map((x) => x.thread_id));
  const dm = await sb.rpc('my_dms'); S.dms = dm.error ? [] : (dm.data || []);
  if (LIVE && !S.adminChecked) { const a = await sb.rpc('is_admin'); S.admin = a.data === true; S.adminChecked = true; }
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
function getHome() { try { return JSON.parse(ls.get('home') || 'null'); } catch (e) { return null; } }
function homeEta() {
  const h = getHome(), me = S.hzMe; if (!h || !me) return null;
  return Math.max(10, Math.min(120, Math.ceil(distM(me, h) * 1.3 / 80 / 5) * 5 + 5));
}
function walkSheet() {
  const eta = homeEta(), opts = [10, 15, 20, 30, 45]; if (eta && !opts.includes(eta)) { opts.push(eta); opts.sort((x, y) => x - y); }
  const def = eta || 15;
  const hint = eta ? `<p class="small">About ${eta - 5} min to your home, plus 5 min to spare.</p>`
    : getHome() ? '<p class="small muted">Tap the target button on the map first and I will suggest the time.</p>'
    : `<button class="btn ghost sm" data-act="home-set">${ic('home')}Set your home to get a time suggestion</button>`;
  openSheet(`${sheetHead('Walk me home')}
    <p class="small muted">Your group sees your live location until you tap "I'm home". If you don't check in on time, Sis asks if you're OK, then alerts them.</p>
    <div class="field"><label for="wTo">Going to</label><input id="wTo" maxlength="80" value="Home"></div>
    ${hint}
    <div class="field"><span class="lab">How long will it take?</span><div class="pick" id="wMin">${opts.map((m) => `<button class="${m === def ? 'on' : ''}" data-act="pick-one" data-v="${m}">${m} min</button>`).join('')}</div></div>
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
function eventSheet(id) {
  const e = S.events.find((x) => x.id === id); if (!e) return;
  const going = e.event_members || [], mine = going.some((x) => x.user_id === S.user.id), left = eventSpotsLeft(e), own = e.created_by === S.user.id;
  const act = mine ? `<button class="btn ghost block" data-act="event-leave:${e.id}">I can't make it</button>`
    : left === 0 ? '<p class="small muted">This event is full.</p>' : `<button class="btn block" data-act="event-join:${e.id}">I'm in</button>`;
  openSheet(`${sheetHead(esc(e.title))}
    <p class="small muted">${EVENT_KINDS[e.kind] || 'Event'} · ${esc(fmtWhen(e.starts_at))}</p>
    ${e.place ? `<p><b>Where:</b> ${esc(e.place)}</p>` : ''}${e.description ? `<p>${esc(e.description)}</p>` : ''}
    <p class="small muted">Organised by ${esc(e.organizer || 'a sister')}</p>
    <div class="stack"><b>${eventCountLine(e)}</b>${going.length ? going.map((m) => `<div class="row">${avatar(m.name)}<span class="grow">${esc(m.name)}</span>${m.user_id !== S.user.id ? `<button class="tiny" data-act="dm-start:${m.user_id}:${esc(m.name)}">Message</button>` : ''}</div>`).join('') : '<p class="small muted">Nobody yet. Be the first.</p>'}</div>
    ${mine ? `<button class="btn block" data-act="event-chat:${e.id}">${ic('users')}Open event chat</button>` : ''}
    ${act}${own ? `<button class="btn ghost block" data-act="event-cancel:${e.id}">Cancel this event</button>` : `<button class="btn ghost sm" data-act="report:event:${e.id}">Report</button>${S.admin ? `<button class="btn ghost sm" data-act="mod-del:event:${e.id}">Remove (moderator)</button>` : ''}`}
    <p class="small muted">Meet in a public place first, and let your Sis group know where you are going.</p>`);
}
function newEventSheet(kind) {
  const d = new Date(Date.now() + 24 * 3600e3); d.setHours(18, 0, 0, 0);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  openSheet(`${sheetHead('Create an event')}
    <p class="muted">A walk, a coffee, a day trip. Others can join with one tap.</p>
    <div class="field"><label for="eTitle">What are we doing?</label><input id="eTitle" maxlength="80" placeholder="e.g. Sunday walk in Kadriorg"></div>
    <div class="field"><label for="eWhen">When</label><input id="eWhen" type="datetime-local" value="${local}"></div>
    <div class="field"><label for="ePlace">Where</label><input id="ePlace" maxlength="120" placeholder="A public place, e.g. park entrance"></div>
    <details class="more"><summary>Add details (optional)</summary>
      <div class="field"><label for="eCap">How many spots?</label><input id="eCap" type="number" min="2" max="100" inputmode="numeric" placeholder="Leave empty for no limit"></div>
      <div class="field"><label for="eDesc">Anything else?</label><input id="eDesc" maxlength="300" placeholder="Pace, what to bring, how to find us"></div>
    </details>
    <p class="small muted">Others will see your first name. Please choose a public place.</p>
    <button class="btn block" data-act="event-save">Create plan</button>`);
}
function replyBarHTML() { return `<div class="replybar" id="replyBar"${S.reply ? '' : ' hidden'}>${S.reply ? `Replying to ${esc(S.reply.who)} <button data-act="reply-clear" aria-label="Cancel reply">✕</button>` : ''}</div>`; }
function threadSheet(th, replies, toEnd) {
  const own = th.created_by === S.user.id, byId = Object.fromEntries(replies.map((r) => [r.id, r]));
  const tiny = (act, label, who) => `<button class="tiny" data-act="${act}"${who ? ` data-who="${esc(who)}"` : ''}>${label}</button>`;
  const mod = (kind, id) => (S.admin ? tiny(`mod-del:${kind}:${id}`, 'Remove (moderator)') : '');
  const bubble = (who, text, ts, mine, actions, quote) => `<div class="bub${mine ? ' me' : ''}"><div class="who">${esc(who)} · ${ago(ts)}</div>${quote || ''}${text ? `<p>${esc(text)}</p>` : ''}${actions}</div>`;
  const first = bubble(th.author, th.body, th.created_at, own, own ? tiny(`thread-del:${th.id}`, 'Delete') : tiny(`report:thread:${th.id}`, 'Report') + tiny(`dm-start:${th.created_by}:${th.author}`, 'Message') + mod('thread', th.id));
  const list = replies.map((r) => bubble(r.author, r.body, r.created_at, r.created_by === S.user.id,
    tiny(`reply-to:${r.id}`, 'Reply', r.author) + (r.created_by === S.user.id ? tiny(`reply-del:${r.id}:${th.id}`, 'Delete') : tiny(`report:reply:${r.id}`, 'Report') + tiny(`dm-start:${r.created_by}:${r.author}`, 'Message') + mod('reply', r.id)),
    r.reply_to && byId[r.reply_to] ? `<div class="quote">${esc(byId[r.reply_to].author)}: ${esc(byId[r.reply_to].body.slice(0, 80))}</div>` : '')).join('');
  openSheet(`${chatHead(esc(th.title), '', th.author)}
    <div class="chat">${first}${list || '<p class="small muted" style="text-align:center">No replies yet. Be the first.</p>'}</div>
    ${replyBarHTML()}
    <div class="composer"><input id="thReply" maxlength="500" placeholder="Write a reply…" aria-label="Your reply"><button class="btn" data-act="reply-send:${th.id}">Send</button></div>
    <p class="small muted">Please don't share names, photos or details that identify other people.</p>`);
  if (toEnd) $('#sheet').scrollTop = $('#sheet').scrollHeight;
}
async function openThread(id, toEnd) {
  S.reply = null;
  const th = S.threads.find((x) => x.id === id); if (!th) return;
  const r = await sb.from('thread_replies').select('*').eq('thread_id', id).order('created_at'); if (r.error) return fail(r.error);
  threadSheet(th, r.data || [], toEnd);
}
async function fetchChat(c) {
  const r = c.kind === 'dm' ? await sb.from('dm_messages').select('*').eq('dm_id', c.id).order('created_at').limit(300)
    : await sb.from('event_messages').select('*').eq('event_id', c.id).order('created_at').limit(300);
  if (r.error) { fail(r.error); return null; }
  const cut = chatSt(c.id).d, data = r.data || [];
  return cut ? data.filter((m) => new Date(m.created_at).getTime() > cut) : data;
}
function renderChat(msgs, toEnd) {
  const c = S.chat; c.n = msgs.length; chatPut(c.id, { s: Date.now() });
  const byId = Object.fromEntries(msgs.map((m) => [m.id, m]));
  const tiny = (act, label, who) => `<button class="tiny" data-act="${act}"${who ? ` data-who="${esc(who)}"` : ''}>${label}</button>`;
  const list = msgs.map((m) => {
    const mine = m.created_by === S.user.id, who = c.kind === 'dm' ? (mine ? 'You' : c.title) : (m.author || 'Sister');
    const q = m.reply_to && byId[m.reply_to] ? `<div class="quote">${esc(c.kind === 'dm' ? (byId[m.reply_to].created_by === S.user.id ? 'You' : c.title) : (byId[m.reply_to].author || 'Sister'))}: ${esc(byId[m.reply_to].body.slice(0, 80))}</div>` : '';
    let acts = tiny(`reply-to:${m.id}`, 'Reply', who);
    if (mine) acts += tiny(`chat-del:${m.id}`, 'Delete');
    else { acts += tiny(`report:${c.kind === 'dm' ? 'dm_msg' : 'event_msg'}:${m.id}`, 'Report'); if (c.kind === 'event') acts += tiny(`dm-start:${m.created_by}:${who}`, 'Message'); if (S.admin && c.kind === 'event') acts += tiny(`mod-del:event_msg:${m.id}`, 'Remove (moderator)'); }
    return `<div class="bub${mine ? ' me' : ''}"><div class="who">${esc(who)} · ${ago(m.created_at)}</div>${q}<p>${esc(m.body)}</p>${acts}</div>`;
  }).join('');
  const draft = $('#chatMsg') ? $('#chatMsg').value : '';
  openSheet(`${chatHead(esc(c.title), esc(c.sub || ''), c.kind === 'dm' ? c.title : '', c.kind === 'dm' ? `<button class="btn ghost sm" data-act="dm-block:${c.other}">Block</button>` : '')}
    <div class="chat">${list || '<p class="small muted" style="text-align:center">No messages yet. Say hello.</p>'}</div>
    ${replyBarHTML()}
    <div class="composer"><input id="chatMsg" maxlength="1000" placeholder="Write a message…" aria-label="Your message"><button class="btn" data-act="chat-send">Send</button></div>
    <p class="small muted">No links, @handles or phone numbers here. Stay safe and keep chatting in sis.</p>`);
  if (draft) $('#chatMsg').value = draft;
  if (toEnd) $('#sheet').scrollTop = $('#sheet').scrollHeight;
  clearInterval(S.chatT);
  S.chatT = setInterval(async () => {
    if (!$('#chatMsg') || !S.chat) return clearInterval(S.chatT);
    const m2 = await fetchChat(S.chat); if (m2 && m2.length !== S.chat.n) renderChat(m2, true);
  }, 6000);
}
async function openChat(c) { S.reply = null; S.chat = c; const msgs = await fetchChat(c); if (msgs) renderChat(msgs, true); }
function reportSheet(kind, id) {
  openSheet(`${sheetHead('Report')}
    <p class="small muted">Tell us what is wrong. Only the sis. team sees your report, and the author is not told who reported.</p>
    <div class="field"><label for="repReason">Reason</label><select id="repReason"><option value="inappropriate">Inappropriate</option><option value="threats">Threats or harassment</option><option value="personal">Shares personal information</option><option value="spam">Spam</option><option value="other">Something else</option></select></div>
    <div class="field"><label for="repNote">Note (optional)</label><input id="repNote" maxlength="200"></div>
    <button class="btn block" data-act="report-send:${kind}:${id}">Send report</button>`);
}
function newThreadSheet() {
  const ex = ['How do you get home safely after dark?', 'New here: where do you meet people?', 'Tips for travelling solo?'];
  openSheet(`${sheetHead('Start a conversation')}
    <div class="field"><label for="thTitle">What would you like to ask or share?</label><input id="thTitle" maxlength="100" placeholder="Type here, or tap an idea below"></div>
    <div class="ideas">${ex.map((x) => `<button data-act="thread-example" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <details class="more"><summary>Add more details (optional)</summary>
      <div class="field"><input id="thBody" maxlength="1000" placeholder="Tell us a bit more" aria-label="More details"></div>
    </details>
    <p class="small muted">Others will see your first name. Please don't share names, photos or details that identify other people.</p>
    <button class="btn block" data-act="thread-save">Post</button>`);
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

/* ---------------- message gestures: swipe left = reply (like Telegram), hold = menu ---------------- */
(() => {
  let st = null, lastHold = 0;
  const closeMenu = () => { const m = document.getElementById('msgMenu'); if (m) m.remove(); };
  const openMenu = (bub, personOnly) => {
    closeMenu();
    const btns = [...bub.querySelectorAll('.tiny')].filter((b) => !personOnly || /^(dm-start|report):/.test(b.dataset.act)); const txt = personOnly ? '' : ((bub.querySelector('p') || {}).textContent || '');
    const ph = document.getElementById('phone'); if (!btns.length || !ph) return false;
    const menu = document.createElement('div'); menu.id = 'msgMenu'; menu.className = 'msgmenu';
    btns.forEach((b) => {
      const c = document.createElement('button'); c.dataset.act = b.dataset.act; if (b.dataset.who) c.dataset.who = b.dataset.who;
      c.textContent = b.textContent; if (/^(chat-del|thread-del|reply-del)/.test(b.dataset.act)) c.className = 'danger'; menu.appendChild(c);
    });
    if (txt) { const cp = document.createElement('button'); cp.dataset.copy = txt; cp.textContent = 'Copy text'; const rb = menu.querySelector('[data-act^="reply-to:"]'); if (rb) rb.after(cp); else menu.prepend(cp); }
    ph.appendChild(menu);
    const pr = ph.getBoundingClientRect(), br = bub.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    let top = br.bottom - pr.top + 6; if (top + mh > pr.height - 12) top = br.top - pr.top - mh - 6;
    menu.style.left = Math.max(12, Math.min(br.left - pr.left, pr.width - mw - 12)) + 'px';
    menu.style.top = Math.max(12, top) + 'px';
    return true;
  };
  document.addEventListener('pointerdown', (e) => {
    const bub = e.target.closest('.bub');
    if (!e.target.closest('#msgMenu')) closeMenu();
    if (!bub || e.button > 0) return;
    st = { bub, x: e.clientX, y: e.clientY, dx: 0, swipe: false, held: false };
    st.timer = setTimeout(() => {
      if (!st || st.swipe) return;
      if (openMenu(bub)) { st.held = true; lastHold = Date.now(); if (navigator.vibrate) navigator.vibrate(12); }
    }, 480);
  });
  document.addEventListener('pointermove', (e) => {
    if (!st || st.held) return;
    const dx = e.clientX - st.x, dy = e.clientY - st.y;
    if (!st.swipe && (Math.abs(dy) > 10 || dx > 10)) { clearTimeout(st.timer); st = null; return; }
    if (dx < -12) { st.swipe = true; clearTimeout(st.timer); st.bub.classList.add('drag'); }
    if (st.swipe) { st.dx = dx; st.bub.style.transform = 'translateX(' + Math.max(dx, -72) + 'px)'; st.bub.style.setProperty('--sw', Math.min(1, -dx / 56)); }
  });
  const end = (cancel) => {
    if (!st) return;
    clearTimeout(st.timer);
    const { bub, dx, swipe } = st; st = null;
    bub.classList.remove('drag'); bub.style.transform = ''; bub.style.removeProperty('--sw');
    if (!cancel && swipe && dx < -56) { const r = bub.querySelector('.tiny[data-act^="reply-to:"]'); if (r) r.click(); }
  };
  document.addEventListener('pointerup', () => end(false));
  document.addEventListener('pointercancel', () => end(true));
  document.addEventListener('contextmenu', (e) => { if (e.target.closest('.bub')) e.preventDefault(); });
  document.addEventListener('click', (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) { try { navigator.clipboard.writeText(cp.dataset.copy); if (typeof toast === 'function') toast('Copied'); } catch (_) {} }
    const who = e.target.closest('.who');
    if (who && who.closest('.bub') && !who.closest('.bub.me')) { lastHold = Date.now(); openMenu(who.closest('.bub'), true); return; }
    if (Date.now() - lastHold > 450) setTimeout(closeMenu, 0);
  });
})();

/* ---------------- private chats: start one with anyone ---------------- */
const personRow = (p) => `<div class="row">${avatar(p.name)}<span class="grow">${esc(p.name)}</span><button class="btn sm" data-act="dm-start:${p.id}:${esc(p.name)}">Message</button></div>`;
function newChatSheet() {
  const seen = new Set(), people = [];
  (S.members || []).forEach((m) => { if (m.user_id && m.user_id !== S.user.id && m.name && !seen.has(m.user_id)) { seen.add(m.user_id); people.push({ id: m.user_id, name: m.name }); } });
  openSheet(`${sheetHead('New chat')}
    <p class="small muted">Write to one sister privately. Only the two of you see it.</p>
    ${people.length ? `<div class="stack"><b>Your circle</b>${people.map(personRow).join('')}</div>` : ''}
    <div class="field"><label for="pSearch">Find someone by name</label><input id="pSearch" maxlength="40" placeholder="Start typing a name" autocomplete="off"></div>
    <div id="pResults" class="stack"></div>`);
}
(() => {
  let timer = null, seq = 0;
  document.addEventListener('input', (e) => {
    if (!e.target || e.target.id !== 'pSearch') return;
    const q = e.target.value.trim(), box = document.getElementById('pResults'); clearTimeout(timer);
    if (!box) return;
    if (q.length < 2) { box.innerHTML = ''; return; }
    timer = setTimeout(async () => {
      const mine = ++seq;
      const { data, error } = await sb.rpc('search_people', { p_q: q });
      const out = document.getElementById('pResults'); if (mine !== seq || !out) return;
      out.innerHTML = error ? '<p class="small muted">Search is not available right now.</p>' : (data || []).length ? data.map(personRow).join('') : '<p class="small muted">No one found with that name.</p>';
    }, 300);
  });
})();

/* ---------------- actions ---------------- */
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const [a, arg] = el.dataset.act.split(/:(.*)/s);
  try {
    switch (a) {
      case 'welcome': return doWelcome();
      case 'google': return doGoogle();
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
      case 'home-now': return arriveHome(false);
      case 'home-wait': closeHomeAsk(); S.homeSnooze = Date.now() + 10 * 60000; return;
      case 'alert-hide': dismissAlert(arg); { const b = $('#banners'); if (b) b.innerHTML = bannersHTML(); } return;
      case 'see-member': { const m = S.members.find((x) => x.user_id === arg); if (!m || m.lat == null) { toast('No location shared right now', 'alert'); return; } if (S.tab !== 'home') await go('home'); const M = maps.around; if (M) { M.map.setView([m.lat, m.lng], 16); const el = $('#aroundMap'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } return; }
      case 'bug-open': {
        const d = await fetchBugs(); if (!d) return;
        S.bugFile = null; renderBugs(d, true);
        clearInterval(S.chatT);
        S.chatT = setInterval(async () => {
          if (!$('#sheet').classList.contains('on') || !$('#bugMsg')) { clearInterval(S.chatT); return; }
          const n = await fetchBugs(); if (n && n.rows.map((m) => m.id).join(',') !== S.bugSig) renderBugs(n);
        }, 6000);
        return;
      }
      case 'bug-attach': { const p = $('#bugPick'); if (p) p.click(); return; }
      case 'bug-send': {
        const inp = $('#bugMsg'), text = ((inp && inp.value) || '').trim(), file = S.bugFile;
        if (!text && !file) return toast('Write a message or add a screenshot', 'alert');
        let path = null;
        if (file) {
          let blob = null; try { blob = await shrinkImage(file); } catch (e) { /* unreadable image */ }
          if (!blob) return toast('Could not read that image', 'alert');
          path = `${S.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
          const up = await sb.storage.from(BUG_BUCKET).upload(path, blob, { contentType: 'image/jpeg' }); if (up.error) return fail(up.error);
        }
        const { error } = await sb.from('bug_messages').insert({ author: S.name, body: text, image_path: path });
        if (error) { if (path) sb.storage.from(BUG_BUCKET).remove([path]); return fail(error); }
        S.bugFile = null; if (inp) inp.value = '';
        const d = await fetchBugs(); if (d) renderBugs(d, true); return;
      }
      case 'bug-del': {
        const m = (S.bugRows || []).find((x) => x.id === arg);
        const { error } = await sb.from('bug_messages').delete().eq('id', arg); if (error) return fail(error);
        if (m && m.image_path) sb.storage.from(BUG_BUCKET).remove([m.image_path]);
        const d = await fetchBugs(); if (d) renderBugs(d); return;
      }
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
      case 'notify': if ('Notification' in window && Notification.permission === 'default') { const r = await Notification.requestPermission(); if (r === 'granted') await pushEnable(); toast(r === 'granted' ? 'Alerts are on' : 'Alerts stay off', r === 'granted' ? 'bell' : 'alert'); render(); } else if (!('Notification' in window)) toast('Add Sis to your home screen to get alerts', 'bell'); return;
      case 'arrived': if (needGroup()) return; return arrivedSheet();
      case 'arrived-go': { const place = $('#aPlace').value.trim() || 'Arrived safely', withLoc = $('#aLoc').checked; closeSheet(); let patch = { status: 'out', place, walk_deadline: null, walk_to: null }; if (withLoc) { const p = await locateOnce(); if (p) patch = { ...patch, ...p, located_at: new Date().toISOString() }; else toast('Could not get your location', 'alert'); } await updateMe(patch); render(); toast('Your group knows you arrived'); return; }
      case 'date': if (needGroup()) return; return dateSheet();
      case 'date-go': { const who = $('#dWho').value.trim(), where = $('#dWhere').value.trim(), [hh, mm] = ($('#dTime').value || '22:00').split(':').map(Number); const d = new Date(); d.setHours(hh, mm, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); const live = $('#dLoc').checked; closeSheet(); await updateMe({ status: 'out', place: where || null, walk_to: `Date${who ? ' with ' + who : ''}`, walk_deadline: d.toISOString() }); if (live) startSharing(true); render(); toast(`Check-in set for ${fmtTime(d)}`, 'heart'); return; }
      case 'ride': if (needGroup()) return; return rideSheet();
      case 'ride-go': { const plate = $('#rPlate').value.trim().toUpperCase(), to = $('#rTo').value.trim() || 'Home', min = +(picked('#rMin') || 20); closeSheet(); await updateMe({ status: 'on_way', place: plate ? `Taxi ${plate}` : 'In a taxi', walk_to: to, walk_deadline: new Date(Date.now() + min * 60000).toISOString() }); if (shareRule('trips')) startSharing(true); render(); toast('Your group is following your ride', 'car'); return; }
      case 'trip': await go('sisterhood'); return newEventSheet('trip');
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
      case 'pin': {
        const on = (S.pins || new Set()).has(arg);
        const r = on ? await sb.from('thread_pins').delete().eq('thread_id', arg).eq('user_id', S.user.id) : await sb.from('thread_pins').insert({ thread_id: arg, user_id: S.user.id });
        if (r.error) return fail(r.error);
        S.pins = S.pins || new Set(); if (on) S.pins.delete(arg); else S.pins.add(arg);
        render(); toast(on ? 'Removed from favourites' : 'Pinned to the top', 'check'); return;
      }
      case 'reply-to': { S.reply = { id: arg, who: el.dataset.who || 'Sister' }; const bar = $('#replyBar'); if (bar) { bar.hidden = false; bar.innerHTML = `Replying to ${esc(S.reply.who)} <button data-act="reply-clear" aria-label="Cancel reply">✕</button>`; } const inp = $('#chatMsg') || $('#thReply'); if (inp) inp.focus(); return; }
      case 'reply-clear': { S.reply = null; const bar = $('#replyBar'); if (bar) { bar.hidden = true; bar.innerHTML = ''; } return; }
      case 'event-chat': { const e = S.events.find((x) => x.id === arg); if (!e) return; return openChat({ kind: 'event', id: arg, title: e.title, sub: eventCountLine(e) }); }
      case 'dm-open': { const [id, other, ...nm] = arg.split(':'); return openChat({ kind: 'dm', id, other, title: nm.join(':') || 'Sister', sub: 'Private chat' }); }
      case 'dm-new': return newChatSheet();
      case 'dm-start': {
        const [uid, ...nm] = arg.split(':'); const { data, error } = await sb.rpc('start_dm', { p_other: uid });
        if (error) return fail(error); return openChat({ kind: 'dm', id: data, other: uid, title: nm.join(':') || 'Sister', sub: 'Private chat' });
      }
      case 'dm-block': {
        if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to block. She can no longer message you.'; return; }
        const { error } = await sb.from('blocks').insert({ blocker: S.user.id, blocked: arg }); if (error && error.code !== '23505') return fail(error);
        clearInterval(S.chatT); closeSheet(); await loadSisterhood(); toast('Blocked', 'lock'); return;
      }
      case 'chat-send': {
        const c = S.chat, text = ($('#chatMsg').value || '').trim(); if (!c || !text) return toast('Write a message first', 'alert');
        const row = c.kind === 'dm' ? { dm_id: c.id, body: text, reply_to: S.reply ? S.reply.id : null } : { event_id: c.id, author: S.name, body: text, reply_to: S.reply ? S.reply.id : null };
        const { error } = await sb.from(c.kind === 'dm' ? 'dm_messages' : 'event_messages').insert(row); if (error) return fail(error);
        S.reply = null; $('#chatMsg').value = ''; const msgs = await fetchChat(c); if (msgs) renderChat(msgs, true); return;
      }
      case 'chat-del': {
        const c = S.chat; const { error } = await sb.from(c.kind === 'dm' ? 'dm_messages' : 'event_messages').delete().eq('id', arg); if (error) return fail(error);
        const msgs = await fetchChat(c); if (msgs) renderChat(msgs); return;
      }
      case 'hz-fold': { const bar = el.closest('.hzbar'); bar.classList.toggle('col'); ls.set('hzcol', bar.classList.contains('col') ? '1' : '0'); return; }
      case 'chat-more': { const r = el.closest('.crow'), was = r.classList.contains('open'); document.querySelectorAll('.crow.open').forEach((x) => x.classList.remove('open')); if (!was) r.classList.add('open'); return; }
      case 'chat-arch': { const was = chatSt(arg).a; chatPut(arg, { a: was ? null : Date.now() }); render(); toast(was ? 'Moved back to chats' : 'Archived. A new message brings it back.', 'check'); return; }
      case 'chat-del-row': { if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Sure?'; return; } chatPut(arg, { d: Date.now(), a: null }); render(); toast('Chat deleted for you', 'check'); return; }
      case 'chat-arch-show': S.showArch = !S.showArch; return render();
      case 'home-set': closeSheet(); return go('me');
      case 'home-here': { const p = await locateOnce(); if (!p) return toast('Could not get your location. Check Location settings.', 'alert'); ls.set('home', JSON.stringify({ lat: p.lat, lng: p.lng })); render(); toast('Home saved on this phone only', 'home'); return; }
      case 'home-pick': S.homePick = true; await go('home'); toast('Tap the map where your home is', 'pin'); return;
      case 'home-clear': ls.set('home', ''); render(); toast('Home removed'); return;
      case 'around-locate': { const p = await hzLocate(); if (!p) return toast('Could not get your location. Check Location settings.', 'alert'); return; }
      case 'hz-new': S.hzDraft = { kind: null, note: '', pt: S.hzMe ? { lat: S.hzMe.lat, lng: S.hzMe.lng } : null }; return hzSheet();
      case 'hz-kind': { S.hzDraft.kind = arg; document.querySelectorAll('.hzk').forEach((b) => b.classList.toggle('on', b.dataset.act === 'hz-kind:' + arg)); return; }
      case 'hz-here': { $('#hzWhere').textContent = 'Finding you…'; const p = await hzLocate(true); if (!p) { $('#hzWhere').textContent = 'Could not get your location. Pick on the map instead.'; return; } S.hzDraft.pt = { lat: p.lat, lng: p.lng }; $('#hzWhere').innerHTML = `${ic('check')} Your current spot`; return; }
      case 'hz-pick': { S.hzDraft.note = $('#hzNote').value; closeSheet(); S.hzPick = true; toast('Tap the map where it is', 'pin'); return; }
      case 'hz-save': {
        const d = S.hzDraft || {}; d.note = ($('#hzNote') ? $('#hzNote').value : '').trim();
        if (!d.kind) return toast('Choose what you saw', 'alert'); if (!d.pt) return toast('Set where it is', 'alert');
        const { error } = await sb.from('hazards').insert({ kind: d.kind, note: d.note || null, lat: d.pt.lat, lng: d.pt.lng });
        if (error) return fail(error);
        S.hzDraft = null; closeSheet(); await loadHazards();
        const M = maps.around; if (M) M.map.setView([d.pt.lat, d.pt.lng], 16);
        toast('Added to the map. Thank you, sister.', 'users'); return;
      }
      case 'hz-vote': {
        const [id, v] = arg.split(':');
        const { error } = await sb.from('hazard_votes').upsert({ hazard_id: id, user_id: S.user.id, still: v === '1' }, { onConflict: 'hazard_id,user_id' });
        if (error) return fail(error);
        closeSheet(); await loadHazards(); toast(v === '1' ? 'Thanks, it stays on the map' : 'Thanks, it goes if others agree'); return;
      }
      case 'report': { const [k, id] = arg.split(':'); return reportSheet(k, id); }
      case 'report-send': {
        const [k, id] = arg.split(':');
        const { error } = k === 'dm_msg' ? await sb.rpc('report_dm_message', { p_msg: id, p_reason: $('#repReason').value, p_note: $('#repNote').value.trim() || null }) : await sb.from('reports').insert({ reporter: S.user.id, kind: k, target_id: id, reason: $('#repReason').value, note: $('#repNote').value.trim() || null });
        if (error && error.code !== '23505') return fail(error);
        closeSheet(); toast(error ? 'You already reported this. Thank you.' : 'Thank you. We will look at it.', 'check'); return;
      }
      case 'mod-del': {
        if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to remove for everyone.'; return; }
        const [k, id] = arg.split(':'); const table = { event: 'events', thread: 'threads', reply: 'thread_replies', hazard: 'hazards', event_msg: 'event_messages' }[k];
        const { error } = await sb.from(table).delete().eq('id', id); if (error) return fail(error);
        closeSheet(); await loadSisterhood(); toast('Removed'); return;
      }
      case 'thread-example': $('#thTitle').value = el.dataset.v; return;
      case 'thread-open': return openThread(arg);
      case 'new-thread': return newThreadSheet();
      case 'thread-save': {
        const title = $('#thTitle').value.trim(); if (!title) return toast('Give the thread a title', 'alert');
        const { error } = await sb.from('threads').insert({ created_by: S.user.id, author: S.name, title, body: $('#thBody').value.trim() || null });
        if (error) return fail(error); closeSheet(); S.seg = 'threads'; await loadSisterhood(); toast('Thread posted', 'users'); return;
      }
      case 'reply-send': { const text = $('#thReply').value.trim(); if (!text) return toast('Write a reply first', 'alert'); const { error } = await sb.from('thread_replies').insert({ thread_id: arg, created_by: S.user.id, author: S.name, body: text, reply_to: S.reply ? S.reply.id : null }); S.reply = null; if (error) return fail(error); await loadSisterhood(); return openThread(arg, true); }
      case 'reply-del': { const [rid, tid] = arg.split(':'); const { error } = await sb.from('thread_replies').delete().eq('id', rid); if (error) return fail(error); await loadSisterhood(); return openThread(tid); }
      case 'thread-del': { if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to delete this thread and its replies.'; return; } const { error } = await sb.from('threads').delete().eq('id', arg); if (error) return fail(error); closeSheet(); await loadSisterhood(); toast('Thread deleted'); return; }
      case 'event-open': return eventSheet(arg);
      case 'new-event': return newEventSheet(arg);
      case 'event-join': { const { error } = await sb.rpc('join_event', { p_event: arg, p_name: S.name }); if (error) return fail(/full/i.test(error.message || '') ? new Error('This event is full') : error); await loadSisterhood(); if ($('#sheet').classList.contains('on')) eventSheet(arg); toast("You're in", 'check'); return; }
      case 'event-leave': { const { error } = await sb.from('event_members').delete().eq('event_id', arg).eq('user_id', S.user.id); if (error) return fail(error); await loadSisterhood(); if ($('#sheet').classList.contains('on')) eventSheet(arg); return; }
      case 'event-cancel': { if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to cancel this event for everyone.'; return; } const { error } = await sb.from('events').delete().eq('id', arg); if (error) return fail(error); closeSheet(); await loadSisterhood(); toast('Event cancelled'); return; }
      case 'event-save': {
        const title = $('#eTitle').value.trim(); if (!title) return toast('Give the event a title', 'alert');
        const when = new Date($('#eWhen').value); if (isNaN(when) || when.getTime() < Date.now()) return toast('Pick a time in the future', 'alert');
        const cap = parseInt($('#eCap').value, 10) || null; if (cap !== null && (cap < 2 || cap > 100)) return toast('Spots: between 2 and 100', 'alert');
        const { data, error } = await sb.from('events').insert({ created_by: S.user.id, organizer: S.name, title, kind: 'meetup', starts_at: when.toISOString(), place: $('#ePlace').value.trim() || null, capacity: cap, description: $('#eDesc').value.trim() || null }).select().single();
        if (error) return fail(error);
        await sb.rpc('join_event', { p_event: data.id, p_name: S.name }); closeSheet(); await loadSisterhood(); toast('Plan created', 'users'); return;
      }
      case 'edit-profile': return profileSheet();
      case 'profile-save': {
        const name = $('#eName').value.trim(), phone = $('#ePhone').value.trim() || null; if (!name) return toast('Add your first name', 'alert');
        const { error } = await sb.from('profiles').update({ name, phone }).eq('id', S.user.id); if (error) return fail(error);
        await sb.from('group_members').update({ name, phone }).eq('user_id', S.user.id);
        S.name = name; S.phone = phone || ''; ls.set('name', name); closeSheet(); await fetchMembers(); render(); toast('Saved'); return;
      }
      case 'toggle-auto': S.auto = !S.auto; ls.set('auto', S.auto ? '1' : '0'); if (S.auto) S.mode = autoMode(); return render();
      case 'signout': if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to sign out. Your groups stay, but this device forgets you.'; return; } stopSharing(true); await sb.auth.signOut(); location.reload(); return;
      case 'delete-account': {
        if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Tap again to permanently delete your account and all your data. This cannot be undone.'; return; }
        stopSharing(true);
        const { error } = await sb.rpc('delete_my_account'); if (error) return fail(error);
        try { await sb.auth.signOut(); } catch (e) { /* account is already gone */ }
        try { Object.keys(localStorage).filter((k) => k.startsWith('sis.')).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* storage blocked */ }
        location.reload(); return;
      }
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
