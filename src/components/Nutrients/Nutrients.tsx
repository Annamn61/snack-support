import { useEffect, useState } from "react";
import { PercentBar } from "./PercentBar";
import './nutrients.scss'
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface NutrientProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (vitamin: string | undefined) => void;
    todaysNutrients: any[];
    selectedFood: any;
    addFoodToToday: (item: any, amount: number, unit: string) => void;
}

export const Nutrients: React.FC<NutrientProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    todaysNutrients,
    selectedFood,
    addFoodToToday,
}: NutrientProps) => {
    const [unit, setUnit] = useState('serving');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (selectedFood) {
            setAmount(selectedFood.item.amount);
            setUnit(selectedFood.item.unit);
        }
    }, [selectedFood]);

    return (
        <div className="nutrients-container col">
            <p className="header-1">Today's Nutrients</p>
            {selectedFood !== undefined && <div className="col" key={selectedFood.item.id}>
                {selectedFood.item.id}
                <div className="row">
                    <TextField
                        // className="search-bar"
                        value={amount}
                        type="number"
                        id="outlined-basic"
                        variant="outlined"
                        placeholder='amount'
                        autoFocus={true}
                        onChange={(e) => setAmount(+(e.target.value))}
                    />
                    <Select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={'calories'}>calories</MenuItem>
                        <MenuItem value={'serving'}>serving(s)</MenuItem>
                        <MenuItem value={'grams'}>grams</MenuItem>
                    </Select>
                    <button className="button-green" onClick={() => addFoodToToday(selectedFood.item.id, amount, unit)}>Add</button>
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
                {todaysNutrients.map((nut: { name: string, percentDV: number, percentOfSelectedFood: number }, index) => {
                    const greyedOut = selectedNutrient ? selectedNutrient !== nut.name : false;
                    return (<PercentBar
                        key={nut.name + index}
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