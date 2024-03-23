const CACHE_NAME = 'my-app-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/expenses.module.js',
    '/icons.js',
    '/sidebar.js',
    '/sidebar.html',
    '/manifest.json',
    // Add other static assets here, e.g., CSS, JavaScript, images
];

// Install event handler
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event handler
self.addEventListener('activate', (event) => {
    const expectedCacheName = CACHE_NAME;
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== expectedCacheName) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

// Fetch event handler (for offline content caching)
self.addEventListener('fetch', (event) => {
    console.log({event})
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Cache successful responses for future use
                        if (response.status === 200) {
                            const clonedResponse = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, clonedResponse);
                                });
                        }
                        return response;
                    });
            })
    );
});