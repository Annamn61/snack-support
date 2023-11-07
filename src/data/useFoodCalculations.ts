import { useEffect, useMemo, useState } from "react";
import { baseFoods } from "./BaseFoods/_BaseIndex";
import { DailyNutrientPercent } from "./Util/types";
import { DRIs } from "./Util/DRIs";
import { getTotalPercentDVWithSelectedFood, getNormalizedFood, normalizeFoodsByCalories, normalizeFoodsByGrams } from "./Helpers/foodCalcHelpers";
import { deleteUserFood, getFoodsInRange, getUserFoods, writeUserFood } from "./Util/firebase";
import { v4 as uuidv4 } from 'uuid';

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
const getRecommendedFoods = (todaysFoodByServing: any[], selectedNutrient: string | undefined, type: string) => {

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

    const todaysPercents = getTotalPercentDVWithSelectedFood(todaysFoodByServing);
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

export function useFoodCalculations() {
    // TODO: get todays food from firebase
    const [todaysFood, setTodaysFood] = useState<any[]>([]);
    const [timeHorizon, setTimeHorizon] = useState<number>(30);
    const [selectedNutrient, setSelectedNutrient] = useState<string | undefined>(undefined);
    const [selectedFood, setSelectedFood] = useState<number | undefined>(undefined);
    const [selectedFoodAmounts, setSelectedFoodAmounts] = useState<{ amount: number, unit: string }>({ amount: 1, unit: 'serving' });
    // const [selectedFood, setSelectedFood] = useState();
    // const [timeHorizon, setTimeHorizon] = useState(1); // could be 1, 3, 7, 28 days
    const [recommendationType, setRecommendationType] = useState('serving');
    const recommendedFoods = useMemo(() => getRecommendedFoods(todaysFood, selectedNutrient, recommendationType), [todaysFood, selectedNutrient, recommendationType]);
    const todaysNutrients = useMemo(() => getTotalPercentDVWithSelectedFood(todaysFood, selectedFoodAmounts, selectedFood).sort(sortPercentDV), [todaysFood, selectedFood, selectedFoodAmounts]); //may add other sort types ? 
    // const dayRangeFoods = useMemo(() => getTotalPercentDVWithSelectedFood(todaysFood, selectedFoodAmounts, selectedFood).sort(sortPercentDV), [todaysFood, selectedFood, selectedFoodAmounts]); //may add other sort types ? 

    useEffect(() => {
        getUserFoods('anna', timeHorizon).then(result => {
            const res = result as { id: any, amount: number, unit: string, pk: string }[]
            setTodaysFoodsRemote(res);
        });
    }, [timeHorizon]);

    useEffect(() => {
        if (todaysFood.length < 1) return;
        if (todaysFood.length < 2) return;
    }, [todaysFood]);

    const addFoodToToday = async (id: any, amount: number, unit: string) => {
        const uuid = await writeUserFood('anna', id, amount, unit);
        const newFood = getNormalizedFood(id, amount, unit);
        const addedFoodItem = { ...newFood, pk: uuid }
        if (newFood === undefined) return;
        setTodaysFood([addedFoodItem, ...todaysFood]);
    }

    const setTodaysFoodsRemote = async (foods: { id: any, amount: number, unit: string, pk: string }[]) => {
        const foodsToSet = foods.map(food => {
            return { ...getNormalizedFood(food.id, food.amount, food.unit), pk: food.pk }
        })
        setTodaysFood(foodsToSet);
    }

    // const printFoodsFromRemoteTest = () => {

    // }

    const removeFoodFromToday = (pk: number) => {
        const newFood = todaysFood.filter(food => food.pk !== pk);
        setTodaysFood(newFood);
        deleteUserFood(`${pk}`);
    };

    return {
        todaysFood,
        addFoodToToday,
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
    }
}