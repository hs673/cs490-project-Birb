import React from "react";
import {Box,  Spacer,  Td, useDisclosure, useColorModeValue} from '@chakra-ui/react';
// import {Box,  Spacer,  Td, useColorModeValue, useDisclosure} from '@chakra-ui/react';
import { Heading, Flex } from '@chakra-ui/react';
import {Icon } from '@chakra-ui/react'
import {IoHourglassOutline, IoChevronDownCircleOutline} from 'react-icons/io5'
// import {IoIosRadioButtonOff, IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline} from 'react-icons/io'
import FocusTime from "./focustime";

function AppointmentContainer(props){
    //handleFocus(title, desc, timer, compTimer, category, index)
    //props.handleFocus(props.title, props.notes, props.timers, props.compTimers, props.prio, props.index )
    // const bg = useColorModeValue('#F5F7F9', '#1A202C')
    const cont = useColorModeValue("white", "#2d3748")
    const passedFocus = useColorModeValue("#f3f6ff", "#243064") //use to gray out passed focus time
    console.log(props.isFocus)
    return (
             <Td padding={0} width={"88%"} style={{ backgroundColor: `${cont}`}}>
                
                {props.isFocus? (
                    <>
                    
                    {props.isCont? (<>
                        {props.isEnd? (<>
                        {props.isBefore? (<>
                            <Flex justifyContent={"center"} borderLeft={"2px solid #E2EAF1"} borderRight={"2px solid #E2EAF1"} borderBottom={"2px solid #E2EAF1"} _hover={{bg:"#E2EAF162"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            </Flex>
                        </>):(<>
                            <Flex justifyContent={"center"} borderLeft={"2px solid #6284FF"} borderRight={"2px solid #6284FF"} borderBottom={"2px solid #6284FF"} _hover={{bg:"#6284ff14"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            </Flex>
                        </>)}
                            
                        </>):(<>
                            {props.isBefore? (<>
                            <Flex justifyContent={"center"} borderLeft={"2px solid #E2EAF1"} borderRight={"2px solid #E2EAF1"} _hover={{bg:"#E2EAF162"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            </Flex></>):(<>
                            <Flex justifyContent={"center"} borderLeft={"2px solid #6284FF"} borderRight={"2px solid #6284FF"} _hover={{bg:"#6284ff14"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            </Flex>
                            </>)} 
                        </>)
                        }
                    </>)
                    :(<>
                    {props.isBefore? (<>
                        <Flex justifyContent={"center"} border={"2px solid #E2EAF1"} _hover={{bg:"#E2EAF162"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            <Flex justifyContent={"flex-left"} alignItems={"center"} style={{ cursor: 'pointer' }} onClick={ () => props.handleFocus(props.title, props.notes, props.timers, props.compTimers, props.prio, props.index )}>
                                <Heading margin={3} textAlign={"center"} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                Focus Time
                                </Heading>
                                <Box alignSelf={"center"} height="6px" width={"6px"} bg={"#000000"} rounded={100}></Box>
                                <Heading margin={3} textAlign={"center"} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                {props.title}
                                </Heading>
                            </Flex>
                            <Spacer></Spacer>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}  >
                                <Icon as={IoHourglassOutline} margin={1} boxSize={"20px"} color={"#000000"} marginRight={"5px"} />
                                <Heading   fontSize={"14px"}  margin={1} fontWeight={"700"} marginRight={"20px"} fontFamily={"'DM Sans', sans-serif"}>{props.compTimers}/{props.timers}</Heading>
                            </Flex>
                        </Flex>
                    </>):(<>
                        <Flex justifyContent={"center"} border={"2px solid #6284FF"} _hover={{bg:"#6284ff14"}} width={"95%"} bg={"white"} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            <Flex justifyContent={"flex-left"} alignItems={"center"} style={{ cursor: 'pointer' }} onClick={ () => props.handleFocus(props.title, props.notes, props.timers, props.compTimers, props.prio, props.index )}>
                                <Heading margin={3} textAlign={"center"} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                Focus Time
                                </Heading>
                                <Box alignSelf={"center"} height="6px" width={"6px"} bg={"#6284FF"} rounded={100}></Box>
                                <Heading margin={3} textAlign={"center"} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                {props.title}
                                </Heading>
                            </Flex>
                            <Spacer></Spacer>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}  >
                                <Icon as={IoHourglassOutline} margin={1} boxSize={"20px"} color={"#6284FF"} marginRight={"5px"} />
                                <Heading   fontSize={"14px"}  margin={1} fontWeight={"700"} marginRight={"20px"} fontFamily={"'DM Sans', sans-serif"}>{props.compTimers}/{props.timers}</Heading>
                            </Flex>
                        </Flex>
                    </>)}
                    </>)
                        
                    }
                    </>   
                ) : 
                (
                    <>
                    {props.isCont? (
                        <>
                        {props.isEnd? (
                            <Flex justifyContent={"center"} borderRight={"2px solid #E2EAF1"} borderLeft={"2px solid #E2EAF1"} borderBottom={"2px solid #E2EAF1"} width={"95%"} bg={cont} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            <Flex justifyContent={"flex-left"} alignItems={"center"}>
                                <Heading  padding={3} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                    {props.title}
                                </Heading>
                            </Flex>
                            <Spacer></Spacer>
                            </Flex>
                        ):(
                            <Flex justifyContent={"center"} borderRight={"2px solid #E2EAF1"} borderLeft={"2px solid #E2EAF1"} width={"95%"} bg={cont} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                            <Flex justifyContent={"flex-left"} alignItems={"center"}>
                                <Heading  padding={3} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                    {props.title}
                                </Heading>
                            </Flex>
                            <Spacer></Spacer>
                            </Flex>
                        )}
                        
                        </>
                    ):(
                    <Flex justifyContent={"center"} border={"2px solid #E2EAF1"} width={"95%"} bg={cont} marginLeft={4} height={45} maxH={"100px"} overflowY={"auto"}>
                        <Flex justifyContent={"flex-left"} alignItems={"center"}>
                            <Heading  padding={3} fontSize={"14px"} fontWeight={"700"} fontFamily={"'DM Sans', sans-serif"}>
                                {props.title}
                            </Heading>
                        </Flex>
                        <Spacer></Spacer>
                    </Flex>
                    )}
                    
                    </>
                ) 
                
                } 
                
            </Td>
  )
    
}
export default AppointmentContainer;