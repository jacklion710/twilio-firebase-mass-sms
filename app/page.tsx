"use client";
import React from 'react';
import Login from '@/components/Login';
import MassSMS from '@/components/MassSMS';
import {
  ChakraProvider,
} from '@chakra-ui/react';

function Home() {

  return (
    <ChakraProvider>

      <MassSMS />

    </ChakraProvider>
  );
}

export default Home;
