import { useEffect } from 'react';
import { NutrientPercent } from './NutrientPercent';
import './data.scss';

interface DataPageProps {
    foodData: any;
}

export const DataPage: React.FC<DataPageProps> = ({ foodData }) => {

    const { addFoodToToday, timeHorizonFoods } = foodData;

    useEffect(() => {
        addFoodToToday(11090, 1, 'serving');
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