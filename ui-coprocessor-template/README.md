# Simple Counter - UI Template
This is a simple counter UI template that uses Cartesi co-processor's onchain and offchain infrastructure.


It's a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

## Before running

1. Deploy the co-processor local contracts.
2. Setup the Co-processor caller address in the `.env.local` file.
```
NEXT_PUBLIC_COPROCESSOR_ADDRESS=
```

## To run locally
```
pnpm install
pnpm dev
```