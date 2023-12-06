import './App.css';
import './Style/global.scss'
import './Style/app.scss'
import './Style/constants.scss'
import './Style/Elements/buttons.scss'
import './Style/Elements/text.scss'
import { Header } from './components/Header';
import { AppRouter } from "./AppRouter";
import { FoodContextProvider } from './data/FoodContext';
import { Login } from './components/Login';
import { auth } from './data/Util/firebaseAuth';
import { useState } from 'react';
import { User } from 'firebase/auth';
function App() {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  auth.onAuthStateChanged((user) => {
    console.log('auth change', user);
    setCurrentUser(user);
  })

  return (
    currentUser ?
      (<FoodContextProvider user={currentUser} >
        <div>
          <Header />
          <AppRouter />
        </div>
      </ FoodContextProvider>) : (
        <Login />
      )
  );
}

export default App;