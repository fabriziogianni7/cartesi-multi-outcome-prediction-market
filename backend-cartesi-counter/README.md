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

## Sample input JSON
The backend receives hex encoded json input. A sample input payload is shown below:
```
{
  "method":"increment",
  "counter": 3
}
```
The backend logic will increment the counter by 1 and emit a notice with value 4.