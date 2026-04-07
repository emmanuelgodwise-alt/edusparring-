/// <reference lib="webworker" />

const CACHE_NAME = 'edusparring-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/edusparring-logo.svg',
  // Critical CSS and JS will be cached dynamically
];

// Install event - cache core assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching core assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately
  (self as any).skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all pages immediately
  (self as any).clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests for offline (they need real-time data)
  if (url.pathname.startsWith('/api/')) {
    // For API requests, try network first, then return cached if available
    event.respondWith(
      fetch(request)
        .then((response: Response) => {
          // Cache successful API responses for specific endpoints
          if (response.ok && shouldCacheAPI(url.pathname)) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // For static assets and pages - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update cache in background
        event.waitUntil(
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // Not in cache - fetch from network
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-match-results') {
    event.waitUntil(syncMatchResults());
  }
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Push notifications
self.addEventListener('push', (event: any) => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' },
    ],
  };

  event.waitUntil(
    (self as any).registration.showNotification(
      data.title || 'EduSparring',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    (self as any).clients.matchAll({ type: 'window' }).then((clients: any[]) => {
      // Check if app is already open
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if not
      if ((self as any).clients.openWindow) {
        return (self as any).clients.openWindow(url);
      }
    })
  );
});

// Helper functions
function shouldCacheAPI(pathname: string): boolean {
  const cacheableEndpoints = [
    '/api/questions',
    '/api/user',
    '/api/leaderboard',
    '/api/careers/jobs',
  ];
  return cacheableEndpoints.some((endpoint) => pathname.startsWith(endpoint));
}

async function syncMatchResults() {
  // Get pending match results from IndexedDB and sync
  console.log('[SW] Syncing match results...');
  // Implementation would read from IndexedDB and POST to server
}

async function syncMessages() {
  // Get pending messages from IndexedDB and sync
  console.log('[SW] Syncing messages...');
  // Implementation would read from IndexedDB and POST to server
}

export {};
