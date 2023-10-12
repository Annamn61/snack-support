import { FoodCard } from '../FoodCard';
import pencil from '../../../assets/pencil.svg';
import './today.scss'
import { useState } from 'react';
import { FoodChip } from '../FoodChip/foodchip';
interface MyDayProps {
    todaysFood: any[];
    addFoodToToday: (item: any, amount: number, unit: string) => void;
    removeFoodFromToday: (id: number) => void;
}

export const MyDay: React.FC<MyDayProps> = ({
    todaysFood,
    addFoodToToday,
    removeFoodFromToday,
}: MyDayProps) => {

    const [edit, setEdit] = useState(false);
    
    const topRecs = ['hi', 'hello', 'wtf is up'];
    return (
        <div className="today col">
            <div className='today-header row'>
                <h2>My Day</h2>
                <button type="button" className="button-icon" onClick={() => setEdit(!edit)}>
                    <img className='icon' src={pencil} alt='edit my day' />
                </button>
            </div>
            <div className='card-row column'>
                {todaysFood.map((item, index) => {
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
                            style={'asdf'}
                        />
                    )
                })}
            </div>
        </div>
    );
};