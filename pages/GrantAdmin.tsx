import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Center,
  Flex,
  Button,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  theme as baseTheme,
  extendTheme,
  HStack,
} from '@chakra-ui/react';
import { COLORS } from '@/utils/palette';
import { firebaseApp } from '@/utils/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions'; 

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

interface AdminRoleResponse {
    message: string;
}

interface AdminRoleRequest {
    email: string;
}

function GrantAdmin() {
    const [email, setEmail] = useState(''); // Using email to identify users for privilege management
    const { isOpen: isOpenGrant, onOpen: onOpenGrant, onClose: onCloseGrant } = useDisclosure();
    const { isOpen: isOpenRevoke, onOpen: onOpenRevoke, onClose: onCloseRevoke } = useDisclosure();
  
    // Initialize Firebase Functions
    const functions = getFunctions(firebaseApp);
  
    const handleGrantPrivileges = async () => {
        const addAdminRole = httpsCallable<AdminRoleRequest, AdminRoleResponse>(functions, 'addAdminRole');
        try {
          const result = await addAdminRole({ email });
          console.log(result.data.message); 
          onCloseGrant();
        } catch (error) {
          console.error(error);
        }
    };
      
  
    const handleRevokePrivileges = async () => {
        const removeAdminRole = httpsCallable<AdminRoleRequest, AdminRoleResponse>(functions, 'removeAdminRole');
        try {
          const result = await removeAdminRole({ email });
          console.log(result.data.message);
          onCloseRevoke();
        } catch (error) {
          console.error(error);
        }
    };
  
  return (
    <ChakraProvider theme={theme}>

      <link href="https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&display=swap" rel="stylesheet"></link>

      <Center minH="100vh" bgColor={background}>
        <Container centerContent>

        <Heading mb={10} textAlign={'center'}>Admin Privileges Management</Heading>

          <Box 
            shadow="md" 
            borderRadius="lg" 
            minH="200px"
            rounded={'lg'}
            boxShadow={'lg'}
            p={9}
            bg={secondary}
            w={'32vw'}
            minW="30vw"
            alignSelf={'center'}
            borderColor={primary}
            borderWidth="3px"
          >    

            <Text textAlign={'center'} mb={4} color={secondaryText}>Manage Administrative Permissions:</Text>

            {/* MESSAGE TO SEND TO YOUR USERS */}
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mt={4}
              placeholder="Enter user email to modify privileges..."
              sx={{
                  '::placeholder': {
                  color: 'gray.400', 
                  },
              }}
              required 
              bg="white" 
              borderColor={primary}
              color={primary}
              _hover={{ borderColor: primary, borderWidth: "2px" }}
              _focus={{ borderColor: accent, borderWidth: '3px' }}
            />
            
            <HStack justifyContent={'center'} mt={5}>
                {/* GRANT ACTION */}
                <Flex justifyContent="center" mt={4}>
                <Button  
                    onClick={onOpenGrant}
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
                    Grant
                </Button>
                </Flex>

                {/* REVOKE ACTION */}
                <Flex justifyContent="center" mt={4}>
                <Button  
                    onClick={onOpenRevoke}
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
                    Revoke
                </Button>
                </Flex>
            </HStack>

            {/* HANDLE ERRORS IF USER IS ALREADY GRANTED PERMISSIONS OR HAS NONE  */}

            {/* GRANTING MODAL */}
            <Modal isOpen={isOpenGrant} onClose={onCloseGrant}>
              <ModalOverlay />
              <ModalContent 
                bgColor={secondary} 
                borderColor={primary} 
                borderWidth="3px" 
                minW="40vw"
              >
                <ModalHeader color={secondaryText}>Grant Privileges Confirmation</ModalHeader>
                <ModalCloseButton />
                <ModalBody color={secondaryText}>
                  Are you sure you want to grant this user administrative privileges?
                </ModalBody>
                <ModalFooter>
                  <Button 
                    mr={3} 
                    onClick={handleGrantPrivileges}
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
                    Yes, Grant Admin Privelages
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onCloseGrant}
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

            {/* REVOCATION MODAL */}
            <Modal isOpen={isOpenRevoke} onClose={onCloseRevoke}>
              <ModalOverlay />
              <ModalContent 
                bgColor={secondary} 
                borderColor={primary} 
                borderWidth="3px" 
                minW="40vw"
              >
                <ModalHeader color={secondaryText}>Revoke Privileges Confirmation</ModalHeader>
                <ModalCloseButton />
                <ModalBody color={secondaryText}>
                  Are you sure you want to revoke this users administrative privileges?
                </ModalBody>
                <ModalFooter>
                  <Button 
                    mr={3} 
                    onClick={handleRevokePrivileges}
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
                    Yes, Revoke Admin Privelages
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onCloseRevoke}
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

export default GrantAdmin;
