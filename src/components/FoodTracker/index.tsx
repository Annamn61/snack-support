import { Nutrients } from './Nutrients/Nutrients';
import { Recommendations } from './Recommendations';
import { FoodCalcs, useFoodCalculations } from '../../data/useFoodCalculations';
import { MyDay } from './MyDay';

interface FoodTrackerProps {
    foodData: FoodCalcs;
}

export const FoodTracker: React.FC<FoodTrackerProps> = ({ foodData }) => {
    const {
        timeHorizonFoods,
        addFoodToDay,
        removeFoodFromToday,
        selectedNutrient,
        setSelectedNutrient,
        selectedFood,
        setSelectedFood,
        setSelectedFoodAmounts,
        recommendationType,
        setRecommendationType,
        recommendedFoods,
        todaysNutrients,
        timeHorizon,
        setTimeHorizon
    } = foodData;

    return (
        <div className="App col">
            <div className="content row">
                <div className="content-right col">
                    <Nutrients
                        selectedFood={selectedFood}
                        setSelectedFood={setSelectedFood}
                        setSelectedFoodAmounts={setSelectedFoodAmounts}
                        selectedNutrient={selectedNutrient}
                        setSelectedNutrient={setSelectedNutrient}
                        todaysNutrients={todaysNutrients}
                        addFoodToDay={addFoodToDay}
                        timeHorizon={timeHorizon}
                    />
                </div>
                <div className="content-left">
                    <Recommendations
                        selectedNutrient={selectedNutrient}
                        selectedFood={selectedFood}
                        setSelectedFood={setSelectedFood}
                        recommendationType={recommendationType}
                        setRecommendationType={setRecommendationType}
                        recommendedFoods={recommendedFoods}
                        timeHorizonFoods={timeHorizonFoods}
                        removeFoodFromToday={removeFoodFromToday}
                        addFoodToDay={addFoodToDay}
                        setSelectedNutrient={setSelectedNutrient}
                    />
                    <MyDay
                        timeHorizonFoods={timeHorizonFoods}
                        addFoodToDay={addFoodToDay}
                        removeFoodFromToday={removeFoodFromToday}
                        timeHorizon={timeHorizon}
                        setTimeHorizon={setTimeHorizon}
                    />
                </div>
            </div>
        </div >
    );
}

export default FoodTracker;