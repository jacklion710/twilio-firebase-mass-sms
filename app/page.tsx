"use client";
import React, { useState, useEffect } from 'react';
import Login from '@/components/Login';
import MassSMS from '@/components/MassSMS';
import { ChakraProvider } from '@chakra-ui/react';
import { auth } from '@/utils/firebase';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
// Import User type from Firebase if not already imported

function Home() {
  // Specify the user state can be User type or null
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser is User | null, which matches the state type
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <ChakraProvider>
      {user ? <MassSMS /> : <Login />}
    </ChakraProvider>
  );
}

export default Home;
