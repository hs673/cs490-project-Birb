import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router";
import { Box, Heading, VStack, FormControl, FormLabel, FormErrorMessage, Input, Button, Divider, Flex, HStack, Card, Icon} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons'
import { RiLockPasswordLine } from 'react-icons/ri'
import {RxPerson} from 'react-icons/rx'
import bcrypt from 'bcryptjs'

function Profile() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [pomodoro, setPomodoro] = useState(null);
  const [timer, setTimer] = useState(0);
  const [short, setShort] = useState(0);
  const [long, setLong] = useState(0);

  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState({});
  console.log(userData);

  useLayoutEffect(() => {
    console.log(localStorage.getItem("token"));
    fetch("http://localhost:5000/api/auth/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? setUser(data.username): navigate('/login'))
    .catch((err) => alert(err))
  }, [navigate])

  useEffect(() => {
    fetch("http://localhost:5000/api/user/" + user)
    .then(res => res.json())
    .then(data => {setUserData(data)})
    .catch((err) => console.log(err))
  }, [user])

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setFname(userData.fname)
      setLname(userData.lname)
      setPomodoro(userData.pomodoro)
    }
  }, [userData])

  useEffect(() => {
    if (pomodoro) {
      setTimer(userData.pomodoro.timer)
      setShort(userData.pomodoro.short)
      setLong(userData.pomodoro.long)
    }
  }, [pomodoro])


  useEffect(() => {
    setPasswordError(false);
  }, [password])
  
  useEffect(() => {
    if (newPassword.length !== 0 && newPassword.length < 6) {
      setPasswordLengthError(true);
    }
    else {
      setPasswordLengthError(false);
    }
  }, [newPassword])

  useEffect(() => {
    if (confirmNewPassword.length !== 0 && newPassword !== confirmNewPassword) {
      setPasswordMatchError(true);
    }
    else {
      setPasswordMatchError(false);
    }
  }, [newPassword, confirmNewPassword])

  const handleSave = async () => {
    var profileSave = {
      username: user,
      fname: fname,
      lname: lname,
      pomodoro: {timer: timer, short: short, long: long}
    };

    if (password.length > 0 && password.length < 6) {
      console.log("Password is incorrect");
      setPasswordError(true);
      return;
    }
    if (newPassword.length > 0 && newPassword.length < 6) {
      console.log("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      console.log("Passwords must match");
      return;
    }

    // if (password.length > 0 && newPassword.length >= 6 && newPassword === confirmNewPassword){
    //   const compare = await bcrypt.compare(password, userData.password)
    //   if (compare) {
    //     console.log("correct")
    //     var profileSave = {
    //       username: user,
    //       fname: fname,
    //       lname: lname,
    //       pomodoro: {timer: timer, short: short, long: long}
    //     };
    //   }
    //   else {
    //     console.log("incorrect")
    //     setPasswordError(true);
    //     return;
    //   }
    // }

    await fetch('http://localhost:5000/api/user/' + user, {
      method: "PUT",
      body: JSON.stringify({...profileSave}),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    window.location.reload();
  }

  const handleCancel = () => {
    setFname(userData.fname)
    setLname(userData.lname)
    setTimer(userData.pomodoro.timer)
    setShort(userData.pomodoro.short)
    setLong(userData.pomodoro.long)
  }

    return (
    <Box p={5} bg="#F5F7F9">    
      <VStack spacing={4} align="start">
        <Box w="100%">
          <Heading as="h2" size="md" mb={2}>
            User Info
          </Heading>
          <Box
          flex="1"
          bg="white"
          position="relative"
          w="100%"
         
          >
          <Card boxShadow='xl' p={5} mb={4} w="100%">
          <HStack spacing={4} align="start">
          <FormControl id="firstName" flex={1}>
            <Flex spacing={4}>
                <Icon as={RxPerson} color={"#6284FF"}/>
                <FormLabel ml={2}>First Name</FormLabel>
            </Flex>
            <Input 
            type="text" 
            placeholder="First Name" 
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            />
          </FormControl>
          <FormControl id="lastName" flex={1}>
            <Flex spacing={4}>
                <Icon as={RxPerson} color={"#6284FF"}/>
                <FormLabel ml={2}>Last Name</FormLabel>
            </Flex>
            <Input 
            type="text" 
            placeholder="Last Name" 
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            />
          </FormControl>
        </HStack>
        </Card>
        </Box>
        </Box>

        <Divider />

        <Box w="100%">
        <Heading as="h2" size="md" mb={2}>
          Change Password
        </Heading>
        <Card boxShadow='xl' p={5} mb={4} w="100%">
        <HStack spacing={4} align="start">
          <FormControl id="currentPassword" isInvalid={passwordError} flex={1}>
            <Flex spacing={4}>
                <Icon as={RiLockPasswordLine} color={"#6284FF"}/>
                <FormLabel ml={2}>Current Password</FormLabel>
            </Flex>
            <Input 
            type="password" 
            placeholder="Current password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <FormErrorMessage>Password is Incorrect</FormErrorMessage>
              )}
          </FormControl>
          <FormControl id="newPassword" isInvalid={passwordLengthError} flex={1}>
            <Flex spacing={4}>
                <Icon as={RiLockPasswordLine} color={"#6284FF"}/>
                <FormLabel ml={2}>New Password</FormLabel>
            </Flex>
            <Input 
            type="password" 
            placeholder="New password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            {passwordLengthError && (
              <FormErrorMessage>Password must be at least 6 characters</FormErrorMessage>
              )}
          </FormControl>
          <FormControl id="confirmPassword" isInvalid={passwordMatchError} flex={1}>
            <Flex spacing={4}>
                <Icon as={RiLockPasswordLine} color={"#6284FF"}/>
                <FormLabel ml={2}>Confirm New Password</FormLabel>
            </Flex>
            <Input 
            type="password" 
            placeholder="Confirm password" 
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            {passwordMatchError && (
              <FormErrorMessage>Passwords must match</FormErrorMessage>
              )}
          </FormControl>
        </HStack>
        </Card>
        </Box>

        <Divider />

        <Box w="100%">
        <Heading as="h2" size="md" mb={2}>
          Pomodoro Timer (Minutes)
        </Heading>
        <Card boxShadow='xl' p={5} mb={4} w="100%">
        <HStack spacing={4} align="start">
          <FormControl id="pomodoro" flex={1}>
            <Flex spacing={4}>
                <TimeIcon color={"#6284FF"}/>
                <FormLabel ml={2}>Pomodoro</FormLabel>
            </Flex>
            <Input 
            type="number" 
            placeholder="Current Setting" 
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
            />
          </FormControl>
          <FormControl id="shortBreak" flex={1}>
            <Flex spacing={4}>
                <TimeIcon color={"#6284FF"}/>
                <FormLabel ml={2}>Short Break</FormLabel>
            </Flex>
            <Input 
            type="number" 
            placeholder="Current Setting" 
            value={short}
            onChange={(e) => setShort(e.target.value)}
            />
          </FormControl>
          <FormControl id="longBreak" flex={1}>
          <Flex spacing={4}>
                <TimeIcon color={"#6284FF"}/>
                <FormLabel ml={2}>Long Break</FormLabel>
            </Flex>
            <Input 
            type="number" 
            placeholder="Current Setting" 
            value={long}
            onChange={(e) => setLong(e.target.value)}
            />
          </FormControl>
        </HStack>
        </Card>
        </Box>

        <Divider />

        <Box w="100%" display="flex" justifyContent="center">
        <HStack spacing={5}>
            <Button size='lg' colorScheme="blue" variant='outline' onClick={handleCancel}>Cancel</Button>
            <Button size='lg' colorScheme="blue" variant='solid' onClick={handleSave}>Save</Button>
        </HStack>
        </Box>

      </VStack>
    </Box>
  );
};

export default Profile;