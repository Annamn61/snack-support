import './recommendations.scss'
import { FoodCard } from '../FoodCard';
import { useMemo, useState } from 'react';
import most from '../../assets/Most.svg';
import least from '../../assets/Least.svg';
import search from '../../assets/search.svg';
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
    const [isSearching, setIsSearching] = useState(false);

    const displayedFoods = useMemo(() => {
        const cards = recommendedFoods.map((rec, index) => {
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
    }, [recommendedFoods, selectedFood, sortOrder]);

    return (
        <div className="recommendations">
            <div className='rec-header row'>
                <div className='words row'>
                    {!isSearching ?
                        (<>
                            <button className="search-button" onClick={() => setIsSearching(true)}>
                                <img src={search} />
                            </button>
                            <p className='header-1-w'>Top Recommendations</p>
                        </>)
                        :
                        (<input type="text" onBlur={() => setIsSearching(false)} >
                        </input>)
                    }
                </div>

                <div className='row'>
                    For:
                    <div className='row'>
                        <button className="selected row" onClick={() => setSortOrder(sortOrder === 'Most' ? 'Least' : 'Most')}>
                            <p>
                                {sortOrder}
                            </p>
                            <img src={sortOrder === 'Most' ? most : least} />
                        </button>
                        <p className=''>{selectedNutrient ? `${selectedNutrient} in` : ''} {getType()}</p>
                    </div>
                    <button className={`${recommendationType === 'calories' ? 'selected' : 'unselected'}`} onClick={() => setRecommendationType('calories')}>Vitamin</button>
                    per
                    <select onChange={(e) => setRecommendationType(e.target.value)}>
                        <option value="calories" onSelect={() => setRecommendationType('calories')}>100 calories</option>
                        <option value="serving" onSelect={() => setRecommendationType('servings')}>serving</option>
                        <option value="grams" onClick={() => setRecommendationType('grams')}>100 grams</option>
                    </select>
                </div>

            </div>
            <div className='card-row row'>
                {sortOrder === "Most" ? displayedFoods : displayedFoods.reverse()}
                {sortOrder === "Most" ? 'displayedFoods' : 'displayedFoods.reverse()'}
            </div>
        </div>
    );
};