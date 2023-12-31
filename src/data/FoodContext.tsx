
// Context.js
import dayjs, { Dayjs } from "dayjs";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { getReadableTimeHorizonFoods, getRecommendedFoods, getTotalPercentDVWithSelectedFood, sortPercentDV, getNormalizedFood } from "./Helpers/foodCalcHelpers";
import { deleteUserFood, getFoodsInRange, writeUserFood } from "./Util/firebaseFirestore";
import { FoodCalcs } from "./Util/types";

export const FoodContext = createContext<FoodCalcs>({
    timeHorizonFoods: [],
    addFoodToDay: function (id: any, amount: number, unit: string): void {
        throw new Error("Function not implemented.");
    },
    selectedNutrient: undefined,
    setSelectedNutrient: function (nutrient: string | undefined): void {
        throw new Error("Function not implemented.");
    },
    selectedFood: undefined,
    setSelectedFood: function (food: number | undefined): void {
        throw new Error("Function not implemented.");
    },
    setSelectedFoodAmounts: function (sFA: { amount: number; unit: string; }): void {
        throw new Error("Function not implemented.");
    },
    recommendationType: "",
    setRecommendationType: function (recType: string): void {
        throw new Error("Function not implemented.");
    },
    recommendedFoods: [],
    todaysNutrients: [],
    timeHorizon: {
        startDate: dayjs(),
        length: 0
    },
    setTimeHorizon: function (tH: { startDate: Dayjs; length: number; }): void {
        throw new Error("Function not implemented.");
    },
    user_uid: '',
});

export const FoodContextProvider = ({ children, user }: any) => {
    const [timeHorizonFoods, setTimeHorizonFoods] = useState<any[][]>([]);
    const [timeHorizon, setTimeHorizon] = useState<{ startDate: Dayjs, length: number }>({ startDate: dayjs().set('hour', 0).set('minute', 0).set('second', 0), length: 1 });
    const [selectedNutrient, setSelectedNutrient] = useState<string | undefined>(undefined);
    const [selectedFood, setSelectedFood] = useState<number | undefined>(undefined);
    const [selectedFoodAmounts, setSelectedFoodAmounts] = useState<{ amount: number, unit: string }>({ amount: 1, unit: 'serving' });
    const [recommendationType, setRecommendationType] = useState('serving');
    const [dataUpdate, setDataUpdate] = useState(false);
    const readableTimeHorizonFoods = useMemo(() => getReadableTimeHorizonFoods(timeHorizonFoods), [timeHorizonFoods]);
    const recommendedFoods = useMemo(() => getRecommendedFoods(readableTimeHorizonFoods, selectedNutrient, recommendationType), [readableTimeHorizonFoods, selectedNutrient, recommendationType]);
    const todaysNutrients = useMemo(() => getTotalPercentDVWithSelectedFood(readableTimeHorizonFoods, selectedFoodAmounts, selectedFood).sort(sortPercentDV), [readableTimeHorizonFoods, selectedFood, selectedFoodAmounts]); //may add other sort types ?


    useEffect(() => {
        console.log(timeHorizon.length);
    }, [timeHorizon]);

    useEffect(() => {
        getFoodsInRange(user.uid, timeHorizon.startDate, timeHorizon.length).then(result => {
            const res = result as { id: any, amount: number, unit: string, pk: string }[][];
            if (res.length === 1 && res[0].length === 0) {
                setTimeHorizonFoods([]);
            } else {
                setTimeHorizonFoods(res as any[][]);
            }
        });
        setDataUpdate(false);
    }, [timeHorizon, dataUpdate]);

    const addFoodToDay = async (id: any, amount: number, unit: string) => {
        const day = timeHorizon.startDate.add((timeHorizon.length - 1), 'day');
        await writeUserFood(user.uid, id, amount, unit, day).then(() => setDataUpdate(true));
    }

    const removeFoodFromToday = (pk: number) => {
        const thFcopy = [...timeHorizonFoods];
        timeHorizonFoods.forEach((day, index) => {
            const newDay = day.filter(food => food.pk !== pk);
            thFcopy[index] = newDay;
        })
        setTimeHorizonFoods(thFcopy);
        deleteUserFood(user.uid, `${pk}`);
    };

    return (
        <FoodContext.Provider value={
            {
                timeHorizonFoods,
                addFoodToDay,
                removeFoodFromToday,
                selectedNutrient,
                setSelectedNutrient,
                selectedFood,
                setSelectedFood,
                setSelectedFoodAmounts,
                recommendationType,
                setRecommendationType,
                recommendedFoods,
                todaysNutrients,
                timeHorizon,
                setTimeHorizon,
                user_uid: user.uid
            }
        }>
            {children}
        </FoodContext.Provider>
    );
};