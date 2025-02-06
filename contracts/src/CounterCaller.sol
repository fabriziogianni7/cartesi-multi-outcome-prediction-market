// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";

contract CounterCaller is CoprocessorAdapter {
    uint256 public count;
    event ResultReceived(bytes output);

    constructor(address _taskIssuerAddress, bytes32 _machineHash) CoprocessorAdapter(_taskIssuerAddress, _machineHash) {}

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }

    function handleNotice(bytes memory notice) internal override {
        require(notice.length >= 32, "Invalid notice length");
        count = abi.decode(notice, (uint256));
        emit ResultReceived(notice);
    }

    function get() external view returns (uint256) {
        return count;
    }

}