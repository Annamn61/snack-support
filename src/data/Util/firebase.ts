import { getDatabase, ref, set } from "firebase/database";

export const firebaseConfig = {
    // ...
    databaseURL: "https://nutrition-app-44b06-default-rtdb.firebaseio.com",
};

export function writeTestData(id: number, name: string, email: string) {
    const db = getDatabase();
    set(ref(db, 'test/' + id), {
        one: name,
        two: email,
    });
}

export function writeUserFood(name: string, id: number, amount: number, unit: string, date?: string) {
    let formattedDate = date ? new Date(date) : new Date();
    const db = getDatabase();
    set(ref(db, 'userFood/' + name + '/' + formattedDate), {
        id,
        amount,
        unit,
    });
}

export function getUserFoods(name: string, startDate: number, endDate: string) {
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