import { Dayjs } from 'dayjs';
import './percent.scss'
interface PercentBarProps {
    status: string,
    setSelectedNutrient: () => void;
    percent: number,        
    name: string,
    percentOfSelectedFood: number | undefined,
    timeHorizon: { startDate: Dayjs, length: number };
}

export const PercentBar: React.FC<PercentBarProps> = ({ status, percent, name, setSelectedNutrient, percentOfSelectedFood, timeHorizon }: PercentBarProps) => {
    const timeHorizonPercentActive = percent / timeHorizon.length;
    const timeHorizonSelected = percentOfSelectedFood ? percentOfSelectedFood / timeHorizon.length : 0;
    const totalPercentIncludesSelected = timeHorizonPercentActive + timeHorizonSelected;
    const decimalPlaces = timeHorizon.length > 1 ? 2 : 0;
    // const totalPercentIncludesSelected = percentOfSelectedFood ? percentOfSelectedFood + percent : percent;
    return (
        <div className={`nutrient ${status}`} onClick={setSelectedNutrient}>
            <p className="name">
                {name}
            </p>
            <div className="bar">
                {percentOfSelectedFood !== undefined && <div className="selectedFood" style={{ width: `${Math.min(totalPercentIncludesSelected, 100)}%` }} />}
                <div className="active" style={{ width: `${Math.min(timeHorizonPercentActive, 100)}%` }} />
            </div>
            <div className="percents row">
                {percentOfSelectedFood !== undefined && <p className="augment">+&nbsp;{timeHorizonSelected.toFixed(decimalPlaces)}%</p>}
                {percentOfSelectedFood !== undefined && <p className="delimiter">|</p>}
                <p className="total">{totalPercentIncludesSelected.toFixed(0)}%</p>
            </div>
        </div>
    );
};