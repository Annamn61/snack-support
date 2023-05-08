import { DRIs } from "../../data/Util/DRIs";
import { pineapple } from "../../data/Util/TestIngredient";
import { DailyNutrientPercent } from "../../data/Util/types";


export const getNutrientPercentages = (): DailyNutrientPercent[] => {
    const todaysSum = pineapple;
    return DRIs[0].micronutrients.map(element => {
        const todaysNutrient = todaysSum.nutrition.nutrients.find(nutrient => nutrient.name === element.name);
        let percent = (todaysNutrient ? todaysNutrient.amount / element.amount : 0) * 100
        if (element.amount === 0) percent = 0;
        return {
            name: element.name,
            percentDV: +(percent.toFixed(2))
        }
    });
}

export const getSortedNutrients = () => {
    return getNutrientPercentages().sort(sortFunc);
}

const sortFunc = (a: { name: string, percentDV: number }, b: { name: string, percentDV: number }) => {
    return a.percentDV - b.percentDV;
}