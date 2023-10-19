# make an api call to get all the base foods
# and save them to a text file

import requests
import json
import os


def getBaseFoods(foodsToGet):
    #for each food in foodsToGet make an api call
    # and save the data to a text file
    for food in foodsToGet:
        url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/" + str(food) +  "/information"
        headers = {
            'X-RapidAPI-Key': '4533082377mshd77b2ed9a1f0af2p1420a5jsnb649f01d95e0', # TODO: pull from env file
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com' # TODO: pull from env file
        }
        params = {
            'amount': '150',
            'unit': 'grams'
        }
        response = requests.request("GET", url, headers=headers, params=params)
        # save the data to a text file
        name = response.json().get('originalName').title().replace(' ', '')
        name_ = response.json().get('originalName').replace(' ', '_')
        print(name)
        with open('Foods/' + name + '.ts', 'a') as outfile:
            outfile.write('export const ' + name_ + ' = ')
            json.dump(response.json(), outfile)
            outfile.write("\n")


if __name__ == "__main__":
    foodsToGet = [2025, 1002025, 2027, 2028, 1002028, 1012028, 2037, 2038, 99226, 93622, 2050, 1052050, 4047, 93800, 11250, 1230, 93650, 1088, 10016073, 10116072, 15114, 10120420, 1001001, 16398, 1145, 1053, 4058, 12698, 10012023, 12023]
    getBaseFoods(foodsToGet)


