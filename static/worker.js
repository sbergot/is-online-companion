"use strict";

const version = 'v1::';

// const offlineFundamentals = [
//   '',
//   'main.bundle.js',
//   'tailwindcss.min.css'
// ];

// self.addEventListener("install", function(event) {
//   console.log('WORKER: install event in progress.');
//   event.waitUntil(
//     caches
//       .open(version + 'fundamentals')
//       .then(function(cache) {
//         return cache.addAll(offlineFundamentals);
//       })
//       .then(function() {
//         console.log('WORKER: install completed');
//       })
//   );
// });

self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();

          caches
            .open(version + 'pages')
            .then(function add(cache) {
              return cache.put(event.request, cacheCopy);
            });

          return response;
        }

        function unableToResolve () {
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
  );
});