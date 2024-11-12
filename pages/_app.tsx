import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';
import { defineChain } from 'viem';

// Define Rootstock Mainnet
export const rootstockMainnet = defineChain({
  id: 30,
  name: 'Rootstock Mainnet',
  network: 'rootstock-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock BTC',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    default: { name: 'RSK Explorer', url: 'https://explorer.rootstock.io' },
  },
});

// Define Rootstock Testnet
export const rootstockTestnet = defineChain({
  id: 31,
  name: 'Rootstock Testnet',
  network: 'rootstock-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Rootstock BTC',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: { name: 'RSK Testnet Explorer', url: 'https://explorer.testnet.rootstock.io' },
  },
});

// Define Citrea Testnet
export const citreaTestnet = defineChain({
  id: 5115,
  name: 'Citrea Testnet',
  network: 'citrea-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Citrea BTC',
    symbol: 'cBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.citrea.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz' },
  },
});

export const metadata = {
  title: 'P2P Betting App',
  description: 'Decentralized peer-to-peer betting with Twitter integration',
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="text-black">
      <PrivyProvider
        appId="cm3b5kzu20171ed9vnqf218ad"
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: '',
          },
          loginMethods: ['twitter', 'wallet'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          defaultChain: citreaTestnet,
          supportedChains: [
            sepolia,
            rootstockMainnet,
            rootstockTestnet,
            citreaTestnet
          ]
        }}
      >
        <Component {...pageProps} />
      </PrivyProvider>
    </div>
  );
}