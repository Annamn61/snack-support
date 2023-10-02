import './App.css';
import './Style/global.scss'
import './Style/app.scss'
import './Style/constants.scss'
import './Style/Elements/buttons.scss'
import './Style/Elements/text.scss'
import { Header } from './components/Header';
import { useFoodCalculations } from './data/useFoodCalculations';
import { AppRouter } from "./AppRouter";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";
import { firebaseConfig, writeTestData } from "./data/Util/firebase";


function App() {

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  writeTestData(1, 'test', 'emailTest');

  // calls data and then caches it in local storage
  // use food calcs should read from the cache
  // V1: NO CACHING - Just call from firebase again each time
  const foodData = useFoodCalculations();


  // const [foodData, setFoodData] = useState(useFoodCalculations())
  // const foodData = createContext(FoodContext);

  return (
    // <FoodContext.Provider value={foodData}>
    <div>
      <Header todaysFood={foodData.todaysFood} />
      <AppRouter foodData={foodData} />
    </div>
    // </ FoodContext.Provider>
  );
}

export default App;