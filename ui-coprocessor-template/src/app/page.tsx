'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useReadContract } from 'wagmi'
import { useState, useEffect } from 'react'
import { counterABI } from '../contracts/counterabi'
import { anvil } from 'wagmi/chains'

const COPROCESSOR_CALLER_ADDRESS = process.env.NEXT_PUBLIC_COPROCESSOR_ADDRESS

type Event = {
  newCount: number;
  timestamp: number;
  txHash: string;
}

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: generatedHash, error: writeError, isPending, isError, writeContract  } = useWriteContract()
  /*
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash: generatedHash as `0x${string}`, retryCount: 10 });
  */
  const receipt = useWaitForTransactionReceipt({ hash: generatedHash });

  const [eventValue, setEventValue] = useState<number | null>(null)
  const [shouldFetch, setShouldFetch] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  const { data: counterValue, refetch: refreshCounter, isLoading } = useReadContract({
    address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
    abi: [{
      inputs: [],
      name: "get",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    }],
    functionName: 'get',
    query: {
      enabled: shouldFetch
    }
  })

  useWatchContractEvent({
    address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
    abi: [{
      type: 'event',
      name: 'CounterIncremented',
      inputs: [
        {
          indexed: false,
          type: 'uint256',
          name: 'newCount'
        }
      ]
    }],
    eventName: 'CounterIncremented',
    onLogs: (logs) => {
      console.log('Event watcher configuration:', {
        address: COPROCESSOR_CALLER_ADDRESS,
        eventName: 'CounterIncremented'
      });
      console.log('Raw event logs:', logs);
      
      logs.forEach(log => {
        console.log('Processing log:', log);
        console.log('Log args:', log.args);
        
        const newEvent = {
          newCount: Number(log.args.newCount),
          timestamp: Date.now(),
          txHash: log.transactionHash
        }
        console.log('Created event:', newEvent);
        setEvents(prev => [...prev, newEvent])
      })
    },
    poll: true,
    pollingInterval: 1000,
    chainId: anvil.id,
  })

  useEffect(() => {
    console.log('Component mounted, COPROCESSOR_CALLER_ADDRESS:', COPROCESSOR_CALLER_ADDRESS);
  }, []);

  console.log('Current events in state:', events);

  const handleIncrement = async () => {
    console.log('COPROCESSOR_CALLER_ADDRESS', COPROCESSOR_CALLER_ADDRESS)
    if (!COPROCESSOR_CALLER_ADDRESS) {
      console.error('Coprocessor caller address not configured')
      return
    }

    const inputData = '0x00000001'
    
    writeContract({
      address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
      abi: [{
        name: 'callCoprocessor',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'input', type: 'bytes' }],
        outputs: [],
      }],
      functionName: 'callCoprocessor',
      args: [inputData],
    })
  }

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
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

      <div>
        <h2>Connect</h2>
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

      <div>
        <h2>Send Input</h2>
        <button 
          type="button" 
          onClick={handleIncrement}
          disabled={isPending || receipt.isLoading}
        >
          {isPending ? 'Waiting for wallet...' : 
           receipt.isLoading ? 'Processing...' : 
           'Increment'}
        </button>
        {/* generatedHash && <div>Transaction Hash: {generatedHash}</div> */}
        {receipt.isSuccess && (
          <div>
            <strong>🎉 Transaction successful!</strong> 
            <br />
            transaction hash: {receipt.data.transactionHash}
            <br />
            block number: {receipt.data.blockNumber.toString()}
            <br />
          </div>
        )}
        {isError && <div>Error: {writeError?.message}</div>}
      </div>

      <div>
        <h2>Read Output</h2>
        <button onClick={async () => {
          setShouldFetch(true)
          await refreshCounter()
        }}>
          Fetch Counter
        </button>
        <div>Current Value: {isLoading ? 'Loading...' : (counterValue ? Number(counterValue) : '-')}</div>
      </div>

      <div>
        <h2>Emitted Events</h2>
        {events.length === 0 ? (
          <p>No events yet</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={`${event.txHash}-${index}`}>
                <div>Count: {event.newCount}</div>
                <div>Time: {new Date(event.timestamp).toLocaleString()}</div>
                <div>Tx: {event.txHash}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App
