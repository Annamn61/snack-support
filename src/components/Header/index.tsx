import './header.scss'
import logo from '../../assets/FF_Logo.svg';
import { logout } from '../../data/Util/firebaseAuth';
import { TimeHorizonToggle } from './TimeHorizonToggle';

export const Header: React.FC = () => {

  return (
    <div className="header row">
      <div className='row'>
        <a href="/">
          <img src={logo} alt="home logo" />
        </a>
      </div>
      <div className='row'>
        <TimeHorizonToggle />
        <button className="button-text" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};