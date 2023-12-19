import React, { useEffect, useState } from "react";
import {Box, Table, Tbody, TableContainer, Tr, Td, useColorModeValue, useDisclosure} from '@chakra-ui/react';
import AppointmentContainer from "./appointmentContainer";
import {parse, format, addDays, parseISO, getHours, getMinutes, setHours, setMinutes, setSeconds, setMilliseconds} from 'date-fns';
import FocusTime from "./focustime";

function Appointment(props){
    const url = process.env.REACT_APP_API_URL;

    // const bg = useColorModeValue('#F5F7F9', '#1A202C')
    const cont = useColorModeValue("white", "#2d3748")
    const username = props.username;
    const [timer, setTimer] = useState(null)
    console.log( "appointments gets props list", props.topList, props.importantList, props.otherList)
    // data = raw data from the google calendar api for the selected day
    const [data, setData] = useState(null);
    const [appointmentData, setAppointmentData] = useState(null);
    //console.log(appointmentData);
    // ** FOR GUI **
    // events with relevant information from google calendar are stored here => check the second useEffect 
    // [
//     title, 
//     description (usually undefined), 
//     eventType(default, focusTime, etc.),
//     start hour,
//     start minutes,
//     end hour,
//     end minutes
//  ]
    const [events, setEvents] = useState([]);
    //console.log('events from google calendar', events)
    
    //fill list with tasks to do today (do not use 0, use military time (1-24) and the function will convert to regular time)
    //title = string, isFocus = bool,

    useEffect(() => {
        if (username !== null) {
            fetch(url + '/api/appointments/' + username)
            .then(res => res.json())
            .then(data => {console.log("wtf"); setAppointmentData(data)})
            .catch((err) => {
                console.log(err);
            })
        }
    }, []) 

    useEffect(() => {
        if (username !== null) {
          fetch(url + '/api/user/' + username)
            .then(res => res.json())
            .then(userData => {
              if (userData && userData.pomodoro && userData.pomodoro.timer) {
                setTimer(userData.pomodoro.timer);
              }
            })
            .catch(err => console.log(err));
        }
      }, [username, url]);

    //LOOK HERE FOR API CALL FOR APPOINTMENTS (GUI)
    // api will find the date you specify and either 
    // update the existing appointments for the existing date or 
    // insert new appointments for the new date 
    useEffect(() => {
        if (username !== null) {

            // put request for the current date

            // fetch(url + '/api/appointments/' + username, {
            //     method: "PUT",
            //     body: JSON.stringify({
            //         date: String(props.selectedDate),
            //         isPlanned: false,
            //         updatedAppointments: {
            //             index: 5,
            //             title: 'Title', 
            //             description: 'This is the description',
            //             startHour: 9,
            //             startMinutes: 30,
            //             endHour: 10,
            //             endMinutes: 0,
            //             ifTask: true
            //         }
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });


            // put request for any other date

            // fetch(url + '/api/appointments/' + username, {
            //     method: "PUT",
            //     body: JSON.stringify({
            //         date: '26-December-2023',
            //         isPlanned: false,
            //         updatedAppointments: {
            //             index: 5,
            //             title: 'Title', 
            //             description: 'This is the description',
            //             startHour: 7,
            //             startMinutes: 30,
            //             endHour: 8,
            //             endMinutes: 0,
            //             ifTask: true
            //         }
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
        }
    }, [username])





    var list= [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

    useEffect(() => {
        if (props.username !== null && props.selectedDate !== null) {
            const dateString = props.selectedDate
            const parsedDate = parse(dateString, "d-MMMM-yyyy", new Date());
            const endOfDayParsed = addDays(parsedDate, 1)
            const endOfDayFormatted = format(setHours(setMinutes(setSeconds(setMilliseconds(endOfDayParsed, 0), 0), 0), 5), "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z';
            const formattedDate = format(setHours(setMinutes(setSeconds(setMilliseconds(parsedDate, 0), 0), 0), 5), "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z';
        
            fetch(url + "/api/events/calendar/" + props.username, {
                method: "POST",
                body: JSON.stringify({
                    start: formattedDate.toString(),
                    end: endOfDayFormatted.toString()
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(dataReturn => {setData(dataReturn)})
            .catch((err) => console.log(err));  
            
            console.log(data)
        }
    }, [props.username, props.selectedDate, url])
    


    useEffect(() => {
        if (data !== null) {
            if (data.items !== null && data.items !== undefined) {
                const newEvents = data.items.map(item => ([
                    item.summary,
                    item.description,
                    item.eventType,
                    getHours(parseISO(item.start.dateTime)),
                    getMinutes(parseISO(item.start.dateTime)),
                    getHours(parseISO(item.end.dateTime)),
                    getMinutes(parseISO(item.end.dateTime)),
                    false
                  ]));
                setEvents(newEvents)
            }
        }
    }, [data])


    const formatTime = (date) => {
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
      };

    return (
    <Box borderRadius={"10"} bg={cont} h={"680px"} marginmiddle={"5px"} overflowY={"auto"} boxShadow={"2px 5px 50px 0px rgba(36, 37, 40, 0.10)"} 
                  css={`
                  &::-webkit-scrollbar {
                      width: 6px;
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
                      background-color: #1E40AF; // Change the color when clicked`
                    }>
        <TableContainer>
           
                {CreateTable(list, events, props.topList, props.otherList, props.importantList, props.selectedDate, timer, props.handleCompletedChange)}
                
            
        </TableContainer>
    </Box>
  
  )
    
}


function CreateTable(list, events, topList, otherList, importantList, date, time, handleCompletedChange){

    var child = []
    const { isOpen, onOpen, onClose } = useDisclosure();
    //timers={focusPomo} completedTimers={focusCompletedPomo}
    const [focusTitle, setFocusTitle] = useState('');
    const [focusDesc, setFocusDesc] = useState('');
    const [focusTime, setFocusTime] = useState('');
    const [completeFocus, setCompleteFocus] = useState('');
    const [focusCat, setFocusCat] = useState('');
    const [focusIndex, setFocusIndex] = useState('');

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update current time every minute
        const intervalId = setInterval(() => {
        setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []); // Run this effect only once on component mount

    const formatTime = (date) => {
        const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        console.log('Current Time:', formattedTime); // Log current time format
        return formattedTime;
    };


    if(events !== null){  // making array with all appointments
        //start with Google calendar events
        for(var i = 0; i < events.length; i++){
            //is event at 30 min mark or more?
            if(events[i][4]>=30){
                list[parseInt( events[i][3],10)*2] = events[i]
            }
            else{//if not mark as starting at the hour
                list[parseInt( events[i][3],10)*2-1] = events[i]
                list[parseInt( events[i][3],10)*2] = events[i]
            }
            var x = parseInt( events[i][3],10)+1
            // mark both hour and minute until it reaches the event
            while(x <= events[i][5]){
                if(x === parseInt(events[i][5],10) && parseInt(events[i][6],10) <= 30){
                }
                else{
                    list[x*2] = events[i];
                }
                if(x === parseInt(events[i][5],10) && parseInt(events[i][6],10) === 0){
                }else{
                    list[x*2-1] = events[i];
                }
                
                x+=1;
            }
        }
        
        //adding focustime
        var topCounter = 0;
        if(topList[0] !== null){
        topList.forEach(task => {
            
            if(task.dateAssigned === date){
                console.log("task builder",task)
                //calculate time
                //console.log("task time", (task.pomodoroTimers * time))
               var compTime = task.pomodoroTimers * time/60.0
                for(var i = 11; i < 40; i++ ){
                    if(list[i].length === 0 && compTime >0){ // 7 == timers, 8== complete 9 == prio 10 = index
                        list[i] = [task.title, true, task.description, i,i,i,i, task.pomodoroTimers, task.completedPomodoroTimers, "Top Priority", topCounter ];
                        compTime -= .5
                    }
                }
                topCounter += 1;
            }
        });
        }
        var impCounter = 0;
        if(importantList[0] !== null){
        importantList.forEach(task => {
            if(task.dateAssigned === date){
                //console.log("task builder",task.dateAssigned)
                console.log("task time", (task.pomodoroTimers * time/60.0))
                var compTime = task.pomodoroTimers * time/60.0
                for(var i = 11; i < 40; i++ ){
                    if(list[i].length === 0 && compTime >0){
                        list[i] = [task.title, true, task.description, i,i,i,i , task.pomodoroTimers, task.completedPomodoroTimers, "Important", impCounter];
                        compTime -= .5
                        
                    }
                }
                impCounter = 0;
            }
        });
        }
        var otherCounter = 0;
        if(otherList[0] !== null){
        otherList.forEach(task => {
            if(task.dateAssigned === date){
                //console.log("task builder",task.dateAssigned)
                console.log("task time", (task.pomodoroTimers * time/60.0))
                var compTime = task.pomodoroTimers * time/60.0
                for(var i = 11; i < 40; i++ ){
                    if(list[i].length === 0 && compTime >0){
                        list[i] = [task.title, true, task.description, i,i,i,i , task.pomodoroTimers, task.completedPomodoroTimers, "Other", otherCounter];
                        compTime -= .5
                    }
                }
                otherCounter+=1;
            }
        });
        }
        

    }

    console.log(list)
    var boolIsEnd = false;
    var boolIsCont = false;
    var lastT = "";

    const bd = useColorModeValue('#6284FF', '#90cdf4');
    function handleFocus(title, desc, timer, compTimer, category, index){
        setFocusTitle(title);
        setFocusDesc(desc)
        setFocusTime(timer)
        setCompleteFocus(compTimer)       
        setFocusCat(category)
        setFocusIndex(index)
        onOpen();
    }

    for (var i = 5; i < 25; i++) {
        const formattedTime = formatTime(currentTime);
        const conditionHour = i;
        const conditionValue = `${conditionHour}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        const isCurrentHour = formattedTime === conditionValue;
        var isPast = date < (currentTime.getDate()+"-"+currentTime.toLocaleString('default', { month: 'long' })+"-"+currentTime.getFullYear() );
        if(!isPast){
            isPast = currentTime.getHours() > i
        }
        const currentHour = parseInt(formattedTime.split(':')[0], 10);
        const hourPassed = conditionHour < currentHour

        //console.log('Current Time:', formattedTime);
        //console.log('Condition Value:', conditionValue);
        //console.log('Condition isPast:', isPast);
        //console.log(`Hour ${conditionHour}:`, isCurrentHour);
        //console.log(`HourPassed ${conditionHour} ${currentHour}:`, hourPassed);
        
      
        if (i <= 12) {//hours before 12 AM
            if(list[i*2-1].length >= 1){//insert hours
                if(lastT !== list[i*2-1][0]){//check if it is a continuation
                    child.push(
                        <Tr key={i}>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}>{i === 12 ? `${i} PM` : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                            <AppointmentContainer title={list[i*2-1][0]} isFocus={list[i*2-1][1]} notes={list[i*2-1][2]} isCont={false} isBefore={isPast}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                        </Tr>
                        
                    )
                    boolIsCont = true
                    
                }
                else{// if it is a cont
                    if(list[i*2].length < 1 || lastT !== list[i*2][0] ){//It is the end
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}>{i === 12 ? `${i} PM` : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                            <AppointmentContainer title={""} isFocus={list[i*2-1][1]} notes={list[i*2-1][2]} isCont={true} isEnd={true} isBefore={isPast}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                        </Tr>
                        
                    )
                    }
                    else{//It is not the end
                        child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}>{i === 12 ? `${i} PM` : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                            <AppointmentContainer title={""} isFocus={list[i*2-1][1]} notes={list[i*2-1][2]} isCont={true} isEnd={false} isBefore={isPast}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                        </Tr>)
                    }
                }
                
                lastT = "" + list[i*2-1][0];
                
            }
            else{//no tasks
                child.push(
                    <Tr>
                        <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}>{i === 12 ? `${i} PM` : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                    </Tr>
                )
            }
            if(list[i*2].length >= 1){//check 30 minute for task
                
                if(lastT !== list[i*2][0]){
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}></Td>
                            <AppointmentContainer title={list[i*2][0]} isFocus={list[i*2][1]} notes={list[i*2][2]} isCont={false} isBefore={isPast}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                        </Tr>
                        
                    )
                    boolIsCont = true;
                }
                else{
                    if(list[i*2+1].length < 1 || lastT !== list[i*2][0] ){
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}></Td>
                            <AppointmentContainer title={""} isFocus={list[i*2][1]} notes={list[i*2][2]} isCont={true} isEnd={true} isBefore={isPast}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                        </Tr>
                    )}
                    else{
                        child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"} style={{
                            border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'
                        }}></Td>
                            <AppointmentContainer title={""} isFocus={list[i*2][1]} notes={list[i*2][2]} isCont={true} isEnd={false} isBefore={isPast}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                        </Tr>)
                    }
                }
                
                lastT = "" + list[i*2][0];
            }
            else{
                child.push(
                    <Tr>
                        <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}></Td>
                    </Tr>
                )
            }
            if(i===4){
                break;
            }
        }
        else{
            if(list[i*2-1].length >= 1){// if it is an Hour
                if(lastT !== list[i*2-1][0]){//check if it is a cont
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}
                            style={{ border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'}}>{i === 24 ? '12 AM' : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                            <AppointmentContainer title={list[i*2-1][0]} notes={list[i*2-1][2]} remaining={list[i*2-1][3]} total={list[i*2-1][4]} isCont={false} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                        </Tr>
                    )
                    boolIsCont = true
                }
                else{//if is cont
                    if(list[i*2].length < 1 || lastT !== list[i*2][0] ){//check if it is the end
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}
                            style={{ border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'}}>{i === 24 ? '12 AM' : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                            <AppointmentContainer title={""} notes={list[i*2-1][2]} remaining={list[i*2-1][3]} total={list[i*2-1][4]} isCont={true} isEnd={true} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                        </Tr>
                    )
                    }
                    else{
                        child.push(
                            <Tr>
                                <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}
                                style={{ border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'}}>{i === 24 ? '12 AM' : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
                                <AppointmentContainer title={""} notes={list[i*2-1][2]} remaining={list[i*2-1][3]} total={list[i*2-1][4]} isCont={true} isEnd={false} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2-1][7]} compTimers= {list[i*2-1][8]} prio={list[i*2-1][9]} index={list[i*2-1][10]} handleFocus={handleFocus}/>
                            </Tr>
                        )
                    }
                }
                lastT=list[i*2-1][0]
                
            }
            else{
                child.push(
                    <Tr>
                        <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}
                        style={{ border: isCurrentHour ? `2px solid ${bd}` : 'none', color: isCurrentHour ? bd : 'inherit'}}>{i === 24 ? '12 AM' : i > 12 ? `${i - 12} PM` : `${i} AM`}</Td>
        
                    </Tr>
                )
            }
            if(list[i*2].length >= 1){//it is min
                if(lastT !==list[i*2][0] ){//check if last insert was ==
                    boolIsCont = true
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}></Td>
                            <AppointmentContainer title={list[i*2][0]} notes={list[i*2][2]} remaining={list[i*2][3]} total={list[i*2][4]} isCont={false} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                        </Tr>
                    )
                }
                else{// if it is
                    if(list[i*2+1].length < 1 || lastT !== list[i*2][0] ){//check if next is also equal
                    child.push(
                        <Tr>
                            <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}></Td>
                            <AppointmentContainer title={""} notes={list[i*2][2]} remaining={list[i*2][3]} total={list[i*2][4]} isCont={true} isEnd={true} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                        </Tr>
                    )}
                    else{
                        child.push(
                            <Tr>
                                <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}></Td>
                                <AppointmentContainer title={""} notes={list[i*2][2]} remaining={list[i*2][3]} total={list[i*2][4]} isCont={true} isEnd={false} isBefore={isPast} isFocus={list[i*2][1]}  timers={list[i*2][7]} compTimers= {list[i*2][8]} prio={list[i*2][9]} index={list[i*2][10]} handleFocus={handleFocus}/>
                            </Tr>
                        )
                    }
                }
                lastT = "" + list[i*2][0];
                
            }
            else{
                child.push(
                <Tr>
                        <Td height={"45px"} padding={4} paddingLeft={4} paddingBottom={6} verticalAlign="middle" width={"80px"}></Td>
                </Tr>
                )
            }
            if(i===24){
                i=0;
            }
        }
    }

    return(
        <Box p={4}>
            <Table variant='unstyled' key={list}>
                <Tbody >
                    {child.map((el, index)=> 
                        <div key={index}>{el}</div>
                        )}
                </Tbody>    
            </Table>
            <FocusTime isOpen={isOpen} onClose={onClose}  title={focusTitle} notes={focusDesc} timers={focusTime} completedTimers={completeFocus} handleCompletedChange={handleCompletedChange} category={focusCat} index={focusIndex}/>
        </Box>
    )
}


export default Appointment;