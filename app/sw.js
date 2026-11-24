/* sis. service worker: shows alerts that arrive while the app is closed.
   It does not cache anything, so the app always loads fresh. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  const tag = d.tag || 'sis';
  e.waitUntil(self.registration.showNotification(d.title || 'sis.', {
    body: d.body || '',
    tag,
    icon: 'apple-touch-icon.png',
    badge: 'apple-touch-icon.png',
    requireInteraction: tag.indexOf('sos') === 0,
    data: { url: d.url || './' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  })());
});
