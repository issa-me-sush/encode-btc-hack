const ABI_BETTING = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			}
		],
		"name": "BetAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "BetCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "expectedOpponent",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "expectedModerator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "opponentTwitter",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "moderatorTwitter",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "BetResolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "moderator",
				"type": "address"
			}
		],
		"name": "ModeratorConfirmed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "acceptBet",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "betCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bets",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "moderator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "enum P2PBetting.BetStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "creatorTwitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "opponentTwitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "moderatorTwitter",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "expectedOpponent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "expectedModerator",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "cancelBet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "confirmModerator",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_expectedOpponent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_expectedModerator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_opponentTwitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_moderatorTwitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_creatorTwitter",
				"type": "string"
			}
		],
		"name": "createBet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "getBetInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "opponent",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "moderator",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "enum P2PBetting.BetStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct P2PBetting.BetInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "getBetParticipants",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "creatorTwitter",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "opponentTwitter",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "moderatorTwitter",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "expectedOpponent",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "expectedModerator",
						"type": "address"
					}
				],
				"internalType": "struct P2PBetting.BetParticipants",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "resolveBet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export default ABI_BETTING;