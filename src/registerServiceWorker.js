/* eslint-disable no-console */

import { Workbox } from "workbox-window/Workbox.mjs";

export let workBox;

if ("serviceWorker" in navigator) {
  workBox = new Workbox("/service-worker.js");

  // Register the service worker after event listeners have been added.
  // By default this method delays registration until after the window has loaded.
  workBox.register();
}
