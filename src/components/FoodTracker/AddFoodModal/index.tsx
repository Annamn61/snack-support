import './addfoodmodal.scss'
import cancel from '../../../assets/CancelLight.svg';
import { FoodChip } from '../FoodChip/foodchip';

interface AddFoodModalProps {
    food: any[],
    deleteFood: (id: number) => void,
    closeModal: () => void,
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
    deleteFood,
    food,
    closeModal,
}: AddFoodModalProps) => {
    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Editing</h2>
                    <button>Today</button> {/* TODO: Should be a select */}
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
                    <button>Cancel</button>
                    <button>Save</button>
                </div>
            </div>
        </div>



    );
};