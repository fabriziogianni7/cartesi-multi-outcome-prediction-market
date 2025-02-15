export const MultiOutcomePredictionMarketAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const marketId = process.env.NEXT_PUBLIC_MARKET_ID;

export const MultiOutcomePredictionMarket = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_taskIssuerAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_machineHash",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "computationSent",
        "inputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "coprocessorCallbackOutputsOnly",
        "inputs": [
            {
                "name": "_machineHash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_payloadHash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "outputs",
                "type": "bytes[]",
                "internalType": "bytes[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createMarket",
        "inputs": [
            {
                "name": "_question",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_initialShares",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "_liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_outcomes",
                "type": "string[]",
                "internalType": "string[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getMarket",
        "inputs": [
            {
                "name": "marketId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "question",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "circulatingShares",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "outcomes",
                "type": "string[]",
                "internalType": "string[]"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "isResolved",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "probabilities",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getUserShares",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "marketId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "shares",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "machineHash",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "prepareCallAndRunExecution",
        "inputs": [
            {
                "name": "_marketId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "outcomeIndex",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "nShares",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "runExecution",
        "inputs": [
            {
                "name": "input",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "s_marketId",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_markets",
        "inputs": [
            {
                "name": "marketId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "question",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "isResolved",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_userShares",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "marketId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "ownedShares",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "taskIssuer",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ITaskIssuer"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "MarketCreated",
        "inputs": [
            {
                "name": "marketId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "question",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ResultReceived",
        "inputs": [
            {
                "name": "inputPayloadHash",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "output",
                "type": "bytes",
                "indexed": false,
                "internalType": "bytes"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "ComputationNotFound",
        "inputs": [
            {
                "name": "payloadHash",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ]
    },
    {
        "type": "error",
        "name": "InsufficientFunds",
        "inputs": [
            {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "balance",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidOutputLength",
        "inputs": [
            {
                "name": "length",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidOutputSelector",
        "inputs": [
            {
                "name": "selector",
                "type": "bytes4",
                "internalType": "bytes4"
            },
            {
                "name": "expected",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ]
    },
    {
        "type": "error",
        "name": "MachineHashMismatch",
        "inputs": [
            {
                "name": "current",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "expected",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ]
    },
    {
        "type": "error",
        "name": "UnauthorizedCaller",
        "inputs": [
            {
                "name": "caller",
                "type": "address",
                "internalType": "address"
            }
        ]
    }
] as const;