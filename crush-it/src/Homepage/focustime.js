import React, { useState, useEffect, useLayoutEffect }  from 'react';
import { useNavigate } from "react-router";

import { HStack } from "@chakra-ui/react";
import { Button, Text, Box, Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton,
         Tab, TabList, TabPanel, TabPanels, Tabs, TabIndicator, Flex, useColorModeValue} from '@chakra-ui/react';

function FocusTime({isOpen, onClose, title, notes, timers, completedTimers, handleCompletedChange, category, index}) {
  const url = process.env.REACT_APP_API_URL;
    //const { isOpen, onOpen, onClose } = useDisclosure()
    const bg = useColorModeValue("#F3F3F3", "#1a202c");
    const blueTxt = useColorModeValue('#6284FF', '#90cdf4');
    const [pomoLength, setPomoLength] = useState('1');
    const [shortLength, setShortLength] = useState('2');
    const [longLength, setLongLength] = useState('3');

    const [isPaused, setIsPaused] = useState(true);
    const [timer, setTimer] = useState(60);
    const [shortTimer, setShortTimer] = useState(120);
    const [longTimer, setLongTimer] = useState(180);
    const [currentPomo, setCurrentPomo] = useState(null)
    const [activeTab, setActiveTab] = useState(0);

    const currentTime = new Date();
    const futureTime = new Date(currentTime);
    const [timeLeft, setTimeLeft] = useState(-1);
    const [finishAt, setFinishAt] = useState('');
    const [flag, setFlag] = useState(false);

    useEffect(() => {

    }, [completedTimers])
    
    function handleOnClose(){
      handleTabChange(0);
      setTimer(pomoLength*60);
      setShortTimer(shortLength*60);
      setLongTimer(longLength*60);
      onClose();
    }

    const handleTabChange = (index) => {
      setIsPaused(true);
      setActiveTab(index);
    };

    const handleToggle = () => {
      setIsPaused(!isPaused);
    };

    // initialize currentPomo with info from DB
    useEffect(() => {
      setCurrentPomo(completedTimers)
    }, [completedTimers])


    // finish at
    useEffect(() => {
      let interval;

      if (isPaused) {
        interval = setInterval(() => {
          console.log('paused', activeTab);
          futureTime.setSeconds(currentTime.getSeconds() + timeLeft);
          setFinishAt(futureTime.toLocaleTimeString());
        }, 1000);
      } else if (!isPaused) {
        interval = setInterval(() => {
          console.log('started');
          setTimeLeft(timeLeft-1);
        }, 1000);
      }
      return () => clearInterval(interval);

    }, [isPaused, timer, activeTab, currentPomo, finishAt, timers]);
    
    // timer
    useEffect(() => {
      let interval;

      // end "finish at"
      if (currentPomo === timers) {
        setTimeLeft(-1);
      }

      if (!isPaused && timer > 0 && currentPomo < timers && activeTab === 0) {

        // calculate time remaining
        if (!flag) {
          console.log('flag');
          setFlag(true);
          var time;
          time = pomoLength*(timers-currentPomo)
          for (let i = currentPomo+1; i < timers; i++) {
            if (i % 3 === 0) { // add a long break
              time += longLength;
            } else { // add a short break
              time += shortLength;
            }
          }
          time *= 60
          futureTime.setSeconds(currentTime.getSeconds() + time);
          setFinishAt(futureTime.toLocaleTimeString());
          console.log(time);
          setTimeLeft(time);
        }

        interval = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
      } else if (timer === 0) {
        // Timer reached 0 seconds
        setTimer(pomoLength*60);
        handleCompletedChange(currentPomo + 1, category, index)
        setCurrentPomo(prevPomo => prevPomo + 1);
        setIsPaused(true);
        if ((currentPomo+1) % 3 !== 0) {
          setActiveTab(1) // change tab to short break
        } else {
          setActiveTab(2) // change tab to long break
        }
      }
      return () => clearInterval(interval);

    }, [isPaused, timer, activeTab, currentPomo, finishAt, timers]);

    // short break
    useEffect(() => {
      let interval;

      //console.log(currentPomo);
      if (!isPaused && shortTimer > 0 && activeTab === 1) {

        interval = setInterval(() => {
          setShortTimer(prevShortTimer => prevShortTimer - 1);
        }, 1000);
      } else if (shortTimer === 0) {
        // ShortTimer reached 0 seconds
        setTimer(pomoLength*60);
        setShortTimer(shortLength*60);
        setIsPaused(true);
        setActiveTab(0) //change tab to pomo
      }
      return () => clearInterval(interval);

    }, [isPaused, shortTimer, shortLength, pomoLength, activeTab, currentPomo, timer]);
    
    // long break
    useEffect(() => {
      let interval;
      
      if (!isPaused && longTimer > 0 && activeTab === 2) {
        interval = setInterval(() => {
          setLongTimer(prevLongTimer => prevLongTimer - 1);
        }, 1000);
      } else if (longTimer === 0) {
        // LongTimer reached 0 seconds
        setTimer(pomoLength*60);
        setLongTimer(longLength*60);
        setIsPaused(true);
        setActiveTab(0) //change tab to pomo
      }
      return () => clearInterval(interval);

    }, [isPaused, longTimer, longLength, pomoLength, currentPomo, timer, activeTab]);

    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useLayoutEffect(() => {
        fetch(url + "/api/auth/getUsername", {
        headers: {
            "x-access-token": localStorage.getItem("token")
        }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setUsername(data.username): navigate('/login'))
        .catch((err) => alert(err))
    }, [navigate, url])

    useEffect(() => {
      if (username !== null) {
        fetch(url + '/api/user/' + username)
          .then(res => res.json())
          .then(userData => {
            if (userData && userData.pomodoro && userData.pomodoro.timer) {
              setPomoLength(userData.pomodoro.timer);
              setTimer(userData.pomodoro.timer*60);
            }
            if (userData && userData.pomodoro && userData.pomodoro.short) {
              setShortLength(userData.pomodoro.short);
              setShortTimer(userData.pomodoro.short*60);
            }
            if (userData && userData.pomodoro && userData.pomodoro.long) {
              setLongLength(userData.pomodoro.long);
              setLongTimer(userData.pomodoro.long*60);
            }
          })
          .catch(err => console.log(err));
      }
    }, [username, url]);

    function formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
    
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
    
      return `${formattedMinutes}:${formattedSeconds}`;
    }


//<IconButton onClick={onOpen} isRound={true} variant='solid' aria-label='Done' fontSize='15px' fontWeight={"extrabold"} icon={<AddIcon />} ml={4} mb={1.5} colorScheme="blue" style={{ background: 'linear-gradient(#5D8EFF 100%, #3E6FE1 100%)', color: 'white' }}/>
    return (
        <>
        


                        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleOnClose}>
                        <ModalOverlay />
                        <ModalContent maxW="40%" maxH="80%">
                        <ModalBody>
                          <Tabs position="relative" variant="unstyled" index={activeTab} onChange={handleTabChange}>
                            <TabList mb="0.5em">
                              <Tab data-testid="pomoTab" fontFamily="DM Sans" fontWeight="bold" _selected={{ color: blueTxt }} mr="4">Pomodoro</Tab>
                              <Tab data-testid="shortTab" fontFamily="DM Sans" fontWeight="bold" _selected={{ color: blueTxt }} mr="4">Short Break</Tab>
                              <Tab data-testid="longTab" fontFamily="DM Sans" fontWeight="bold" _selected={{ color: blueTxt }}>Long Break</Tab>
                            </TabList>
                            <TabIndicator
                              sx={{
                                width: "2px",
                                height: "3px",
                                backgroundColor: blueTxt,
                                borderRadius: "3px",
                              }}
                            />
                            <ModalCloseButton />
                            <TabPanels>
                              <TabPanel>
                                <Box rounded={8} bg = {bg} alignContent={"center"} p={10} textAlign={"center"}>
                                  <Text data-testid="pomoTimer" fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>
                                    {formatTime(timer)}
                                  </Text>
                                  <Button data-testid="pomoStart" borderRadius={"16px"} width={"158px"} height={"54"} background="linear-gradient(180deg, #6284FF 0%, #4B6DE9 100%)" textColor={'white'} size="lg" onClick={handleToggle}>
                                    {isPaused ? "Start" : "Pause"}
                                  </Button>
                                </Box>
                                <Text data-testid="title" mt={5} mb={5} fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"20px"}>{title}</Text>
                                <Box bg = {bg} p={5} rounded={8}>
                                  <Text fontFamily={"DM Sans"} textColor={blueTxt} fontWeight={"bold"} fontSize={"16px"} mb={3}>Notes:</Text>
                                  <Text data-testid="note" fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"14px"} mb={3}>
                                    {notes}
                                  </Text>
                                </Box>
                                <Box mt={5} bg="black" p={5} rounded={8}>
                                  <Flex justifyContent="center" alignItems="center" mt={3}>
                                    <HStack>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px">
                                        Pomos:
                                      </Text>
                                      <Text data-testid="pomoLeft" fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {currentPomo}/{timers}
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px" ml={8}>
                                        Finish{currentPomo === timers ? 'ed' : ''} At:
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {finishAt}
                                      </Text>
                                    </HStack>
                                  </Flex>
                                </Box>
                              </TabPanel>
                              <TabPanel>
                                  <Box bg = {bg} borderRadius={8} alignContent={"center"} p={10} textAlign={"center"}>
                                    <Text data-testid="shortTimer" fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>
                                      {formatTime(shortTimer)}
                                    </Text>
                                    <Button data-testid="shortStart" borderRadius={"16px"} width={"158px"} height={"54"} background="linear-gradient(180deg, #6284FF 0%, #4B6DE9 100%)" textColor={'white'} size="lg" onClick={handleToggle}>
                                      {isPaused ? "Start" : "Pause"}
                                    </Button>
                                  </Box>
                                  <Box mt={5} bg="black" p={5} rounded={8}>
                                  <Flex justifyContent="center" alignItems="center" mt={3}>
                                    <HStack>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px">
                                        Pomos:
                                      </Text>
                                      <Text data-testid="pomoLeft" fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {currentPomo}/{timers}
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px" ml={8}>
                                        Finish{currentPomo === timers ? 'ed' : ''} At:
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {finishAt}
                                      </Text>
                                    </HStack>
                                  </Flex>
                                </Box>
                              </TabPanel>
                              <TabPanel>
                                <Box bg = {bg} borderRadius={8} alignContent={"center"} p={10} textAlign={"center"}>
                                  <Text data-testid="longTimer" fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>
                                    {formatTime(longTimer)}
                                  </Text>
                                  <Button data-testid="longStart" borderRadius={"16px"} width={"158px"} height={"54"} background="linear-gradient(180deg, #6284FF 0%, #4B6DE9 100%)" textColor={'white'} size="lg" onClick={handleToggle}>
                                    {isPaused ? "Start" : "Pause"}
                                  </Button>
                                </Box>
                                <Box mt={5} bg="black" p={5} rounded={8}>
                                  <Flex justifyContent="center" alignItems="center" mt={3}>
                                    <HStack>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px">
                                        Pomos:
                                      </Text>
                                      <Text data-testid="pomoLeft" fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {currentPomo}/{timers}
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px" ml={8}>
                                        Finish{currentPomo === timers ? 'ed' : ''} At:
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        {finishAt}
                                      </Text>
                                    </HStack>
                                  </Flex>
                                </Box>
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        </ModalBody>
                        <ModalFooter>
                            
                        </ModalFooter>
                      </ModalContent>
                      </Modal>
        </>  
  );
};

export default FocusTime;