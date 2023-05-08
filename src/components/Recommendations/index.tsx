import './recommendations.scss'
import { FoodCard } from '../FoodCard';
import { useEffect } from 'react';
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

    return (
        <div className="recommendations">
            <div className='rec-header row'>
                <div className='words col'>
                    <p className='header-1-w'>Top Recommendations</p>
                    <p className=''>for {selectedNutrient ? `${selectedNutrient} in` : ''} {getType()}</p>
                </div>
                <div className='type-buttons row'>
                    <button className={`${recommendationType === 'calories' ? 'selected' : 'unselected'}`} onClick={() => setRecommendationType('calories')}>Calories</button>
                    <button className={`${recommendationType === 'grams' ? 'selected' : 'unselected'}`} onClick={() => setRecommendationType('grams')}>Grams</button>
                    <button className={`${recommendationType === 'servings' ? 'selected' : 'unselected'}`} onClick={() => setRecommendationType('servings')}>Servings</button>
                </div>
            </div>
            <div className='card-row row'>
                {recommendedFoods.map((rec) => {
                    console.log('rec', rec.percent);
                    return (
                        <FoodCard
                            className={'recommendations-cards'}
                            selectedFood={selectedFood}
                            name={rec.item.name}
                            image={rec.item.image}
                            amount={+(rec.item.amount.toFixed(2))}
                            unit={rec.item.unit}
                            percent={Math.round(rec.percent * 100) / 100}
                            onClick={selectedFood === rec ? () => setSelectedFood(undefined) : () => setSelectedFood(rec)}
                        />
                    )
                })}
            </div>
        </div>
    );
};