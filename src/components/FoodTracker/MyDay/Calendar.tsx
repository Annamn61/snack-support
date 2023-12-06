import dayjs, { Dayjs } from 'dayjs';
import './today.scss'
import { useEffect, useMemo, useState } from 'react';
import { Dots } from './Dots';

interface CalendarProps {
    foods?: any[][],
    monthsBack: number,
    timeHorizon: { startDate: Dayjs, length: number };
    setTimeHorizon: (tH: { startDate: Dayjs, length: number }) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    foods, 
    monthsBack,
    timeHorizon,
    setTimeHorizon
}: CalendarProps) => {

    const [currentDate, setCurrentDate] = useState(dayjs());

    useEffect(() => {
        setCurrentDate(dayjs().subtract(monthsBack, 'month'));
    }, [monthsBack])

    const daysInWeek = 7;

    const firstWeekday = useMemo(() => (
        currentDate.startOf("month").day()
    ), [currentDate]);

    const daysInMonth = useMemo(() => {
        return currentDate.daysInMonth();
    }, [currentDate]);

    const daysInPreviousMonth = useMemo(() => {
        return (currentDate.subtract(1, 'month')).daysInMonth();
    }, [currentDate]);

    const numWeeksDisplayed = useMemo(() => (
        Math.ceil((firstWeekday + daysInMonth) / 7)
    ), [firstWeekday, daysInMonth]);

    const firstDisplayedDay = useMemo(() => {
        return currentDate.set('date', 1).subtract(firstWeekday, 'day');
    }, [currentDate, firstWeekday]);

    useEffect(() => {
        setTimeHorizon({ startDate: firstDisplayedDay.set('hour', 0).set('minute', 0).set('second', 0), length: numWeeksDisplayed * 7 });
    }, [numWeeksDisplayed, firstDisplayedDay]);

    return (
        <div className="calendar">
            {currentDate.format('MMMM')}
            {foods && Array.from(Array(numWeeksDisplayed)).map((value, weekIndex) => {
                return <div key={`week-${weekIndex}`} className="week row">
                    {Array.from(Array(daysInWeek)).map((value, dayIndex) => {
                        const totalIndex = (weekIndex * daysInWeek + dayIndex);
                        const fullDay = firstDisplayedDay.add(totalIndex, 'day');
                        const isToday = fullDay.isSame(dayjs(), 'day');

                        // low opacity styles
                        const isLastMonth = weekIndex === 0 && fullDay.date() > 8;
                        const isNextMonth = weekIndex  === numWeeksDisplayed - 1 && fullDay.date() < 8;
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
                            </div>
                        )
                    })}
                </div>
            })}
        </div>
    );
};

