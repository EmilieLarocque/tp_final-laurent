const CACHE_VERSION = 'v10';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  'index.html',
  'manifest.json',
  'css/style.css',
  'javascript/lock-screen.js',
  'javascript/widgets.js',
  'javascript/windows-iframe.js',
  'javascript/easter-eggs.js',
  'javascript/quest-log.js',
  'javascript/contact-form.js',
  'javascript/project-filter.js',
  'pages/a-propos.html',
  'pages/projet.html',
  'pages/projet-1.html',
  'pages/projet-2.html',
  'pages/services.html',
  'pages/contact.html',
  'pages/merci.html',
  'pages/cv.html',
  'icons/icon-144.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-144-maskable.png',
  'icons/icon-192-maskable.png',
  'icons/icon-512-maskable.png',
  'media/sims4-portrait.png',
  'media/sims4-body.png',
  'media/dossier.png',
  'media/dossier-vide.png',
  'media/dossier-2.png',
  'media/dossier-ouvert.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(
        PRECACHE_URLS.map((url) => new URL(url, self.registration.scope).toString())
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Pages : réseau d'abord, secours sur le cache (puis sur l'accueil) hors ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match(new URL('index.html', self.registration.scope).toString())
          )
        )
    );
    return;
  }

  // Assets (CSS/JS/images/polices) : cache d'abord, réseau en secours + mise à jour du cache.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && (response.status === 200 || response.type === 'opaque')) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
