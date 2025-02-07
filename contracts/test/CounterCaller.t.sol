// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {CounterCaller} from "../src/CounterCaller.sol";

contract CounterCallerTest is Test {
    CounterCaller public counter;
    address mockTaskIssuer = address(0x1);
    bytes32 mockMachineHash = bytes32(uint256(1));

    event ResultReceived(bytes32 indexed inputPayloadHash, bytes output);

    function setUp() public {
        counter = new CounterCaller(mockTaskIssuer, mockMachineHash);
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

        // Create a mock inputPayloadHash
        bytes32 mockInputPayloadHash = bytes32(uint256(123));

        // Expect the ResultReceived event to be emitted with both inputPayloadHash and notice
        vm.expectEmit(true, true, true, true);
        emit ResultReceived(mockInputPayloadHash, notice);

        // Since handleNotice is internal, we need to call it through a mock contract
        MockCounterCaller mockCounter = new MockCounterCaller(mockTaskIssuer, mockMachineHash);
        mockCounter.exposedHandleNotice(mockInputPayloadHash, notice);

        assertEq(mockCounter.count(), 42, "Count should be updated to 42");
    }
}

// Helper contract to test internal functions
contract MockCounterCaller is CounterCaller {
    constructor(address _taskIssuerAddress, bytes32 _machineHash) CounterCaller(_taskIssuerAddress, _machineHash) {}

    function exposedHandleNotice(bytes32 inputPayloadHash, bytes memory notice) public {
        handleNotice(inputPayloadHash, notice);
    }
}
