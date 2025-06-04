import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private renderErrorDisplay() {
    return (
      <Box
        p={5}
        m={5}
        textAlign="center"
        bg="red.50"
        color="red.800"
        borderWidth="1px"
        borderColor="red.200"
        borderRadius="md"
        _dark={{
          bg: 'red.900',
          color: 'red.100',
          borderColor: 'red.700'
        }}
      >
        <Heading as="h2" size="md" mb={2}>
          Algo salió mal
        </Heading>
        <Text mb={4}>
          {this.state.error?.message || 'Ocurrió un error inesperado'}
        </Text>
        <Button 
          onClick={() => window.location.reload()}
          colorScheme="red"
          size="sm"
        >
          Recargar Página
        </Button>
      </Box>
    );
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorDisplay();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
