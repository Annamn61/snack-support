import { baseFoods } from "../BaseFoods/_BaseIndex";
import { DRIs } from "../Util/DRIs";

export const sortRankings = (a: {
    name: string,
    image: string,
    percent: number,
}, b: {
    name: string,
    image: string,
    percent: number,
}) => {
    return b.percent - a.percent
}

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

export const getTotalPercentDVWithSelectedFood = (todaysFood: any[], selectedFoodAmounts?: { amount: number, unit: string }, selectedFood?: number) => {

    //sum all nutrients from todaysFood.nutrition.nutrients
    const todaysNutrientSum = getTotalNutrientAmount(todaysFood);

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