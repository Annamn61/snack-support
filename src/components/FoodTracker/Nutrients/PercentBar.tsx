import './percent.scss'
interface PercentBarProps {
    greyedOut: boolean,
    setSelectedNutrient: () => void;
    percent: number,
    name: string,
    percentOfSelectedFood: number | undefined,
}

export const PercentBar: React.FC<PercentBarProps> = ({ greyedOut, percent, name, setSelectedNutrient, percentOfSelectedFood }: PercentBarProps) => {
    const totalPercent = percentOfSelectedFood ? percentOfSelectedFood + percent : percent;
    return (
        <div className={`nutrient ${greyedOut ? 'greyed' : ''}`} onClick={setSelectedNutrient}>
            <p className="name">
                {name}
            </p>
            <div className="bar">
                {percentOfSelectedFood !== undefined && <div className="selectedFood" style={{ width: `${Math.min(percent + percentOfSelectedFood, 100)}%` }} />}
                <div className="active" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <div className="percents row">
                {percentOfSelectedFood !== undefined && <p className="augment">+&nbsp;{percentOfSelectedFood.toFixed(0)}%</p>}
                {percentOfSelectedFood != undefined && <p className="delimiter">|</p>}
                <p className="total">{totalPercent.toFixed(0)}%</p>
            </div>
        </div>
    );
};