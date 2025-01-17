'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useReadContract } from 'wagmi'
import { useState, useEffect } from 'react'
import { holesky, anvil } from 'wagmi/chains'
import { counterCallerABI } from '../contracts/CounterCallerABI'

const COPROCESSOR_CALLER_ADDRESS = process.env.NEXT_PUBLIC_COPROCESSOR_CALLER_ADDRESS

type Event = {
  newCount: number;
  timestamp: number;
  txHash: string;
  type: 'counter' | 'result';
  output?: string;
}

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: generatedHash, error: writeError, isPending, isError, writeContract  } = useWriteContract()
  const [waitingForEvent, setWaitingForEvent] = useState(false);
  const receipt = useWaitForTransactionReceipt({ hash: generatedHash });

  useEffect(() => {
    if (receipt.isSuccess) {
      setWaitingForEvent(true);
    }
  }, [receipt.isSuccess]);

  const [events, setEvents] = useState<Event[]>([])

  const { data: counterValue, refetch: refreshCounter, isLoading } = useReadContract({
    address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
    abi: counterCallerABI,
    functionName: 'get',
  })

  useWatchContractEvent({
    address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
    abi: counterCallerABI,
    eventName: 'ResultReceived',
    onLogs: async (logs) => {
      logs.forEach(log => {
        const output = log.args.output as `0x${string}`;
        const outputValue = parseInt(output, 16);
        const newEvent: Event = {
          type: 'result',
          timestamp: Date.now(),
          txHash: log.transactionHash,
          newCount: 0,
          output: outputValue.toString()
        }
        setEvents(prev => [...prev, newEvent])
      })
      await refreshCounter()
      setWaitingForEvent(false);
    },
    poll: true,
    pollingInterval: 1000,
    chainId: holesky.id,
  })

  const handleIncrement = async () => {
    
    if (!COPROCESSOR_CALLER_ADDRESS) {
      console.error('Coprocessor caller address not configured')
      return
    }

    try {
      await refreshCounter()
    } catch (error) {
      console.error('Failed to refresh counter:', error)
    }

    const jsonInput = {
      method: "increment",
      counter: Number(counterValue || 0)
    }

    const inputData = '0x' + Buffer.from(JSON.stringify(jsonInput)).toString('hex')
    
    writeContract({
      address: COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
      abi: counterCallerABI,
      functionName: 'runExecution',
      args: [inputData as `0x${string}`]
    })
  }

  return (
    <>
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

      <div>
        <h2>Counter: {isLoading ? 'Loading...' : (counterValue ? Number(counterValue) : '-')}</h2>
        <button onClick={async () => {
          await refreshCounter()
        }}>
          Refresh
        </button>
        <button 
          type="button" 
          onClick={handleIncrement}
          disabled={isPending || receipt.isLoading || waitingForEvent}
        >
          {isPending ? 'Waiting for wallet...' : 
           receipt.isLoading ? 'Processing transaction...' : 
           waitingForEvent ? 'Waiting for result...' :
           'Increment'}
        </button>
      </div>

      <div>
        {receipt.isSuccess && (
          <div>
            <strong>Transaction confirmed! {waitingForEvent ? 'Waiting for result...' : 'Counter incremented 🎉'}</strong> 
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
        <h2>Emitted Events</h2>
        {events.filter(e => e.type === 'result').length === 0 ? (
          <p>No events yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Time</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {[...events]
                .filter(e => e.type === 'result')
                .reverse()
                .map((event, index) => (
                  <tr key={`${event.txHash}-${index}`}>
                    <td>{event.output}</td>
                    <td>{new Date(event.timestamp).toLocaleString()}</td>
                    <td>{event.txHash}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default App
