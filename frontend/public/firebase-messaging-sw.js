// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBSAySgy2Armd6wsxWpg5SG0KVyVgGqZl8",
  authDomain: "water-level-sensor-b2715.firebaseapp.com",
  projectId: "water-level-sensor-b2715",
  storageBucket: "water-level-sensor-b2715.appspot.com",
  messagingSenderId: "277295265116",
  appId: "1:277295265116:web:e5b573651bc7ae51133d99",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = `River Alert - ${payload.data.river}`;
  const notificationOptions = {
    body:
      payload.data.severity == "warn"
        ? `Siaga 🟡`
        : payload.data.severity == "danger"
        ? `Waspada 🔴`
        : `Awas 🚨🚨🚨`,
    requireInteraction: true,
    vibration:
      payload.data.severity == "warn"
        ? [1000,1000,1000]
        : payload.data.severity == "danger"
        ? [500,500,500]
        : [100,100,100,100,100,100,100,100,100]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
