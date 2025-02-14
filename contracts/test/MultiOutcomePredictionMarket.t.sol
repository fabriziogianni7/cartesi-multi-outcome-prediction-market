// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import {MultiOutcomePredictionMarket} from "../src/MultiOutcomePredictionMarket.sol";

contract MultiOutcomePredictionMarketTest is Test {
    MultiOutcomePredictionMarket public market;
    address public constant TASK_ISSUER_ADDRESS = address(0x1);
    bytes32 public constant MACHINE_HASH = bytes32(uint256(1));

    function setUp() public {
        market = new MultiOutcomePredictionMarket(TASK_ISSUER_ADDRESS, MACHINE_HASH);
    }

    function testCreateMarket() public {
        string memory question = "Who will win the Formula 1 championship?";
        // uint256 deadline = block.timestamp + 1000; // in the future
        uint256[] memory initialShares = new uint256[](3);
        initialShares[0] = 10;
        initialShares[1] = 10;
        initialShares[2] = 10;
        uint256 liquidity = 100;
        string[] memory outcomes = new string[](3);
        outcomes[0] = "Lewis Hamilton";
        outcomes[1] = "Max Verstappen";
        outcomes[2] = "Charles Leclerc";

        market.createMarket(question, initialShares, liquidity, outcomes);

        // Verify market creation
        assertEq(market.s_marketId(), 1, "Market ID should be 1");

        MultiOutcomePredictionMarket.Market memory createdMarket = market.getMarket(1);

        assertEq(createdMarket.question, question, "Question should match");
        assertEq(createdMarket.liquidity, liquidity, "Liquidity should match");
        assertEq(createdMarket.circulatingShares.length, 3, "Should have 3 outcomes");
        assertEq(createdMarket.outcomes.length, 3, "Should have 3 outcomes");
        assertEq(createdMarket.isResolved, false, "Market should not be resolved");
    }

    function testPrepareRun() public {
        // Create a market first
        testCreateMarket();

        uint256 outcomeIndex = 1; // Index for "Max Verstappen"
        uint256 nShares = 5;

        // Mock the coprocessor response if necessary
        vm.mockCall(address(market), abi.encodeWithSignature("runExecution(bytes)"), abi.encode());

        market.prepareCallAndRunExecution(1, outcomeIndex, nShares);
    }
}
