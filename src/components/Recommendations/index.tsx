import './recommendations.scss'
import { FoodCard } from '../FoodCard';
import { useMemo, useState } from 'react';
import most from '../../assets/Most.svg';
import least from '../../assets/Least.svg';
import cancel from '../../assets/Cancel.svg';
import search from '../../assets/search.svg';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
interface RecommendationProps {
    selectedNutrient: string | undefined;
    selectedFood: any;
    setSelectedFood: (food: any) => void;
    recommendationType: any;
    setRecommendationType: (food: any) => void;
    recommendedFoods: any[];
}

export const Recommendations: React.FC<RecommendationProps> = ({
    selectedNutrient,
    selectedFood,
    setSelectedFood,
    recommendationType,
    setRecommendationType,
    recommendedFoods,
}: RecommendationProps) => {

    // delete
    const getType = () => {
        switch (recommendationType) {
            case 'calories':
                return '100 calories'
                break;
            case 'grams':
                return '100 grams'
                break;
            default:
                return '1 serving'
        };
    }

    const [sortOrder, setSortOrder] = useState('Most');
    const [recType, setRecType] = useState('calorie');
    const [timePeriod, setTimePeriod] = useState('today');
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const displayedFoods = useMemo(() => {
        const cards = recommendedFoods.filter((food) => food.item.name.includes(searchText)).map((rec, index) => {
            return (<FoodCard
                key={'foodCard_' + index}
                className={'recommendations-cards'}
                selectedFood={selectedFood}
                name={rec.item.name}
                image={rec.item.image}
                amount={+(rec.item.amount.toFixed(2))}
                unit={rec.item.unit}
                percent={rec.percent && Math.round(rec.percent * 100) / 100}
                onClick={selectedFood === rec ? () => setSelectedFood(undefined) : () => setSelectedFood(rec)}
            />)
        })
        if (sortOrder === "Most") {
            return [...cards];
        }
        console.log('reverse', cards.reverse()[0])
        return cards.slice().reverse();
    }, [recommendedFoods, selectedFood, sortOrder, searchText]);

    return (
        <div className="recommendations">
            <div className='rec-header row'>
                <div className='words row'>
                    {!isSearching ?
                        (<>
                            <button className="circle-button" onClick={() => setIsSearching(true)}>
                                <img src={search} />
                            </button>
                            <p className='header-1-w row'>Top Recommendations</p>
                        </>)
                        :
                        (
                            <TextField
                                value={searchText}
                                InputProps={{
                                    startAdornment: <img src={search} />,
                                }}
                                className="search-bar"
                                type="text"
                                onBlur={() => { setIsSearching(false); setSearchText('') }}
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
                            <button className="selected row" onClick={() => setSortOrder(sortOrder === 'Most' ? 'Least' : 'Most')}>
                                {sortOrder}
                                <img src={sortOrder === 'Most' ? most : least} />
                            </button>
                            <button className={'selected-nutrient row'} >
                                <p>{selectedNutrient}</p>
                                <img src={cancel} />
                            </button>
                        </> :
                        <Select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value={'today'}>Today</MenuItem>
                            <MenuItem value={'week'}>This Week</MenuItem>
                            <MenuItem value={'month'}>This Month</MenuItem>
                        </Select>
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
            <div className='card-row row'>
                {sortOrder === "Most" ? displayedFoods : displayedFoods.reverse()}
            </div>
        </div>
    );
};