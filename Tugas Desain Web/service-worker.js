const CACHE_NAME = 'website-cache-v1'; // Ubah versi cache jika ada perubahan
const urlsToCache = [
    '/',
    'manifest.json',
    'index.html',
    'about.html',
    'contact.html',
    'App.js',
    '1.png',
];
// Install Service Worker dan cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event to serve cached files
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada dalam cache, kembalikan response
                if (response) {
                    return response;
                }

                // Jika tidak ada dalam cache, lakukan fetch
                return fetch(event.request).then((response) => {
                    // Cache response untuk permintaan yang berhasil
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                }).catch((error) => {
                    console.error('Fetching failed:', error);
                    // Tidak ada halaman offline, cukup kembalikan response kosong atau error
                });
            })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});