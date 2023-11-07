import './today.scss'

interface DotsProps {
    foodList: any[]
}

export const Dots: React.FC<DotsProps> = ({
    foodList,
}: DotsProps) => {
    return (
        <div className="dots-container">
            {foodList && foodList.map((food) => {
                return <div className="dot" />
            })}
        </div>
    );
};
