import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import FoodTracker from './components/FoodTracker';
import { DataPage } from './components/DataPage';

export const AppRouter: React.FC<{foodData: any}> = ({ foodData }) => {
    return (
        <Router>
        <Routes>
          <Route path='/' element={<FoodTracker foodData={foodData} />} />
          <Route path='/data' element={<DataPage foodData={foodData} />} />
        </Routes>
        </Router>
    );
};