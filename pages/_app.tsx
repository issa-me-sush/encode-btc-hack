import type { AppProps } from 'next/app';
// import Script from 'next/script';
import '@/styles/globals.css';
import {PrivyProvider} from '@privy-io/react-auth';
import { sepolia} from 'viem/chains'

export const metadata = {
  title: 'P2P Betting App',
  description: 'Decentralized peer-to-peer betting with Twitter integration',
};


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    
<PrivyProvider
      appId="cm3b5kzu20171ed9vnqf218ad"
      config={{
       
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '',
        },
        loginMethods: ['twitter','wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: sepolia,
        supportedChains: [sepolia]
      }}
    >
      
        <Component {...pageProps} />
     
      </PrivyProvider>

    </>
  );
}