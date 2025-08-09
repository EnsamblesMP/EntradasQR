'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { system } from './system'
import type { ThemeProviderProps } from 'next-themes'
import { Toaster } from './toaster'

export function Provider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  )
}