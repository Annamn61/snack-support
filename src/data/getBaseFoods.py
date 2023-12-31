# run with: python3 getBaseFoods.py from this directory

# make an api call to get all the base foods
# and save them to a text file

import requests
import json
import os
import time

def getBaseFoods(foodsToGet):
    #for each food in foodsToGet make an api call
    # and save the data to a text file
    for food in foodsToGet:
        url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/" + str(food) +  "/information"
        headers = {
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
        params = {
            'amount': '150',
            'unit': 'grams'
        }
        response = requests.request("GET", url, headers=headers, params=params)
        # save the data to a text file
        if (response.json().get('originalName')): 
            name = response.json().get('originalName').title().replace(' ', '')
            name_ = response.json().get('originalName').replace(' ', '_')
            print(name)
            with open('Foods/' + name + '.ts', 'a') as outfile:
                outfile.write('export const ' + name_ + ' = ')
                json.dump(response.json(), outfile)
                outfile.write("\n")
        else: 
            print('error!!!!', food, response.json())
        time.sleep(3)

if __name__ == "__main__":
    foodsToGet = []
    getBaseFoods(foodsToGet)


