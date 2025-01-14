// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "../lib/forge-std/src/Test.sol";
import {CounterCaller} from "../src/CounterCaller.sol";

contract CounterCallerTest is Test {
    CounterCaller public counter;
    address mockCoprocessor = address(0x1);
    bytes32 mockMachineHash = bytes32(uint256(1));

    event ResultReceived(bytes output);

    function setUp() public {
        counter = new CounterCaller(mockCoprocessor, mockMachineHash);
    }

    function testInitialCount() external view {
        assertEq(counter.count(), 0, "Initial count should be 0");
    }

    function testGet() external view {
        assertEq(counter.get(), 0, "Get should return current count");
    }

    function testHandleNotice() public {
        // Create a mock notice with value 42
        bytes memory notice = new bytes(32);
        assembly {
            mstore(add(notice, 32), 42)
        }

        // Expect the ResultReceived event to be emitted
        vm.expectEmit(true, true, true, true);
        emit ResultReceived(notice);

        // Since handleNotice is internal, we need to call it through a mock contract
        MockCounterCaller mockCounter = new MockCounterCaller(mockCoprocessor, mockMachineHash);
        mockCounter.exposedHandleNotice(notice);

        assertEq(mockCounter.count(), 42, "Count should be updated to 42");
    }
}

// Helper contract to test internal functions
contract MockCounterCaller is CounterCaller {
    constructor(address _coprocessorAddress, bytes32 _machineHash) 
        CounterCaller(_coprocessorAddress, _machineHash) {}

    function exposedHandleNotice(bytes memory notice) public {
        handleNotice(notice);
    }
}
