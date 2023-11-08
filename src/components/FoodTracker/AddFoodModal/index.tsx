import './addfoodmodal.scss'
import Cancel from '../../../assets/CancelLight.svg';
import calendar from '../../../assets/calendar.svg';
import { FoodChip } from '../FoodChip/foodchip';
import { MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getFoodsInRange } from '../../../data/Util/firebase';

interface AddFoodModalProps {
    food?: any[],
    foodToAdd: any,
    deleteFood: (pk: number) => void,
    addFoodToToday: (id: number, amount: number, unit: string) => void,
    closeModal: () => void,
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
    deleteFood,
    food,
    foodToAdd,
    closeModal,
    addFoodToToday,
}: AddFoodModalProps) => {
    const [addingAmount, setAddingAmount] = useState(foodToAdd.amount);
    const [addingUnit, setAddingUnit] = useState(foodToAdd.unit);
    const [value, setValue] = useState<Dayjs | null>(dayjs());

    const [renderedItems, setRenderedItems] = useState<any[][]>([]);

    useEffect(() => {
        (async () => {
            if (value) {
                const ret = await getFoodsInRange(value, 1);
                // TODO -> Switch the items to ones with NAMES
                setRenderedItems(ret[0]);
            }
        })();
    }, [value]);

    useEffect(() => {
        console.log('value', value);
    }, [value]);

    return (
        <div className="modal">
            <div className="modal-background" />
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title row">
                        <h2>Editing</h2>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Basic date picker"
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                    <button onClick={() => closeModal()}><img src={Cancel} /></button>
                </div>
                <div className="modal-chips">
                    {renderedItems && renderedItems.map((item) => <FoodChip
                        key={item.pk}
                        unit={item.unit}
                        name={item.name}
                        amount={item.amount}
                        type={'food'} // TODO: This should be fruit/veg/meat etc. 
                        style={'beige'}
                        onDelete={() => deleteFood(item.pk)}
                    />
                    )}
                </div>
                <div className="modal-add">
                    <div className="row add-food" key={foodToAdd.id}>
                        <TextField
                            className="add-food-amount input-green"
                            value={addingAmount}
                            type="number"
                            id="outlined-basic"
                            variant="outlined"
                            placeholder='amount'
                            autoFocus={true}
                            onChange={(e) => setAddingAmount(+(e.target.value) > 0 ? +(e.target.value) : 0)}
                        />
                        <Select
                            className="add-food-unit select-green"
                            value={addingUnit}
                            onChange={(e) => setAddingUnit(e.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value={'calories'}>calories</MenuItem>
                            <MenuItem value={'serving'}>serving(s)</MenuItem>
                            <MenuItem value={'grams'}>grams</MenuItem>
                        </Select>
                        <p>{foodToAdd.name}</p>
                        <button type="button" className="button-primary" onClick={() => addFoodToToday(foodToAdd.id, addingAmount, addingUnit)}>Add</button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={() => closeModal()}>Cancel</button>
                    <button>Save</button>
                </div>
            </div>
        </div>



    );
};