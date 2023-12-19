import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Link as ReactRouterLink } from "react-router-dom";
import {Box, Heading, FormControl, FormLabel, InputRightElement, InputGroup,FormErrorMessage, Input, Button, Text, Link as ChakraLink, Card, CardHeader, CardBody, CardFooter, VStack} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import MainLogo from '../media/mainlogo';

function Signup() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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

  const handleTogglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const handleTogglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  useLayoutEffect(() => {
    fetch(url + "/api/auth/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res =>  res.json())
    .then(data => data.isLoggedIn ? navigate("/"): null)
    .catch((err) => (err))
  }, [navigate, url]);



  async function onSubmit() {
    // Implement your login logic here

    if (!emailRegex.test(email)) {
      //console.log("Invalid email format")
      setEmailError(true);

      return;
    }

    
    if (password.length < 8) {
      //console.log("Password must be at least 8 characters");
      setPasswordLengthError(true);
      return;
    }
    if (!specialRegex.test(password) || !lowerRegex.test(password) || !upperRegex.test(password) || !digitRegex.test(password)) {
      //console.log("Passwords must contain a mix of uppercase letters, lowercase letters, numbers, and symbols");
      return;
    }
    if (password !== confirmPassword) {
      //console.log("Passwords must match");
      return;
    }

    const response = await fetch(url + '/api/auth/register', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({username: email, password: password, fname: 'First', lname: 'Last', pomodoro: {timer: 25, short: 5, long: 15}})
    })
    if(!response.ok) {
      if (response.status === 400) {
        //console.log("Email already being used");
        setEmailSameError(true);
      }
    } else {
      const taskResponse = await fetch(url + '/api/tasks', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({username: email})
      })
      if (!taskResponse.ok) {
        //console.log("Error inserting tasks document for user")
      } else {
        //console.log("Successfully inserted tasks document for user")
      }

      await fetch(url + '/api/events/', {
        method: "PUT",
        body: JSON.stringify({
            username: email,
            access_token: ''
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      
      await fetch(url + '/api/appointments/', {
        method: "POST",
        body: JSON.stringify({
            username: email,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      });

      await fetch(url + '/api/pic/', {
        method: "POST",
        body: JSON.stringify({
            username: email,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      });


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
        //console.log("True")
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
                    <InputGroup>
                    <Input
                      type={showPassword1 ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleTogglePassword1}>
                     {showPassword1 ? <ViewOffIcon /> : <ViewIcon />} 
                     </Button>
                  </InputRightElement>
                    </InputGroup>
                    {passwordLengthError && (
                        <FormErrorMessage>Password must be at least 8 characters.</FormErrorMessage>
                       )}
                       {comboError && !passwordLengthError && (
                        <FormErrorMessage>Passwords must contain a mix of uppercase letters, lowercase letters, numbers, and symbols.</FormErrorMessage>
                      )}
                  </FormControl>
                  <FormControl id="confirm-password" isInvalid={passwordMatchError} isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                    <Input
                      type={showPassword2 ? 'text' : 'password'}
                      placeholder="Enter your password again"
                      value={confirmPassword}
                      
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleTogglePassword2}>
                     {showPassword2 ? <ViewOffIcon /> : <ViewIcon />} 
                     </Button>
                  </InputRightElement>
                    </InputGroup>
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
