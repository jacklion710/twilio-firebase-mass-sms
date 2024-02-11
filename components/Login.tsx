import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
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
  
      const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSignIn();
        }
      };
  
      const handleSignInWithEmail = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // Assuming successful sign-in redirects to the home page or user dashboard.
          window.location.href = '/';
        } catch (err) {
          setError("There was an issue with logging in. Please check your credentials and try again.");
          toast({
            title: "Authentication Error",
            description: "There was an issue with logging in. Please check your credentials and try again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }; 
    
      const handleSignIn = async () => {
        try {
          await handleSignInWithEmail();
        } catch (err) {
          const friendlyErrorMessage = "There was an issue with logging in. Please check your credentials and try again.";
          setError(friendlyErrorMessage);
          console.error(err);
        }
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
                        placeholder="Enter your email"
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

function toast(arg0: { title: string; description: string; status: string; duration: number; isClosable: boolean; }) {
  throw new Error('Function not implemented.');
}
    