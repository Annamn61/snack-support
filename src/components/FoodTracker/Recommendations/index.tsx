import './recommendations.scss'
import { useMemo, useState } from 'react';
import most from '../../../assets/Most.svg';
import least from '../../../assets/Least.svg';
import cancel from '../../../assets/Cancel.svg';
import search from '../../../assets/search.svg';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FoodCard } from '../FoodCard';
import { AddFoodModal } from '../AddFoodModal';
import { NoResults } from './NoResults';
interface RecommendationProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (nutrient: any) => void;
    selectedFood: number | undefined;
    setSelectedFood: (food: any) => void;
    recommendationType: any;
    setRecommendationType: (food: any) => void;
    recommendedFoods: any[];
    timeHorizonFoods?: any[];
    removeFoodFromToday: (id: number) => void;
    addFoodToToday: (id: number, amount: number, unit: string) => void;
}

export const Recommendations: React.FC<RecommendationProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    selectedFood,
    setSelectedFood,
    recommendationType,
    setRecommendationType,
    recommendedFoods,
    timeHorizonFoods,
    removeFoodFromToday,
    addFoodToToday,
}: RecommendationProps) => {

    const [sortOrder, setSortOrder] = useState('Most');
    const [recType, setRecType] = useState('calorie');
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalFoodToAdd, setModalFoodToAdd] = useState(undefined);

    const matchesSearch = (food: any) => {
        if (food.item.name.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
        }
        if (food.item.aisle.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
        }
        if (food.item.image.toLowerCase().includes(searchText.toLowerCase())) {
            return true;
        }
        return food.item.categoryPath.map((category: string) => category.toLowerCase().includes(searchText.toLowerCase())).includes(true);
    }

    const displayedFoods = useMemo(() => {
        const filteredFoods = recommendedFoods.filter((food) => matchesSearch(food))
        const cards = filteredFoods.map((rec, index) => {
            return (<FoodCard
                id={rec.item.id}
                key={'foodCard_' + index}
                className={'recommendations-cards'}
                selectedFood={selectedFood}
                name={rec.item.name}
                image={rec.item.image}
                amount={+(rec.item.amount.toFixed(2))}
                unit={rec.item.unit}
                percent={(selectedNutrient !== undefined) && Math.round(rec.percent * 100) / 100}
                onClick={selectedFood === rec.item.id ? () => setSelectedFood(undefined) : () => setSelectedFood(rec.item.id)}
                onAdd={() => { setOpenModal(true); setModalFoodToAdd(rec.item) }}
            />)
        })
        if (sortOrder === "Most") {
            return [...cards];
        }
        return cards.slice().reverse();
    }, [recommendedFoods, selectedFood, sortOrder, searchText]);

    return (
        <div className="recommendations">
            <div className='rec-header row'>
                <div className='words row'>
                    {!isSearching ?
                        (<>
                            <button type="button" className="button-icon" onClick={() => setIsSearching(true)}>
                                <img src={search} alt="search" />
                            </button>
                            <h2>Top Recommendations</h2>
                        </>)
                        :
                        (
                            <TextField
                                value={searchText}
                                InputProps={{
                                    startAdornment: <img src={search} alt="search" />,
                                }}
                                className="search-bar"
                                type="text"
                                // onBlur={() => { setIsSearching(false); setSearchText('') }}
                                id="outlined-basic"
                                variant="outlined"
                                placeholder='search'
                                autoFocus={true}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        )
                    }
                </div>

                {!isSearching ? (<div className='display-settings row'>
                    For:
                    {selectedNutrient ?
                        <>
                            <button type="button" className="button-secondary" onClick={() => setSortOrder(sortOrder === 'Most' ? 'Least' : 'Most')}>
                                {sortOrder}
                                <img src={sortOrder === 'Most' ? most : least} alt={sortOrder} />
                            </button>
                            <button type="button" className="button-decorative" onClick={() => setSelectedNutrient(undefined)}>
                                <p>{selectedNutrient}</p>
                                <img src={cancel} alt="cancel" />
                            </button>
                        </> : 'today'
                    }
                    per
                    <Select
                        value={recommendationType}
                        onChange={(e) => setRecommendationType(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={'calorie'}>calorie</MenuItem>
                        <MenuItem value={'serving'}>serving</MenuItem>
                        <MenuItem value={'gram'}>gram</MenuItem>
                    </Select>
                </div>) :
                    (<p>{displayedFoods.length} results</p>)}

            </div>
            {displayedFoods.length > 0 ? (
                <div className='card-row row'>
                    {displayedFoods}
                    {/* {sortOrder === "Most" ? displayedFoods : displayedFoods.reverse()} */}
                </div>
            ) : <NoResults />}

            {openModal && <AddFoodModal
                food={timeHorizonFoods}
                foodToAdd={modalFoodToAdd}
                deleteFood={removeFoodFromToday}
                addFoodToToday={addFoodToToday}
                closeModal={() => setOpenModal(false)} />
            }
        </div>
    );
};