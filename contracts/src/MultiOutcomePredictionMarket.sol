// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CoprocessorAdapter} from "coprocessor-base-contract/CoprocessorAdapter.sol";
/**
 * Frontend will call:
 * - read predicate to get the market predicate (like who will win Formula 1 championship?), shares and probability
 * - read outcomeArray to get the outcomes, shares and probability
 * - runExecution to buy new shares --> it will pass the outcome index and number of shares + correct stable coin amount
 * - fetch SharesBought to get which user has x shares
 */

contract MultiOutcomePredictionMarket is CoprocessorAdapter {
    // the prediction
    bytes public predicate;
    Outcome[] public outcomeArray;
    address public erc20Token; // token to pay the shares

    struct Outcome {
        uint256 id;
        uint256 name;
        uint256 shares; // number of shares of this outcome
        uint256 probability;
    }

    uint256 public count;

    event SharesBought(address indexed user, uint256 indexed nOfShares); // needs to be emitted when the user succesfully buy shares
    event ResultReceived(bytes32 indexed inputPayloadHash, bytes output);

    // initial values
    constructor(address _taskIssuerAddress, bytes32 _machineHash, bytes memory _question, Outcome[] memory _outcomes)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }

    // this function should
    // a. buy new shares for the user
    // b. update probability (sovrascrivere outcomeArray?)
    function handleNotice(bytes32 inputPayloadHash, bytes memory notice) internal override {
        require(notice.length >= 32, "Invalid notice length");
        count = abi.decode(notice, (uint256));
        emit ResultReceived(inputPayloadHash, notice);
    }

    function get() external view returns (uint256) {
        return count;
    }
}
