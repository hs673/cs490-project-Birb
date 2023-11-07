import React, { useState } from 'react';
import {Center, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Text} from '@chakra-ui/react';
import {IoChevronBackCircleSharp, IoChevronForwardCircleSharp, IoChevronDownCircleOutline} from 'react-icons/io5'

function DatePicker() {
    const currentDate = new Date();
    const curMonth = currentDate.toLocaleString('default', { month: 'long' });
    const curDate = currentDate.getDate().toString();
    const curYear = currentDate.getFullYear().toString();


    const [selectedMonth, setSelectedMonth] = useState(curMonth);
    const [selectedDate, setSelectedDate] = useState(curDate);
    const [selectedYear, setSelectedYear] = useState(curYear);
  
    const handleMonthClick = (month) => {
      setSelectedMonth(month);

    // Recalculate selectedDate based on the new month
    const daysInMonth = new Date(currentDate.getFullYear(), months.indexOf(month) + 1, 0).getDate();
    setSelectedDate((prevDate) => (prevDate <= daysInMonth ? prevDate : '1'));
    };   
  
    const handleDateClick = (date) => {
      setSelectedDate(date);
    };
  
    const handleYearClick = (year) => {
      setSelectedYear(year);
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
    const years = Array.from({ length: 10 }, (_, i) => (2023 + i).toString());
  

  return (
    <Center borderRadius={"10"} w={"98%"} bg="#6284FF26" p={3} height={"8vh"} ml={5}>
        <IconButton
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
        />
        <Menu>
        <MenuButton as={Button} variant='outline' colorScheme='blue' ml={1} mr={1} color="#6284FF" size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text color="black" p={2} mt={3}>{selectedMonth}</Text>
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
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
        />

        <IconButton
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
            ml={5}
        />
        <Menu>
        <MenuButton as={Button} variant='outline' colorScheme='blue' ml={1} mr={1} color="#6284FF" size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text color="black" p={2} mt={3}>{selectedDate}</Text>
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
            <MenuItem key={date} onClick={() => handleDateClick(date)}>
              {date}
            </MenuItem>
          ))}
        </MenuList>
        </Menu>
        <IconButton
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
        />

        <IconButton
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronBackCircleSharp />}
            ml={5}
        />
        <Menu>
        <MenuButton as={Button} variant='outline' colorScheme='blue' ml={1} mr={1} color="#6284FF" size='lg' fontSize={'3xl'} rightIcon={<IoChevronDownCircleOutline />}>
            <Text color="black" p={2} mt={3}>{selectedYear}</Text>
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
            variant='outline'
            colorScheme='blue'
            color="#6284FF"
            aria-label='previousMonth'
            size='lg'
            fontSize={'3xl'}
            icon={<IoChevronForwardCircleSharp />}
        />
  
        </Center>
  );
};

export default DatePicker;