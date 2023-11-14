import { useEffect, useMemo, useState } from "react";
import { baseFoods } from "./BaseFoods/_BaseIndex";
import { DailyNutrientPercent } from "./Util/types";
import { DRIs } from "./Util/DRIs";
import { getTotalPercentDVWithSelectedFood, getNormalizedFood, normalizeFoodsByCalories, normalizeFoodsByGrams } from "./Helpers/foodCalcHelpers";
import { deleteUserFood, getFoodsInRange, getUserFoods, writeUserFood } from "./Util/firebase";
import dayjs, { Dayjs } from "dayjs";

export interface FoodCalcs {
    timeHorizonFoods: any[][];
    addFoodToDay: (day: Dayjs, id: any, amount: number, unit: string) => void;
    removeFoodFromToday?: any, // FIX THIS
    selectedNutrient: string | undefined,
    setSelectedNutrient: (nutrient: string | undefined) => void;
    selectedFood: number | undefined,
    setSelectedFood: (food:( number | undefined)) => void;
    setSelectedFoodAmounts: (sFA : { amount: number, unit: string }) => void;
    recommendationType: string,
    setRecommendationType: (recType: string) => void,
    recommendedFoods: {
        item: any;
        score: number;
        percent: number | undefined;
    }[],
    todaysNutrients: {
        name: any;
        percentDV: number;
        percentOfSelectedFood: number;
    }[],
    timeHorizon: {
        startDate: Dayjs;
        length: number;
    },
    setTimeHorizon: (tH: {
        startDate: Dayjs;
        length: number;
    }) => void,
}

const calculateRecommendedScore = (todaysPercents: DailyNutrientPercent[], foodItemNutrients: any[], selectedNutrient: string | undefined) => {
    let score = 0;
    let selectedNutrientDRI: { name: string; amount: number; unit: string; }[] = [];
    if (selectedNutrient) {
        let nutrientDri = DRIs[0].micronutrients.find((nut) => nut.name === selectedNutrient);
        selectedNutrientDRI = nutrientDri ? [nutrientDri] : [];
    }
    let scoredDris = selectedNutrient ? selectedNutrientDRI : DRIs[0].micronutrients;
    scoredDris.forEach(element => {
        const nutrientInformation = foodItemNutrients.find(foodItemNutrients => foodItemNutrients.name === element.name);
        let singleServingPercent = (nutrientInformation ? nutrientInformation.amount / element.amount : 0) * 100
        if (element.amount === 0) singleServingPercent = 0;
        const dailyRemainingPercent = todaysPercents.find(todaysElement => element.name === todaysElement.name)?.percentDV
        score += selectedNutrient ? singleServingPercent : Math.min(dailyRemainingPercent ? 100 - dailyRemainingPercent : 100, singleServingPercent);
    });
    return score;
}

// looks at todays food items, returns all nutrients or vitamin by selected unit type
// returns recommended foods (name, image, percent, amount, units) sorted by ranking
const getRecommendedFoods = (timeHorizonFoods: any[], selectedNutrient: string | undefined, type: string) => {

    const getNormalizedFood = () => {
        switch (type) {
            case 'calorie':
                return normalizeFoodsByCalories(100);
            case 'gram':
                return normalizeFoodsByGrams(100);
            default:
                return baseFoods
        };
    }
    const foodsToUse: any[] = getNormalizedFood();

    const todaysPercents = getTotalPercentDVWithSelectedFood(timeHorizonFoods);
    const rankings = foodsToUse.map((food) => {
        const score = calculateRecommendedScore(todaysPercents, food.nutrition.nutrients, selectedNutrient);
        // TODO: convert food item to grams for the unit, or pass the unit down?

        return {
            item: food,
            score: score,
            percent: selectedNutrient ? score : undefined,
        }
    })
    return rankings.sort(sortRankings);
}


// // looks at todays nutrients
// // return [{ name, percentDV, percentOfSelectedFood }]
// const getTodaysNutrients = (todaysFood: any[], selectedFoodAmounts?: { amount: number, unit: string }, selectedFood?: number,) => {

//     //sum all nutrients from todaysFood.nutrition.nutrients
//     const todaysNutrientSum = NutrientSum(todaysFood);

//     // normalize selected food to selectedFoodAmounts
//     const normalizedFood: any | undefined = selectedFood && selectedFoodAmounts ? getNormalizedFood(selectedFood, selectedFoodAmounts.amount, selectedFoodAmounts.unit) : undefined;

//     return DRIs[0].micronutrients.map(element => {
//         const todaysNutrient = todaysNutrientSum.find((nutrient: { name: string; }) => nutrient.name === element.name);
//         let percent = (todaysNutrient ? todaysNutrient.amount / element.amount : 0) * 100
//         const selectedFoodNutrients = normalizedFood?.nutrition.nutrients.find((nutrient: { name: string; }) => nutrient.name === element.name);
//         let percentOfSelectedFood = (selectedFoodNutrients ? selectedFoodNutrients.amount / element.amount : 0) * 100
//         if (element.amount === 0) percent = 0;
//         return {
//             name: element.name,
//             percentDV: +(percent.toFixed(2)),
//             percentOfSelectedFood: percentOfSelectedFood,
//         }
//     });
// }

const sortPercentDV = (a: { name: string, percentDV: number }, b: { name: string, percentDV: number }) => {
    return a.percentDV - b.percentDV;
}

const sortRankings = (a: {
    item: any,
    score: number,
}, b: {
    item: any,
    score: number,
}) => {
    return b.score - a.score
}

const getReadableTimeHorizonFoods = (tHF: any[][]) => {
    // Remove first few days of not the same month 
    let newTHF: any[][] = [...tHF];
    if (tHF.length > 7) {
        tHF.forEach((foodSet, index) => {
            // removes foods from prior month
            if (index < 7 && foodSet.length > 0) {
                const foodDate = foodSet[0].addedDate;
                if(dayjs(foodDate).date() > 7) newTHF[index] = []
            }
            // removes foods from next month
            if (index > 27 && foodSet.length > 0) {
                const foodDate = foodSet[0].addedDate;
                if(dayjs(foodDate).date() < 7) newTHF[index] = []
            }
        })
    }

    const mergedTH = newTHF.flat(1);
    const foodsToSet = mergedTH.map(food => {
        return { ...getNormalizedFood(food.id, food.amount, food.unit), pk: food.pk }
    })
    return foodsToSet;
}

export function useFoodCalculations(): FoodCalcs {
    // TODO: get todays food from firebase
    const [timeHorizonFoods, setTimeHorizonFoods] = useState<any[][]>([]);
    const [timeHorizon, setTimeHorizon] = useState<{ startDate: Dayjs, length: number }>({ startDate: dayjs().set('hour', 0).set('minute', 0).set('second', 0), length: 1 });
    const [selectedNutrient, setSelectedNutrient] = useState<string | undefined>(undefined);
    const [selectedFood, setSelectedFood] = useState<number | undefined>(undefined);
    const [selectedFoodAmounts, setSelectedFoodAmounts] = useState<{ amount: number, unit: string }>({ amount: 1, unit: 'serving' });
    const [recommendationType, setRecommendationType] = useState('serving');
    const readableTimeHorizonFoods = useMemo(() => getReadableTimeHorizonFoods(timeHorizonFoods), [timeHorizonFoods]);
    const recommendedFoods = useMemo(() => getRecommendedFoods(readableTimeHorizonFoods, selectedNutrient, recommendationType), [readableTimeHorizonFoods, selectedNutrient, recommendationType]);
    const todaysNutrients = useMemo(() => getTotalPercentDVWithSelectedFood(readableTimeHorizonFoods, selectedFoodAmounts, selectedFood).sort(sortPercentDV), [readableTimeHorizonFoods, selectedFood, selectedFoodAmounts]); //may add other sort types ? 

    useEffect(() => {
        getFoodsInRange(timeHorizon.startDate, timeHorizon.length).then(result => {
            const res = result as { id: any, amount: number, unit: string, pk: string }[][];
            setTimeHorizonFoods(res as any[][]);
        });
    }, [timeHorizon]);

    const addFoodToDay = async (day: Dayjs, id: any, amount: number, unit: string) => {
        const uuid = await writeUserFood('anna', id, amount, unit, day);
        const newFood = getNormalizedFood(id, amount, unit);
        const addedFoodItem = { ...newFood, pk: uuid }
        if (newFood === undefined) return;
        // only add to THF if the day is within the time Horizon
        // setTimeHorizonFoods([addedFoodItem, ...timeHorizonFoods]);
    }

    // const setTimeHorizonFoodsRemote = async (foods: { id: any, amount: number, unit: string, pk: string }[][]) => {
    //     const foodsToSet = foods.map(food => {
    //         return { ...getNormalizedFood(food.id, food.amount, food.unit), pk: food.pk }
    //     })
    //     setTimeHorizonFoods(foodsToSet);
    // }

    // const removeFoodFromToday = (pk: number) => {
    //     const newFood = timeHorizonFoods.filter(food => food.pk !== pk);
    //     setTimeHorizonFoods(newFood);
    //     deleteUserFood(`${pk}`);
    // };

    return {
        timeHorizonFoods,
        addFoodToDay,
        // removeFoodFromToday,
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
    }
}