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
        setTimeHorizon
    } = useContext(FoodContext);

    const [monthsBack, setMonthsBack] = useState(0);

    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
                <button onClick={() => setMonthsBack(monthsBack + 1)}>'B'</button>
                <button onClick={() => setMonthsBack(Math.max(monthsBack - 1, 0))}>'F'</button>
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
                    monthsBack={monthsBack}
                    setTimeHorizon={setTimeHorizon}
                    timeHorizon={timeHorizon}
                    foods={timeHorizonFoods}
                />
            }
        </div>
    );
};