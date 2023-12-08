import './recommendations.scss'
import { useContext, useMemo, useState } from 'react';
import most from '../../../assets/Most.svg';
import least from '../../../assets/Least.svg';
import cancel from '../../../assets/Cancel.svg';
import cancel_light from '../../../assets/CancelLight.svg';
import search from '../../../assets/search.svg';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FoodCard } from '../FoodCard';
import { AddFoodModal } from '../AddFoodModal';
import { NoResults } from './NoResults';
import { FoodContext } from '../../../data/FoodContext';
import { convertTimeHorizonLengthToSelectRelative } from '../../../data/Helpers/foodCalcHelpers';

export const Recommendations: React.FC = () => {

    const {
        addFoodToDay,
        removeFoodFromToday,
        selectedNutrient,
        setSelectedNutrient,
        selectedFood,
        setSelectedFood,
        recommendationType,
        setRecommendationType,
        recommendedFoods,
        user_uid,
        timeHorizon
    } = useContext(FoodContext);

    const [sortOrder, setSortOrder] = useState('Most');
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalFoodToAdd, setModalFoodToAdd] = useState<any>(undefined);

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
            const modalFoodToAdd = ({
                unit: recommendationType === 'serving' ? recommendationType : recommendationType + 's',
                amount: rec.item.amount,
                name: rec.item.name,
                id: rec.item.id
            })
            return (<FoodCard
                id={rec.item.id}
                key={'foodCard_' + index}
                className={'recommendations-cards'}
                selectedFood={selectedFood}
                name={rec.item.name}
                image={rec.item.image}
                amount={+(rec.item.amount.toFixed(2))}
                unit={rec.item.unit}
                percent={(selectedNutrient !== undefined && rec.percent !== undefined) && Math.round(rec.percent * 100) / 100}
                onClick={selectedFood === rec.item.id ? () => setSelectedFood(undefined) : () => setSelectedFood(rec.item.id)}
                onAdd={() => { setOpenModal(true); setModalFoodToAdd(modalFoodToAdd) }}
            />)
        })
        if (sortOrder === "Most") {
            return [...cards];
        }
        return cards.slice().reverse();
    }, [recommendedFoods, selectedFood, sortOrder, searchText]);

    const searchCancel = (
        <button className="button-icon-small" onClick={() => setSearchText('')}>
            <img src={cancel_light} alt="cancel" />
        </button>
    )

    const searchBar = (<TextField
        value={searchText}
        InputProps={{
            startAdornment: <img src={search} alt="search" />,
            endAdornment: searchText !== '' && searchCancel,
        }}
        className="search-bar"
        type="text"
        // onBlur={() => { setIsSearching(false); setSearchText('') }}
        id="outlined-basic"
        variant="outlined"
        placeholder='search'
        autoFocus={true}
        onChange={(e) => setSearchText(e.target.value)}
    />);

    const mostLeastSorter = (
        <button type="button" className="button-secondary" onClick={() => setSortOrder(sortOrder === 'Most' ? 'Least' : 'Most')}>
            {sortOrder}
            <img src={sortOrder === 'Most' ? most : least} alt={sortOrder} />
        </button>
    )

    const vitaminChip = (
        <button type="button" className="button-decorative" onClick={() => setSelectedNutrient(undefined)}>
            <p>{selectedNutrient}</p>
            <img src={cancel} alt="cancel" />
        </button>
    )

    const unitSelector = (
        <Select
            value={recommendationType}
            onChange={(e) => setRecommendationType(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            autoWidth={true}
        >
            <MenuItem value={'calorie'}>calorie</MenuItem>
            <MenuItem value={'serving'}>serving</MenuItem>
            <MenuItem value={'gram'}>gram</MenuItem>
        </Select>
    )

    return (
        <div className="recommendations">
            <div className='rec-header col'>
                <div className='rec-header-top row'>
                    {selectedNutrient ? (
                        <div className="rec-header-top-nutrients row">
                            {mostLeastSorter}
                            {vitaminChip}
                        </div>
                    ) : (
                        <h2>Top Recommendations</h2>
                    )
                    }
                    {searchBar}
                </div>
                <div className='rec-header-bottom row'>
                    <div className='rec-header-bottom-info row'>
                        per
                        {unitSelector}
                        {/* For:
                        {convertTimeHorizonLengthToSelectRelative(timeHorizon.length)} */}
                    </div>
                    <p>{displayedFoods.length} results</p>
                </div>
            </div>

            {displayedFoods.length > 0 ? (
                <div className='card-row row'>
                    {displayedFoods}
                </div>
            ) : <NoResults />}

            {openModal && <AddFoodModal
                foodToAdd={modalFoodToAdd}
                closeModal={() => setOpenModal(false)}
            />
            }
        </div>
    );
};