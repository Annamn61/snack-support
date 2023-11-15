import { Nutrients } from './Nutrients/Nutrients';
import { Recommendations } from './Recommendations';
import { MyDay } from './MyDay';

export const FoodTracker: React.FC = () => {

    return (
        <div className="App col">
            <div className="content row">
                <div className="content-right col">
                    <Nutrients />
                </div>
                <div className="content-left">
                    <Recommendations />
                    <MyDay />
                </div>
            </div>
        </div >
    );
}

export default FoodTracker;