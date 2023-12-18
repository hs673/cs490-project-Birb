import React, { useState, useEffect } from 'react';
import { Box, Image, Icon, IconButton, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
         ModalBody, ModalFooter } from '@chakra-ui/react';
import userIcon from '../media/userIcon.png';
import { TbPhotoEdit } from "react-icons/tb";

function UploadAvatar(props){
    const url = process.env.REACT_APP_API_URL;
    const [isOpen, setIsOpen] = useState(false);
    const username = props.username;

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const [showFile, setShowFile] = useState(userIcon)
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        event.preventDefault()
        const file = event.target.files[0];
        setSelectedFile(file)
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    useEffect(() => {
        if(username) {
            fetch(url + '/api/pic/' + username)
            .then(res => res.json())
            .then(data => {
                if(data.picture !== null){
                    setShowFile(data.picture)
                }
            })
        }
    }, [username, url])



    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFile !== null) {
            // Perform your upload logic here, e.g., send the file to your server
            let b64file = await toBase64(selectedFile);
            fetch(url + '/api/pic/' + username, {
                method: "PUT",
                body: JSON.stringify({
                    username: username,
                    selectedFile: b64file
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // Reset the selected file state after upload\
            setSelectedFile(null);
            closeModal();
            setShowFile(b64file);
        } else {
            console.error('No file selected for upload');
        }
    };

    return (
        <>
        <Box marginLeft={5}
            position="relative"
            display="inline-block"
            
            _hover={{
                '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                pointerEvents: 'none',
                
                },
                '& .edit-icon': {
                opacity: 1,
                pointerEvents: 'none'
                },
            }}
            >
            <IconButton
                onClick={openModal}
                icon={<Image src={showFile} alt="Profile Icon" h="100%" />}
                isRound
                h={"75px"}
            />
            <Icon
                className="edit-icon"
                as={TbPhotoEdit}
                color="white"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                opacity={0}
                zIndex={2}
                h={8} // Adjust the size of the `FaEdit` icon here
                w={8}
            />
            </Box>
      
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Upload Profile Picture</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {/* Add your file input or upload component here */}
                {/* Example: */}
                <input type="file" accept="image/*" onChange={handleFileChange} /> {/* */}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleUpload}>
                Upload
                </Button>
                <Button variant="ghost" onClick={closeModal}>
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );

};

export default UploadAvatar;