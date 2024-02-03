import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC3jqJSsJ5JJO5uPo9dT7oJBIhXB15x6NA",
  authDomain: "ablis-control-panel.firebaseapp.com",
  projectId: "ablis-control-panel",
  storageBucket: "ablis-control-panel.appspot.com",
  messagingSenderId: "253767075269",
  appId: "1:253767075269:web:bf96a050108891464037ac",
  measurementId: "G-CFJM2DRS6K",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase();