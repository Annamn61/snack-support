import './header.scss'
import logo from '../../assets/FF_Logo.svg';
// interface HeaderProps {
//     percent: number,
//     name: string,
// }

export const Header: React.FC<{todaysFood: any[]}> = ({ todaysFood }) => {
    return (
        <div className="header">
            <img src={logo} />
            {/* {todaysFood.map((food) => {
                return (
                    <div key={food.id}>
                        {food.name}
                    </div>
                )
            })} */}
        </div>
    );
};