import './header.scss'
// interface HeaderProps {
//     percent: number,
//     name: string,
// }

export const Header: React.FC<{todaysFood: any[]}> = ({ todaysFood }) => {
    return (
        <div className="header">
            hello i am the header
            {todaysFood.map((food) => {
                return (
                    <div key={food.id}>
                        {food.name}
                    </div>
                )
            })}
        </div>
    );
};