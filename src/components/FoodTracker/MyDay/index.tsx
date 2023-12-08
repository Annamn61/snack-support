import './today.scss'
import { useContext, useState } from 'react';
import { FoodChip } from '../FoodChip/foodchip';
import { Calendar } from './Calendar';
import { FoodContext } from '../../../data/FoodContext';
import { convertTimeHorizonLengthToSelect } from '../../../data/Helpers/foodCalcHelpers';

export const MyDay: React.FC = () => {

    const {
        timeHorizonFoods,
        removeFoodFromToday,
        timeHorizon,
    } = useContext(FoodContext);

    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
            </div>
            {convertTimeHorizonLengthToSelect(timeHorizon.length) === 'day' ? <div className='chips-col col'>
                {timeHorizonFoods && timeHorizonFoods.length > 0 && timeHorizonFoods[0].map((item, index) => {
                    if (item.length < 1) return null;
                    return (
                        <FoodChip
                            onDelete={() => removeFoodFromToday(item.pk)}
                            id={item.id}
                            key={item.id + index}
                            amount={item.amount}
                            unit={item.unit}
                            style={'white'}
                        />
                    )
                })}
            </div> :
                <Calendar
                    foods={timeHorizonFoods}
                />
            }
        </div>
    );
};