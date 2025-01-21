'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBlockNumber } from 'wagmi'
import { useState, useEffect } from 'react'
import { counterCallerABI } from '../contracts-abi/CounterCallerABI'

const COPROCESSOR_CALLER_ADDRESS = process.env.NEXT_PUBLIC_COPROCESSOR_CALLER_ADDRESS

function App() {
  // Set variables to manage the account
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  // Set variable to subscribe to the block number
  const { data: blockNumber } = useBlockNumber({ watch: true })

  // State variables to track the transaction and result
  const [txBlockNumber, setTxBlockNumber] = useState<number | null>(null)
  const [blocksWatched, setBlocksWatched] = useState(0)
  const [waitingForResult, setWaitingForResult] = useState(false)
  const [processedTxHash, setProcessedTxHash] = useState<string | null>(null);
  const [previousCounterValue, setPreviousCounterValue] = useState<bigint | null>(null)

  // Hook to read the counter value from the contract
  const { data: counterValue, refetch: refreshCounter, isLoading } = useReadContract({
    address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
    abi: counterCallerABI,
    functionName: 'get',
  })

  // Hooks to write the contract call and wait for the transaction receipt
  const { data: generatedHash, error: writeError, isPending, isError, writeContract  } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: generatedHash });

  // Function to reset the states
  const resetStates = () => {
    setTxBlockNumber(null);
    setBlocksWatched(0);
    setWaitingForResult(false);
    setProcessedTxHash(receipt.data?.transactionHash || null);
  };

  // Start watching the blocks for coprocessor result
  useEffect(() => {
    // Only wait for result if we have a new successful tx receipt
    if (receipt.isSuccess && !waitingForResult && receipt.data?.transactionHash !== processedTxHash) {
      setWaitingForResult(true);
    }

    // Set state variables when we're waiting for a result
    if (receipt.isSuccess && blockNumber && !txBlockNumber && waitingForResult) {
      setTxBlockNumber(Number(receipt.data.blockNumber));
      setBlocksWatched(0);
      setPreviousCounterValue(counterValue ?? null);
    }

    if (txBlockNumber && blockNumber && waitingForResult) {
      const blocksSinceTx = Number(blockNumber) - txBlockNumber;
      setBlocksWatched(blocksSinceTx);

      if (counterValue !== previousCounterValue) {
        console.log('Counter changed, resetting states');
        resetStates();
        return;
      }

      // Keep a 5 blocks timeout to wait for the result
      if (blocksSinceTx <= 5) {
        refreshCounter().then(() => {
          if (counterValue !== previousCounterValue) {
            console.log('Counter changed after refresh, resetting states');
            resetStates();
            return;
          }
        });
      } else {
        console.log('Reached max blocks, resetting states');
        resetStates();
        return;
      }
    }
  }, [blockNumber, receipt.isSuccess, receipt.data?.blockNumber, receipt.data?.transactionHash, counterValue, waitingForResult]);


  const handleIncrement = async () => {
    // Validate configuration
    if (!COPROCESSOR_CALLER_ADDRESS) {
      console.error('Coprocessor caller address not configured')
      return
    }

    try {
      // Get latest counter value before proceeding
      await refreshCounter()
      
      // Prepare hex format input payload
      const payload = {
        method: "increment",
        counter: Number(counterValue || 0)
      }
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('hex')
      const inputData = `0x${encodedPayload}` as `0x${string}`
      
      // Execute contract call
      writeContract({
        address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
        abi: counterCallerABI,
        functionName: 'runExecution',
        args: [inputData]
      })
    } catch (error) {
      console.error('Failed to increment:', error)
      setWaitingForResult(false);
    }
  }

  // Handle state transition messages
  const getWaitingMessage = () => {
    if (isPending) return 'Waiting for wallet...';
    if (receipt.isLoading) return 'Processing transaction...';
    if (waitingForResult) {
      if (blocksWatched > 0) return `Waiting for result... (${blocksWatched}/5 blocks)`;
      return 'Waiting for result...';
    }
    return 'Increment';
  };

  return (
    <div>
      {/* Component: Connected Accounts */}
      <div>
        <div>
          account status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      {/* Component: Wallet Connectors */}
      <div>
        <h2>Connect wallet</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      {/* Component: Counter */}
      <div>
        <h1>Counter: {isLoading ? 'Loading...' : (counterValue ? Number(counterValue) : '-')}</h1>
        <button onClick={async () => {
          await refreshCounter()
        }}>
          Refresh
        </button>
        <button 
          type="button" 
            onClick={handleIncrement}
          disabled={isPending || receipt.isLoading || waitingForResult}
        >
          {getWaitingMessage()}
        </button>
      </div>

      {/* Component: Transaction Result */}
      <div>
        {receipt.isSuccess && (
          <div>
            <strong>Transaction confirmed! {waitingForResult ? 'Waiting for result from Coprocessor...' : 'Counter incremented successfully 🎉'}</strong> 
            <br />
            transaction hash: {receipt.data.transactionHash}
            <br />
            block number: {receipt.data.blockNumber.toString()}
            <br />
          </div>
        )}
        {isError && <div>Error: {writeError?.message}</div>}
      </div>

      {/* Component: Faucet link */}
      <div>
        <p> 
          Get testnet eth from <a href="https://cloud.google.com/application/web3/faucet/ethereum/holesky">Holesky Faucet</a>
        </p>
      </div>
    </div>
  )
}

export default App
