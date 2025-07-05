import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'viem/chains';
import { defineChain } from 'viem';

// Define Flow EVM chain
const flowEVM = defineChain({
  id: 747,
  name: 'Flow EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flow EVM Explorer',
      url: 'https://evm.flowscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5022
    }
  }
});

// Use a valid project ID or make it optional for development
const projectId = '2f5a2fd928dcab7596d65a164bfa8d87'; // Fallback to a generic one for development

export const wagmiConfig = getDefaultConfig({
  appName: 'HedgeHog',
  projectId,
  chains: [flowEVM, mainnet, polygon, optimism, arbitrum, base, zora],
  transports: {
    [flowEVM.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
  ssr: false, // Important for client-side rendering
});

export { RainbowKitProvider, darkTheme };
