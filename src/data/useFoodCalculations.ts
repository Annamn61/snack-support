import { useEffect, useMemo, useState } from "react";
import { baseFoods } from "./BaseFoods/_BaseIndex";
import { DailyNutrientPercent } from "./Util/types";
import { pineapple } from "./Util/TestIngredient";
import { DRIs } from "./Util/DRIs";
import { today } from "./Util/TestDay";
import { normalizeFoodsByCalories, normalizeFoodsByGrams } from "./Helpers/foodCalcHelpers";

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
        score += Math.min(dailyRemainingPercent ? 100 - dailyRemainingPercent : 100, singleServingPercent);
        // console.log(element.name, dailyRemainingPercent ? 100 - dailyRemainingPercent : 100, '|', singleServingPercent);
    });
    return score;
}

// looks at todays food items, returns all nutrients or vitamin by selected unit type
// returns recommended foods (name, image, percent, amount, units) sorted by ranking
const getRecommendedFoods = (todaysFoodByServing: any[], selectedNutrient: string | undefined, type: string) => {


    const getNormalizedFood = () => {
        switch (type) {
            case 'calories':
                return normalizeFoodsByCalories(baseFoods, 100);
            case 'grams':
                return normalizeFoodsByGrams(baseFoods, 100);
            default:
                return baseFoods
        };
    }
    const foodsToUse = getNormalizedFood();

    const todaysPercents = getTodaysNutrients(todaysFoodByServing);
    const rankings = foodsToUse.map((food) => {
        const score = calculateRecommendedScore(todaysPercents, food.nutrition.nutrients, selectedNutrient);

        console.log('food', food);
        // TODO: convert food item to grams for the unit, or pass the unit down?

        return {
            item: food,
            score: score,
            percent: selectedNutrient ? score : undefined,
        }
    })
    return rankings.sort(sortRankings);
}


// looks at todays nutrients
// return [{ name, percentDV, percentOfSelectedFood }]
const getTodaysNutrients = (todaysFood: any[], selectedFood?: any) => {
    const todaysSum = pineapple;
    return DRIs[0].micronutrients.map(element => {
        const todaysNutrient = todaysSum.nutrition.nutrients.find(nutrient => nutrient.name === element.name);
        let percent = (todaysNutrient ? todaysNutrient.amount / element.amount : 0) * 100
        const selectedFoodNutrients = selectedFood?.item.nutrition.nutrients.find((nutrient: { name: string; }) => nutrient.name === element.name);
        let percentOfSelectedFood = (selectedFoodNutrients ? selectedFoodNutrients.amount / element.amount : 0) * 100
        if (element.amount === 0) percent = 0;
        return {
            name: element.name,
            percentDV: +(percent.toFixed(2)),
            percentOfSelectedFood: percentOfSelectedFood,
        }
    });
}

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
    const [todaysFood, setTodaysFood] = useState(today);
    const [selectedNutrient, setSelectedNutrient] = useState<string | undefined>(undefined);
    const [selectedFood, setSelectedFood] = useState();
    // const [timeHorizon, setTimeHorizon] = useState(1); // could be 1, 3, 7, 28 days
    const [recommendationType, setRecommendationType] = useState('servings');
    const recommendedFoods = useMemo(() => getRecommendedFoods(todaysFood, selectedNutrient, recommendationType), [todaysFood, selectedNutrient, recommendationType]);
    const todaysNutrients = useMemo(() => getTodaysNutrients(todaysFood, selectedFood).sort(sortPercentDV), [todaysFood, selectedFood]); //may add other sort types ? 

    useEffect(() => {
        console.log('selectedNutrient change', selectedNutrient);
    }, [selectedNutrient])

    const addFoodToToday = (item: any, amount: number, unit: string) => {
        const newItem = 'hi';
        // setTodaysFood(todaysFood + newItem)
    }

    return {
        todaysFood,
        addFoodToToday,
        selectedNutrient,
        setSelectedNutrient,
        selectedFood,
        setSelectedFood,
        recommendationType,
        setRecommendationType,
        recommendedFoods,
        todaysNutrients,
    }
}