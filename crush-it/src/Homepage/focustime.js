import React, { useState }  from 'react';
import { HStack, Spacer, useDisclosure } from "@chakra-ui/react";
import { IconButton, Button, Text, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
         Tab, TabList, TabPanel, TabPanels, Tabs, Flex, useColorModeValue} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";

function FocusTime() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const bg = useColorModeValue("#F3F3F3", "#1a202c");
    const blueTxt = useColorModeValue('#6284FF', '#90cdf4');

    const [isPaused, setIsPaused] = useState(true);

    const handleToggle = () => {
      setIsPaused((prevState) => !prevState);
    };

    return (
        <>
        <IconButton onClick={onOpen} isRound={true} variant='solid' aria-label='Done' fontSize='15px' fontWeight={"extrabold"} icon={<AddIcon />} ml={4} mb={1.5}
                        colorScheme="blue" style={{ background: 'linear-gradient(#5D8EFF 100%, #3E6FE1 100%)', color: 'white' }}/>


                        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                      <ModalContent maxW="600px">
                        <ModalCloseButton />
                        <ModalBody>
                          <Tabs isFitted variant="enclosed">
                            <TabList mb="1em">
                              <Tab>Pomodoro</Tab>
                              <Tab>Short Break</Tab>
                              <Tab>Long Break</Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel>
                                <Box bg = {bg} alignContent={"center"} p={10} textAlign={"center"}>
                                  <Text fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>25:00</Text>
                                  <Button colorScheme="blue" size="lg" onClick={handleToggle}>
                                    {isPaused ? "Start" : "Pause"}
                                  </Button>
                                </Box>
                                <Text mt={5} mb={5} fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"20px"}>Task Title</Text>
                                <Box bg = {bg} p={5}>
                                  <Text fontFamily={"DM Sans"} textColor={blueTxt} fontWeight={"bold"} fontSize={"16px"} mb={3}>Notes</Text>
                                  <Text fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"12px"} mb={3}>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                  </Text>
                                </Box>
                                <Box mt={5} bg="black" p={5}>
                                  <Flex justifyContent="center" alignItems="center" mt={3}>
                                    <HStack>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px">
                                        Pomos:
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        0/3
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor="white" fontWeight="bold" fontSize="20px" ml={8}>
                                        Finish At:
                                      </Text>
                                      <Text fontFamily="DM Sans" textColor={blueTxt} fontWeight="bold" fontSize="20px">
                                        19:53 (1.4h)
                                      </Text>
                                    </HStack>
                                  </Flex>
                                </Box>
                              </TabPanel>
                              <TabPanel>
                                  <Box bg = {bg} alignContent={"center"} p={10} textAlign={"center"}>
                                    <Text fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>5:00</Text>
                                    <Button colorScheme="blue" size="lg" onClick={handleToggle}>
                                      {isPaused ? "Start" : "Pause"}
                                    </Button>
                                  </Box>
                              </TabPanel>
                              <TabPanel>
                                <Box bg = {bg} alignContent={"center"} p={10} textAlign={"center"}>
                                  <Text fontFamily={"DM Sans"} fontWeight={"bold"} fontSize={"100px"}>15:00</Text>
                                  <Button colorScheme="blue" size="lg" onClick={handleToggle}>
                                    {isPaused ? "Start" : "Pause"}
                                  </Button>
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