"use client";
import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Textarea,
  Button,
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
} from '@chakra-ui/react';

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
    // Send message to users
    await fetch('/api/twilio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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
    <ChakraProvider>
      <Box p={5}>

        {/* LIST OF USERS WHO ARE OPTED INTO YOUR SMS LIST */}
        <Box mt={4} overflowY="scroll" maxH="300px" p={4} border="1px" borderColor="gray.200">
          <VStack align="stretch">
            {users.map((user, index) => (
              <Text key={index}>{`${user.firstName} ${user.lastName} (${user.phoneNumber})`}</Text>
            ))}
          </VStack>
        </Box>

        {/* MESSAGE TO SEND TO YOUR USERS */}
        <Textarea
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* SUBMIT MESSAGE */}
        <Button mt={4} colorScheme="blue" onClick={handleSendClick}>
          Send Message
        </Button>

        {/* CONFIRMATION MODAL */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Message</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to send this message?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={sendMessage}>
                Yes, Send It
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
      </Box>
    </ChakraProvider>
  );
}

export default Home;
