import './percent.scss'
interface PercentBarProps {
    greyedOut: boolean,
    setSelectedNutrient: () => void;
    percent: number,
    name: string,
    percentOfSelectedFood: number,
}

export const PercentBar: React.FC<PercentBarProps> = ({ greyedOut, percent, name, setSelectedNutrient, percentOfSelectedFood }: PercentBarProps) => {
    return (
        <div className={`nutrient ${greyedOut ? 'greyed' : ''}`} onClick={setSelectedNutrient}>
            <p className="name">
                {name}
            </p>
            <div className="bar">
                <div className="selectedFood" style={{ width: `${Math.min(percent + percentOfSelectedFood, 100)}%` }} />
                <div className="active" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <p className="percents">
                {percent}/{percentOfSelectedFood}
            </p>
        </div>
    );
};