import './foodchip.scss'
import cancel from '../../../assets/CancelLight.svg';

interface FoodChipProps {
    amount: number,
    unit: string,
    name: string,
    type: string,
    style: 'beige' | 'white',
    onDelete: () => void,
}

export const FoodChip: React.FC<FoodChipProps> = ({
    amount,
    unit,
    name,
    type,
    style,
    onDelete,
}: FoodChipProps) => {
    const styleClass = style === 'white' ? 'foodchip-white' : '';
    return (
        <div className={`foodchip ${styleClass} row`}>
            <div className="foodchip-circle" />
            <div className="foodchip-title row" >
                <p>{amount}</p>
                <p>{unit}</p>
                <p>{name}</p>
            </div>
            <div className="foodchip-delete">
                <button type="button" className="" onClick={onDelete} >
                    <img src={cancel} />
                </button>
            </div>
        </div>
    );
};