// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Counter {
    uint256 public count;

    // Add event for increment
    event CounterIncremented(uint256 newCount);

    // Function to get the current count
    function get() public view returns (uint256) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
        emit CounterIncremented(count);
    }

    // Add coprocessor function that calls increment
    function callCoprocessor(bytes calldata /* input */) external {
        // For this simple example, we ignore the input and just increment
        inc();
    }
}
