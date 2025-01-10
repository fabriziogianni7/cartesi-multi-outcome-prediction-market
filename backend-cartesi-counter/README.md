# Simple Counter Backend - JavaScript DApp Template

This is a template for JavaScript Cartesi DApps. It uses node to execute the backend application. This backend is meant to be run by the operator in the Eigenlayer network.

The application entrypoint is the `src/index.js` file.

## Steps to run locally
### Install cartesi-coprocessor cli 
```
cargo install cartesi-coprocessor
```

### Build and register the backend machine
**NOTE**: Before this step, you need to have the co-processor devnet env running(refer parent readme) AND you need a [w3 storage account](https://web3.storage/) to upload the machine.
```
cartesi-coprocessor register --email <w3 storage account email>
```

### Import the machine for local operator
```
curl -X POST -F file=@output.car http://127.0.0.1:5001/api/v0/dag/import
```
Operator will start downloading the dapp-machine. Hit `/ensure` endpoint to check the status. You can start sending inputs when status is ready.
```
curl -X POST "http://127.0.0.1:3034/ensure/$CID/$MACHINE_HASH/$SIZE"
```

Set env variables(if missing in above step)
```
CID=$(cat output.cid) 
SIZE=$(cat output.size)
MACHINE_HASH=$(xxd -p .cartesi/image/hash | tr -d '\n')
```
Once machine is downloaded, deploy the caller contract and start interacting with frontend.


## Sample input JSON
The backend receives hex encoded json input. A sample input payload is shown below:
```
{
  "method":"increment",
  "counter": 3
}
```
The backend logic will increment the counter by 1 and emit a notice with value 4.