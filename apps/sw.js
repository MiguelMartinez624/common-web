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
const version = 'v1'; // Update version number for significant changes

const cacheNameWithVersion = `${CACHE_NAME}-${version}`;
// Install event handler
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheNameWithVersion)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event handler (with cache invalidation)
self.addEventListener('activate', (event) => {
    const expectedCacheName = cacheNameWithVersion;
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
    event.respondWith(
        // Check cache first
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Check if cache is expired
                    const cachedTime = cachedResponse.headers.get('X-Cache-Time'); // Custom header for cache timestamp
                    if (!cachedTime || Date.now() - cachedTime > (24 * 60 * 60 * 1000)) { // 24 hours in milliseconds
                        console.log('Cached response expired, fetching new data');
                        return fetch(event.request);
                    }
                    return cachedResponse;
                }

                // If no cache or expired, fetch from network and potentially cache again
                return fetch(event.request)
                    .then((response) => {
                        if (response.status === 200 && event.request.method !== 'POST') {
                            const clonedResponse = response.clone();
                            caches.open(cacheNameWithVersion)
                                .then((cache) => {
                                    // Add cache expiration header
                                    const newHeaders = new Headers(response.headers);
                                    newHeaders.set('X-Cache-Time', new Date().toString()); // Set custom cache timestamp header
                                    clonedResponse.headers = newHeaders;
                                    cache.put(event.request, clonedResponse);
                                });
                        }
                        return response;
                    });
            })
    );
});