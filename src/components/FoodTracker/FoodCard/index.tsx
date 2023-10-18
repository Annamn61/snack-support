import './foodcard.scss'
import { SmallPercentBar } from '../Nutrients/SmallPercentBar';

interface FoodCardProps {
    className?: string,
    selectedFood?: number,
    editing?: boolean,
    deleteFood?: (id: number) => void,
    name: string,
    image: string,
    amount: number,
    id: number,
    unit: string,
    percent: number | false,
    onClick: (() => any) | undefined;
    onAdd: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
    className,
    selectedFood,
    name,
    image,
    amount,
    id,
    unit,
    percent,
    onClick,
    onAdd,
}: FoodCardProps) => {
    const selectedColor = selectedFood === id ? 'selectedColor' : 'unselectedColor'
    return (
        <div className={`food-container ${className}`} onClick={onClick}>
            <div className={`foodcard col ${selectedFood ? selectedColor : 'defaultColor'}`}>
                <div className="foodname">
                    <p>{name}</p>
                </div>
                <img className="image" src={`https://spoonacular.com/cdn/ingredients_100x100/${image}`} alt={name} />
                {percent !== false && <SmallPercentBar percent={percent} />}
                <div className="percent">
                    {percent !== false ? <p>{percent} %</p> : null}
                </div>
                <button className="foodcard-add" onClick={(e) =>{ onAdd(); e.stopPropagation()}}>+</button>
            </div>
        </div>
    );
};