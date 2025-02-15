import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { anvil } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import 'dotenv'

export function getConfig() {
  return createConfig({
    chains: [anvil],
    connectors: [
      // injected(),
      // coinbaseWallet(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'default-project-id'
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    syncConnectedChain: true,
    ssr: true,
    transports: {
      [anvil.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
