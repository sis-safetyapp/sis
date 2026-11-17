/* Nearby Sisters: calls only to people from the signed-in user's own Sis groups.
   No public directory, no location uploads, no implication of identity verification.
   Existing group membership is NOT proof of trust; invite only people you know. */
'use strict';

const SIS_NEARBY_MAX_KM = 10;
const SIS_NEARBY_FRESH_MS = 10 * 60 * 1000;

function sisSafeDial(value) {
  const phone = String(value || '').replace(/[\s().-]/g, '');
  return /^\+?[0-9]{3,18}$/.test(phone) ? phone : '';
}

function sisRecentSharing(member) {
  if (member.sharing !== true ||
      !Number.isFinite(member.lat) || !Number.isFinite(member.lng) ||
      Math.abs(member.lat) > 90 || Math.abs(member.lng) > 180) return false;
  const age = Date.now() - Date.parse(member.located_at);
  return Number.isFinite(age) && age >= 0 && age <= SIS_NEARBY_FRESH_MS;
}

function sisGetLocationFast() {
  return new Promise(function(resolve) {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(function(pos) {
      resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, function() {
      resolve(null);
    }, { enableHighAccuracy: false, timeout: 6500, maximumAge: 30000 });
  });
}

function sisNearbyContactRow(member, details) {
  const phone = sisSafeDial(member.phone);
  return '<div class="item">' + avatar(member.name, 'sm') +
    '<span class="grow"><span class="t">' + esc(member.name) + '</span><br>' +
    '<span class="s">' + esc(details) + '</span></span>' +
    (phone ? '<a class="btn sm" href="tel:' + esc(phone) +
      '" aria-label="Call ' + esc(member.name) + '">' + ic('phone') + 'Call</a>' :
      '<span class="small muted">No phone</span>') + '</div>';
}

async function nearbySistersSheet() {
  const activeGroups = S.groups.filter(function(group) {
    return !group.ends_at || new Date(group.ends_at).getTime() > Date.now();
  });
  if (!activeGroups.length) {
    openSheet(sheetHead('Nearby Sisters') +
      '<p class="small muted">First create a group with women you know. Sis does not verify identities just because someone has an invite code.</p>' +
      '<button class="btn block" data-act="group-join">Join a group you trust</button>' +
      '<p class="small muted">DEMO: no emergency call is placed. For a real emergency, call 112 manually.</p>');
    return;
  }
  openSheet(sheetHead('Nearby Sisters · 10 km') +
    '<p class="small muted">Finding your group contacts who are sharing a recent location. Your own location stays on this device for this search.</p>' +
    '<div class="spinner" aria-label="Finding nearby contacts"></div>' +
    '<p class="small muted">DEMO: no emergency call is placed. For a real emergency, call 112 manually.</p>');

  try {
    const results = await Promise.all([
      sb.from('group_members')
        .select('user_id, name, phone, lat, lng, sharing, located_at, group_id')
        .in('group_id', activeGroups.map(function(group) { return group.id; })),
      sisGetLocationFast()
    ]);
    const answer = results[0], here = results[1];
    if (answer.error) throw answer.error;

    const contactsByUser = new Map();
    for (const member of answer.data || []) {
      if (member.user_id === S.user.id) continue;
      const previous = contactsByUser.get(member.user_id);
      const bestPosition = sisRecentSharing(member) &&
        (!previous || !sisRecentSharing(previous) ||
          Date.parse(member.located_at) > Date.parse(previous.located_at));
      if (!previous || bestPosition) {
        contactsByUser.set(member.user_id, Object.assign({}, member, {
          phone: member.phone || (previous && previous.phone) || null
        }));
      } else if (!previous.phone && member.phone) {
        previous.phone = member.phone;
      }
    }
    const contacts = Array.from(contactsByUser.values());
    const hasLocation = here && Number.isFinite(here.lat) && Number.isFinite(here.lng);
    const nearby = hasLocation ? contacts.filter(sisRecentSharing).map(function(member) {
      return Object.assign({}, member, { distanceKm: distM(here, member) / 1000 });
    }).filter(function(member) {
      return member.distanceKm <= SIS_NEARBY_MAX_KM;
    }).sort(function(a, b) {
      return a.distanceKm - b.distanceKm;
    }) : [];
    const otherContacts = contacts.filter(function(member) {
      return sisSafeDial(member.phone) && !nearby.some(function(n) {
        return n.user_id === member.user_id;
      });
    });
    const title = !hasLocation ? 'Your location is unavailable' :
      'Found ' + nearby.length + ' contact' + (nearby.length === 1 ? '' : 's') + ' within 10 km';
    let body = '<p class="small muted">Private to your existing groups. Approximate distance only. Recent sharing does not mean someone is available, and Sis does not verify identities.</p>' +
      '<div class="card stack"><div class="row">' + ic('locate') + '<b>' + esc(title) + '</b></div>';

    if (!hasLocation) {
      body += '<p class="small muted">Allow location access to check the 10 km radius. You can still call people you know below.</p>';
    } else if (nearby.length) {
      body += '<div class="list">' + nearby.map(function(member) {
        const distance = member.distanceKm < 1 ? 'under 1' : String(Math.round(member.distanceKm));
        return sisNearbyContactRow(member, 'Approx. ' + distance + ' km · location ' + ago(member.located_at));
      }).join('') + '</div>';
    } else {
      body += '<p class="small muted">No group contact has shared a recent location within 10 km.</p>';
    }
    body += '</div>';

    if (otherContacts.length) {
      body += '<div class="stack"><h3>Other people in your groups</h3>' +
        '<p class="small muted">Their distance is unknown or outside 10 km. They are not listed as nearby.</p>' +
        '<div class="list">' + otherContacts.map(function(member) {
          return sisNearbyContactRow(member, 'Group contact · distance not confirmed');
        }).join('') + '</div></div>';
    }
    if (!nearby.length && !otherContacts.length) {
      body += '<p class="small muted">No callable contacts yet. Ask trusted friends to join a group and add their phone number.</p>';
    }
    body += '<button class="btn ghost block" data-act="nearby">' + ic('locate') + 'Refresh contacts</button>' +
      '<p class="small muted">DEMO: no emergency call is placed. For a real emergency, call 112 manually.</p>' +
      '<p class="small muted">Calls open your phone dialer. This tool does not dispatch help or send messages automatically.</p>';
    openSheet(sheetHead('Nearby Sisters · 10 km') + body);
  } catch (error) {
    console.error('Nearby Sisters lookup failed:', error);
    openSheet(sheetHead('Nearby Sisters') +
      '<p role="alert">Could not load your group contacts. Check your connection and try again.</p>' +
      '<button class="btn ghost block" data-act="nearby">Retry</button>' +
      '<p class="small muted">DEMO: no emergency call is placed. For a real emergency, call 112 manually.</p>');
  }
}
