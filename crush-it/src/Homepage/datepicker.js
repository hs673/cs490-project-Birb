import React, { useState } from 'react';
import {Center, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Text, useColorModeValue} from '@chakra-ui/react';
import {IoChevronBackCircleSharp, IoChevronForwardCircleSharp, IoChevronDownCircleOutline} from 'react-icons/io5';
import { useDateContext } from '../components/datecontext';

function DatePicker({onDateSelected}) {
    const text = useColorModeValue('black', 'white');
    const ic = useColorModeValue('#6284FF', '#90cdf4');


    const currentDate = new Date();
    const curMonth = currentDate.toLocaleString('default', { month: 'long' });
    const curDate = currentDate.getDate().toString();
    const curYear = currentDate.getFullYear().toString();


    const [selectedMonth, setSelectedMonth] = useState(curMonth);
    const [selectedDate, setSelectedDate] = useState(curDate);
    const [selectedYear, setSelectedYear] = useState(curYear);

    //selected date = today
    const { setAsCurrentDate, setAsGreaterCurrentDate } = useDateContext();

    const isCurrentDate = (
      selectedMonth === curMonth &&
      selectedDate === curDate &&
      selectedYear === curYear
    );
    setAsGreaterCurrentDate(selectedYear > curYear || (selectedYear === curYear && selectedMonth > curMonth) || (selectedYear === curYear && selectedMonth === curMonth && selectedDate > curDate))

    console.log("isToday", isCurrentDate)

    setAsCurrentDate(isCurrentDate);
  
    const handleDateSelected = (day, month, year)=> {
        onDateSelected(day.toString() + "-" + month.toString()+"-"+year.toString());
    }

    handleDateSelected(selectedDate,selectedMonth,selectedYear)

    const handleMonthClick = (month) => {
      setSelectedMonth(month);

    // Recalculate selectedDate based on the new month
    const daysInMonth = getDaysInMonth(selectedYear, month);
    setSelectedDate((prevDate) => (prevDate <= daysInMonth ? prevDate : daysInMonth));
    handleDateSelected(selectedDate,selectedMonth,selectedYear)
    };   
  
    const handleDateClick = (date) => {
      setSelectedDate(date);
      handleDateSelected(selectedDate,selectedMonth,selectedYear)
    };
  
    const handleYearClick = (year) => {
      if (getDaysInMonth(year, selectedMonth) !== 29 && selectedMonth === 'February' && selectedDate === '29') { // go back to February 28th if current date is February 29th
        setSelectedDate('28');
      }
      setSelectedYear(year);
      handleDateSelected(selectedDate,selectedMonth,selectedYear)
    };

    const setPreviousYear = (year) => {
      // don't go prior to current year
      if (year !== curYear) {
        if (selectedMonth === 'February' && selectedDate === '29') { // go back to February 28th if current date is February 29th
          setSelectedDate('28');
        }
        setSelectedYear((parseInt(year)-1).toString());
      }
      return (parseInt(year)-1).toString();
    };

    const setPreviousMonth = (year, month) => {
      var monthIndex = months.indexOf(month);
      if (monthIndex === 0) {
        setPreviousYear(year);
        monthIndex = ((year === curYear) ? 0 : 11); // don't go to December if selectedYear is curYear
      } else {
        monthIndex--;
      }
      handleMonthClick(months[monthIndex]);
      return months[monthIndex];
    };

    const setPreviousDate = (year, month, date) => {
      date = parseInt(date);
      if (date === 1) {
        month = setPreviousMonth(year, month);
        // don't go to 31 if it's January 1st curYear
        if (year !== curYear || months.indexOf(selectedMonth) !== 0) {
          setSelectedDate(getDaysInMonth(selectedYear, month).toString()) 
        }
      } else {
        date--;
        setSelectedDate(date.toString());
      }
    };
    
    const setNextYear = (year) => {
      // don't go further than 10 years
      if (year !== (parseInt(curYear)+9).toString()) {
        if (selectedMonth === 'February' && selectedDate === '29') { // go back to February 28th if current date is February 29th
          setSelectedDate('28');
        }
        setSelectedYear((parseInt(year)+1).toString());
      }
      return (parseInt(year)+1).toString();
    };

    const setNextMonth = (year, month) => {
      var monthIndex = months.indexOf(month);
      if (monthIndex === 11) {
        setNextYear(year);
        monthIndex = ((year === (parseInt(curYear)+9).toString()) ? 11 : 0); // don't go to January if selectedYear is curYear+9
      } else {
        monthIndex++;
      }
      handleMonthClick(months[monthIndex]);
      return months[monthIndex];
    };

    const setNextDate = (year, month, date) => {
      date = parseInt(date);
      if (date === getDaysInMonth(year, month)) {
        month = setNextMonth(year, month);
        // don't go to 31 if it's January 1st curYear
        if (year !== (parseInt(curYear)+9).toString() || months.indexOf(selectedMonth) !== 11) {
          setSelectedDate('1') 
        }
      } else {
        date++;
        setSelectedDate(date.toString());
      }
    };

    //leap year calculator
    const getDaysInMonth = (year, month) => {
        const monthIndex = months.indexOf(month);
        if (monthIndex === 1) {
          // February
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            // Leap year
            return 29;
          } else {
            return 28;
          }
        } else if ([3, 5, 8, 10].includes(monthIndex)) {
          // Months with 30 days
          return 30;
        } else {
          // Months with 31 days
          return 31;
        }
      };
  
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dates = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => (i + 1).toString());
    const years = Array.from({ length: 10 }, (_, i) => (parseInt(curYear) + i).toString());
  

  return (
    <Center borderRadius={"10"} w={"98%"} bg="#6284FF26" p={3} height={"8vh"} ml={5}>

        <IconButton
            data-testid="monthLeft"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
            onClick={() => setPreviousMonth(selectedYear, selectedMonth)}
        />
        <Menu >
        <MenuButton as={Button} width='30vh' variant='outline' colorScheme='blue' ml={1} mr={1} color={ic} size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text data-testid="month" color={text} p={2} m={3}>{selectedMonth}</Text>
        </MenuButton>
        <MenuList maxH="230px" overflowY="auto" w="auto" overflowX="hidden" fontSize={'xl'}
                css={`
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 80px;
                  }
                  &::-webkit-scrollbar-thumb {
                    background-color: #6284FF;
                    border-radius: 8px;
                  }
                  &::-webkit-scrollbar-track {
                    background-color: rgba(98, 132, 255, 0.15);
                  }
                  &::-webkit-scrollbar-thumb:hover {
                    background-color: #405DC9;
                  }
                  &::-webkit-scrollbar-thumb:active {
                    background-color: #1E40AF; // Change the color when clicked
                  }
        `}>
            {months.map((month) => (
            <MenuItem key={month} onClick={() => handleMonthClick(month)}>
              {month}
            </MenuItem>
          ))}
        </MenuList>
        </Menu>
        <IconButton
            data-testid="monthRight"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
            onClick={() => setNextMonth(selectedYear, selectedMonth)}
        />

        <IconButton
        data-testid="dayLeft"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
            ml={5}
            onClick={() => setPreviousDate(selectedYear, selectedMonth, selectedDate)}
        />
        <Menu>
        <MenuButton as={Button} width='15vh' variant='outline' colorScheme='blue' ml={1} mr={1} color={ic} size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text data-testid="day" color={text} p={2} m={3}>{selectedDate}</Text>
        </MenuButton>
        <MenuList maxH="230px" overflowY="auto" w="auto" overflowX="hidden" fontSize={'xl'}
                css={`
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 80px;
                  }
                  &::-webkit-scrollbar-thumb {
                    background-color: #6284FF;
                    border-radius: 8px;
                  }
                  &::-webkit-scrollbar-track {
                    background-color: rgba(98, 132, 255, 0.15);
                  }
                  &::-webkit-scrollbar-thumb:hover {
                    background-color: #405DC9;
                  }
                  &::-webkit-scrollbar-thumb:active {
                    background-color: #1E40AF; // Change the color when clicked
                  }
        `}>
            {dates.map((date) => (
            <MenuItem  key={date} onClick={() => handleDateClick(date)}>
              {date}
            </MenuItem>
          ))}
        </MenuList>
        </Menu>
        <IconButton
            data-testid="dayRight"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
            onClick={() => setNextDate(selectedYear, selectedMonth, selectedDate)}
        />

        <IconButton
            data-testid="yearLeft"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
            ml={5}
            onClick={() => setPreviousYear(selectedYear)}
        />
        <Menu>
        <MenuButton as={Button} width='20vh' variant='outline' colorScheme='blue' ml={1} mr={1} color={ic} size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text data-testid="year" color={text} p={2} m={3}>{selectedYear}</Text>
        </MenuButton>
        <MenuList maxH="230px" overflowY="auto" w="auto" overflowX="hidden" fontSize={'xl'}
                css={`
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 80px;
                  }
                  &::-webkit-scrollbar-thumb {
                    background-color: #6284FF;
                    border-radius: 8px;
                  }
                  &::-webkit-scrollbar-track {
                    background-color: rgba(98, 132, 255, 0.15);
                  }
                  &::-webkit-scrollbar-thumb:hover {
                    background-color: #405DC9;
                  }
                  &::-webkit-scrollbar-thumb:active {
                    background-color: #1E40AF; // Change the color when clicked
                  }
        `}>
            {years.map((year) => (
            <MenuItem key={year} onClick={() => handleYearClick(year)}>
              {year}
            </MenuItem>
          ))}
        </MenuList>
        </Menu>
        <IconButton
            data-testid="yearRight"
            variant='outline'
            colorScheme='blue'
            color={ic}
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
            onClick={() => setNextYear(selectedYear)}
        />
  
        </Center>
  );
};

export default DatePicker;