# Simple Counter Template - Cartesi Coprocessor 

This repo contains an end-to-end template that demonstrates a simple counter running on Cartesi Co-processor's stack. The backend of the Coprocessor dApp is implemented in 4 different languages: [JavaScript](./backend-cartesi-counter-js/), [Python](./backend-cartesi-counter-py/), [Rust](./backend-cartesi-counter-rs/), and [Go](./backend-cartesi-counter-go/). You can pick any language and extend the template to your own Coprocessor logic.

The UI template is implemented with [React](./ui-coprocessor-template/) and [Wagmi](https://wagmi.sh/) starter kit.

## How does it work?
A user can connect their wallet to the frontend and increment the counter. The frontend will send a transaction to the caller contract, which will then call the co-processor to increment the counter. The co-processor will then return the result to the on-chain contract, which will be reflected on the UI.

A data flow diagram is provided below to help you understand the flow of data between the frontend, the on-chain contract, and the co-processor.

![Counter Data Flow Diagram](./counter-dfd.jpg)

## Project Structure

- `backend-cartesi-counter-js/` - Backend implementation in JavaScript.
- `backend-cartesi-counter-py/` - Backend implementation in Python.
- `backend-cartesi-counter-rs/` - Backend implementation in Rust.
- `backend-cartesi-counter-go/` - Backend implementation in Go.
- `contracts/` - Smart contract with custom dApp logic and function to issue task to the co-processor.
- `ui-coprocessor-template/` - Frontend React application for reading the counter value and incrementing it.

## Setup Instructions for Devnet

### 1. Run Cartesi-Coprocessor devnet environment

Before running the dApp, you need to have the Coprocessor devnet environment running. It will spin up a local operator in devnet mode that will host the dApp backend.

Clone and navigate to the repository:
```shell
git clone https://github.com/zippiehq/cartesi-coprocessor && cd cartesi-coprocessor
```

Initialize all submodules:
```shell
git submodule update --init --recursive
```

Start the devnet environment:
```shell
docker compose -f docker-compose-devnet.yaml up --wait -d
```

To turn down the environment later, run:
```shell
docker compose -f docker-compose-devnet.yaml down -v
```


### 2. Build and Deploy Backend Cartesi Machine

Navigate to the desired backend folder and follow steps in the dedicated README files [Python](./backend-cartesi-counter-py/README.md), [JavaScript](./backend-cartesi-counter-js/README.md), [Rust](./backend-cartesi-counter-rs/README.md), and [Go](./backend-cartesi-counter-go/README.md).

### 3. Deploy CounterCaller Smart Contract


To deploy the contract, cd into the `contracts` folder and run the following command:

```shell
$ forge create --broadcast \
    --rpc-url <your_rpc_url> \
    --private-key <your_private_key> \
    ./src/CounterCaller.sol:CounterCaller \
    --constructor-args <coprocessor_address> <machine_hash>
```

Example values for local development:
- RPC URL: http://127.0.0.1:8545
- Coprocessor Address: It's the `task_issuer` that you can get from [config-devnet.toml](https://github.com/zippiehq/cartesi-coprocessor/blob/dbcc51edb7c8edf0ff1d385ed3f36c5f73230ec5/config-devnet.toml#L8)
- Machine Hash: Get from cartesi-backend deployment output

NOTE: Copy the deployed contract address you get from above command and save it for later use in the frontend interaction.

### 4. Run Frontend Application

Navigate to the frontend folder and follow steps in the [README](./ui-coprocessor-template/README.md)

The frontend will be available at http://localhost:3000


## License

MIT

