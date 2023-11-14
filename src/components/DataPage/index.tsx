import { useEffect } from 'react';
import { NutrientPercent } from './NutrientPercent';
import './data.scss';
import { FoodCalcs } from '../../data/useFoodCalculations';
import dayjs from 'dayjs';

interface DataPageProps {
    foodData: FoodCalcs;
}

export const DataPage: React.FC<DataPageProps> = ({ foodData }) => {

    const { addFoodToDay, timeHorizonFoods } = foodData;

    useEffect(() => {
        addFoodToDay(dayjs(), 11090, 1, 'serving');
    }, []);

    return (
        <div className="data">
            <div className="data-sidebar">
                hi
            </div>
            <div className="data-content">
                <NutrientPercent food={foodData.timeHorizonFoods} />
            </div>
        </div>
    );
};