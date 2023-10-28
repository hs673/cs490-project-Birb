import React from "react";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 // We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
import { ChakraProvider, Flex, Heading, Spacer, Button, Image } from '@chakra-ui/react';


 // Here, we display our Navbar
export default function Navbar2() {
 return (
   
    
    <Flex as={"nav"} bg={"white"} width={"100%"} height={"70px" } alignItems={"center"} p={"20px"} >
    <Heading>Profile</Heading>
    <Spacer></Spacer>
    <NavLink to="/profile" >
        <Button leftIcon={<Image borderRadius='full' boxSize="40px" src="https://bit.ly/dan-abramov"/>} variant={"ghost"} colorScheme="linkedin" bg={"white"}>name lastName</Button>
    </NavLink>
    </Flex>
     
   
 );
}