import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDSd5oRdgVqUF8Y970Eky4r8dgIRFhlII4",
  authDomain: "taskmanagermentapp.firebaseapp.com",
  databaseURL: "https://taskmanagermentapp.firebaseio.com",
  projectId: "taskmanagermentapp",
  storageBucket: "taskmanagermentapp.appspot.com",
  messagingSenderId: "779963213646",
  appId: "1:779963213646:web:4c501b798d4a366fed601f"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);