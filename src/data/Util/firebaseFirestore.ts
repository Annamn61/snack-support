import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getFirestore, query, where } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import { firebaseApp } from "./firebaseInit";

const db = getFirestore(firebaseApp);

export async function writeUserFood(name: string, id: number, amount: number, unit: string, day: Dayjs) {
  const result = await addDoc(collection(db, 'users/' + name + '/foods'), {
    id,
    addedDate: day.valueOf(),
    amount,
    unit,
  });
  return (result as any)._key.path.segments[3];
}

export async function deleteUserFood(user_uid: string, uuid: string) {
  const result = await deleteDoc(doc(db, 'users/' + user_uid + '/foods', uuid));
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

export const getFoodsInRange = async (user_uid: string, startDate: Dayjs, numberOfDays: number) => {
  const midnightStart = startDate.set('hour', 0).set('minute', 0).set('second', 0);
  const midnightEnd = startDate.add(numberOfDays - 1, 'day').set('hour', 23).set('minute', 59).set('second', 59);

  const currentUser = query(collection(db, "users", user_uid, "foods"), where("addedDate", ">=", Number(midnightStart)), where("addedDate", "<", Number(midnightEnd)));

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

export async function getUserFoods(user_uid: string, from: number) {
  let queryFrom = new Date();
  queryFrom.setDate(queryFrom.getDate() - from);

  const currentUser = query(collection(db, "users", user_uid, "foods"), where("addedDate", ">=", Number(queryFrom)));

  const querySnapshot = await getDocs(currentUser);
  let foodsList: { pk: string; }[] = [];
  querySnapshot.forEach((doc) => {
    foodsList.push({
      ...doc.data(),
      pk: doc.id
    })
  });
  return foodsList;
}