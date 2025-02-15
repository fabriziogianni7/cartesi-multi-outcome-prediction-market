// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CoprocessorAdapter} from "coprocessor-base-contract/CoprocessorAdapter.sol";

/**
 * (very) basic contract to create and resolve multi-outcome prediction markets
 * uses cartesi CoprocessorAdapter contract to send requests to Cartesi Coprocessors
 * The coprocessor uses logaritmic score market rule to calculate the price of n shares and recalculate the probabilities of the outcomes
 */
contract MultiOutcomePredictionMarket is CoprocessorAdapter {
    struct Market {
        string question;
        uint256[] circulatingShares;
        string[] outcomes;
        uint256 liquidity;
        bool isResolved;
        uint256[] probabilities;
    }

    uint256 public s_marketId;

    mapping(uint256 marketId => Market market) public s_markets;
    mapping(address user => mapping(uint256 marketId => uint256[] ownedShares)) public s_userShares;

    // event SharesBought(address indexed user, uint256 indexed nOfShares); // needs to be emitted when the user succesfully buy shares
    event ResultReceived(bytes32 indexed inputPayloadHash, bytes output);
    event MarketCreated(uint256 marketId, string question);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    /// @notice format data before calling runExecution
    function prepareCallAndRunExecution(uint256 _marketId, uint256 outcomeIndex, uint256 nShares) public {
        uint256[] memory quantities = s_markets[_marketId].circulatingShares;
        uint256 liquidity = s_markets[_marketId].liquidity;

        bytes memory input = abi.encode(quantities, liquidity, outcomeIndex, nShares, _marketId, msg.sender);
        this.runExecution(input);
    }

    function runExecution(bytes calldata input) public {
        // todo make sure only this contract can call this function permissioned
        callCoprocessor(input);
    }

    function createMarket(
        string memory _question,
        uint256[] memory _initialShares,
        uint256 _liquidity,
        string[] memory _outcomes
    ) public {
        // require(s_markets[s_marketId].isResolved == false, "Market already resolved");
        // require(s_markets[s_marketId].deadline > block.timestamp, "Market deadline has passed");

        s_marketId++;
        uint256[] memory _probabilities = new uint256[](_outcomes.length);
        uint256 baseProb = 1e6 / _outcomes.length;
        for (uint256 i; i < _outcomes.length; i++) {
            _probabilities[i] = baseProb;
        }

        s_markets[s_marketId] = Market({
            question: _question,
            circulatingShares: _initialShares,
            liquidity: _liquidity,
            isResolved: false,
            outcomes: _outcomes,
            probabilities: _probabilities
        });

        emit MarketCreated(s_marketId, _question);
    }

    /// @notice update market and user shares
    function handleNotice(bytes32 inputPayloadHash, bytes memory notice) internal override {
        require(notice.length >= 32, "Invalid notice length");
        (
            uint256[] memory probabilities,
            uint256 outcome_index,
            uint256 total_price_for_specific_outcome_converted,
            uint256 n_shares,
            uint256 market_id,
            address user_address
        ) = abi.decode(notice, (uint256[], uint256, uint256, uint256, uint256, address));

        if (s_userShares[user_address][market_id].length == 0) {
            s_userShares[user_address][market_id] = new uint256[](probabilities.length);
        }
        s_userShares[user_address][market_id][outcome_index] += n_shares; // good luck with it!

        s_markets[market_id].liquidity += total_price_for_specific_outcome_converted;
        s_markets[market_id].circulatingShares[outcome_index] += n_shares;
        s_markets[market_id].probabilities = probabilities;

        //todo user should pay here!!

        emit ResultReceived(inputPayloadHash, notice);
    }

    function getMarket(uint256 marketId) public view returns (string memory question, uint256[] memory circulatingShares, string[] memory outcomes, uint256 liquidity, bool isResolved, uint256[] memory probabilities) {
        return (s_markets[marketId].question,
            s_markets[marketId].circulatingShares,
            s_markets[marketId].outcomes,
            s_markets[marketId].liquidity,
            s_markets[marketId].isResolved,
            s_markets[marketId].probabilities
        );
    }

    function getUserShares(address user, uint256 marketId) public view returns (uint256[] memory shares) {
        return s_userShares[user][marketId];
    }

}
