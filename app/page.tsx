"use client";
import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Center,
  Flex,
  Textarea,
  Button,
  Heading,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  theme as baseTheme,
  extendTheme,
} from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'Kdam Thmor Pro', sans-serif",
    body: "'Kdam Thmor Pro', sans-serif",
  },
}, baseTheme);

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

function Home() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Fetch users who have opted in for text messaging
    const fetchUsers = async () => {
      // Fetch logic remains the same
    };
    
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    // Assuming `users` contains all necessary data
    const payload = {
      template: message, // The message template with placeholders
      users: users, // Array of users
    };
  
    await fetch('/api/twilio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    alert('Message sent!');
    onClose(); // Close modal after sending
  };

  const handleSendClick = () => {
    if (message.trim() === '') {
      alert('Please enter a message to send.');
      return;
    }
    onOpen(); // Open confirmation modal
  };

  return (
    <ChakraProvider theme={theme}>
      <link href="https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&display=swap" rel="stylesheet"></link>

      <Center minH="100vh" bgColor="#FAF8F5">
        <Container>

          <Heading mb={10} textAlign={'center'}>Mass SMS Builder</Heading>

          <Box 
            shadow="md" 
            borderRadius="lg" 
            minH="600px"
            rounded={'lg'}
            boxShadow={'lg'}
            p={9}
            bg={'#A8BACB'}
            w={'32vw'}
            minW="50vw"
            alignSelf={'center'}
            borderColor={'#2E4A6B'}
            borderWidth="3px"
          >    

            <Text color="white">List of users who are opted in for texts:</Text>

            {/* LIST OF USERS WHO ARE OPTED INTO YOUR SMS LIST */}
            <Box borderColor="black" bgColor="white" mb={8} mt={4} overflowY="scroll" maxH="400px" p={4} border="1px" borderRadius="md" minH="200px"> 
              <VStack align="stretch">
                {users.map((user, index) => (
                  <Text color='#2E4A6B' key={index}>{`${user.firstName} ${user.lastName} (${user.phoneNumber})`}</Text>
                ))}
              </VStack>
            </Box>

            <Text color="white">Compose your message:</Text>

            {/* MESSAGE TO SEND TO YOUR USERS */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              mt={4}
              minH="200px"
              placeholder="Type your message..."
              sx={{
                  '::placeholder': {
                  color: 'gray.400', 
                  },
              }}
              rows={4} 
              required 
              bg="white" 
              borderColor="black"
              color='#2E4A6B'
              _hover={{ borderColor: '#2E4A6B', borderWidth: "2px" }}
              _focus={{ borderColor: '#FF8C42', borderWidth: '3px' }}
            />

            {/* SUBMIT MESSAGE */}
            <Flex justifyContent="center" mt={4}> {/* Centered horizontally */}
              <Button  
                onClick={handleSendClick}
                color={'#FFFFFF'}
                _hover={{
                  bg: `${'#FF8C42'}80`,
                  transform: 'scale(1.05)'
                }}
                _active={{
                  bg: `${'#FF8C42'}80`
                }}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                border="2px solid"
                borderColor={'#8D8D8D'}
                backgroundColor={`${'#7C9EB2'}80`}
                transition="all 0.3s ease-in-out"
                style={{ borderRadius: '20px' }}
                mb={4}
                w="8vw"
                minW={"130px"}
              >
                Send Message
              </Button>
            </Flex>

            {/* CONFIRMATION MODAL */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent 
                bgColor={'#A8BACB'} 
                borderColor={'#2E4A6B'} 
                borderWidth="3px" 
                minW="40vw"
              >
                <ModalHeader>Confirm Message</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Are you sure you want to send this message?
                </ModalBody>
                <ModalFooter>
                  <Button 
                    mr={3} 
                    onClick={sendMessage}
                    bgColor={`${'#6A8D7F'}80`}
                    color="white" 
                    _hover={{ bg: `${'#87A696'}80`, transform: 'scale(1.05)' }} 
                    _active={{ bg: "green.700" }} 
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)" 
                    border="2px solid"
                    borderColor="green.500"
                    transition="all 0.3s ease-in-out" 
                    borderRadius="20px" 
                    fontFamily="'Kdam Thmor Pro', sans-serif"
                  >
                    Yes, Send It
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    bgColor={`${'#7C9EB2'}80`}
                    color={'#FFFFFF'}
                    _hover={{ bg: `${'#FF8C42'}80`, transform: 'scale(1.05)' }}
                    _active={{ bg: `${'#FF5513'}80` }}
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                    border="2px solid"
                    borderColor={'#8D8D8D'}
                    transition="all 0.3s ease-in-out"
                    borderRadius="20px"
                    fontFamily="'Kdam Thmor Pro', sans-serif"
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

          </Box>
        </Container>
      </Center>
    </ChakraProvider>
  );
}

export default Home;
