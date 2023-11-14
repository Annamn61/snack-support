import { useEffect, useState } from "react";
import { PercentBar } from "./PercentBar";
import './nutrients.scss'
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getFoodById } from "../../../data/Helpers/foodCalcHelpers";
import dayjs, { Dayjs } from "dayjs";

interface NutrientProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (vitamin: string | undefined) => void;
    todaysNutrients: any[];
    selectedFood: number | undefined;
    setSelectedFood: (food: number | undefined) => void;
    setSelectedFoodAmounts: (amounts: { amount: number, unit: string }) => void;
    addFoodToDay: (day: Dayjs, item: any, amount: number, unit: string) => void;
    timeHorizon: { startDate: Dayjs, length: number };
}

export const Nutrients: React.FC<NutrientProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    todaysNutrients,
    selectedFood,
    setSelectedFood,
    setSelectedFoodAmounts,
    addFoodToDay,
    timeHorizon,
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
                    {null}
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
                <button type="button" className="button-primary" onClick={() => { addFoodToDay(dayjs(), selectedFood, amount, unit); setSelectedFood(undefined) }}>Add</button>
            </div> :
                <p className="augment">Select a food to see it's breakdown</p>
            }
            <div className="nutrient-bars col">
                {todaysNutrients.map((nut: { name: string, percentDV: number, percentOfSelectedFood: number }, index) => {
                    const status = !selectedNutrient ? '' : selectedNutrient === nut.name ? 'highlighted' : 'greyed';
                    return (<PercentBar
                        timeHorizon={timeHorizon}
                        key={nut.name + index}
                        status={status}
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