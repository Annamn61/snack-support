 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";

//  const firebaseConfig2 = {
//    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//    authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//    projectId: "XXXXXXXXXXXXXXXXX",
//    storageBucket: "XXXXXXXXXXXXXXXXXXXXXXXX",
 
//    messagingSenderId: "XXXXXXXXXXXXXXX",
//    appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
//  };

 export const firebaseConfig = {
    projectId: 'nutrition-app-44b06',
    databaseURL: "https://nutrition-app-44b06-default-rtdb.firebaseio.com",
};
 
 const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);