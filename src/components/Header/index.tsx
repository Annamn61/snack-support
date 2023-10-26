import './header.scss'
import logo from '../../assets/FF_Logo.svg';

export const Header: React.FC = () => {

  return (
    <div className="header">
      <a href="/">
        <img src={logo} alt="home logo"/>
      </a>
      <a href="/data">
        Data
      </a>
    </div>
  );
};