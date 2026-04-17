// Intercepts every network request made by the app
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // 🚫 IMPORTANT: Do NOT intercept Firebase Storage requests
  if (url.includes("firebasestorage.googleapis.com")) {
    return; // Let the browser handle it normally
  }

  // Default offline-first caching for everything else
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
