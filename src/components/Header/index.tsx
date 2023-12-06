import './header.scss'
import { MenuItem, Select } from '@mui/material';
import logo from '../../assets/FF_Logo.svg';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { FoodContext } from '../../data/FoodContext';
import { logout } from '../../data/Util/firebaseAuth';

export const Header: React.FC = () => {

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

  return (
    <div className="header row">
      <div className='row'>
        <a href="/">
          <img src={logo} alt="home logo" />
        </a>
      </div>
      <div className='row'>
        <Select
          className="add-food-unit select-green"
          value={convertLengthToSelect(timeHorizon.length)}
          onChange={(e) => updateTimeHorizon(e.target.value as 'day' | 'week' | 'month')}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={'day'}>today</MenuItem>
          <MenuItem value={'week'}>this week</MenuItem>
          <MenuItem value={'month'}>this month</MenuItem>
        </Select>
        <button className="button-text" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};