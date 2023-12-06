import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA5u3MqdBNNOkvVcVvzvu4_6jIiHZozx2g",
    authDomain: "nutrition-app-44b06.firebaseapp.com",
    databaseURL: "https://nutrition-app-44b06-default-rtdb.firebaseio.com",
    projectId: "nutrition-app-44b06",
    storageBucket: "nutrition-app-44b06.appspot.com",
    messagingSenderId: "738554110129",
    appId: "1:738554110129:web:d266d869244a1410380290",
    measurementId: "G-9R42V7RJEE"
  };
  
  export const firebaseApp = initializeApp(firebaseConfig);