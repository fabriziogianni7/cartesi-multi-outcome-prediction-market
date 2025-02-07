// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CoprocessorAdapter} from "coprocessor-base-contract/CoprocessorAdapter.sol";

contract CounterCaller is CoprocessorAdapter {
    uint256 public count;
    event ResultReceived(bytes32 indexed inputPayloadHash, bytes output);

    constructor(address _taskIssuerAddress, bytes32 _machineHash) CoprocessorAdapter(_taskIssuerAddress, _machineHash) {}

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }

    function handleNotice(bytes32 inputPayloadHash, bytes memory notice ) internal override {
        require(notice.length >= 32, "Invalid notice length");
        count = abi.decode(notice, (uint256));
        emit ResultReceived(inputPayloadHash, notice);
    }

    function get() external view returns (uint256) {
        return count;
    }
}
