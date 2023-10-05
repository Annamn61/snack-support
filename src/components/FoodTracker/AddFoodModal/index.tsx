import './addfoodmodal.scss'
import cancel from '../../../assets/CancelLight.svg';
import { FoodChip } from '../FoodChip/foodchip';
import { MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

interface AddFoodModalProps {
  food: any[],
  foodToAdd: any,
  deleteFood: (id: number) => void,
  closeModal: () => void,
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  deleteFood,
  food,
  foodToAdd,
  closeModal,
}: AddFoodModalProps) => {
  console.log('FOOD', food);
  const [addingAmount, setAddingAmount] = useState(foodToAdd.amount);
  const [addingUnit, setAddingUnit] = useState(foodToAdd.unit);

  return (
    <div className="modal">
      <div className="modal-background" />
      <div className="modal-container">
        <div className="modal-header">
          <div className="row">
            <h2>Editing</h2>
            <button>Today</button> {/* TODO: Should be a select */}
          </div>
          <button onClick={() => closeModal()}>X</button>
        </div>
        <div>
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
            <button type="button" className="button-primary" onClick={() => console.log('hi')}>Add</button>
            {/* <button type="button" className="button-primary" onClick={() => { addFoodToToday(selectedFood, addingAmount, addingUnit); setSelectedFood(undefined) }}>Add</button> */}
          </div>
        </div>
        <div className="modal-chips">
          {food.map((item) => <FoodChip
            key={item.id}
            unit={item.unit}
            name={item.name}
            amount={item.amount}
            type={'food'} // TODO: This should be fruit/veg/meat etc. 
            style={'beige'}
            onDelete={() => console.log('delete')}
          />
          )}
        </div>
        <div className="modal-add">

        </div>
        <div className="modal-footer">
          <button onClick={() => closeModal()}>Cancel</button>
          <button>Save</button>
        </div>
      </div>
    </div>



  );
};