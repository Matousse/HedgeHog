import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import Home from './pages/index';

// Configurer le client React Query
const queryClient = new QueryClient();

// Configurer wagmi avec connectkit
const config = createConfig(
  getDefaultConfig({
    // ID de votre projet Infura ou Alchemy
    appName: 'HedgeHog',
    // Vous pouvez ajouter votre clé API ici
    // infuraId: process.env.INFURA_ID,
    // alchemyId: process.env.ALCHEMY_ID,
    // Utiliser un ID temporaire pour le développement
    walletConnectProjectId: 'temporary-project-id-for-development',
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  }),
);

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Home />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
