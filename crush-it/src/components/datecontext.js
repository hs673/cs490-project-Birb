import { createContext, useContext, useState } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [isCurrentDate, setIsCurrentDate] = useState(false);
  const [isGreaterCurrentDate, setIsGreaterCurrentDate] = useState(false)
  const [isPlanned, setIsPlanned] = useState(false)

  const setAsCurrentDate = (value) => {
    setIsCurrentDate(value);
  };

  const setAsGreaterCurrentDate = (value) => {
    setIsGreaterCurrentDate(value)
  }

  const setAsPlanned = (value) => {
    setIsPlanned(value)
  }
  
  console.log("datecontext", isCurrentDate)

  return (
    <DateContext.Provider value={{ isCurrentDate, isGreaterCurrentDate, isPlanned, setAsCurrentDate, setAsGreaterCurrentDate, setAsPlanned}}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  return useContext(DateContext);
};
