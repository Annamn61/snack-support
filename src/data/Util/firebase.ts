import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { getFirestore, query, where } from "firebase/firestore";
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

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
 
export async function writeUserFood(name: string, id: number, amount: number, unit: string, date?: string) {
    let formattedDate = date ? new Date(date) : new Date();
    const result = await addDoc(collection(db, 'users/' + name + '/foods'), {
        id,
        addedDate: Number(formattedDate),
        amount,
        unit,
      });
    // use their returned uuid not MINEs
    console.log('added', (result as any)._key.path.segments[3]);
    return (result as any)._key.path.segments[3];
}

export async function getUserFoods(name: string, from: string) {
    const subtract = from === 'week' ? 7 : 1;
    let queryFrom = new Date().getDate() - subtract;

    const usersRef = collection(db, "users");
    const currentUser = query(collection(db, "users", "anna", "foods"), where("id", "==", 11445));

    const querySnapshot = await getDocs(currentUser);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });

    // const dbRef = ref(getDatabase()).orderBy('addedDate');

    // get(child(dbRef, `userFood/${name}`)).then((snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log(snapshot.val());
    //     } else {
    //       console.log("No data available");
    //     }
    //   }).catch((error) => {
    //     console.error(error);
    //   });
      

    // let formattedDate = date ? new Date(date) : new Date();
    // const db = getDatabase();
    // set(ref(db, 'userFood/' + name + '/' + formattedDate), {
    //     id,
    //     amount,
    //     unit,
    // });
}

export function deleteUserFood(id: number, amount: string, email: string) {
    // const db = getDatabase();
    // set(ref(db, 'test/' + id), {
    //     one: name,
    //     two: email,
    // });
}