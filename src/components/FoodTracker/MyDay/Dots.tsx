import './today.scss'

interface DotsProps {
    foodList: any[],
    dotKey: string,
}

export const Dots: React.FC<DotsProps> = ({
    foodList,
    dotKey
}: DotsProps) => {
    return (
        <div className="dots-container">
            {foodList && foodList.map((food, index) => {
                return <div className="dot" key={`Dot=${index}=${dotKey}`}/>
            })}
        </div>
    );
};
