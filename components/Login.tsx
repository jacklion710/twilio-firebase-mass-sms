import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link as ChakraLink,
    Button,
    Heading,
    Text,
    ChakraProvider,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react';
  import { 
    ViewIcon, 
    ViewOffIcon 
  } from '@chakra-ui/icons';
  import { 
    useState, 
    useEffect 
  } from 'react';
  import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
  } from 'firebase/auth';
  import { 
    auth, 
    db, 
    getDocs, 
    updateDoc, 
    doc, 
    collection, 
    query, 
    where 
  } from '@/utils/firebase';
  import dynamic from "next/dynamic";
  import { COLORS } from '@/utils/palette';
  
  const { 
    text, 
    secondaryText, 
    background, 
    secondary, 
    buttonCol, 
    primary, 
    accent,
    grey 
  } = COLORS;
    
  function Login() {
      const [email, setEmail] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [password, setPassword] = useState('');
      const [passwordError, setPasswordError] = useState('');
      const [error, setError] = useState<string | null>(null);
      const [rememberMe, setRememberMe] = useState(false);
      
      const flexVariants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        hidden: { opacity: 0, scale: 0.8 }
      };
    
      const stackVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.5,
            duration: 0.5
          }
        }
      };
  
      const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSignIn();
        }
      };
  
      const handleSignInWithEmail = async (signInEmail: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, signInEmail, password);
          const user = userCredential.user;
  
          localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
      
          // Update the user document in Firestore to ensure it matches the auth email
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            email: signInEmail // Update the email field in Firestore
          });
      
          // Redirect to home page if email is verified
          if (user.emailVerified) {
            window.location.href = '/'; // Redirect to home page
          } else {
            setError("Please verify your email address before logging in.");
          }
        } catch (err) {
          const friendlyErrorMessage = "There was an issue with logging in. Please check your credentials and try again.";
          setError(friendlyErrorMessage);
        }
      };
  
      const handleSignInWithUsername = async (username: string, password: string) => {
        try {
          // Query Firestore for the user document with the matching username
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('username', '==', username));
          const querySnapshot = await getDocs(q);
  
          localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
      
          if (querySnapshot.empty) {
            throw new Error('Username does not exist');
          }
      
          // Assuming usernames are unique, there should only be one match
          const userDoc = querySnapshot.docs[0];
          const signInEmail = userDoc.data().email;
      
          // Continue with the log-in process using the email
          return handleSignInWithEmail(signInEmail, password);
        } catch (err) {
          setError("There was an issue with logging in with the username. Please check your credentials and try again.");
        }
      };    
    
      const handleSignIn = async () => {
        try {
          // Determine if the input is a username or an email
          const isUsername = !email.includes('@');
          if (isUsername) {
            await handleSignInWithUsername(email, password);
          } else {
            await handleSignInWithEmail(email, password);
          }
        } catch (err) {
          const friendlyErrorMessage = "There was an issue with logging in. Please check your credentials and try again.";
          setError(friendlyErrorMessage);
          console.error(err);
        }
      }; 
          
      // Handle Remember Me checkbox change
      const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
      };
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user && localStorage.getItem('rememberMe') === 'true') {
            console.log('User is signed in:', user);
            window.location.href = '/auth/Profile'; 
          } else {
            console.log('User is logged out or not remembered');
          }
        });
    
        return () => unsubscribe();
      }, []);
    
      return (
        <ChakraProvider>
          <Flex direction="column" minHeight="100vh" style={{ borderBottom: 'solid rgba(168, 186, 203, 1.0)' }}>
          <Flex
            align={'center'}
            justify={'center'}
            pb="150px"
            bg={background}
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100vw', 
              maxWidth: '100%',
              minHeight: '100vh',
              overflowX: 'hidden',
            }}
          >
              <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6} py={6}>
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'} textAlign={'center'} color={text} fontFamily="'Kdam Thmor Pro', sans-serif">
                    Log In
                  </Heading>
                  <Text textAlign={'center'} fontSize={'lg'} color={text} fontFamily="'Kdam Thmor Pro', sans-serif">
                    Log in as an admin (recommended) if your rules restrict users from listing document data.
                  </Text>
                </Stack>
                <Box
                  rounded={'lg'}
                  boxShadow={'lg'}
                  p={9}
                  bg={secondary}
                  w={'32vw'}
                  alignSelf={'center'}
                  borderColor={primary}
                  borderWidth="3px"
                  minWidth={"350px"}
                >
                  <Stack spacing={4}>
                    <FormControl id="email" isRequired>
                      <FormLabel color={secondaryText} fontFamily="'Kdam Thmor Pro', sans-serif">Username or Email Address</FormLabel>
                      <Input
                        placeholder="Enter your username or email"
                        sx={{
                            '::placeholder': {
                            color: 'gray.400', 
                            },
                        }}
                        bg={background}
                        color={text}
                        _hover={{ borderColor: primary, borderWidth: "2px" }}
                        _focus={{ borderColor: accent, borderWidth: '3px' }}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        onKeyDown={handleKeyPress}
                        borderColor="black"
                        fontFamily="'Kdam Thmor Pro', sans-serif"
                      />
                    </FormControl> 
    
                    <FormControl id="password" isRequired>
                      <FormLabel color={secondaryText} fontFamily="'Kdam Thmor Pro', sans-serif">Password</FormLabel>
                      <InputGroup>
                        <Input 
                          fontFamily="'Kdam Thmor Pro', sans-serif"
                          bg={background} 
                          color={text}
                          placeholder="Enter your password"
                          _hover={{ borderColor: primary, borderWidth: "2px" }}
                          _focus={{ borderColor: accent, borderWidth: '3px' }}
                          sx={{
                              '::placeholder': {
                              color: 'gray.400', 
                              },
                          }}
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          type={showPassword ? "text" : "password"} 
                          onKeyDown={handleKeyPress}
                          borderColor="black"
                        />
                        <InputRightElement h={'full'}>
                          <Button
                            color={secondary}
                            variant={'ghost'}
                            _hover={{ borderColor: primary, borderWidth: "2px" }}
                            onClick={() => setShowPassword((showPassword) => !showPassword)}>
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {passwordError && <Text color="red.500">{passwordError}</Text>} {/* Show password error here */}
                    </FormControl>
    
                    <Stack spacing={10}>
    
                      {error && <Text textAlign='center' color="red.500">{error}</Text>}
                      <Flex justifyContent="center" mt={4}>
                        <Button
                          onClick={handleSignIn}
                          loadingText="Submitting"
                          size="lg"
                          color={secondaryText}
                          _hover={{
                            bg: `${accent}80`,
                            transform: 'scale(1.05)'
                          }}
                          _active={{
                            bg: `${accent}80`
                          }}
                          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
                          border="2px solid"
                          borderColor={grey}
                          backgroundColor={`${buttonCol}80`}
                          transition="all 0.3s ease-in-out"
                          style={{ borderRadius: '20px' }}
                          w="10vw"
                          minW="150px"
                          fontFamily="'Kdam Thmor Pro', sans-serif"
                        >
                          Log In
                        </Button>
                      </Flex>
  
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
          </Flex>
          </Flex>
        </ChakraProvider>
      );
    }
    
    export default dynamic(() => Promise.resolve(Login), { ssr: false });
    