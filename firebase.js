import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyA7H9C-Zoa7s0VQaluGvDM8E7SlVKt8OnQ",
  authDomain: "gifted-chat-312a3.firebaseapp.com",
  projectId: "gifted-chat-312a3",
  storageBucket: "gifted-chat-312a3.appspot.com",
  messagingSenderId: "1077836626832",
  appId: "1:1077836626832:web:8b8b43347a9dc6f19d1115",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
