// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {CounterCaller} from "../src/CounterCaller.sol";

contract DeployCounterCaller is Script {
    function run() external returns (CounterCaller) {
        // These values should be replaced with your actual values
        address coprocessorAddress = vm.envAddress("COPROCESSOR_ADDRESS");
        bytes32 machineHash = vm.envBytes32("MACHINE_HASH");

        vm.startBroadcast();
        CounterCaller counter = new CounterCaller(
            coprocessorAddress,
            machineHash
        );
        vm.stopBroadcast();

        return counter;
    }
}
