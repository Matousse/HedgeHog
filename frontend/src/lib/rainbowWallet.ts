import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'viem/chains';

const projectId = 'YOUR_PROJECT_ID'; // Replace with your WalletConnect project ID

export const wagmiConfig = getDefaultConfig({
  appName: 'HedgeHog',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
});

export { RainbowKitProvider, darkTheme };
