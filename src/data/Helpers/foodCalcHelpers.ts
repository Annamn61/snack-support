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

export const normalizeFoodsByCalories = (foods: any[], calories: number) => {
    return foods.map((food) => {
        const multiplier = calories / food.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Calories').amount;
        const foodCopy = JSON.parse(JSON.stringify(food));
        foodCopy.amount = food.amount * multiplier;
        food.nutrition.nutrients.forEach((nutrient: any, index: number) => {
            foodCopy.nutrition.nutrients[index].amount = nutrient.amount * multiplier
            foodCopy.nutrition.nutrients[index].percentOfDailyNeeds = nutrient.percentOfDailyNeeds * multiplier
        })
        return foodCopy;
    })
}

export const normalizeFoodsByGrams = (foods: any[], grams: number) => {
    return foods.map((food) => {
        const multiplier = grams / food.nutrition.weightPerServing.amount;
        const foodCopy = JSON.parse(JSON.stringify(food));
        foodCopy.amount = food.amount * multiplier;
        food.nutrition.nutrients.forEach((nutrient: any, index: number) => {
            foodCopy.nutrition.nutrients[index].amount = nutrient.amount * multiplier
            foodCopy.nutrition.nutrients[index].percentOfDailyNeeds = nutrient.percentOfDailyNeeds * multiplier
        })
        return foodCopy;
    })
}