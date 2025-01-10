# Simple Counter Template[JS/TS] - Cartesi Coprocessor 

This is an end-to-end template that demonstrates a simple counter running on Cartesi co-processor's infrastructure.

## How does it work?
A user can connect their wallet to the frontend and increment the counter. The frontend will send a transaction to the caller contract, which will then call the co-processor to increment the counter. The co-processor will then return the result to the frontend, which will be reflected in the UI.
[#TODO - ADD IMAGE]

## Project Structure

- `backend-cartesi-counter/` - Counter dApp implementation in JavaScript
- `contracts/` - Smart contract for issuing task to the co-processor
- `ui-coprocessor-template/` - Frontend React application

## Setup Instructions

### 1. Run Cartesi-Coprocessor devnet env

Clone and spin up the Cartesi Coprocessor repository:
```
git clone https://github.com/cartesi/cartesi-coprocessor.git

cd cartesi-coprocessor

git submodule update --init --recursive

docker compose -f docker-compose-devnet.yaml up --wait -d
```

To turn down the environment, run:
```
docker compose -f docker-compose-devnet.yaml down -v
```


### 2. Build and Deploy Backend Cartesi Machine

Navigate to the backend folder and follow steps in the [README](./backend-cartesi-counter/README.md).

### 3. Deploy CounterCaller Smart Contract

- Initiate a Foundry project with base contract [CoprocessorAdapter](https://github.com/Mugen-Builders/coprocessor-base-contract).
- Wrap the base contract with a CounterCaller implmentation from [contracts](./contracts) folder. 
- Deploy CounterCaller contract to the devnet.

NOTE: You'll need the machine hash output and co-processor proxy address(task_issuer) for the smart contract deployment. Navigate to `config-devnet.toml` file inside Cartesi-Coprocessor repo to find `task_issuer` address. 

### 4. Run Frontend Application

Navigate to the frontend folder and follow steps in the [README](./ui-coprocessor-template/README.md)

The frontend will be available at http://localhost:3000



## Usage

1. Connect your wallet to the local network (chain ID: 31337)
2. Use the UI to increment the counter
3. Transactions will be processed by the Cartesi machine and results reflected in the UI

## License

MIT

