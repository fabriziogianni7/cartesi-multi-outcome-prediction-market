// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./CoprocessorAdapter.sol";

contract CounterCaller is CoprocessorAdapter {
    uint256 public count;
    event ResultReceived(bytes output);

    constructor(address _coprocessorAddress, bytes32 _machineHash) CoprocessorAdapter(_coprocessorAddress, _machineHash) {}

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }

    function handleNotice(bytes memory notice) internal override {
        uint256 value;
        assembly {
            value := mload(add(notice, 32))
        }
        count = value;
        emit ResultReceived(notice);
    }

    function get() external view returns (uint256) {
        return count;
    }

}