// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

const firebaseConfig = JSON.parse(
  process.env.REACT_APP_FIREBASE_CONFIG || false
);

if (firebaseConfig) {
  console.log(`Initializing firebase analytics.`);
  firebase.initializeApp(firebaseConfig);
}
