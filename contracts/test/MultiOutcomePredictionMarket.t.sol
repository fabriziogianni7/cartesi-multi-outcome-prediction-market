// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import {MultiOutcomePredictionMarket} from "../src/MultiOutcomePredictionMarket.sol";
import {MockMultiOutcomePredictionMarket} from "./mock/MockMultiOutcomePredictionMarket.sol";

contract MultiOutcomePredictionMarketTest is Test {
    MockMultiOutcomePredictionMarket public market;
    address public constant TASK_ISSUER_ADDRESS = address(0x1);
    bytes32 public constant MACHINE_HASH = bytes32(uint256(1));
    address public user = address(0x1234); // Example user address

    function setUp() public {
        market = new MockMultiOutcomePredictionMarket(TASK_ISSUER_ADDRESS, MACHINE_HASH);
        // Assuming we're always testing with user as the sender for simplicity
        vm.startPrank(user);
    }

    function testCreateMarket() public {
        string memory question = "Who will win the Formula 1 championship?";
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
        for (uint256 i = 0; i < createdMarket.probabilities.length; i++) {
            assertEq(createdMarket.probabilities[i], 333333, "Probability should be evenly distributed");
        }
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

    function testHandleNotice() public {
        testCreateMarket();

        uint256[] memory probabilities = new uint256[](3);
        probabilities[0] = 300000;
        probabilities[1] = 400000;
        probabilities[2] = 300000;
        uint256 outcomeIndex = 1;
        uint256 totalPrice = 50; // Example price
        uint256 nShares = 5;
        uint256 marketId = 1;
        address userAddress = user;

        bytes memory notice = abi.encode(probabilities, outcomeIndex, totalPrice, nShares, marketId, userAddress);
        bytes32 inputPayloadHash = keccak256("test_hash");

        // Call the mock function to handle notice
        market.mockHandleNotice(inputPayloadHash, notice);

        // Check if shares were updated correctly
        assertEq(market.s_userShares(userAddress, marketId, outcomeIndex), nShares, "User should have shares");

        // Check if market properties were updated
        MultiOutcomePredictionMarket.Market memory updatedMarket = market.getMarket(marketId);
        assertEq(updatedMarket.liquidity, 150, "Liquidity should have increased");
        assertEq(updatedMarket.circulatingShares[outcomeIndex], 15, "Shares should have increased");
        assertEq(
            updatedMarket.probabilities[outcomeIndex], probabilities[outcomeIndex], "Probability should be updated"
        );
    }

    function tearDown() public {
        vm.stopPrank();
    }
}
