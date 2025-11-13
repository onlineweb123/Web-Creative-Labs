self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
});

var cacheName = 'v1';
var appShellFiles = [
    './explore.html',
    './game.html',
    './icon-128x128.png',
    './icon-144x144.png',
    './icon-152x152.png',
    './icon-192x192.png',
    './icon-256x256.png',
    './icon-512x512.png',
    './index.html',
    './manifest.json',
];

self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(appShellFiles);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
