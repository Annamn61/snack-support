import './foodchip.scss'
import cancel from '../../../assets/CancelLight.svg';
import { getNormalizedFood } from '../../../data/Helpers/foodCalcHelpers';

interface FoodChipProps {
    amount: number,
    unit: string,
    id: number,
    style: 'beige' | 'white',
    onDelete: () => void,
}

export const FoodChip: React.FC<FoodChipProps> = ({
    amount,
    unit,
    id,
    style,
    onDelete,
}: FoodChipProps) => {
    const styleClass = style === 'white' ? 'foodchip-white' : '';
    const item = getNormalizedFood(id, amount, unit) as { name: string };
    return (
        <div className={`foodchip ${styleClass} row`}>
            <div className="foodchip-circle" />
            <div className="foodchip-title row" >
                <p>{amount}</p>
                <p>{unit}</p>
                <p>{item.name}</p>
            </div>
            <div className="foodchip-delete">
                <button type="button" className="" onClick={onDelete} >
                    <img src={cancel} />
                </button>
            </div>
        </div>
    );
};