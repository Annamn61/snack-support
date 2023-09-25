import { baseFoods } from "../BaseFoods/_BaseIndex";

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

export const getFoodById = (id: number,  amount: number, unit: string) => {
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