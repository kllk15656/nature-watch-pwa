// Runs when the service worker is first installed
self.addEventListener("install", () => {
  console.log("Service worker installed");
});
// Runs after installation and takes control of the app
self.addEventListener("activate", () => {
  console.log("Service worker activated");
});
