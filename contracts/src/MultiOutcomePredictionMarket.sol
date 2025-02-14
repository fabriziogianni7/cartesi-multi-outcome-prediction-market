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

    event SharesBought(address indexed user, uint256 indexed nOfShares); 
    event ResultReceived(bytes32 indexed inputPayloadHash, bytes output, bool success);
    event MarketCreated(uint marketId, string question, string[] outcomesOptions);
    event RequestCreated(uint requestId, uint deadline, bytes inputBytes, address requester);
    event RequestFullfilled(uint requestId);
    event SharesWithdrawn(address indexed user, uint256 indexed marketId);
    
    address public erc20Token; 
    address public keeper;
    uint256 public s_marketId;
    uint256 internal requestCounter;

    mapping(address user => mapping(uint marketId => uint[] ownedShares)) public s_userShares;
    mapping(uint marketId => uint256[] circulatingShares) public s_circulatingShares;
    mapping(uint marketId => Market market) public s_markets;
    mapping(uint requestId => Request request) public s_requests;
    mapping(uint marketId => uint[] winningOutcomes) public s_winningOutcomes;
    mapping(uint marketId => uint prizePool) public s_prizePools;
    
    struct Market {
        string question;
        string[] outcomesOptions;
        uint deadline;
        bool isResolved;
    }

    struct Request {
        uint marketId;
        uint deadline;
        address requester;
        bool isFullfilled;
        bytes inputBytes;
    }

    struct Notice {
        int256 finalPrice;
        uint256 requestId;
        uint[] updatedSharesList;
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "Only keeper can call this function");
        _;
    }

    // initial values
    constructor(address _taskIssuerAddress, bytes32 _machineHash, address _keeper)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {
        keeper = _keeper;
    }

    function createMarket(string memory _question, uint256 _deadline, string[] memory _outcomesOptions) public {
        require(s_markets[s_marketId].isResolved == false, "Market already resolved");
        require(s_markets[s_marketId].deadline > block.timestamp, "Market deadline has passed");
        s_marketId++;
        s_markets[s_marketId] = Market({
            question: _question,
            outcomesOptions: _outcomesOptions,
            deadline: _deadline,
            isResolved: false
        });
        
        s_circulatingShares[s_marketId] = new uint256[](_outcomesOptions.length * 2);   
        
        emit MarketCreated(s_marketId, _question, _outcomesOptions);
    }

    
 

    function manageShares(uint256 _marketId, uint256 _deadline, bytes memory _encodedListOfInt) public {
        ++requestCounter;
        s_requests[requestCounter] = Request({
            marketId: _marketId,
            deadline: _deadline,
            inputBytes: _encodedListOfInt,
            requester: msg.sender,
            isFullfilled: false
        });
        emit RequestCreated(requestCounter, _deadline, _encodedListOfInt, msg.sender);
    }

    function getShares(uint256 _marketId) public view returns (uint[] memory) {
        return s_circulatingShares[_marketId];
    }

    function resolveMarket(uint256 _marketId, uint256[] memory _winningOutcomes) public /*OnlyResolutionContract*/{
        require(s_markets[_marketId].isResolved == false, "Market already resolved");
        require(s_markets[_marketId].deadline < block.timestamp, "Market deadline has not passed");

        s_winningOutcomes[_marketId] = _winningOutcomes;
        s_markets[_marketId].isResolved = true;
    }

    function handleNotice(bytes32 inputPayloadHash, bytes memory _notices) internal override {
        require(_notices.length >= 32, "Invalid notice length");
        Notice[] memory notices = abi.decode(_notices, (Notice[]));

        for (uint256 i = 0; i < notices.length; i++) {
            if (s_requests[notices[i].requestId].deadline < block.timestamp) {
                continue;
            }
            s_userShares[notices[i].requesters][notices[i].marketId] = notices[i].updatedSharesList;
            if (notices[i].finalPrice < 0) {
                //IERC20(erc20Token).transfer(notices[i].requesters, uint256(-notices[i].finalPrice));
            } else {
                /* try (IERC20(erc20Token).transferFrom(msg.sender, address(this), _amount)) {
                    continue;
                } catch (bytes memory reason) {
                    //fulfill;
                } */
            }
            
        }
    }

    function withdrawShares(uint256 _marketId) public {
        require(s_markets[_marketId].isResolved == true, "Market not resolved");

        uint256[] memory winningOutcomes = s_winningOutcomes[_marketId];

        uint256 totalWinningCirculation = 0;
        for (uint256 i = 0; i < winningOutcomes.length; i++) {
            uint256 outcomeIndex = winningOutcomes[i];
            // Convert circulating shares (stored as int) to uint, assuming non-negative values
            totalWinningCirculation += uint256(s_circulatingShares[_marketId][outcomeIndex]);
        }
        require(totalWinningCirculation > 0, "No circulating shares in winning outcomes");

        // Assume the prize pool for this market is stored in s_prizePool mapping
        uint256 prizePool = s_prizePools[_marketId];
        uint256 pricePerShare = prizePool / totalWinningCirculation;

        uint256 userWinningShares = 0;
        for (uint256 i = 0; i < winningOutcomes.length; i++) {
            uint256 outcomeIndex = winningOutcomes[i];
            userWinningShares += s_userShares[msg.sender][_marketId][outcomeIndex];
        }
        uint256 winnings = userWinningShares * pricePerShare;

        // Transfer the winnings to the user
        //IERC20(erc20Token).transfer(msg.sender, winnings);   

        // Deduct the transferred winnings from the market prize pool
        s_prizePools[_marketId] -= winnings;
        delete s_userShares[msg.sender][_marketId];

        emit SharesWithdrawn(msg.sender, _marketId);
    }
}
