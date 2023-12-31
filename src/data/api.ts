import axios from 'axios'

const baseUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/';

export const searchFoodItems = async (queryTerm: string) => {

    const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/search',
        params: {
            query: queryTerm,
            addChildren: 'true',
            // minProteinPercent: '5',
            // maxProteinPercent: '50',
            // minFatPercent: '1',
            // maxFatPercent: '10',
            // minCarbsPercent: '5',
            // maxCarbsPercent: '30',
            metaInformation: 'false',
            // intolerances: 'egg',
            sort: 'calories',
            sortDirection: 'asc',
            offset: '0',
            number: '10'
        },
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getIngredient = async (queryTerm: string) => {

    const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${queryTerm}/information`,
        params: {
            amount: '150',
            unit: 'grams'
        },
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
