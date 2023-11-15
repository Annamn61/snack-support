import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import FoodTracker from './components/FoodTracker';
import { DataPage } from './components/DataPage';

export const AppRouter: React.FC = () => {
    return (
        <Router>
        <Routes>
          <Route path='/' element={<FoodTracker />} />
          <Route path='/data' element={<DataPage />} />
        </Routes>
        </Router>
    );
};