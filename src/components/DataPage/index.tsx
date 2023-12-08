import { useContext, useEffect } from 'react';
import { NutrientPercent } from './NutrientPercent';
import './data.scss';
import { FoodContext } from '../../data/FoodContext';

export const DataPage: React.FC = () => {

    const { addFoodToDay, timeHorizonFoods } = useContext(FoodContext);

    useEffect(() => {
        addFoodToDay(11090, 1, 'serving');
    }, []);

    return (
        <div className="data">
            <div className="data-sidebar">
                hi
            </div>
            <div className="data-content">
                <NutrientPercent food={timeHorizonFoods} />
            </div>
        </div>
    );
};