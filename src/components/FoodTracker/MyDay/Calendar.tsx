import dayjs, { Dayjs } from 'dayjs';
import './today.scss'
import { useContext, useState } from 'react';
import { Dots } from './Dots';
import { FoodContext } from '../../../data/FoodContext';
import { AddFoodModal } from '../AddFoodModal';

interface CalendarProps {
    foods?: any[][],
}

export const Calendar: React.FC<CalendarProps> = ({
    foods,
}: CalendarProps) => {

    const [openModalDate, setOpenModalDate] = useState<Dayjs | null>(null);

    const {
        timeHorizon,
        setTimeHorizon
    } = useContext(FoodContext);

    const daysInWeek = 7;

    return (
        <div className="calendar">
            {foods && Array.from(Array(timeHorizon.length / daysInWeek)).map((value, weekIndex) => {
                return <div key={`week-${weekIndex}`} className="week row">
                    {Array.from(Array(daysInWeek)).map((value, dayIndex) => {
                        const totalIndex = (weekIndex * daysInWeek + dayIndex);
                        const fullDay = timeHorizon.startDate.add(totalIndex, 'day');
                        const isToday = fullDay.isSame(dayjs(), 'day');

                        // low opacity styles
                        const isLastMonth = weekIndex === 0 && fullDay.date() > 8;
                        const isNextMonth = weekIndex === (timeHorizon.length / daysInWeek) - 1 && fullDay.date() < 8;
                        const greyed = isLastMonth || isNextMonth;
                        return (
                            <div
                                key={totalIndex}
                                className={`day ${greyed ? 'day-grey' : ''}`}
                                onClick={() => setTimeHorizon({ startDate: fullDay.set('hour', 0).set('minute', 0).set('second', 0), length: 1 })}
                            >
                                <p className={isToday ? 'isToday' : ''}>
                                    {fullDay.date()}
                                </p>
                                <Dots dotKey={`day-${dayIndex}`} foodList={foods[totalIndex]} />
                                <button className="foodcard-add" onClick={(e) => { setOpenModalDate(fullDay); e.stopPropagation() }}>+</button>
                            </div>
                        )
                    })}
                </div>
            })}
            {openModalDate && <AddFoodModal
                foodToAdd={null}
                closeModal={() => setOpenModalDate(null)}
                date={openModalDate}
            />
            }
        </div>
    );
};

