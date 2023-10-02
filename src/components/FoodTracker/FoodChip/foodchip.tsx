import './foodchip.scss'
import cancel from '../../../assets/CancelLight.svg';

interface FoodChipProps {
    amount: number,
    unit: string,
    name: string,
    type: string,
    style: string,
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
    return (
        <div>
          chip
        </div>
    );
};