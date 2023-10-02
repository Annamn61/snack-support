import { ResponsiveBar } from '@nivo/bar'
// import { NutrientSum } from '../../../data/Helpers/foodCalcHelpers';
import { getTotaPercentDVByDay } from '../../../data/Helpers/foodCalcHelpers';

const data = [
    {
        "country": "AD",
        "hot dog": 2,
        "hot dogColor": "hsl(336, 70%, 50%)",
        "burger": 169,
        "burgerColor": "hsl(235, 70%, 50%)",
        "sandwich": 175,
        "sandwichColor": "hsl(341, 70%, 50%)",
        "kebab": 3,
        "kebabColor": "hsl(253, 70%, 50%)",
        "fries": 9,
        "friesColor": "hsl(353, 70%, 50%)",
        "donut": 97,
        "donutColor": "hsl(237, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 101,
        "hot dogColor": "hsl(330, 70%, 50%)",
        "burger": 200,
        "burgerColor": "hsl(80, 70%, 50%)",
        "sandwich": 190,
        "sandwichColor": "hsl(334, 70%, 50%)",
        "kebab": 72,
        "kebabColor": "hsl(19, 70%, 50%)",
        "fries": 52,
        "friesColor": "hsl(269, 70%, 50%)",
        "donut": 2,
        "donutColor": "hsl(135, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 151,
        "hot dogColor": "hsl(248, 70%, 50%)",
        "burger": 179,
        "burgerColor": "hsl(325, 70%, 50%)",
        "sandwich": 145,
        "sandwichColor": "hsl(132, 70%, 50%)",
        "kebab": 78,
        "kebabColor": "hsl(172, 70%, 50%)",
        "fries": 165,
        "friesColor": "hsl(354, 70%, 50%)",
        "donut": 102,
        "donutColor": "hsl(237, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 72,
        "hot dogColor": "hsl(216, 70%, 50%)",
        "burger": 29,
        "burgerColor": "hsl(223, 70%, 50%)",
        "sandwich": 30,
        "sandwichColor": "hsl(134, 70%, 50%)",
        "kebab": 7,
        "kebabColor": "hsl(70, 70%, 50%)",
        "fries": 120,
        "friesColor": "hsl(332, 70%, 50%)",
        "donut": 25,
        "donutColor": "hsl(64, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 11,
        "hot dogColor": "hsl(207, 70%, 50%)",
        "burger": 51,
        "burgerColor": "hsl(83, 70%, 50%)",
        "sandwich": 8,
        "sandwichColor": "hsl(241, 70%, 50%)",
        "kebab": 112,
        "kebabColor": "hsl(133, 70%, 50%)",
        "fries": 123,
        "friesColor": "hsl(39, 70%, 50%)",
        "donut": 125,
        "donutColor": "hsl(150, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 70,
        "hot dogColor": "hsl(40, 70%, 50%)",
        "burger": 155,
        "burgerColor": "hsl(85, 70%, 50%)",
        "sandwich": 59,
        "sandwichColor": "hsl(322, 70%, 50%)",
        "kebab": 90,
        "kebabColor": "hsl(308, 70%, 50%)",
        "fries": 151,
        "friesColor": "hsl(230, 70%, 50%)",
        "donut": 82,
        "donutColor": "hsl(350, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 137,
        "hot dogColor": "hsl(352, 70%, 50%)",
        "burger": 109,
        "burgerColor": "hsl(14, 70%, 50%)",
        "sandwich": 141,
        "sandwichColor": "hsl(103, 70%, 50%)",
        "kebab": 185,
        "kebabColor": "hsl(91, 70%, 50%)",
        "fries": 81,
        "friesColor": "hsl(174, 70%, 50%)",
        "donut": 57,
        "donutColor": "hsl(238, 70%, 50%)"
    }
]

interface NutrientPercentProps {
    food: any;
}

export const NutrientPercent: React.FC<NutrientPercentProps> = ({ food }) => {

    const nutrientData = getTotaPercentDVByDay(food, 1);

    return (
        <div className="graph-nutrientPercent">
            <div>FIRST GRAPH-</div>
            <ResponsiveBar
                data={nutrientData}
                keys={[
                    'percentDV',
                ]}
                indexBy="name"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'country',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'food',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
            />
        </div>
    );
};