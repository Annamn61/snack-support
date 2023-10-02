import { useEffect, useState } from "react";
import { PercentBar } from "./PercentBar";
import './nutrients.scss'
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getFoodById } from "../../../data/Helpers/foodCalcHelpers";

interface NutrientProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (vitamin: string | undefined) => void;
    todaysNutrients: any[];
    selectedFood: number | undefined;
    setSelectedFood: (food: number | undefined) => void;
    setSelectedFoodAmounts: (amounts: { amount: number, unit: string }) => void;
    addFoodToToday: (item: any, amount: number, unit: string) => void;
}

export const Nutrients: React.FC<NutrientProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    todaysNutrients,
    selectedFood,
    setSelectedFood,
    setSelectedFoodAmounts,
    addFoodToToday,
}: NutrientProps) => {
    const [unit, setUnit] = useState('serving');
    const [timeScale, setTimeScale] = useState('day');
    const [amount, setAmount] = useState(0);
    const [foodName, setFoodName] = useState('');
    const [selectedFoodItem, setSelectedFoodItem] = useState<any>(getFoodById(selectedFood));

    useEffect(() => {
        const food = getFoodById(selectedFood);
        setSelectedFoodItem(food);
        if (food) {
            const { amount, unit, name } = food;
            setSelectedFoodAmounts({ amount, unit });
            setAmount(amount);
            setUnit(unit);
            setFoodName(name);
        }
    }, [selectedFood]);

    useEffect(() => {
        setSelectedFoodAmounts({ amount, unit });
    }, [unit, amount]);


    return (
        <div className="nutrients-container col">
            <div className="row">
                <h2>Nutrient Breakdown</h2>
                <div className="row">
                    <p>Daily Value</p>
                    <Select
                        className="add-food-unit select-green"
                        value={timeScale}
                        onChange={(e) => setTimeScale(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={'day'}>Today</MenuItem>
                        <MenuItem value={'week'}>This Week</MenuItem>
                        <MenuItem value={'month'}>This Month</MenuItem>
                    </Select>
                </div>
            </div>
            {selectedFood !== undefined ? <div className="row add-food" key={selectedFood}>
                <p>{foodName}</p>
                <TextField
                    className="add-food-amount input-green"
                    value={amount}
                    type="number"
                    id="outlined-basic"
                    variant="outlined"
                    placeholder='amount'
                    autoFocus={true}
                    onChange={(e) => setAmount(+(e.target.value) > 0 ? +(e.target.value) : 0)}
                />
                <Select
                    className="add-food-unit select-green"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={'calories'}>calories</MenuItem>
                    <MenuItem value={'serving'}>serving(s)</MenuItem>
                    <MenuItem value={'grams'}>grams</MenuItem>
                </Select>
                <button type="button" className="button-primary" onClick={() => { addFoodToToday(selectedFood, amount, unit); setSelectedFood(undefined) }}>Add</button>
            </div> :
                <p className="augment">Select a food to see it's breakdown</p>
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