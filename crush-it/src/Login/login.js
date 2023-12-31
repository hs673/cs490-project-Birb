import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Link as ReactRouterLink } from "react-router-dom";
import {Box, Heading, FormControl, FormLabel, FormErrorMessage, Input, Button, Text,InputRightElement, InputGroup, 
        Link as ChakraLink, Card, CardHeader, CardBody, CardFooter, VStack, useColorMode} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import MainLogo from '../media/mainlogo';

function Login() {
  const url = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const { colorMode, toggleColorMode } = useColorMode();

  // Set color mode to light
  if (colorMode !== 'light') {
    toggleColorMode();
  }

  useEffect(() => {
    setEmailError(false);
    setPasswordError(false);
  }, [email, password])


  useLayoutEffect(() => {
    fetch(url + "/api/auth/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? navigate("/"): null)
    .catch((err) => console.log(err))
  }, [navigate, url])


  async function onSubmit() {
    const user = {
      username: email,
      password: password
    }

    const response = await fetch(url + '/api/auth/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
    if (!response.ok) {
      if (response.status === 400) {
        setPasswordError(true);
      }
      if (response.status === 404) {
        setEmailError(true);
      }
      //console.log(response);
    } else {
      const tokenHolder = await response.json();
      //console.log("token holder", ""+JSON.stringify( tokenHolder))
      localStorage.setItem("token", tokenHolder.token)
      window.location.reload();
    }
  }


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
              <Heading  as="h2" size="lg" mb={4}>
                <div data-testid="Login">
                Login
                </div>
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={10}>
                <FormControl id="email" isInvalid={emailError || passwordError} isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="Email"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                        <FormErrorMessage data-testid="EmailErrorMsg">Email does not exist.</FormErrorMessage>
                       )}
                  {passwordError && !emailError && (
                  <FormErrorMessage>Email or password is incorrect.</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl id="password" isInvalid={passwordError} isRequired >
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                  <Input
                    data-testid="Pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
                     {showPassword ? <ViewOffIcon /> : <ViewIcon />} 
                     </Button>
                  </InputRightElement>
                  </InputGroup>
                  {passwordError && (
                    <FormErrorMessage >Email or password is incorrect.</FormErrorMessage>
                    )}
                </FormControl>
                  <Button width='200px' colorScheme="brand" onClick={onSubmit}>Login</Button>
              </VStack>
              <Box height={"15vh"}></Box>
            </CardBody>
            <br/><br/><br/><br/><br/><br/><br/>
            <CardFooter bg="white" style={{ textAlign: 'center' }}>
              <Box w="100%" bg="#F5F7F9" display="inline-block" p={2} rounded="md">
                <Text display="inline" textAlign="center">Don't Have an Account?</Text>
                <ChakraLink as={ReactRouterLink} to='/signup' display="inline" color="#6284FF" style={{ marginLeft: '5px', fontWeight: 'bold'}}>Sign up Here!</ChakraLink>
              </Box>
            </CardFooter>
          </Card>
        </Box>
      </Box>
    </Box>
  );  
};


export default Login;
