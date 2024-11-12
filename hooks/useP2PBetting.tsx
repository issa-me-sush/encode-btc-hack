'use client';

import { useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ABI_BETTING from '../components/abi';
const CONTRACT_ADDRESS = '0x43362f83B2f2caCE6d69D108627866115a2f8A4c';
const ABI = ABI_BETTING;

export function useP2PBetting() {
  const { user, sendTransaction } = usePrivy();

  const getWalletAddress = async (username: string) => {
    try {
      // First get Twitter user data
      const twitterRes = await fetch(`/api/get-twitter-user?username=${username}`);
      const twitterData = await twitterRes.json();
      console.log("twitter data " , twitterData)
   let jsondata
      if (!twitterData.data) {
       jsondata = {
        "twitterId": "1582316359",        
        "name": "Allen",      
        "username": "allenjosephaj"
      }
      }else{
        jsondata= {
        twitterId: twitterData.data.userId,
        name: twitterData.data.name,
        username: twitterData.data.username
        }
      }
      console.log(jsondata)
      // Then get/create wallet using Twitter data
      const walletRes = await fetch('/api/get-wallet-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsondata)
      });

      const walletData = await walletRes.json();
      return walletData.walletAddress;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      throw error;
    }
  };

  const createBet = useCallback(async (
    opponentUsername: string,
    moderatorUsername: string,
    description: string,
    amount: string,
    deadline: number
  ) => {
    if (!user?.wallet) return;

    try {
      // Get wallet addresses for opponent and moderator
      const opponentWallet = await getWalletAddress(opponentUsername);
      // const moderatorWallet = await getWalletAddress(moderatorUsername);
      const moderatorWallet = "0x53B5E8597E4BF8878b0909562D09463e55595CaE";

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const creatorTwitter = user.twitter?.username || '';

      const tx = await contract.populateTransaction.createBet(
        opponentWallet,                // _expectedOpponent
        moderatorWallet,               // _expectedModerator
        opponentUsername,              // _opponentTwitter
        moderatorUsername,             // _moderatorTwitter
        description,                   // _description
        deadline,                      // _deadline
        creatorTwitter                 // _creatorTwitter
      );

      const result = await sendTransaction({
        to: CONTRACT_ADDRESS,
        data: tx.data,
        value: ethers.utils.parseEther(amount).toHexString(),
      });

      return result;
    } catch (error) {
      console.error('Error creating bet:', error);
      throw error;
    }
  }, [user, sendTransaction]);

  return { createBet };
}