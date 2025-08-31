'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { system } from './system'
import type { ThemeProviderProps } from 'next-themes'
import { ToasterPortal } from "./ToasterPortal"

export function Provider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
      <ToasterPortal />
    </ChakraProvider>
  )
}