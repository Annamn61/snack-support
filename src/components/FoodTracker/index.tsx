import { Nutrients } from './Nutrients/Nutrients';
import { Recommendations } from './Recommendations';
import { useFoodCalculations } from '../../data/useFoodCalculations';
import { MyDay } from './MyDay';

interface FoodTrackerProps {
    foodData: any;
}

export const FoodTracker: React.FC<FoodTrackerProps> = ({ foodData }) => {
    const {
        todaysFood,
        addFoodToToday,
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
                        addFoodToToday={addFoodToToday}
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
                        todaysFood={todaysFood}
                        removeFoodFromToday={removeFoodFromToday}
                        addFoodToToday={addFoodToToday}
                        setSelectedNutrient={setSelectedNutrient}
                    />
                    <MyDay
                        todaysFood={todaysFood}
                        addFoodToToday={addFoodToToday}
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