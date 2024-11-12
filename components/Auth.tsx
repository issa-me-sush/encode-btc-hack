'use client';

import { usePrivy } from '@privy-io/react-auth';
import { BettingInterface } from './BettingInterface';

export function Auth() {
  const { login, authenticated } = usePrivy();

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">P2P Betting</h1>
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Twitter
        </button>
      </div>
    );
  }

  return <BettingInterface />;
}