import './App.css';
import './Style/global.scss'
import './Style/app.scss'
import './Style/constants.scss'
import './Style/Elements/buttons.scss'
import './Style/Elements/text.scss'
import { Header } from './components/Header';
import { AppRouter } from "./AppRouter";
import { FoodContextProvider } from './data/FoodContext';
function App() {

  return (
    <FoodContextProvider>
    <div>
      <Header />
      <AppRouter />
    </div>
    </ FoodContextProvider>
  );
}

export default App;