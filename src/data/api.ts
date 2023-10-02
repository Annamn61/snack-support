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
            'X-RapidAPI-Key': '4533082377mshd77b2ed9a1f0af2p1420a5jsnb649f01d95e0', //TODO: pull from env file
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com' //TODO: pull from env file
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