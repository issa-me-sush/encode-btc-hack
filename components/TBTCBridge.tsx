'use client';

import { useState } from 'react';
import { ethers } from "ethers";
import dynamic from 'next/dynamic';

// Dynamically import TBTC to avoid SSR issues
const TBTCModule = dynamic(
  () => import('@keep-network/tbtc-v2.ts').then(mod => {
    const TBTCComponent = () => {
      // Use mod.TBTC here
      return null; // or your actual JSX
    };
    return { default: TBTCComponent };
  }),
  { ssr: false }
);

export function TBTCBridge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeBridge = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the TBTC module
      const TBTC = (await TBTCModule) as any;

      // Initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize SDK for testnet (Sepolia)
      const sdk = await TBTC.default.initializeSepolia(provider);

      // Initialize for Arbitrum
      const arbProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARBITRUM_RPC);
      await sdk.initializeCrossChain("Arbitrum", signer);

      // You can now use sdk.deposits, sdk.redemptions, etc.
      console.log("Bridge initialized successfully");

    } catch (err) {
      console.error(err);
      setError('Failed to initialize bridge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">tBTC Cross-Chain Bridge</h2>
      
      <div className="space-y-4">
        <button
          onClick={initializeBridge}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          {loading ? 'Initializing...' : 'Initialize Bridge'}
        </button>

        {error && (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Bridge Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cross-chain BTC transfers</li>
            <li>Ethereum ↔ Arbitrum bridge support</li>
            <li>Testnet (Sepolia) support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}