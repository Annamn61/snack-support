import './today.scss'
import { useEffect, useState } from 'react';
import { FoodChip } from '../FoodChip/foodchip';
import { MenuItem, Select } from '@mui/material';
import { Calendar } from './Calendar';
import dayjs, { Dayjs } from 'dayjs';
interface MyDayProps {
    timeHorizonFoods?: any[][];
    addFoodToDay: (day: Dayjs, item: any, amount: number, unit: string) => void;
    removeFoodFromToday: (id: number) => void;
    timeHorizon: { startDate: Dayjs, length: number };
    setTimeHorizon: (tH: { startDate: Dayjs, length: number }) => void;
}

export const MyDay: React.FC<MyDayProps> = ({
    timeHorizonFoods,
    addFoodToDay,
    removeFoodFromToday,
    timeHorizon,
    setTimeHorizon
}: MyDayProps) => {

    const [monthsBack, setMonthsBack] = useState(0);

    const topRecs = ['hi', 'hello', 'wtf is up'];

    const updateTimeHorizon = (value: 'week' | 'day' | 'month') => {
        let day = dayjs();
        let length = 1;
        if (value === 'week' ) {
            day = dayjs().set('day', 1);
            length = 7;
        } 
        if (value === 'month') {
            const firstWeekDay = day.startOf("month").day()
            day = dayjs().set('date', 1).subtract(firstWeekDay, 'day');
            length = Math.ceil((firstWeekDay + day.daysInMonth()) / 7) * 7;
        }
        setTimeHorizon({ startDate: day.set('hour', 0).set('minute', 0).set('second', 0), length: length})
    }

    const convertLengthToSelect = (length: number) => {
        if (length === 1) return 'day'
        if (length === 7) return 'week'
        return 'month';
    }

    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
                <button onClick={() => setMonthsBack(monthsBack + 1)}>'B'</button>
                <button onClick={() => setMonthsBack(Math.max(monthsBack - 1, 0))}>'F'</button>
                <Select
                    className="add-food-unit select-green"
                    value={convertLengthToSelect(timeHorizon.length)}
                    onChange={(e) => updateTimeHorizon(e.target.value as 'day' | 'week' | 'month')}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={'day'}>today</MenuItem>
                    <MenuItem value={'week'}>this week</MenuItem>
                    <MenuItem value={'month'}>this month</MenuItem>
                </Select>
            </div>
            {/* {timeHorizon !== 30 ? <div className='chips-col col'> */}
            {convertLengthToSelect(timeHorizon.length) === 'day' ? <div className='chips-col col'>
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