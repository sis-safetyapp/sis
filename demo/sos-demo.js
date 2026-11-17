/* Safety & Sisterhood hackathon SOS demo.
   The incoming SOS and member are simulated LOCALLY (not Supabase).
   The saved phone number is user-entered and stays in localStorage on this device.
   The primary in-app call screen is simulated; REAL calls use a separate dialer link. */
(function () {
  'use strict';

  const KEY = 'sis.sos-demo-contact.v1';
  const GROUP_NAME = 'Hackathon SOS demo group';
  let pending = null;
  let callTicker = null;

  function validNumber(number) {
    const cleaned = String(number || '').replace(/[\s().-]/g, '');
    return /^\+[1-9][0-9]{6,14}$/.test(cleaned) ? cleaned : '';
  }

  function readContact() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const candidate = JSON.parse(raw);
      const phone = validNumber(candidate.phone);
      if (!phone) return null;
      return { name: String(candidate.name || 'Demo Sister').slice(0, 40), phone };
    } catch (error) {
      console.warn('SOS demo contact not available:', error);
      return null;
    }
  }

  function masked(number) {
    return '•••• ' + number.slice(-4);
  }

  function card() {
    const contact = readContact();
    return '<section class="card stack sos-demo-card" aria-label="Demo SOS group">' +
      '<div class="row between"><h2>Hackathon SOS group</h2>' +
      '<span class="pill acc">DEMO</span></div>' +
      '<p class="small muted">Simulated group with one member. An in-app call demo is available, with a separate real phone-dial option.</p>' +
      (contact
        ? '<div class="item sos-demo-member">' + avatar(contact.name, 'sm') +
          '<span class="grow"><b>' + esc(contact.name) +
          '</b><br><span class="small muted">Demo contact · ' + esc(masked(contact.phone)) +
          '</span></span><span class="pill safe">Saved</span></div>'
        : '<p class="small muted">Set up one contact number to demonstrate calling.</p>') +
      '<button class="btn danger block" type="button" data-act="sos-demo-trigger">' +
      ic('alert') + (contact ? 'Simulate incoming SOS' : 'Set up simulated SOS') + '</button>' +
      '<button class="btn ghost block" type="button" data-act="sos-demo-enable-alerts">' +
      ic('bell') + 'Enable SOS sound notifications</button>' +
      '<p class="small muted">Android APK v0.1.4: after a simulated SOS, a local notification with sound is scheduled in 4 seconds. Allow notifications and keep sound on. This is not server push to another device.</p>' +
      '<button class="btn ghost block" type="button" data-act="sos-demo-setup">' +
      ic('user') + (contact ? 'Edit demo contact' : 'Add demo contact') + '</button>' +
      (pending ? '<button class="btn ghost sm" type="button" data-act="sos-demo-clear">Clear simulated SOS</button>' : '') +
      '</section>';
  }

  function banner() {
    if (!pending) return '';
    const contact = readContact();
    // A saved phone number is required for showing a live dial action.
    if (!contact) return '';
    return '<div class="banner sos-demo-alert" role="alert">' +
      '<div class="row"><span class="pill" style="background:#fff;color:#9f1827">SIMULATED SOS</span>' +
      '<strong>Incoming SOS from ' + esc(contact.name) + '</strong></div>' +
      '<p class="small">Hackathon SOS demo group · ' + ago(pending.at) +
      ' · Example event, not received from another device.</p>' +
      '<p class="small">The SOS is simulated. Try the in-app demo screen, or choose a genuine telephone call separately.</p>' +
      '<div class="stack">' +
      '<button class="btn white block" type="button" data-act="sos-demo-call-inapp">' +
      ic('phone') + 'Call ' + esc(contact.name) + ' in Sis (DEMO)</button>' +
      '<button class="btn ghost block" type="button" data-act="sos-demo-map">' +
      ic('locate') + 'View location on real street map</button>' +
      '<a class="btn ghost block" href="tel:' + esc(contact.phone) +
      '" aria-label="Open Android phone dialer for a real call to ' + esc(contact.name) +
      '">' + ic('phone') + 'Call by phone (REAL)</a>' +
      '<button class="btn ghost sm" type="button" data-act="sos-demo-clear">Dismiss</button>' +
      '</div></div>';
  }

  function endInAppCall() {
    if (callTicker !== null) {
      clearInterval(callTicker);
      callTicker = null;
    }
    const layer = document.getElementById('callLayer');
    if (layer) layer.innerHTML = '';
  }

  function startInAppCall() {
    const contact = readContact();
    if (!contact || !pending || S.mode !== 'night') return false;
    const layer = document.getElementById('callLayer');
    if (!layer) {
      toast('The in-app demo call screen is unavailable.', 'alert');
      return false;
    }
    endInAppCall();
    // Visual demo only: calling a real phone number from inside Sis requires
    // a voice provider, server credentials and a paid PSTN connection.
    layer.innerHTML = '<div class="call" role="dialog" aria-modal="true" aria-label="Demo call">' +
      '<p class="eyebrow" style="color:#fff">SOS DEMO • NO AUDIO CONNECTION</p>' +
      '<div>' + avatar(contact.name) + '<div class="who">' + esc(contact.name) + '</div>' +
      '<p>Example in-app calling screen</p>' +
      '<p id="sisSosDemoCallTimer">00:00</p>' +
      '<p class="small">Simulation only. Nobody is being called.</p></div>' +
      '<div class="acts"><button type="button" data-act="sos-demo-call-end">' +
      '<span class="c" style="background:#e5484d">' + ic('end') + '</span>End demo</button></div>' +
      '</div>';
    let seconds = 0;
    callTicker = setInterval(function () {
      seconds += 1;
      const counter = document.getElementById('sisSosDemoCallTimer');
      if (counter) counter.textContent = String(Math.floor(seconds / 60)).padStart(2, '0') +
        ':' + String(seconds % 60).padStart(2, '0');
    }, 1000);
    return true;
  }

  function viewIncidentMap() {
    const contact = readContact();
    if (!contact || !pending || S.mode !== 'night') return false;
    if (typeof window.sisDemoStart !== 'function') {
      toast('Live map is not available. Reload the website.', 'alert');
      return false;
    }
    window.sisDemoStart({ sosContact: contact.name });
    return true;
  }

  function setup() {
    const contact = readContact() || { name: 'Demo Sister', phone: '' };
    openSheet(sheetHead('Set up hackathon SOS group') +
      '<div class="note info"><span><b>Demo alert is simulated.</b> The in-app call screen is simulated too. A separate real phone-dial button can call this number. Only use a number you have permission to call.</span></div>' +
      '<div class="field"><label for="sosDemoName">Example group member name</label>' +
      '<input id="sosDemoName" maxlength="40" autocomplete="off" value="' + esc(contact.name) + '"></div>' +
      '<div class="field"><label for="sosDemoPhone">Real test phone number (international + format)</label>' +
      '<input id="sosDemoPhone" type="tel" maxlength="24" autocomplete="off" inputmode="tel" placeholder="+372 ..." value="' +
      esc(contact.phone) + '"></div>' +
      '<p class="small muted">Saved on this device only; it is not uploaded to Supabase or committed to GitHub. It may be erased if you uninstall the APK.</p>' +
      '<button class="btn block" type="button" data-act="sos-demo-save">Save demo contact</button>' +
      '<button class="btn ghost block" type="button" data-act="close">Cancel</button>');
  }

  function save() {
    const name = (document.getElementById('sosDemoName')?.value || '').trim().slice(0, 40);
    const phone = validNumber(document.getElementById('sosDemoPhone')?.value || '');
    if (!name) {
      toast('Enter a demo contact name.', 'alert');
      return false;
    }
    if (!phone) {
      toast('Enter a valid international phone number starting with +.', 'alert');
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify({ name, phone }));
    } catch (error) {
      toast('Device storage is unavailable. Please enable browser storage.', 'alert');
      return false;
    }
    pending = null;
    closeSheet();
    render();
    toast('Demo group ready. A test SOS will NOT notify anyone.', 'check');
    return true;
  }

  function trigger() {
    if (S.mode !== 'night') {
      toast('Switch to Night mode to demonstrate SOS.', 'moon');
      return false;
    }
    if (!readContact()) {
      setup();
      return false;
    }
    const contact = readContact();
    pending = { at: new Date().toISOString() };
    render();
    if (window.SisNativeNotifications && typeof window.SisNativeNotifications.demoSos === 'function') {
      try {
        window.SisNativeNotifications.demoSos(contact.name);
        toast('Simulated SOS: audible Android notification in 4 seconds, if enabled.', 'alert');
      } catch (error) {
        console.warn('Native demo notification failed:', error);
        toast('Demo SOS displayed, but Android notification could not be scheduled.', 'alert');
      }
    } else {
      // Web-only fallback: sound can play while the webpage is open. Background
      // push on iPhone/Chrome needs a separate push service and permission flow.
      try { if (typeof beep === 'function') beep(); } catch (error) { /* unsupported */ }
      toast('Simulated SOS shown here. Background push is not configured.', 'alert');
    }
    try { navigator.vibrate?.([200, 100, 200]); } catch (error) { /* optional */ }
    return true;
  }

  function clear() {
    endInAppCall();
    pending = null;
    render();
    toast('Demo SOS dismissed.');
  }

  document.addEventListener('click', function (event) {
    const element = event.target.closest('[data-act]');
    if (!element) return;
    const action = element.dataset.act;
    if (action === 'sos-demo-enable-alerts') {
      if (window.SisNativeNotifications && typeof window.SisNativeNotifications.enableNotifications === 'function') {
        window.SisNativeNotifications.enableNotifications();
      } else {
        try { if (typeof beep === 'function') beep(); } catch (error) { /* unsupported */ }
        toast('Sound test only. This browser has no native background SOS notifications.', 'bell');
      }
    } else if (action === 'sos-demo-setup') setup();
    else if (action === 'sos-demo-save') save();
    else if (action === 'sos-demo-trigger') trigger();
    else if (action === 'sos-demo-call-inapp') startInAppCall();
    else if (action === 'sos-demo-call-end') endInAppCall();
    else if (action === 'sos-demo-map') viewIncidentMap();
    else if (action === 'sos-demo-clear') clear();
  });

  window.sisSosDemo = { card, banner, setup, save, trigger, clear, readContact, startInAppCall, endInAppCall, viewIncidentMap };
})();
