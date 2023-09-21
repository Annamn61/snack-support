import { FoodCard } from '../FoodCard';
import './today.scss'
interface MyDayProps {
    todaysFood: any[];
    addFoodToToday: (item: any, amount: number, unit: string) => void
}

export const MyDay: React.FC<MyDayProps> = ({
    todaysFood,
    addFoodToToday,
}: MyDayProps) => {
    const topRecs = ['hi', 'hello', 'wtf is up'];
    return (
        <div className="today">
            <div className='row'>
                <p className='header-1'>My Day</p>
            </div>
            <div className='card-row row'>
                {todaysFood.map((item) => {
                    return (
                        <FoodCard
                            onClick={undefined}
                            percent={undefined}
                            name={item.name}
                            image={item.image}
                            amount={item.amount}
                            unit={item.unit}
                        />
                    )
                })}
            </div>
        </div>
    );
};