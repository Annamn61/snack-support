import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import dayjs, { Dayjs } from "dayjs";


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
  return (result as any)._key.path.segments[3];
}

export async function deleteUserFood(uuid: string) {
  const name = 'anna';
  const result = await deleteDoc(doc(db, 'users/' + name + '/foods', uuid));
}

const sortFoodsIntoDays = (startTime: number, numberOfDays: number, foods: any[]) => {
  const dayArray: any[][] = new Array(numberOfDays).fill([]);
  foods.forEach((food) => {
    const difference = food.addedDate - startTime;
    const index = Math.floor(difference / (24 * 60 * 60 * 1000));
    dayArray[index] = [...dayArray[index], food];
  })
  return dayArray;
}

export const getFoodsInRange = async (startDate: Dayjs, numberOfDays: number) => {
  const midnightStart = startDate.set('hour', 0).set('minute', 0).set('second', 0);
  const midnightEnd = startDate.add(numberOfDays - 1, 'day').set('hour', 23).set('minute', 59).set('second', 59);

  // const usersRef = collection(db, "users");
  const currentUser = query(collection(db, "users", "anna", "foods"), where("addedDate", ">=", Number(midnightStart)), where("addedDate", "<", Number(midnightEnd)));

  const querySnapshot = await getDocs(currentUser);
  let foodsList: { pk: string; }[] = [];
  querySnapshot.forEach((doc) => {
    foodsList.push({
      ...doc.data(),
      pk: doc.id
    })
  });

  return sortFoodsIntoDays(midnightStart.valueOf(), numberOfDays, foodsList);;
} 

export async function getUserFoods(name: string, from: number) {
  // getRange(1, 2);
  let queryFrom = new Date();
  queryFrom.setDate(queryFrom.getDate() - from);

  const usersRef = collection(db, "users");
  // console.log(queryFrom);
  const currentUser = query(collection(db, "users", "anna", "foods"), where("addedDate", ">=", Number(queryFrom)));

  const querySnapshot = await getDocs(currentUser);
  let foodsList: { pk: string; }[] = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    foodsList.push({
      ...doc.data(),
      pk: doc.id
    })
  });
  return foodsList;
}