'use client';

import { useState } from 'react';
import { useP2PBetting } from '@/hooks/useP2PBetting';
import { ethers } from 'ethers';
import { TBTCBridge } from './TBTCBridge';
import ABI_BETTING from '../components/abi';

const CONTRACT_ADDRESS = '0xD6302d3bDDb59Da0217B4A04778d3642A379dA0E';
const ABI = ABI_BETTING;
type BetStep = 'initial' | 'details' | 'moderator' | 'review' | 'share';

export function BettingInterface() {
  const { createBet } = useP2PBetting();
  const [activeTab, setActiveTab] = useState('betting');
  const [currentStep, setCurrentStep] = useState<BetStep>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [betId, setBetId] = useState<string | null>(null);
  
  // Prediction Market State
  const [predictionData, setPredictionData] = useState({
    question: '',
    probability: 50,
    stake: ''
  });

  const [betData, setBetData] = useState({
    opponent: '',
    moderator: '',
    amount: '',
    description: '',
    deadline: ''
  });

  const handleCreateBet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const deadlineDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
      
      const tx = await createBet(
        betData.opponent,
        betData.moderator,
        betData.description,
        "0.001",
        Math.floor(deadlineDate / 1000)
      );

      // Wait for transaction confirmation
      const receipt = await tx;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      // Find the BetCreated event
      const betCreatedEvent = receipt?.logs.find(log => 
        log.topics[0] === contract.interface.getEventTopic('BetCreated')
      );
      
      if (betCreatedEvent) {
        const parsedLog = contract.interface.parseLog(betCreatedEvent);
        const newBetId = parsedLog.args.betId.toString();
        setBetId(newBetId);
        console.log("Generated betId:", newBetId);
      } else {
        throw new Error("Failed to get betId from event");
      }
      
      setCurrentStep('share');
  //  @ts-ignore 
    } catch (err: any) {
      setError(err.message || 'Failed to create bet');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInitialStep = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <h2 className="text-2xl font-bold text-center ">Create a New Bet</h2>
      <button
        onClick={() => setCurrentStep('details')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
      >
        Start New Bet
      </button>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentStep('initial')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Bet Details</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opponent&apos;s Username
          </label>
          <input
            type="text"
            value={betData.opponent}
            onChange={(e) => setBetData({ ...betData, opponent: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <input
            type="number"
            value={betData.amount}
            onChange={(e) => setBetData({ ...betData, amount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="0.1"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={betData.description}
            onChange={(e) => setBetData({ ...betData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="What's the bet about?"
            rows={3}
          />
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('moderator')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
      >
        Next: Choose Moderator
      </button>
    </div>
  );

  const renderModeratorStep = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentStep('details')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Choose Moderator</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Moderator&apos;s Username
        </label>
        <input
          type="text"
          value={betData.moderator}
          onChange={(e) => setBetData({ ...betData, moderator: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
          placeholder="username"
        />
      </div>

      <button
        onClick={() => setCurrentStep('review')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
      >
        Next: Review Bet
      </button>
    </div>
  );

  const renderReviewStep = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentStep('moderator')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Review Bet</h2>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Betting Against</h3>
          <p className="text-lg">@{betData.opponent}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Amount</h3>
          <p className="text-lg">{betData.amount} ETH</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-lg">{betData.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Moderator</h3>
          <p className="text-lg">@{betData.moderator}</p>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleCreateBet}
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Creating Bet...' : 'Create & Share Bet'}
      </button>
    </div>
  );

  const renderShareStep = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Bet Created!</h2>
        <p className="text-gray-600 mb-8">Share this bet with @{betData.opponent} and @{betData.moderator}</p>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              const text = `🎲 I just created a bet worth ${betData.amount} ETH!\n\nJoin as opponent: @${betData.opponent}\nModerator: @${betData.moderator}\n\nAccept here: ${window.location.origin}/bet/${betId}`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
            }}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Share on Twitter
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/bet/${betId}`);
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );

  const renderPredictionMarket = () => (
    <div className="max-w-md mx-auto space-y-6 p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Prediction Market</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            type="text"
            value={predictionData.question}
            onChange={(e) => setPredictionData({ ...predictionData, question: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Will BTC reach $100k by 2024?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Probability ({predictionData.probability}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={predictionData.probability}
            onChange={(e) => setPredictionData({ ...predictionData, probability: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stake Amount (ETH)
          </label>
          <input
            type="number"
            value={predictionData.stake}
            onChange={(e) => setPredictionData({ ...predictionData, stake: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.1"
            step="0.01"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => console.log('Yes prediction:', predictionData)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Yes
          </button>
          <button
            onClick={() => console.log('No prediction:', predictionData)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            No
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Market Info</h3>
        <div className="space-y-2 text-sm text-blue-600">
          <p>Total Volume: 125.5 ETH</p>
          <p>Current Yes Price: {predictionData.probability}%</p>
          <p>Current No Price: {100 - predictionData.probability}%</p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'initial':
        return renderInitialStep();
      case 'details':
        return renderDetailsStep();
      case 'moderator':
        return renderModeratorStep();
      case 'review':
        return renderReviewStep();
      case 'share':
        return renderShareStep();
      default:
        return renderInitialStep();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('betting')}
            className={`py-4 px-1 border-b-2 ${
              activeTab === 'betting'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            P2P Betting
          </button>
          <button
            onClick={() => setActiveTab('bridge')}
            className={`py-4 px-1 border-b-2 ${
              activeTab === 'bridge'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            tBTC Bridge
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`py-4 px-1 border-b-2 ${
              activeTab === 'prediction'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Prediction Market
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'betting' && renderCurrentStep()}
        {activeTab === 'bridge' && <TBTCBridge />}
        {activeTab === 'prediction' && renderPredictionMarket()}
      </div>
    </div>
  );
}