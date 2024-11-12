'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
// import { sendTransaction } from 'viem/actions';
import ABI_BETTING from '@/components/abi';

const CONTRACT_ADDRESS = '0xD6302d3bDDb59Da0217B4A04778d3642A379dA0E';
const SEPOLIA_CHAIN_ID = 11155111;

export default function BetPage() {
  const pathname = usePathname();
  const id = pathname?.split('/').pop();
  const { user, authenticated, ready, login , sendTransaction } = usePrivy();
  const { wallets } = useWallets();
//   @ts-ignore 
  const [betDetails, setBetDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Current user:", user?.twitter?.username);
    console.log("Bet details:", betDetails);
    console.log("Is Opponent:", user?.twitter?.username === betDetails?.opponentTwitter);
  }, [user, betDetails]);

  useEffect(() => {
    async function fetchBetDetails() {
      if (!id || wallets.length === 0) {
        console.log("No bet ID or wallet not found");
        return;
      }

      try {
        const wallet = wallets[0];
        await wallet.switchChain(SEPOLIA_CHAIN_ID);
        const provider = await wallet.getEthersProvider();
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI_BETTING, signer);

        const bet = await contract.bets(id);
        console.log("Raw bet data:", bet);

        if (bet.creator === ethers.constants.AddressZero) {
          throw new Error("Bet not found");
        }

        const formattedBet = {
          creator: bet.creator,
          opponent: bet.opponent,
          moderator: bet.moderator,
          amount: ethers.utils.formatEther(bet.amount),
          description: bet.description,
          deadline: new Date(bet.deadline.toNumber() * 1000).toLocaleString(),
          status: bet.status,
          creatorTwitter: bet.creatorTwitter,
          opponentTwitter: bet.opponentTwitter,
          moderatorTwitter: bet.moderatorTwitter,
          winner: bet.winner
        };

        console.log("Formatted bet:", formattedBet);
        setBetDetails(formattedBet);
// @ts-ignore 
      } catch (error: any) {
        console.error('Error details:', error);
        setError(error.message || "Failed to fetch bet details");
      } finally {
        setLoading(false);
      }
    }

    if (ready && wallets.length > 0) {
      fetchBetDetails();
    }
  }, [id, ready, wallets]);

  const handleAcceptBet = async () => {
    try {
      const wallet = wallets[0];
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI_BETTING, signer);

      // Populate the transaction
      const tx = await contract.populateTransaction.acceptBet(id);

      // Send transaction with the bet amount as value
      const result = await sendTransaction({
        to: CONTRACT_ADDRESS,
        data: tx.data,
        value: ethers.utils.parseEther(betDetails.amount).toHexString(),
      });

      console.log("Accept bet transaction:", result);
      // Refresh bet details after acceptance
      window.location.reload();
    } catch (error) {
      console.error("Error accepting bet:", error);
      setError("Failed to accept bet");
    }
  };

  const handleConfirmModerator = async () => {
    try {
      const wallet = wallets[0];
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI_BETTING, signer);

      // Populate the transaction
      const tx = await contract.populateTransaction.confirmModerator(id);

      // Send transaction
      const result = await sendTransaction({
        to: CONTRACT_ADDRESS,
        data: tx.data,
      });

      console.log("Confirm moderator transaction:", result);
      // Refresh bet details after confirmation
      window.location.reload();
    } catch (error) {
      console.error("Error confirming moderator:", error);
      setError("Failed to confirm as moderator");
    }
  };



  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8 ">P2P Betting</h1>
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Twitter
        </button>
      </div>
    );
  }

  if (!ready || loading) {
    return <div className="p-8 text-center">Loading bet details...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  // Check if user is authorized (opponent or moderator)
  const isOpponent = user?.twitter?.username === betDetails?.opponentTwitter;
  const isModerator = user?.twitter?.username === betDetails?.moderatorTwitter;
  const isAuthorized = isOpponent || isModerator;

//   const getBetStatus = (status: number) => {
//     switch (status) {
//       case 0:
//         return "Created";
//       case 1:
//         return "Accepted by Opponent";
//       case 2:
//         return "Active";
//       default:
//         return "Unknown";
//     }
//   };

  return (
    <div className="max-w-md mx-auto p-8">

      <></>

      {!isAuthorized ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Unauthorized Access</p>
          <p>You are not the opponent ({betDetails?.opponentTwitter}) or moderator ({betDetails?.moderatorTwitter})</p>
        </div>
      ) : (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p className="font-bold">Authorized Access</p>
          <p>{isOpponent ? "You are the opponent" : "You are the moderator"}</p>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Bet Details</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Creator</h3>
          <p className="text-lg">@{betDetails.creatorTwitter}</p>
          <p className="text-xs text-gray-400">{betDetails.creator}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Opponent</h3>
          <p className="text-lg">@{betDetails.opponentTwitter}</p>
          <p className="text-xs text-gray-400">{betDetails.opponent}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Moderator</h3>
          <p className="text-lg">@{betDetails.moderatorTwitter}</p>
          <p className="text-xs text-gray-400">{betDetails.moderator}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Amount</h3>
          <p className="text-lg">{betDetails.amount} ETH</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-lg">{betDetails.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
          <p className="text-lg">{betDetails.deadline}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="text-lg">{betDetails.status}</p>
        </div>
      </div>

      <div className="mt-6">
        {isOpponent && (
          <button 
            onClick={handleAcceptBet}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-2"
          >
            Accept Bet ({betDetails.amount} ETH)
          </button>
        )}

        {isModerator && (
          <button 
            onClick={handleConfirmModerator}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
          >
            Confirm as Moderator
          </button>
        )}

        {!isOpponent && !isModerator && (
          <p className="text-red-500">
            Not authorized to take actions
          </p>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Your Twitter: {user?.twitter?.username}</p>
        <p>Opponent Twitter: {betDetails?.opponentTwitter}</p>
        <p>Moderator Twitter: {betDetails?.moderatorTwitter}</p>
        <p>Bet Status: {betDetails?.status}</p>
        <p>Is Authorized: {isAuthorized ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
