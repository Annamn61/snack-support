import { MenuItem, Select } from '@mui/material';
import { FoodContext } from '../../data/FoodContext';
import { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import arrowLeft from '../../assets/ArrowLeft.svg'
import arrowRight from '../../assets/ArrowRight.svg'
// import { FoodChip } from '../FoodChip/foodchip';
// import { Calendar } from './Calendar';
// import { FoodContext } from '../../../data/FoodContext';
// import { convertTimeHorizonLengthToSelect } from '../../../data/Helpers/foodCalcHelpers';

export const TimeHorizonToggle: React.FC = () => {

    const [value, setValue] = useState<Dayjs | null>(dayjs());

    const {
        timeHorizon,
        setTimeHorizon
    } = useContext(FoodContext);

    const updateTimeHorizon = (value: 'week' | 'day' | 'month') => {
        let day = dayjs();
        let length = 1;
        if (value === 'week') {
            day = dayjs().set('day', 1);
            length = 7;
        }
        if (value === 'month') {
            const firstWeekDay = day.startOf("month").day()
            day = dayjs().set('date', 1).subtract(firstWeekDay, 'day');
            length = Math.ceil((firstWeekDay + day.daysInMonth()) / 7) * 7;
        }
        setTimeHorizon({ startDate: day.set('hour', 0).set('minute', 0).set('second', 0), length: length })
    }

    const convertLengthToSelect = (length: number) => {
        if (length === 1) return 'day'
        if (length === 7) return 'week'
        return 'month';
    }

    const [monthsBack, setMonthsBack] = useState(0);

    useEffect(() => {
        const currentDate = dayjs().subtract(monthsBack, 'month');
        const firstWeekday = currentDate.startOf("month").day();
        const daysInMonth = currentDate.daysInMonth();
        const numWeeksDisplayed = Math.ceil((firstWeekday + daysInMonth) / 7);
        const firstDisplayedDay = currentDate.set('date', 1).subtract(firstWeekday, 'day');
        setTimeHorizon({ startDate: firstDisplayedDay.set('hour', 0).set('minute', 0).set('second', 0), length: numWeeksDisplayed * 7 });
    }, [monthsBack])

    const setToToday = () => {
        if (timeHorizon.length === 1) {
            setTimeHorizon({ startDate: dayjs().set('hour', 0).set('minute', 0).set('second', 0), length: 1 });
        } else {
            setMonthsBack(0);
        }
    }

    const setTimeHorizonDate = (date: Dayjs | null) => {
        const dateToSet = date ? date : dayjs();
        setTimeHorizon({ startDate: dateToSet.set('hour', 0).set('minute', 0).set('second', 0), length: 1 });
    }

    return (
        <div className="timeHorizon-container row">
            {timeHorizon.length === 1 ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        className="modal-datePicker"
                        value={timeHorizon.startDate}
                        onChange={(newValue) => setTimeHorizonDate(newValue)}
                        disableFuture
                    />
                </LocalizationProvider>
            ) : (
                <>
                    <button className="button-tiny" onClick={() => setMonthsBack(monthsBack + 1)}>
                        <img src={arrowLeft} />
                    </button>
                    <div className="timeHorizon-month row">
                        <p>{timeHorizon.startDate.add(8, 'day').format('MMMM')}</p>
                        <p>'{timeHorizon.startDate.add(8, 'day').format('YY')}</p>
                    </div>
                    <button disabled={monthsBack === 0} className="button-tiny" onClick={() => setMonthsBack(Math.max(monthsBack - 1, 0))}>
                        <img src={arrowRight} />
                    </button>
                </>
            )}
            <button className="button-icon" onClick={setToToday}>#</button>

            <Select
                className="add-food-unit select-green"
                value={convertLengthToSelect(timeHorizon.length)}
                onChange={(e) => updateTimeHorizon(e.target.value as 'day' | 'week' | 'month')}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value={'day'}>day</MenuItem>
                {/* <MenuItem value={'week'}>this week</MenuItem> */}
                <MenuItem value={'month'}>month</MenuItem>
            </Select>
        </div>
    );
};