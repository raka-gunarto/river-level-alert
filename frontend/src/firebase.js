import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBSAySgy2Armd6wsxWpg5SG0KVyVgGqZl8",
  authDomain: "water-level-sensor-b2715.firebaseapp.com",
  databaseURL: "https://water-level-sensor-b2715-default-rtdb.firebaseio.com",
  projectId: "water-level-sensor-b2715",
  storageBucket: "water-level-sensor-b2715.appspot.com",
  messagingSenderId: "277295265116",
  appId: "1:277295265116:web:e5b573651bc7ae51133d99",
  measurementId: "G-C67JHN9ZZB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging
  .getToken({
    vapidKey:
      "BI3t_wyBZlVTeCsDYbELEohTdbYS09JiXMcvNLonrlzAnr9rrHxSIiPJx3JjYfn6cKR7FVpKOykAaeeqVxCpuks",
  })
  .then((currentToken) =>
    currentToken
      ? window.localStorage.setItem("fcmToken", currentToken)
      : window.localStorage.removeItem("fcmToken")
  );
