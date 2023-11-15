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
    foodToAdd: any,
    deleteFood: (pk: number) => void,
    addFoodToDay: (day: Dayjs, id: string, amount: number, unit: string) => void,
    closeModal: () => void,
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
    deleteFood,
    foodToAdd,
    closeModal,
    addFoodToDay,
}: AddFoodModalProps) => {
    const [addingAmount, setAddingAmount] = useState(foodToAdd.amount);
    const [addingUnit, setAddingUnit] = useState(foodToAdd.unit);
    const [value, setValue] = useState<Dayjs | null>(dayjs());
    const [initialItems, setInitialItems] = useState<{
        addedDate: number, pk: string, id: number, amount: number, unit: string
    }[]>([]);
    const [renderedItems, setRenderedItems] = useState<{
        addedDate: number, pk: string, id: number, amount: number, unit: string
    }[]>([]);

    useEffect(() => {
        (async () => {
            if (value) {
                const ret = await getFoodsInRange(value, 1);
                setInitialItems(ret[0]);
                setRenderedItems(ret[0]);
            }
        })();
    }, [value]);

    const removeItem = (pk: string) => {
        setRenderedItems(renderedItems.filter(food => food.pk !== pk));
    }

    const addItem = (day: Dayjs, id: number, amount: number, unit: string) => {
        const newItem = {
            addedDate: day.valueOf(),
            pk: 'tempUUID' + Math.random(),
            id,
            unit,
            amount,
        }
        const newRendered = [...renderedItems];
        newRendered.push(newItem);
        setRenderedItems(newRendered);
    }

    const saveItems = () => {
        const initialPks = initialItems.map(item => item.pk);
        const renderedPks = renderedItems.map(item => item.pk);
        // Todo on save - either instead of return do add and delete
        // OR find a way to do a group add and delete in one call

        // check instead for includes a temp UUID
        const addedPks = renderedItems.map(renderedItem => {
            if (!initialPks.includes(renderedItem.pk)) {
                return renderedItem.pk;
            }
        });
        const removedPks = initialPks.map(initPk => {
            if (!renderedPks.includes(initPk)) {
                return initPk;
            }
        });
        console.log('added', addedPks);
        console.log('removed', removedPks);
    }

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
                        id={item.id}
                        unit={item.unit}
                        amount={item.amount}
                        style={'beige'}
                        onDelete={() => removeItem(item.pk)}
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
                        <button
                            type="button"
                            className="button-primary"
                            onClick={() => addItem(value!, foodToAdd.id, addingAmount, addingUnit)}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={() => closeModal()}>Cancel</button>
                    <button onClick={() => saveItems()}>Save</button>
                </div>
            </div>
        </div>
    );
};

function uuidv4() {
    throw new Error('Function not implemented.');
}
