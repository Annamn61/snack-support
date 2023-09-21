import { useState } from "react";
import { PercentBar } from "./PercentBar";
import './nutrients.scss'

interface NutrientProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (vitamin: string | undefined) => void;
    todaysNutrients: any[];
    selectedFood: any;
}

export const Nutrients: React.FC<NutrientProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    todaysNutrients,
    selectedFood
}: NutrientProps) => {
    console.log('selected ', selectedFood)
    const [unit, setUnit] = useState('servings');
    return (
        <div className="nutrients-container col">
            <p className="header-1">Today's Nutrients</p>
            {selectedFood !== undefined && <div className="col">
                {selectedFood.item.name}
                <div className="row">
                    <input placeholder="amount" />
                    <select onChange={(e) => setUnit(e.target.value)}>
                        <option value="calories" onSelect={() => setUnit('calories')}>calories</option>
                        <option value="serving" onSelect={() => setUnit('servings')}>serving(s)</option>
                        <option value="grams" onClick={() => setUnit('grams')}>grams</option>
                    </select>
                    <button>Add</button>
                </div>
            </div>
            }
            {selectedFood !== undefined && <div className="row">
                <p className="augment">+&nbsp;{selectedFood.item.name}&nbsp;%</p>
                <p className="delimiter">|</p>
                <p className="total">total %</p>
            </div>
            }
            <div className="nutrient-bars col">
                {todaysNutrients.map((nut: { name: string, percentDV: number, percentOfSelectedFood: number }) => {
                    const greyedOut = selectedNutrient ? selectedNutrient !== nut.name : false;
                    return (<PercentBar
                        greyedOut={greyedOut}
                        setSelectedNutrient={selectedNutrient === nut.name ? () => setSelectedNutrient(undefined) : () => setSelectedNutrient(nut.name)}
                        name={nut.name}
                        percent={nut.percentDV}
                        percentOfSelectedFood={selectedFood ? nut.percentOfSelectedFood : undefined}
                    />);
                }
                )}
            </div>
        </div>
    );
};