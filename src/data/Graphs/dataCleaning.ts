// takes in nutrients and returns the % daily value of each nutrient based on the number of days in the time horizon
export const getNutrientPercentagesByDays = (nutrients: any[], timeHorizon: number) => {
    return nutrients.map(nutrient => {
        return {
            name: nutrient.name,
            percentDV: nutrient.amount / timeHorizon,
        }
    })


    // const todaysSum = pineapple;
    // return DRIs[0].micronutrients.map(element => {
    //     const todaysNutrient = todaysSum.nutrition.nutrients.find(nutrient => nutrient.name === element.name);
    //     let percent = (todaysNutrient ? todaysNutrient.amount / element.amount : 0) * 100
    //     if (element.amount === 0) percent = 0;
    //     return {
    //         name: element.name,
    //         percentDV: +(percent.toFixed(2))
    //     }
    // });
}

