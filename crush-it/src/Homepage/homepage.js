import React, {useLayoutEffect, useState, useEffect} from "react";
import { useNavigate } from "react-router";
import {Box, Heading, Container, VStack, HStack,Flex, useColorModeValue, Spacer} from '@chakra-ui/react';
import TaskContainer from "./TaskContainer"
import DatePicker from './datepicker';
import AddTask from './addtask';
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
// import FocusTime from "./focustime";
import Appointment from "./appointments";
import { useDateContext } from '../components/datecontext';

function Homepage(){
    const url = process.env.REACT_APP_API_URL;
    //selectedDate uses a CallBack function to get the currentDay from DatePicker
    //setting up selectedDate

    const bg = useColorModeValue('#F5F7F9', '#1A202C')
    const cont = useColorModeValue("white", "#2d3748")

    const [selectedDate, setSelectedDate] = useState(null);
    const [username, setUsername] = useState(null)
    const [timerLength, setTimerLength] = useState(30)
    const [topTasks, setTopTasks] = useState([])
    const [importantTasks, setImportantTasks] = useState([])
    const [otherTasks, setOtherTasks] = useState([])
    const { isPlanned} = useDateContext();

    useEffect(() =>{

    }, [topTasks, importantTasks, otherTasks])
    //handle the date change
    const handleSelected = (date) => {
        setSelectedDate (date)  
    };
    //use {selectedDate} anywhere

    const handleTop = (arr) => {
        setTopTasks(arr);
    }

    const handleImportant = (arr) => {
        setImportantTasks(arr);
    }

    const handleOther = (arr) => {
        setOtherTasks(arr);
    }

    const handleUpdatedPomo = async (pomo, category, i) => {      
        var edit = null 
        var top = topTasks
        var important = importantTasks
        var other = otherTasks
        if (category === 'Top Priority') {
            edit = {dateAssigned: topTasks[i].dateAssigned, title: topTasks[i].title, description: topTasks[i].description, pomodoroTimers: pomo, completedPomodoroTimers:topTasks[i].completedPomodoroTimers, priority: topTasks[i].priority, status: topTasks[i].status}
            top[i] = edit
        }
        if (category === 'Important') {
            edit = {dateAssigned: importantTasks[i].dateAssigned, title: importantTasks[i].title, description: importantTasks[i].description, pomodoroTimers: pomo, completedPomodoroTimers:importantTasks[i].completedPomodoroTimers, priority: importantTasks[i].priority, status: importantTasks[i].status}
            important[i] = edit
        }
        if (category === 'Other') {
            edit = {dateAssigned: otherTasks[i].dateAssigned, title: otherTasks[i].title, description: otherTasks[i].description, pomodoroTimers: pomo, completedPomodoroTimers:otherTasks[i].completedPomodoroTimers, priority: otherTasks[i].priority, status: otherTasks[i].status}
            other[i] = edit
        }
        const response = await fetch(url + '/api/tasks/' + username, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                topTasks: top,
                importantTasks: important,
                otherTasks: other,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response)
        } else {
            handleTop(top)
            handleImportant(important)
            handleOther(other)
        }
    }

    const handleUpdatedDescription = async (description, category, i) => {      
        var edit = null 
        var top = topTasks
        var important = importantTasks
        var other = otherTasks
        if (category === 'Top Priority') {
            edit = {dateAssigned: topTasks[i].dateAssigned, title: topTasks[i].title, description: description, pomodoroTimers: topTasks[i].pomodoroTimers, completedPomodoroTimers:topTasks[i].completedPomodoroTimers, priority: topTasks[i].priority, status: topTasks[i].status}
            top[i] = edit
        }
        if (category === 'Important') {
            edit = {dateAssigned: importantTasks[i].dateAssigned, title: importantTasks[i].title, description: description, pomodoroTimers: importantTasks[i].pomodoroTimers, completedPomodoroTimers:importantTasks[i].completedPomodoroTimers, priority: importantTasks[i].priority, status: importantTasks[i].status}
            important[i] = edit
        }
        if (category === 'Other') {
            edit = {dateAssigned: otherTasks[i].dateAssigned, title: otherTasks[i].title, description: description, pomodoroTimers: otherTasks[i].pomodoroTimers, completedPomodoroTimers:otherTasks[i].completedPomodoroTimers, priority: otherTasks[i].priority, status: otherTasks[i].status}
            other[i] = edit
        }
        const response = await fetch(url + '/api/tasks/' + username, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                topTasks: top,
                importantTasks: important,
                otherTasks: other,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response)
        } else {
            handleTop(top)
            handleImportant(important)
            handleOther(other)
        }
    }

    const handleUpdatedIcon = async (icon, category, i) => {      
        var edit = null 
        var top = topTasks
        var important = importantTasks
        var other = otherTasks
        if (category === 'Top Priority') {
            edit = {dateAssigned: topTasks[i].dateAssigned, title: topTasks[i].title, description: topTasks[i].description, pomodoroTimers: topTasks[i].pomodoroTimers, completedPomodoroTimers:topTasks[i].completedPomodoroTimers, priority: topTasks[i].priority, status: String(icon)}
            top[i] = edit
        }
        if (category === 'Important') {
            edit = {dateAssigned: importantTasks[i].dateAssigned, title: importantTasks[i].title, description: importantTasks[i].description, pomodoroTimers: importantTasks[i].pomodoroTimers, completedPomodoroTimers:importantTasks[i].completedPomodoroTimers, priority: importantTasks[i].priority, status: String(icon)}
            important[i] = edit
        }
        if (category === 'Other') {
            edit = {dateAssigned: otherTasks[i].dateAssigned, title: otherTasks[i].title, description: otherTasks[i].description, pomodoroTimers: otherTasks[i].pomodoroTimers, completedPomodoroTimers:otherTasks[i].completedPomodoroTimers, priority: otherTasks[i].priority, status: String(icon)}
            other[i] = edit
        }
        const response = await fetch(url + '/api/tasks/' + username, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                topTasks: top,
                importantTasks: important,
                otherTasks: other,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response)
        } else {
            handleTop(top)
            handleImportant(important)
            handleOther(other)
        }
    }

    const handleCompletedChange = async (completed, category, i) => {
        console.log("handle Completed: ",completed,category,i)
        var edit = null 
        var top = topTasks
        var important = importantTasks
        var other = otherTasks
        if (category === 'Top Priority') {
            edit = {dateAssigned: topTasks[i].dateAssigned, title: topTasks[i].title, description: topTasks[i].description, pomodoroTimers: topTasks[i].pomodoroTimers, completedPomodoroTimers: completed, priority: topTasks[i].priority, status: topTasks[i].status}
            top[i] = edit
        }
        if (category === 'Important') {
            edit = {dateAssigned: importantTasks[i].dateAssigned, title: importantTasks[i].title, description: importantTasks[i].description, pomodoroTimers: importantTasks[i].pomodoroTimers, completedPomodoroTimers: completed, priority: importantTasks[i].priority, status: importantTasks[i].status}
            important[i] = edit
        }
        if (category === 'Other') {
            edit = {dateAssigned: otherTasks[i].dateAssigned, title: otherTasks[i].title, description: otherTasks[i].description, pomodoroTimers: otherTasks[i].pomodoroTimers, completedPomodoroTimers: completed, priority: otherTasks[i].priority, status: otherTasks[i].status}
            other[i] = edit
        }
        const response = await fetch(url + '/api/tasks/' + username, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                topTasks: top,
                importantTasks: important,
                otherTasks: other,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response)
        } else {
            handleTop(top)
            handleImportant(important)
            handleOther(other)
        }
    }


    const handleDrop = async (id, originalCategory, targetCategory) => {
        var top = []
        var important = []
        var other = []      
        if (topTasks[0] !== null) {
            top = topTasks
        }
        
        if (importantTasks[0] !== null) {
            important = importantTasks
        }
        if (otherTasks[0] !== null) {
            other = otherTasks
        }

        console.log("original", originalCategory)
        console.log("id", id)
        console.log("target", targetCategory)
        if (targetCategory === 'Top Priority') {
            if (originalCategory === 'Important') {
                top.push({dateAssigned: importantTasks[id].dateAssigned, title: importantTasks[id].title, description: importantTasks[id].description, pomodoroTimers: importantTasks[id].pomodoroTimers, completedPomodoroTimers:importantTasks[id].completedPomodoroTimers, priority: 'Top', status: importantTasks[id].status})
                important.splice(id, 1)
            }
            if (originalCategory === 'Other') {
                top.push({dateAssigned: otherTasks[id].dateAssigned, title: otherTasks[id].title, description: otherTasks[id].description, pomodoroTimers: otherTasks[id].pomodoroTimers, completedPomodoroTimers:otherTasks[id].completedPomodoroTimers, priority: 'Top', status: otherTasks[id].status})
                other.splice(id, 1)
            }
        }
        if (targetCategory === 'Important') {
            if (originalCategory === 'Top Priority') {
                important.push({dateAssigned: topTasks[id].dateAssigned, title: topTasks[id].title, description: topTasks[id].description, pomodoroTimers: topTasks[id].pomodoroTimers, completedPomodoroTimers:topTasks[id].completedPomodoroTimers, priority: 'Important', status: topTasks[id].status})
                top.splice(id, 1)
            }
            if (originalCategory === 'Other') {
                important.push({dateAssigned: otherTasks[id].dateAssigned, title: otherTasks[id].title, description: otherTasks[id].description, pomodoroTimers: otherTasks[id].pomodoroTimers, completedPomodoroTimers:otherTasks[id].completedPomodoroTimers, priority: 'Important', status: otherTasks[id].status})
                other.splice(id, 1)
            }
        }
        if (targetCategory === 'Other') {
            if (originalCategory === 'Top Priority') {
                other.push({dateAssigned: topTasks[id].dateAssigned, title: topTasks[id].title, description: topTasks[id].description, pomodoroTimers: topTasks[id].pomodoroTimers, completedPomodoroTimers:topTasks[id].completedPomodoroTimers, priority: 'Other', status: topTasks[id].status})
                top.splice(id, 1)
            }
            if (originalCategory === 'Important') {
                other.push({dateAssigned: importantTasks[id].dateAssigned, title: importantTasks[id].title, description: importantTasks[id].description, pomodoroTimers: importantTasks[id].pomodoroTimers, completedPomodoroTimers:importantTasks[id].completedPomodoroTimers, priority: 'Other', status: importantTasks[id].status})
                important.splice(id, 1)
            }
        }
        const response = await fetch(url + '/api/tasks/' + username, {
            method: "PUT",
            body: JSON.stringify({
                username: username,
                topTasks: top,
                importantTasks: important,
                otherTasks: other,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response)
        } else {
            fetch(url + '/api/tasks/' + username)
            .then(res => res.json())
            .then(data => {setTopTasks(data.topTasks); setImportantTasks(data.importantTasks); setOtherTasks(data.otherTasks)})
            .catch((err) => console.log(err))
        }
    }


    

    const navigate = useNavigate();

    useLayoutEffect(() => {
        fetch(url + "/api/auth/getUsername", {
        headers: {
            "x-access-token": localStorage.getItem("token")
        }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setUsername(data.username): navigate('/login'))
        .catch((err) => console.log(err))
    }, [navigate, url])



    //status is broken into 4 different elements notStarted="NS", Finished="FN", InProgress="IP", Canceled="anything", movedOver="MO" 
    useEffect(() => {
        if (username !== null) {
            fetch(url + '/api/tasks/' + username)
            .then(res => res.json())
            .then(data => {setTopTasks(data.topTasks); setImportantTasks(data.importantTasks); setOtherTasks(data.otherTasks)})
            .catch((err) => console.log(err))
        }
    }, [username, url, isPlanned])

    useEffect(() => {
        if (username !== null) {
            fetch(url + '/api/user/' + username)
            .then(res => res.json())
            .then(data => {setTimerLength(data.pomodoro.timer)})
            .catch((err) => console.log(err))
        }
    }, [username, url])

    useEffect(() => {
        const todayDate = new Date();
        const curMonth = todayDate.toLocaleString('default', { month: 'long' });
        const curDate = todayDate.getDate();
        const curYear = todayDate.getFullYear();
        const currentDate = curDate.toString() + "-" + curMonth.toString()+"-"+curYear.toString();
        if (username !== null) {
            fetch(url + '/api/appointments/' + username)
            .then(res => res.json())
            .then(data => {
                if (currentDate !== data.date) {
                    fetch(url + "/api/appointments/" + username, {
                        method: "PUT",
                        body: JSON.stringify({
                            date: String(currentDate),
                            isPlanned: false
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .catch((err) => console.log(err))
                }
            })
            .catch((err) => {
                console.log(err);
            })

        }
    })
    


    
    // const topPriorityList = [["Complete Math Homework", "This is a hw", 1, "FN" ], ["Homework 2","This is a hw", 3, "NS"]];
    // const importantList = [["Homework 1", "This is a hw", 4, "FN" ], ["Homework 7","This is a hw", 2, "CA"]];
    // const otherList = [["Homework 4", "", 10, "IP" ], ["Homework 3","", 3, "MO"]];

    return (
        <Flex>
        <Sidebar  homepage={true} />
         <Box flex="1">
           <Navbar homepage={true} />

        <Box p={5} bg={bg} height={"94vh"}>
        <DatePicker onDateSelected={handleSelected} />
  
        <HStack justify={"left"} p={5}  h={"93%"} width={ "100%"} align={"flex-start"} >
            <VStack  h={"100%"} width={"60%" } align="top" justify={"left"} marginBottom={1}>
            <Heading fontSize={"30px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>Tasks
            <AddTask  dateSelected={selectedDate} user={username} handleTop={handleTop} handleImportant={handleImportant} handleOther={handleOther}/>
            </Heading>

              <Container borderRadius={"10"} bg={cont} minW={"100%"} h={"680px"} paddingTop={"5"} boxShadow={"2px 5px 50px 0px rgba(36, 37, 40, 0.10)"}>
                <TaskContainer dateSelected={selectedDate} timerLength={timerLength} category='Top Priority' categoryList={topTasks} onChange={handleTop} handleUpdatedPomo={handleUpdatedPomo} handleUpdatedDescription={handleUpdatedDescription} handleUpdatedIcon={handleUpdatedIcon} handleDrop={handleDrop} handleCompletedChange={handleCompletedChange}/>
                <TaskContainer dateSelected={selectedDate} timerLength={timerLength} category='Important' categoryList={importantTasks} onChange={handleImportant} handleUpdatedPomo={handleUpdatedPomo} handleUpdatedDescription={handleUpdatedDescription} handleUpdatedIcon={handleUpdatedIcon} handleDrop={handleDrop} handleCompletedChange={handleCompletedChange}/>
                <TaskContainer dateSelected={selectedDate} timerLength={timerLength} category='Other' categoryList={otherTasks} onChange={handleOther} handleUpdatedPomo={handleUpdatedPomo} handleUpdatedDescription={handleUpdatedDescription} handleUpdatedIcon={handleUpdatedIcon} handleDrop={handleDrop} handleCompletedChange={handleCompletedChange}/>
                
              </Container>

          </VStack>

          <Spacer></Spacer>
  
          <VStack h={"100%"} width={"45%" } align="left" justify={"left"} >
              <Heading fontSize={"30px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"} marginBottom={3}>Appointments
              
              </Heading>

            <Appointment username={username} topList={topTasks} otherList={otherTasks} importantList={importantTasks} selectedDate={selectedDate} handleCompletedChange={handleCompletedChange}> </Appointment>
  
          </VStack>
  
      </HStack>
  
  </Box>
  </Box>
     </Flex>
  )
    
}
export default Homepage;