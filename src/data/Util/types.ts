import { Dayjs } from "dayjs";

export interface Nutrient {
    name: string,
    amount: number,
    unit: string,
}

export interface DailyNutrientPercent {
    name: string,
    percentDV: number,
}

export interface FoodCalcs {
    timeHorizonFoods: any[][];
    addFoodToDay: (id: any, amount: number, unit: string) => void;
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
    user_uid: string,
}