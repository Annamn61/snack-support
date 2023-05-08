import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './Style/global.scss'
import { searchFoodItems } from './data/api';
import { pineapple } from './data/Util/TestIngredient';
import { Nutrients } from './components/Nutrients/Nutrients';
import './Style/app.scss'
import { Header } from './components/Header';
import { Recommendations } from './components/Recommendations';
import { useFoodCalculations } from './data/useFoodCalculations';
import { MyDay } from './components/MyDay';

const listToFilter = ['banana chips', 'banana', 'fried banana']

function App() {
  const {
    todaysFood,
    addFoodToToday,
    selectedNutrient,
    setSelectedNutrient,
    selectedFood,
    setSelectedFood,
    recommendationType,
    setRecommendationType,
    recommendedFoods,
    todaysNutrients,
  } = useFoodCalculations();

  return (
    <div className="App col">
      <div className="app-background" />
      <Header />
      <div className="content row">
        <div className="content-left">
          <Recommendations
            selectedNutrient={selectedNutrient}
            selectedFood={selectedFood}
            setSelectedFood={setSelectedFood}
            recommendationType={recommendationType}
            setRecommendationType={setRecommendationType}
            recommendedFoods={recommendedFoods}
          />
          <MyDay
            todaysFood={todaysFood}
            addFoodToToday={addFoodToToday}
          />
        </div>
        <div className="content-right col">
          <Nutrients
            selectedFood={selectedFood}
            selectedNutrient={selectedNutrient}
            setSelectedNutrient={setSelectedNutrient}
            todaysNutrients={todaysNutrients}
          />
        </div>
      </div>
    </div >
  );
}

export default App;
