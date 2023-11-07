import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Link as ReactRouterLink } from "react-router-dom";
import {Box, Heading, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, Link as ChakraLink, Card, CardHeader, CardBody, CardFooter, VStack} from '@chakra-ui/react';

import MainLogo from '../media/mainlogo';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [emailSameError, setEmailSameError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [comboError, setComboError] = useState(false)

  const digitRegex = /\d/;
  const lowerRegex = /[a-z]/;
  const upperRegex = /[A-Z]/;
  const specialRegex = /[^a-zA-Z0-9]/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


  const emailRegex =/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;


  useLayoutEffect(() => {
    fetch("http://localhost:5000/api/auth/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res =>  res.json())
    .then(data => data.isLoggedIn ? navigate("/"): null)
    .catch((err) => (err))
  }, [navigate]);



  async function onSubmit() {
    // Implement your login logic here

    if (!emailRegex.test(email)) {
      console.log("Invalid email format")
      setEmailError(true);

      return;
    }

    
    if (password.length < 8) {
      console.log("Password must be at least 8 characters");
      setPasswordLengthError(true);
      return;
    }
    if (!specialRegex.test(password) || !lowerRegex.test(password) || !upperRegex.test(password) || !digitRegex.test(password)) {
      console.log("Passwords must contain a mix of uppercase letters, lowercase letters, numbers, and symbols");
      return;
    }
    if (password !== confirmPassword) {
      console.log("Passwords must match");
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({username: email, password: password, fname: 'First', lname: 'Last', pomodoro: {timer: 25, short: 5, long: 15}})
    })
    if(!response.ok) {
      if (response.status === 400) {
        console.log("Email already being used");
        setEmailSameError(true);
      }
    } else {
        navigate('/login');
    };
  };


  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailError(false);
    if (email.length !== 0 && !emailRegex.test(email)) {
      setEmailError(true);
    }
  }, [email])


  useEffect(() => {
    setPasswordLengthError(false)
    if (password.length !== 0 && password.length < 8) {
      setPasswordLengthError(true);
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword.length !== 0 && password !== confirmPassword) {
      setPasswordMatchError(true);
    }
    else {
      setPasswordMatchError(false);
    }
  }, [password, confirmPassword])


  useEffect(() => {
    setComboError(false);
    const digitRegex = /\d/;
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    const specialRegex = /[^a-zA-Z0-9]/;

    if (!passwordLengthError && password.length !== 0) {
      if (!specialRegex.test(password) || !lowerRegex.test(password) || !upperRegex.test(password) || !digitRegex.test(password)) {
        console.log("True")
        setComboError(true)
      }
    }
  }, [password, passwordLengthError])

  return (
    <Box h="100vh" display="flex">
        <MainLogo />
      <Box
        flex="1"
        bg="white"
        position="relative"
      >
        <Box
          w="90%"
          mx="5%"
          p={4}
          position="absolute"
          top="50%"
          left="30%"
          transform="translate(-50%, -50%)"
        >
          <Card boxShadow='2xl'>
            <CardHeader>
              <Heading as="h2" size="lg" mb={4}>
                Sign Up
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={10} direction='row'>
                  <FormControl id="email" isInvalid={emailError || emailSameError} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                        <FormErrorMessage>Please enter in a valid email.</FormErrorMessage>
                       )}
                    {emailSameError && (
                        <FormErrorMessage>Email already in use.</FormErrorMessage>
                       )}
                  </FormControl>
                  <FormControl id="password" isInvalid={passwordLengthError || comboError} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordLengthError && (
                        <FormErrorMessage>Password must be at least 8 characters.</FormErrorMessage>
                       )}
                       {comboError && !passwordLengthError && (
                        <FormErrorMessage>Passwords must contain a mix of uppercase letters, lowercase letters, numbers, and symbols.</FormErrorMessage>
                      )}
                  </FormControl>
                  <FormControl id="confirm-password" isInvalid={passwordMatchError} isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password again"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                      {passwordMatchError && (
                        <FormErrorMessage>Passwords must match.</FormErrorMessage>
                       )}
                    </FormControl>

                  <Button colorScheme="brand" onClick={onSubmit}>Sign Up</Button>

              </VStack>
            </CardBody>
            <br/><br/><br/><br/><br/><br/><br/>
            <CardFooter bg="white" style={{ textAlign: 'center' }} padding-top='100px'>
              <Box w="100%" bg="#F5F7F9" display="inline-block" p={2} rounded="md">
                <Text display="inline" textAlign="center">Already Have an Account?</Text>
                <ChakraLink as={ReactRouterLink} to='/' display="inline" color="#6284FF" style={{ marginLeft: '5px', fontWeight: 'bold'}}>Log in Here!</ChakraLink>
              </Box>
            </CardFooter>
          </Card>
        </Box>
      </Box>
    </Box>
  );  
};


export default Signup;
