import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { RainbowKitProvider, darkTheme } from './lib/rainbowWallet'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './lib/rainbowWallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './lib/apollo'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider theme={darkTheme()}>
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ApolloProvider>
  </StrictMode>,
)
