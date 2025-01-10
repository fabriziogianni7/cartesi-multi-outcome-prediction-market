export const counterCallerABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_coprocessorAddress",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_machineHash",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "payloadHash",
				"type": "bytes32"
			}
		],
		"name": "ComputationNotFound",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"name": "InsufficientFunds",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "length",
				"type": "uint256"
			}
		],
		"name": "InvalidOutputLength",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "selector",
				"type": "bytes4"
			},
			{
				"internalType": "bytes4",
				"name": "expected",
				"type": "bytes4"
			}
		],
		"name": "InvalidOutputSelector",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "current",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "expected",
				"type": "bytes32"
			}
		],
		"name": "MachineHashMismatch",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "caller",
				"type": "address"
			}
		],
		"name": "UnauthorizedCaller",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "output",
				"type": "bytes"
			}
		],
		"name": "ResultReceived",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "computationSent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "coprocessor",
		"outputs": [
			{
				"internalType": "contract ICoprocessor",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_machineHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_payloadHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes[]",
				"name": "outputs",
				"type": "bytes[]"
			}
		],
		"name": "coprocessorCallbackOutputsOnly",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count",
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
		"inputs": [],
		"name": "get",
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
		"inputs": [],
		"name": "machineHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "input",
				"type": "bytes"
			}
		],
		"name": "runExecution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const;