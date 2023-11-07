import './today.scss'
import { useState } from 'react';
import { FoodChip } from '../FoodChip/foodchip';
import { MenuItem, Select } from '@mui/material';
import { Calendar } from './Calendar';
interface MyDayProps {
    timeHorizonFoods?: any[];
    addFoodToToday: (item: any, amount: number, unit: string) => void;
    removeFoodFromToday: (id: number) => void;
    timeHorizon: number;
    setTimeHorizon: (tH: number) => void;
}

export const MyDay: React.FC<MyDayProps> = ({
    timeHorizonFoods,
    addFoodToToday,
    removeFoodFromToday,
    timeHorizon,
    setTimeHorizon
}: MyDayProps) => {

    const [monthsBack, setMonthsBack] = useState(0);

    const topRecs = ['hi', 'hello', 'wtf is up'];
    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
                <button onClick={() => setMonthsBack(monthsBack + 1)}>'B'</button>
                <button onClick={() => setMonthsBack(Math.max(monthsBack - 1, 0))}>'F'</button>
                <Select
                    className="add-food-unit select-green"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value as number)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={1}>today</MenuItem>
                    <MenuItem value={7}>this week</MenuItem>
                    <MenuItem value={30}>this month</MenuItem>
                </Select>
            </div>
            {timeHorizon !== 30 ? <div className='chips-col col'>
                {timeHorizonFoods && timeHorizonFoods.map((item, index) => {
                    return (
                        <FoodChip
                            // editing={edit}
                            onDelete={() => removeFoodFromToday(item.pk)}
                            // id={item.id}
                            key={item.id + index}
                            // onClick={undefined}
                            // percent={undefined}
                            name={item.name}
                            // image={item.image}
                            amount={item.amount}
                            unit={item.unit}
                            type={'asdf'}
                            style={'white'}
                        />
                    )
                })}
            </div> :
                <Calendar monthsBack={monthsBack} food={timeHorizonFoods || []} />
            }
        </div>
    );
};