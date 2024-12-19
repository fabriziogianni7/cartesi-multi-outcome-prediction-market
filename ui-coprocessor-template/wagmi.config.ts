import { defineConfig, loadEnv } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { counterABI } from './src/contracts/counterabi'

export default defineConfig(() => {

  if (process.env.NODE_ENV === 'development') {
    const env = loadEnv({
      mode: process.env.NODE_ENV,
      envDir: process.cwd(),
    })
    return {
      // dev specific config
      out: 'src/generated.ts',
      contracts: [{
        abi: counterABI,
        address: env.NEXT_PUBLIC_COPROCESSOR_CALLER_ADDRESS as `0x${string}`,
        name: 'Counter',
      },],
      plugins: [
        react(),
      ],
    }
  } else {
    return {
      // production specific config
      out: 'src/generated.ts',
      contracts: [],
      plugins: [],
    }
  }
})