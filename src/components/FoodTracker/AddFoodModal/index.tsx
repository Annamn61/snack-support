import './addfoodmodal.scss'
import Cancel from '../../../assets/CancelLight.svg';
import calendar from '../../../assets/calendar.svg';
import { FoodChip } from '../FoodChip/foodchip';
import { Autocomplete, CircularProgress, MenuItem, Select, TextField } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { addAndDeleteFoods, getFoodsInRange } from '../../../data/Util/firebaseFirestore';
import { getFoodNames, getIdFromName } from '../../../data/Helpers/foodCalcHelpers';
import { FoodContext } from '../../../data/FoodContext';

interface AddFoodModalProps {
    foodToAdd: any,
    closeModal: () => void,
    date?: Dayjs,
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
    foodToAdd,
    closeModal,
    date,
}: AddFoodModalProps) => {

    const {
        user_uid,
    } = useContext(FoodContext);

    const [addingAmount, setAddingAmount] = useState<number | '' | undefined>(foodToAdd ? foodToAdd.amount : '');
    const [addingUnit, setAddingUnit] = useState(foodToAdd ? foodToAdd.unit : 'grams');
    const [addingFoodValue, setAddingFoodValue] = useState<null | string>(foodToAdd ? foodToAdd.name: '');
    const [addingFoodInput, setAddingFoodInput] = useState('');
    const [value, setValue] = useState<Dayjs | null>(date ? date : dayjs());
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);
    const amountRef = useRef<HTMLInputElement>(null);
    const [initialItems, setInitialItems] = useState<{
        addedDate: number, pk: string, id: number, amount: number, unit: string
    }[]>([]);
    const [renderedItems, setRenderedItems] = useState<{
        addedDate: number, pk: string, id: number, amount: number, unit: string
    }[]>([]);

    useEffect(() => {
        (async () => {
            if (value) {
                const ret = await getFoodsInRange(user_uid, value, 1);
                setInitialItems(ret[0]);
                setRenderedItems(ret[0]);
            }
        })();
    }, [value]);

    const removeItem = (pk: string) => {
        setRenderedItems(renderedItems.filter(food => food.pk !== pk));
        setUpdated(true);
    }

    const addItem = (day: Dayjs, name: string | null, amount: number | '' | undefined, unit: string | undefined) => {
        if (!name || !amount || !unit) return;
        const id = getIdFromName(name);
        if (id === null) {
            console.log('food found not found');
            return;
        }
        const newItem = {
            addedDate: day.valueOf(),
            pk: String(Math.random()),
            id,
            unit,
            amount,
        }
        const newRendered = [...renderedItems];
        newRendered.push(newItem);
        setRenderedItems(newRendered);
        setUpdated(true);

        // reset
        setAddingAmount('');
        if (amountRef) {
            amountRef.current!.focus();
        }
        // setAddingFoodValue(null);
    }

    const saveItems = () => {
        const initialPks = initialItems.map(item => item.pk);
        const renderedPks = renderedItems.map(item => item.pk);

        const addedItems = renderedItems.filter(renderedItem => !initialPks.includes(renderedItem.pk));
        const removedPks = initialPks.filter(initPk => !renderedPks.includes(initPk));

        setLoadingSave(true);
        addAndDeleteFoods(user_uid, addedItems, removedPks).then(() => {
            closeModal();
            setLoadingSave(false);
        }
        );
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
                                className="modal-datePicker"
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                disableFuture
                            />
                        </LocalizationProvider>
                    </div>
                    <button className="button-icon" onClick={() => closeModal()}><img src={Cancel} /></button>
                </div>

                {renderedItems && renderedItems.length > 0 ?
                    (<div className="modal-chips">
                        {renderedItems.map((item) => <FoodChip
                            key={item.pk}
                            id={item.id}
                            unit={item.unit}
                            amount={item.amount}
                            style={'beige'}
                            onDelete={() => removeItem(item.pk)}
                        />)}
                    </div>) :
                    (<p className="modal-empty">
                        Looks like there haven't been any foods logged yet for this day.
                    </p>)
                }
                <div className="modal-add">
                    <div className="row add-food">
                        <TextField
                            className="add-food-amount input-green"
                            value={addingAmount}
                            inputRef={amountRef}
                            type={addingAmount === '' ? "" : "number"}
                            id="outlined-basic"
                            variant="outlined"
                            placeholder='amount'
                            autoFocus={true}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setAddingAmount('');
                                    return;
                                }
                                setAddingAmount(+(e.target.value) > 0 ? +(e.target.value) : 0);
                            }}
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
                        <Autocomplete
                            disablePortal
                            value={addingFoodValue}
                            // onChange={(e) => setAddingFood(e.target.value)}
                            onChange={(event: any, newValue: string | null) => {
                                setAddingFoodValue(newValue);
                            }}
                            inputValue={addingFoodInput}
                            onInputChange={(event, newInputValue) => {
                                setAddingFoodInput(newInputValue);
                            }}
                            id="combo-box-demo"
                            options={getFoodNames()}
                            renderInput={(params: any) => <TextField {...params} />}
                        />
                        <button
                            type="button"
                            className="button-primary"
                            disabled={!addingAmount || !addingUnit || !addingFoodValue}
                            onClick={() => addItem(value!, addingFoodValue, addingAmount, addingUnit)}
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="button-text" onClick={() => closeModal()}>Cancel</button>
                    {loadingSave ? <CircularProgress sx={{padding: '0px 23px', color: '#DD8256'}} size={16} /> : <button disabled={!updated} className="button-decorative" onClick={() => saveItems()}>Save</button>}
                </div>
            </div>
        </div>
    );
};
