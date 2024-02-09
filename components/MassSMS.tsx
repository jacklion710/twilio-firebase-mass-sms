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
import { db } from '@/utils/firebase'; 
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { COLORS } from '@/utils/palette';

const { 
  secondaryText, 
  background,
  secondary, 
  buttonCol, 
  primary, 
  accent,
  neonAccent,
  grey,
  greenPrimary,
  greenSecondary
} = COLORS;

const theme = extendTheme({
  fonts: {
    heading: "'Kdam Thmor Pro', sans-serif",
    body: "'Kdam Thmor Pro', sans-serif",
  },
}, baseTheme);

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

function MassSMS() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function formatPhoneNumber(phoneNumber: string) {
    // Remove hyphens, parentheses, and spaces
    const cleanNumber = phoneNumber.replace(/[-()\s]/g, '');
    // Prepend with +1
    return `+1${cleanNumber}`;
  }  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('isOptedInTexts', '==', true));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => {
          const user = doc.data();
          return {
            id: doc.id,
            firstName: user.firstName,
            lastName: user.lastName,
            // Format the phone number before saving the user data
            phoneNumber: formatPhoneNumber(user.phoneNumber),
          };
        });
  
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You have been signed out.');
      // Optionally, redirect the user to the login page or perform other actions after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
      alert('Failed to sign out.');
    }
  };

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

      <Center minH="100vh" bgColor={background}>
        <Container>

          <Heading mb={10} textAlign={'center'}>Mass SMS Builder</Heading>

          <Box 
            shadow="md" 
            borderRadius="lg" 
            minH="600px"
            rounded={'lg'}
            boxShadow={'lg'}
            p={9}
            bg={secondary}
            w={'32vw'}
            minW="50vw"
            alignSelf={'center'}
            borderColor={primary}
            borderWidth="3px"
          >    

            <Text color={secondaryText}>List of users who are opted in for texts:</Text>

            {/* LIST OF USERS WHO ARE OPTED INTO YOUR SMS LIST */}
            <Box borderColor={primary} bgColor="white" mb={8} mt={4} overflowY="scroll" maxH="400px" p={4} border="1px" borderRadius="md" minH="200px"> 
              <VStack align="stretch">
                {users.map((user, index) => (
                  <Text color={primary} key={index}>{`${user.firstName} ${user.lastName} (${user.phoneNumber})`}</Text>
                ))}
              </VStack>
            </Box>

            <Text color={secondaryText}>Compose your message:</Text>

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
              borderColor={primary}
              color={primary}
              _hover={{ borderColor: primary, borderWidth: "2px" }}
              _focus={{ borderColor: accent, borderWidth: '3px' }}
            />

            {/* SUBMIT MESSAGE */}
            <Flex justifyContent="center" mt={4}> {/* Centered horizontally */}
              <Button  
                onClick={handleSendClick}
                color={secondaryText}
                _hover={{
                  bg: `${accent}80`,
                  transform: 'scale(1.05)'
                }}
                _active={{
                  bg: `${neonAccent}80`
                }}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                border="2px solid"
                borderColor={grey}
                backgroundColor={`${buttonCol}80`}
                transition="all 0.3s ease-in-out"
                style={{ borderRadius: '20px' }}
                mb={4}
                w="8vw"
                minW={"130px"}
              >
                Send Message
              </Button>
            </Flex>

            {/* SIGN OUT BUTTON */}
            <Flex justifyContent="flex-end" width="full">
              <Button
                onClick={handleSignOut}
                colorScheme="red"
                size="sm"
                mt="4"
              >
                Sign Out
              </Button>
            </Flex>

            {/* CONFIRMATION MODAL */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent 
                bgColor={secondary} 
                borderColor={primary} 
                borderWidth="3px" 
                minW="40vw"
              >
                <ModalHeader color={secondaryText}>Confirm Message</ModalHeader>
                <ModalCloseButton />
                <ModalBody color={secondaryText}>
                  Are you sure you want to send this message?
                </ModalBody>
                <ModalFooter>
                  <Button 
                    mr={3} 
                    onClick={sendMessage}
                    bgColor={`${greenPrimary}80`}
                    color={secondaryText}
                    _hover={{ bg: `${greenSecondary}80`, transform: 'scale(1.05)' }} 
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
                    bgColor={`${buttonCol}80`}
                    color={secondaryText}
                    _hover={{ bg: `${accent}80`, transform: 'scale(1.05)' }}
                    _active={{ bg: `${neonAccent}80` }}
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                    border="2px solid"
                    borderColor={primary}
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

export default MassSMS;
