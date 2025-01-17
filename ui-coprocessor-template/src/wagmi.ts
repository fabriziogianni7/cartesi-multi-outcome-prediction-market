import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { holesky, anvil } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [holesky, anvil],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    syncConnectedChain: true, 
    ssr: true,
    transports: {
      [holesky.id]: http('https://ethereum-holesky-rpc.publicnode.com'),
      [anvil.id]: http('http://127.0.0.1:8545'),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
