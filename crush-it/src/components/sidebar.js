// We import bootstrap to make our application look better.
import React, {useLayoutEffect, useState, useEffect} from "react";
import { useNavigate } from "react-router";
import { useDateContext } from './datecontext';
 // We import NavLink to utilize the react router.
 
import { NavLink,useLocation } from "react-router-dom";
import { Box, VStack, Text, Button, Image, Spacer, useColorModeValue} from "@chakra-ui/react";
import logOutIcon from '../media/logout.png'
 // Here, we display our Navbar
export default function Sidebar(prop) {
  const url = process.env.REACT_APP_API_URL;

  const { isCurrentDate } = useDateContext();
  console.log("sidebarDate", isCurrentDate)

  const bg = useColorModeValue('#252628', '#1E1E1E')

  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null)
  
  const todayDate = new Date();
  const curMonth = todayDate.toLocaleString('default', { month: 'long' });
  const curDate = todayDate.getDate();
  const curYear = todayDate.getFullYear();
  const currentDate = curDate.toString() + "-" + curMonth.toString()+"-"+curYear.toString();
  const [prevDate, setPrevDate] = useState('');

  const [topTasks, setTopTasks] = useState([])
  const [importantTasks, setImportantTasks] = useState([])
  const [otherTasks, setOtherTasks] = useState([])
  const [flag, setFlag] = useState(false);

  useLayoutEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/signup") {
      // console.log(localStorage.getItem("token"));
       fetch(url + "/api/auth/getUsername", {
       headers: {
           "x-access-token": localStorage.getItem("token")
       }
       })
       .then(res => res.json())
       .then(data => data.isLoggedIn ? setUsername(data.username): navigate('/login'))
       .catch((err) => alert(err))
    }
  }, [location.pathname, navigate, url])
   
  //status is broken into 4 different elements notStarted="NS", Finished="FN", InProgress="IP", Canceled="anything", movedOver="MO" 
  useEffect(() => {
      if (username !== null) {
          fetch(url + '/api/tasks/' + username)
          .then(res => res.json())
          .then(data => {setTopTasks(data.topTasks); setImportantTasks(data.importantTasks); setOtherTasks(data.otherTasks)})
          .catch((err) => console.log(err))
      }
  }, [username, url])

  function compareDateStrings(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    if (date1 > date2) {
      return 1; // date 1 > date 2
    } else if (date1 < date2) {
      return -1; // date 1 < date 2
    } else {
      return 0; // date 1 == date 2
    }
  }

  useEffect(() => {
    
    // set prevDate
    var allTasks = [...topTasks, ...importantTasks, ...otherTasks];
    var tempPrevDate = '';
    allTasks.forEach(task => {
      if (task !== null && compareDateStrings(task.dateAssigned, currentDate) < 0) { // if the task is before today
        if (compareDateStrings(task.dateAssigned, tempPrevDate) >= 0 || tempPrevDate === '') { // check if it's more recent
          tempPrevDate = task.dateAssigned;
        }
      }
    });
    if (tempPrevDate !== '') { // there are tasks before today
      setPrevDate(tempPrevDate);
    }

    // top loop
    var temp;
    var tempTopTasks = topTasks;
    var tempImportantTasks = importantTasks;
    var tempOtherTasks = otherTasks;
    var topCounter = 0;
    var importantFlag = false;
    if (topTasks[0] !== null) {
      topTasks.forEach(task => {
        if (task !== null && task.dateAssigned === tempPrevDate && (task.status === 'NS' || task.status === 'IP')) {
          topCounter++;
          temp = {...task};
          temp.dateAssigned = currentDate;
          temp.completedPomodoroTimers = 0;
          temp.status = 'NS';
          delete temp._id;
          task.status = 'MO';
          if (topCounter <= 3) {
            tempTopTasks.push(temp);
          } else {
            temp.priority = 'Important';
            tempImportantTasks.push(temp);
          }
        }
      });
      setTopTasks(tempTopTasks);
    }

    if (importantTasks[0] !== null) {
      // important loop
      importantTasks.forEach(task => {
        if (task !== null && task.dateAssigned === tempPrevDate && (task.status === 'NS' || task.status === 'IP') ) {
          topCounter++;
          temp = {...task};
          temp.dateAssigned = currentDate;
          temp.completedPomodoroTimers = 0;
          temp.status = 'NS';
          delete temp._id;
          task.status = 'MO';
          if (topCounter <= 3) {
            temp.priority = 'Top';
            tempTopTasks.push(temp);
          } else {
            importantFlag = true;
            tempImportantTasks.push(temp);
          }
        }
      });
      setImportantTasks(tempImportantTasks);
    }

    if (otherTasks[0] !== null) {
      // other loop
      otherTasks.forEach(task => {
        if (task !== null && task.dateAssigned === tempPrevDate && (task.status === 'NS' || task.status === 'IP') ) {
          topCounter++;
          temp = {...task};
          temp.dateAssigned = currentDate;
          temp.completedPomodoroTimers = 0;
          temp.status = 'NS';
          delete temp._id;
          task.status = 'MO';
          if (topCounter <= 3) {
            temp.priority = 'Top';
            tempTopTasks.push(temp);
          } else if (!importantFlag){
            temp.priority = 'Important';
            tempImportantTasks.push(temp);
          } else {
            tempOtherTasks.push(temp);
          }
        }
      });
      setOtherTasks(tempOtherTasks);
    }

    console.log('all tasks', tempTopTasks, tempImportantTasks, tempOtherTasks);

    // plan day is clicked
    if (flag){
      console.log(tempTopTasks)
      fetch(url + '/api/tasks/' + username, {
          method: "PUT",
          body: JSON.stringify({
              username: username,
              topTasks: tempTopTasks,
              importantTasks: tempImportantTasks,
              otherTasks: tempOtherTasks,
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(res => res.json())
      .then(() => {
        setTopTasks(tempTopTasks); 
        setImportantTasks(tempImportantTasks); 
        setOtherTasks(tempOtherTasks)
        window.location.reload();})
      .catch((err) => console.log(err))
    }
    setFlag(false);

  }, [topTasks, importantTasks, otherTasks, url]);

  const handlePlanDay = async () => {
    setFlag(true);

    // fetch tasks and assign previous day's to today's
    console.log('today is ' + currentDate + ', yesterday was ' + prevDate);

    if (username !== null) {
      await fetch(url + '/api/tasks/' + username)
      .then(res => res.json())
      .then(data => {setTopTasks(data.topTasks); setImportantTasks(data.importantTasks); setOtherTasks(data.otherTasks)})
      .catch((err) => console.log(err))
    }

  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
}

  if (location.pathname === "/login" || location.pathname === "/signup"){
      return null;
  }

  if ((location.pathname === "/" || location.pathname === "/homepage") ){ // load plan day button if it is homepage
    if( prop !== null && prop.homepage == true){
      return (
        <VStack align="start" height={"100vh"} width="200px" spacing={4} p={4} bg={bg} alignItems={"center"}>
          <NavLink data-testid="home" to="/">
            <Text fontFamily={"'Fredoka', sans-serif"} fontSize="30px" fontWeight={"400"} textColor={"white"} align={"center"} >Crush It</Text>
          </NavLink>
          
          <Box height={"1px"} width={"160px"} bg={"#3E3F42"}></Box>
  
          <Image textColor="white" src="/smallLogo.svg" alt="SVG Image" />
          
          <Text fontFamily={"'DM Sans', sans-serif"} textAlign={"center"} fontSize={"20px"} textColor={"white"} fontWeight={"700"}>It's time to plan your day!</Text>
          <Button data-testid="planDay" fontFamily={"'DM Sans', sans-serif"} height={"54px"} borderRadius={"14px"} variant="outline" color={"white"} fontSize={"18px"} fontWeight={"700"} width={"160px"} isDisabled={location.pathname !== "/" || !isCurrentDate } onClick={handlePlanDay}>Plan Day</Button>
  
          <Spacer></Spacer>
  
          <Button data-testid="logout" fontFamily={"'DM Sans', sans-serif"} leftIcon={<Image borderRadius='full' boxSize="24px" src={logOutIcon} display='fixed'/>} onClick={handleLogout} fontSize={"12px"} borderRadius={"10px"} bg="#252628" variant={"outline"} textColor={"white"} margin={"14"} w={"120px"} h="38">
            Log Out
          </Button>
        </VStack>
      );
    }
    else{
      return null;
    }
    
    
}

      return (
        <VStack align="start" height={"100vh"} width="200px" spacing={4} p={4} bg={bg} alignItems={"center"}>
          <NavLink data-testid="home" to="/">
            <Text fontFamily={"'Fredoka', sans-serif"} fontSize="30px" fontWeight={"400"} textColor={"white"} align={"center"} >Crush It</Text>
          </NavLink>
          
          <Box height={"1px"} width={"160px"} bg={"#3E3F42"}></Box>

          <Image textColor="white" src="/smallLogo.svg" alt="SVG Image" />
          
          <Text fontFamily={"'DM Sans', sans-serif"} textAlign={"center"} fontSize={"20px"} textColor={"white"} fontWeight={"700"}>It's time to plan your day!</Text>
          <Spacer></Spacer>

          <Button data-testid="logout" fontFamily={"'DM Sans', sans-serif"} leftIcon={<Image borderRadius='full' boxSize="24px" src={logOutIcon} display='fixed'/>} onClick={handleLogout} fontSize={"12px"} borderRadius={"10px"} bg="#252628" variant={"outline"} textColor={"white"} margin={"14"} w={"120px"} h="38">
            Log Out
          </Button>
        </VStack>
        
      );
}



