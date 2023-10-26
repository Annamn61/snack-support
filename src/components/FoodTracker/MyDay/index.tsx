import { FoodCard } from '../FoodCard';
import pencil from '../../../assets/pencil.svg';
import './today.scss'
import { useState } from 'react';
import { FoodChip } from '../FoodChip/foodchip';
import { MenuItem, Select } from '@mui/material';
interface MyDayProps {
    todaysFood?: any[];
    addFoodToToday: (item: any, amount: number, unit: string) => void;
    removeFoodFromToday: (id: number) => void;
    timeHorizon: number;
    setTimeHorizon: (tH: number) => void;
}

export const MyDay: React.FC<MyDayProps> = ({
    todaysFood,
    addFoodToToday,
    removeFoodFromToday,
    timeHorizon,
    setTimeHorizon
}: MyDayProps) => {

    const [edit, setEdit] = useState(false);

    const topRecs = ['hi', 'hello', 'wtf is up'];
    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
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
                <button type="button" className="button-icon" onClick={() => setEdit(!edit)}>
                    <img className='icon' src={pencil} alt='edit my day' />
                </button>
            </div>
            <div className='chips-col col'>
                {todaysFood && todaysFood.map((item, index) => {
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
            </div>
        </div>
    );
};