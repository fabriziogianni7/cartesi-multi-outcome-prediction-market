// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {MultiOutcomePredictionMarket} from "../../src/MultiOutcomePredictionMarket.sol";

contract MockMultiOutcomePredictionMarket is MultiOutcomePredictionMarket {
    // Expose handleNotice as public for testing
    function mockHandleNotice(bytes32 inputPayloadHash, bytes memory notice) public {
        handleNotice(inputPayloadHash, notice);
    }

    // Constructor to match the parent contract
    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        MultiOutcomePredictionMarket(_taskIssuerAddress, _machineHash)
    {}
}
