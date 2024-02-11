import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Center,
  Heading,
  Text,
  theme as baseTheme,
  extendTheme,
} from '@chakra-ui/react';
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

function IsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      setIsLoading(true);
      // Check if there is a current user before attempting to get ID token result
      if (auth.currentUser) {
        auth.currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            // Check if the user has the admin custom claim
            setIsAdmin(!!idTokenResult.claims.admin);
          })
          .catch((error) => {
            console.error("Error fetching user claims", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    };
  
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAdminRole();
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });
  
    // Cleanup subscription
    return () => unsubscribe();
  }, []);  

  return (
    <ChakraProvider theme={theme}>
      <Center minH="100vh" bgColor={COLORS.background}>
        <Container centerContent>
          <Heading mb={10} textAlign={'center'}>Are You an Admin?</Heading>
          <Box shadow="md" borderRadius="lg" minH="200px" rounded={'lg'} boxShadow={'lg'} p={9} bg={COLORS.secondary} w={'32vw'} minW="30vw" alignSelf={'center'} borderColor={COLORS.primary} borderWidth="3px">
            {isLoading ? (
              <Text fontSize="2xl" fontWeight={'bold'} color={secondaryText} textAlign={'center'} mt={8}>Loading...</Text>
            ) : (
              <Text fontSize="2xl" fontWeight={'bold'} color={secondaryText} textAlign={'center'} mt={8}>{isAdmin ? "Yes, you are an admin." : "No, you are not an admin."}</Text>
            )}
          </Box>
        </Container>
      </Center>
    </ChakraProvider>
  );
}

export default IsAdmin;
