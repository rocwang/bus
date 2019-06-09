import { Workbox } from "workbox-window/Workbox.mjs";

export const workBox = new Workbox("/service-worker.js");

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  // Register the service worker after event listeners have been added.
  // By default this method delays registration until after the window has loaded.
  workBox.register();
}
