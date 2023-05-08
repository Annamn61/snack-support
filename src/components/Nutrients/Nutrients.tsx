import { PercentBar } from "./PercentBar";
import './nutrients.scss'

interface NutrientProps {
    selectedNutrient: string | undefined;
    setSelectedNutrient: (vitamin: string | undefined) => void;
    todaysNutrients: any[];
    selectedFood: any;
}

export const Nutrients: React.FC<NutrientProps> = ({
    selectedNutrient,
    setSelectedNutrient,
    todaysNutrients,
    selectedFood
}: NutrientProps) => {
    return (
        <div className="nutrients-container col">
            <p className="header-1">Today's Nutrients</p>
            <div className="nutrient-bars col">
                {todaysNutrients.map((nut: { name: string, percentDV: number, percentOfSelectedFood: number }) => {
                    const greyedOut = selectedNutrient ? selectedNutrient !== nut.name : false;
                    return (<PercentBar
                        greyedOut={greyedOut}
                        setSelectedNutrient={selectedNutrient === nut.name ? () => setSelectedNutrient(undefined) : () => setSelectedNutrient(nut.name)}
                        name={nut.name}
                        percent={nut.percentDV}
                        percentOfSelectedFood={nut.percentOfSelectedFood}
                    />);
                }
                )}
            </div>
        </div>
    );
};