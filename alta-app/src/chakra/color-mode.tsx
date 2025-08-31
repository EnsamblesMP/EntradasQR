import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import * as React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useColorMode } from './use-color-mode'
import { ThemeProviderProps } from 'next-themes'

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
  )
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <FiMoon /> : <FiSun />
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props: React.ComponentProps<typeof IconButton>, ref: React.Ref<HTMLButtonElement>) {
    const { toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize='8' />}>
        <IconButton
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    )
  }
);

export const LightMode = React.forwardRef(
  function LightMode(props: React.ComponentProps<typeof Span>, ref: React.Ref<HTMLSpanElement>) {
    return (
      <Span
        color='fg'
        display='contents'
        className='chakra-theme light'
        colorPalette='gray'
        colorScheme='light'
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef(
  function DarkMode(props: React.ComponentProps<typeof Span>, ref: React.Ref<HTMLSpanElement>) {
    return (
      <Span
        color='fg'
        display='contents'
        className='chakra-theme dark'
        colorPalette='gray'
        colorScheme='dark'
        ref={ref}
        {...props}
      />
    );
  }
);
