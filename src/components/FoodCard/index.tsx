import './foodcard.scss'
interface FoodCardProps {
    className?: string,
    selectedFood?: any,
    name: string,
    image: string,
    amount: number,
    unit: string,
    percent: number | undefined,
    onClick: (() => any) | undefined;
}

export const FoodCard: React.FC<FoodCardProps> = ({
    className,
    selectedFood,
    name,
    image,
    amount,
    unit,
    percent,
    onClick,
}: FoodCardProps) => {
    const selectedColor = selectedFood && selectedFood.item.name === name ? 'selectedColor' : 'unselectedColor'
    return (
        <div className={`food-container ${className}`} onClick={onClick}>
            <div className={`foodcard ${selectedFood ? selectedColor : 'defaultColor'}`}>
                <img className="image" src={`https://spoonacular.com/cdn/ingredients_100x100/${image}`} alt={image} />
                <p>{name}</p>
                <p>{amount} {unit}(s)</p>
            </div>
            {percent !== undefined ? <p>{percent} %</p> : null}
        </div>
    );
};