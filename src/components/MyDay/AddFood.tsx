import { useState } from 'react';
import { baseFoods } from '../../data/BaseFoods/_BaseIndex';
import { searchFoodItems } from '../../data/api';
interface RecommendationProps {
    selectedFood: any;
}

export const AddFood: React.FC<RecommendationProps> = ({
    selectedFood,
}: RecommendationProps) => {
    const topRecs = ['hi', 'hello', 'wtf is up'];
    const [filteredItems, setFilteredItems] = useState(baseFoods);
    const filterItems = (e: any) => {
      const value = e.target.value
    //   setFilteredItems(baseFoods.filter((item) => item.includes(value)));
    }
  
    return (
        <div className="addfood">
            <div>
                <input
                    className="search"
                    type="text"
                    placeholder="searchmeee"
                    onChange={(e) => filterItems(e)}
                />
                <button
                    onClick={() => console.log(searchFoodItems('banana'))}
                >
                    Banana
                </button>
                {/* {filteredItems} */}
            </div>
        </div>
    );
};