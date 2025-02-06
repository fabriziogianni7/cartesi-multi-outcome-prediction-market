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

Below steps will assume that you've cloned this repo to your local machine and you already have Docker Desktop, Cartesi CLI and Foundry installed.

### 1. Install `cartesi-coprocessor` CLI

cartesi-coprocessor CLI will help us build, publish, deploy and run local environment with ease.
```shell
cargo install cartesi-coprocessor
```

### 2. Run the Coprocessor devnet environment

Before running the dApp, you need to have the Coprocessor devnet environment running. It will spin up a local operator in devnet mode that will host the dApp backend.


On your terminal, start the devnet environment:
```shell
cartesi-coprocessor start-devnet
```
You can open Docker Desktop to see the running containers and corresponding logs. DApp logs are visible in the `cartesi-coprocessor-operator` container.

To turn down the environment later, run:
```shell
cartesi-coprocessor stop-devnet
```

### 3. Build and Publish Backend Cartesi Machine

Open another terminal tab and `cd` into the desired backend folder [Python](./backend-cartesi-counter-py/), [JavaScript](./backend-cartesi-counter-js/), [Rust](./backend-cartesi-counter-rs/), and [Go](./backend-cartesi-counter-go/).

Run the publish command for devnet:
```shell
cartesi-coprocessor publish --network devnet
```

At this point, you should see the `machine hash` by running:
```shell
cartesi-coprocessor address-book
```

### 4. Deploy `CounterCaller` Smart Contract

To deploy the contract, `cd` into the `contracts` folder and run the following command:

```shell
cartesi-coprocessor deploy --contract-name CounterCaller --network devnet --constructor-args <task_issuer_address> <machine_hash>
```
**NOTE:** You can get the `task_issuer_address` and `machine_hash` from the `address-book` command as shown in the previous step.

Copy the deployed contract address you get from above command and save it for later use in the frontend interaction.

### 5. Run Frontend Application

Navigate to the frontend folder and follow steps in the [README](./ui-coprocessor-template/README.md)

The frontend will be available at http://localhost:3000

## License

MIT

