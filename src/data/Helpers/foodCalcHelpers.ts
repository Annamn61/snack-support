import dayjs from "dayjs";
import { baseFoods } from "../BaseFoods/_BaseIndex";
import { DRIs } from "../Util/DRIs";
import { DailyNutrientPercent } from "../Util/types";

export const normalizeFoodsByCalories = (calories: number) => {
    return baseFoods.map((food) => {
        return getNormalizedFood(food.id, calories, 'calories');
    })
}

export const normalizeFoodsByGrams = (grams: number) => {
    return baseFoods.map((food) => {
        return getNormalizedFood(food.id, grams, 'grams');
    })
}

export const getFoodById = (id: number | undefined) => {
    if(!id) return;
    return baseFoods.find(food => food.id === id);
}

export const getNormalizedFood = (id: number,  amount: number, unit: string) => {
    const food = baseFoods.find(food => food.id === id);
    if (!food) return;
    //get multiplier by unit type
    let multiplier = amount;
    if (unit === 'calories') {
        const caloriesAmount = food.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Calories');
        if (!caloriesAmount) return;
        multiplier = amount / caloriesAmount.amount;
    } else if (unit === 'grams') {
        multiplier = amount / food.nutrition.weightPerServing.amount;
    } else if (unit === 'serving') {
        // TODO: fix, serving size is not always 1 because basefoods are not normalized always
        multiplier = amount; // food.nutrition.weightPerServing.amount;
    }

    const normalizedNutrients = food.nutrition.nutrients.map((nutrient: { amount: number; }) => {
        return {
            ...nutrient,
            amount: nutrient.amount * multiplier,
        }
    })

    const normalizedFlavenoids = food.nutrition.flavonoids.map((flavonoid: { amount: number; }) => {
        return {
            ...flavonoid,
            amount: flavonoid.amount * multiplier,
        }
    })

    return {
        ...food,
        estimatedCost: {
            unit: food.estimatedCost.unit,
            value: food.estimatedCost.value * multiplier,
        },
        amount: food.amount * multiplier,
        nutrition: {
            ...food.nutrition,
            flavenoids: normalizedFlavenoids,
            caloricBreakdown: {
                percentCarbs: food.nutrition.caloricBreakdown.percentCarbs * multiplier,
                percentFat: food.nutrition.caloricBreakdown.percentFat * multiplier,
                percentProtein: food.nutrition.caloricBreakdown.percentProtein * multiplier,
            },
            nutrients: normalizedNutrients,
        }
    }
}

const percentFromDV = (dri: {amount: number}, nutrient: {amount: number}) => {
    return (nutrient ? nutrient.amount / dri.amount : 0) * 100;
}

const getNutrient = (searchName: string, nutrients: any[]) => {
    return nutrients?.find((nutrient: { name: string; }) => nutrient.name === searchName);
}

export const getTotalNutrientAmount = (foodList: any[]) => {
    const todaysNutrientSum = JSON.parse(JSON.stringify(foodList)).reduce((acc: any[], food: { nutrition: { nutrients: any[]; }; }) => {
        food.nutrition.nutrients.forEach((nutrient: any) => {
            const existingNutrient = acc.find((accNutrient: any) => accNutrient.name === nutrient.name);
            if (existingNutrient) {
                existingNutrient.amount += nutrient.amount;
            } else {
                acc.push(nutrient);
            }
        })
        return acc;
    }, []);
    return todaysNutrientSum
}

export const getTotaPercentDVByDay = (foodList: any[], days: number) => {
    return getTotalPercentDVWithSelectedFood(foodList).map((nutrient: { name: string; percentDV: number; }) => {
        return {
            name: nutrient.name,
            percentDV: nutrient.percentDV / days,
        }
    })
};

export const getTotalPercentDVWithSelectedFood = (timeHorizonFoods: any[], selectedFoodAmounts?: { amount: number, unit: string }, selectedFood?: number) => {

    //sum all nutrients from todaysFood.nutrition.nutrients
    const todaysNutrientSum = getTotalNutrientAmount(timeHorizonFoods);

    // normalize selected food to selectedFoodAmounts
    const normalizedFood: any | undefined = selectedFood && selectedFoodAmounts ? getNormalizedFood(selectedFood, selectedFoodAmounts.amount, selectedFoodAmounts.unit) : undefined;

    return DRIs[0].micronutrients.map((dri: { name: any; amount: number; }) => {
        const todaysNutrient = getNutrient(dri.name, todaysNutrientSum);
        let percent = percentFromDV(dri, todaysNutrient);
        const selectedFoodNutrient = getNutrient(dri.name, normalizedFood?.nutrition.nutrients);
        let percentOfSelectedFood = percentFromDV(dri, selectedFoodNutrient);
        if (dri.amount === 0) percent = 0;

        // return object
        return {
            name: dri.name,
            percentDV: +(percent.toFixed(2)),
            percentOfSelectedFood: percentOfSelectedFood,
        }
    });
}

export const sortPercentDV = (a: { name: string, percentDV: number }, b: { name: string, percentDV: number }) => {
    return a.percentDV - b.percentDV;
}

export const sortRankings = (a: {
    item: any,
    score: number,
}, b: {
    item: any,
    score: number,
}) => {
    return b.score - a.score
}

export const getReadableTimeHorizonFoods = (tHF: any[][]) => {
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

export const getFoodNamesAndIds = () => {
    return baseFoods.map((food) => {
        return {
            name: food.name,
            id: food.id,
        }
    })
}

export const getFoodNames = () => {
    return baseFoods.map((food) => food.name);
}

export const getIdFromName = (name: string | null) => {
    if(!name) return null;
    let foundId = null;
    baseFoods.forEach(food => {
        if(food.name === name) {
            foundId = food.id;
            return;
        }
    })
    return foundId;
}


// looks at todays food items, returns all nutrients or vitamin by selected unit type
// returns recommended foods (name, image, percent, amount, units) sorted by ranking
export const getRecommendedFoods = (timeHorizonFoods: any[], selectedNutrient: string | undefined, type: string) => {

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

export const convertTimeHorizonLengthToSelect = (length: number) => {
    if (length === 1) return 'day'
    if (length === 7) return 'week'
    return 'month';
  }

  export const convertTimeHorizonLengthToSelectRelative = (length: number) => {
    if (length === 1) return 'Today'
    if (length === 7) return 'This Week'
    return 'This Month';
  }