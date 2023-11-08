import dayjs from 'dayjs';
import './today.scss'
import { useEffect, useMemo, useState } from 'react';
import { Dots } from './Dots';
import { getFoodsInRange } from '../../../data/Util/firebase';

interface CalendarProps {
    monthsBack: number,
    food: any[],
    // timeHorizon: number;
    // setTimeHorizon: (tH: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    monthsBack,
    food,
    // timeHorizon,
    // setTimeHorizon
}: CalendarProps) => {

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [renderedItems, setRenderedItems] = useState<any[][]>([]);

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

    const listedDays = useMemo(() => {
        const totalDisplayed = numWeeksDisplayed * daysInWeek;
        const currMonthDays = Array.from({ length: daysInMonth }, (value, index) => index + 1);
        const prevMonthDays = Array.from({ length: firstWeekday }, (value, index) => daysInPreviousMonth - firstWeekday + index + 1);
        const nextMonthDays = Array.from({ length: totalDisplayed - currMonthDays.length - prevMonthDays.length }, (value, index) => index + 1);

        return [...prevMonthDays, ...currMonthDays, ...nextMonthDays];
    }, [daysInPreviousMonth, daysInMonth, firstWeekday, numWeeksDisplayed]);

    const firstDisplayedDay = useMemo(() => {
        return currentDate.set('date', 1).subtract(firstWeekday, 'day');
    }, [currentDate, firstWeekday]);

    useEffect(() => {
        (async () => {
            const ret = await getFoodsInRange(firstDisplayedDay, numWeeksDisplayed * daysInWeek);
            setRenderedItems(ret);
        })();
    }, [numWeeksDisplayed, firstDisplayedDay]);


    const getDayNumber = (weekIndex: number, dayIndex: number) => {
        const totalIndex = (weekIndex * daysInWeek + dayIndex);
        return listedDays[totalIndex];
    }

    return (
        <div className="calendar">
            {currentDate.format('MMMM')}
            {Array.from(Array(numWeeksDisplayed)).map((value, weekIndex) => {
                return <div key={`week-${weekIndex}`} className="week row">
                    {Array.from(Array(daysInWeek)).map((value, dayIndex) => {
                        const totalIndex = (weekIndex * daysInWeek + dayIndex);
                        const isToday = false; // TODO:1 - calc if this is today
                        return <div key={totalIndex} className="day"><p className={isToday ? 'isToday' : ''}>{getDayNumber(weekIndex, dayIndex)}</p><Dots foodList={renderedItems[totalIndex]} /></div>
                    })}
                </div>
            })}
        </div>
    );
};

