"use client";
import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Textarea, Button, VStack, Text } from '@chakra-ui/react';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

function Home() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users who have opted in for text messaging
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
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
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <Textarea
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button mt={4} colorScheme="blue" onClick={sendMessage}>
          Send Message
        </Button>
        <Box mt={4} overflowY="scroll" maxH="300px" p={4} border="1px" borderColor="gray.200">
          <VStack align="stretch">
            {users.map((user, index) => (
              <Text key={index}>{`${user.firstName} ${user.lastName} (${user.phoneNumber})`}</Text>
            ))}
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
