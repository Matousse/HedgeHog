// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import { OApp, Origin, MessagingFee } from "node_modules/@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PutOptionHandler is AutomationCompatibleInterface, OApp,Ownable {
    using SafeERC20 for IERC20;

    struct Opt {
        uint256 strike;
        uint256 premium;
		uint256 amount;
        uint256 expiry;
        address seller;
        address buyer;
		address asset;
        bool    assetSent;
        bool    fundSent;
    }

	uint256 public optCount;
    mapping(uint256 => Opt) public opts;
    
    address public usdc;
    address private constant ETH = address(0);

    // Action codes for cross-chain propagation
    uint8 private constant ACTION_CREATE = 0;
    uint8 private constant ACTION_BUY = 1;
    uint8 private constant ACTION_DELETE = 2;
    uint8 private constant ACTION_EXERCISE = 3;
    uint8 private constant ACTION_EXPIRE = 4;

	event OptCreated(
        uint256 optId,
        address indexed seller,
        uint256 strike,
        uint256 premium,
		address asset,
		uint256 amount,
        uint256 expiry
    );

    event OptBought(uint256 optId, address indexed buyer);
    event OptExercised(uint256 optId, address indexed buyer);
    event OptDeleted(uint256 optId);
    event AssetSent(uint256 optId, address indexed buyer);
    event AssetReclaimed(uint256 optId, address indexed buyer);


    constructor(address _usdc, address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) {
        require(_usdc != address(0), "USDC address cannot be zero");
        usdc = _usdc;
    }


    function checkUpkeep(bytes calldata) external override returns (bool upkeepNeeded, bytes memory performData) {
        uint256 count = 0;
        uint256[] memory exercisedOpts = new uint256[](optCount);

        for (uint256 i = 0; i < optCount; i++) {
            if (block.timestamp >= opts[i].expiry) {
                Opt storage opt = opts[i];
                if (opt.assetSent) {
                    count++;
                    exercisedOpts[count] = i;
                }
                else {
                    // Give back the money to the seller if put option buyer has not transfered the asset at expiry
                    IERC20(usdc).safeTransfer(opt.seller, opt.strike);
                    delete opts[i];
                    emit OptDeleted(i);
                }
            }
        }

        if (count > 0) {
            upkeepNeeded = true;
            performData = abi.encode(exercisedOpts, count);
        } else {
            upkeepNeeded = false;
            performData = "";
        }
    }

    function performUpkeep(bytes calldata performData, uint32[] calldata dstEids, bytes calldata options) external override payable {
        (uint256[] memory exercisedOpts, uint256 count) = abi.decode(performData, (uint256[], uint256));
        for (uint256 i = 0; i < count; i++) {
            _settleExpiredOpt(exercisedOpts[i], dstEids, options);
        }
    }


    function _settleExpiredOpt(uint256 optId, uint32[] memory dstEids, bytes calldata options) internal {
        Opt storage opt = opts[optId];
        require(block.timestamp >= opt.expiry, "Option has not expired yet");
        if (opt.asset == ETH) {
            (bool success, ) = payable(opt.seller).call{value: opt.amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(opt.asset).safeTransfer(opt.seller, opt.amount);}
        IERC20(usdc).safeTransfer(opt.buyer, opt.strike);
        emit OptDeleted(optId);
        delete opts[optId];
        if (dstEids.length > 0) {
            _propagateOptionChange{value: msg.value}(ACTION_EXPIRE, optId, dstEids, options);
        }
    }

    // Propagate option change to other chains
    function _propagateOptionChange(
        uint8 action,
        uint256 optId,
        uint32[] memory dstEids,
        bytes calldata options
    ) internal {
        bytes memory message = abi.encode(action, optId, opts[optId]);
        uint256 feePerChain = msg.value / dstEids.length;
        for (uint256 i = 0; i < dstEids.length; i++) {
            _lzSend(
                dstEids[i],
                message,
                combineOptions(dstEids[i], 1, options),
                MessagingFee(feePerChain, 0),
                payable(msg.sender)
            );
        }
    }

    // Cross-chain receive logic
    function _lzReceive(
        Origin calldata, /*_origin*/
        bytes32, /*_guid*/
        bytes calldata _message,
        address, /*_executor*/
        bytes calldata /*_extraData*/
    ) internal override {
        (uint8 action, uint256 optId, Opt memory opt) = abi.decode(_message, (uint8, uint256, Opt));
        if (action == ACTION_CREATE) {
            opts[optId] = opt;
            emit OptCreated(optId, opt.seller, opt.strike, opt.premium, opt.asset, opt.amount, opt.expiry);
            if (optId >= optCount) optCount = optId + 1;
        } else if (action == ACTION_BUY) {
            opts[optId].buyer = opt.buyer;
            emit OptBought(optId, opt.buyer);
        } else if (action == ACTION_DELETE) {
            delete opts[optId];
            emit OptDeleted(optId);
        } else if (action == ACTION_EXERCISE) {
            // Mark as exercised (custom logic if needed)
            emit OptExercised(optId, opt.buyer);
        } else if (action == ACTION_EXPIRE) {
            delete opts[optId];
            emit OptDeleted(optId);
        }
    }

    // --- MODIFIED PUBLIC FUNCTIONS ---

    function createPutOpt(
        uint256 strike,
        uint256 premium,
        uint256 expiry,
        address asset,
        uint256 amount,
        uint32[] calldata dstEids,
        bytes calldata options
    ) external payable {
        require(expiry > block.timestamp, "Expiry must be in the future");
        uint256 allowance = IERC20(usdc).allowance(msg.sender, address(this));
        require(allowance >= strike, "Insufficient allowance for seller (PUT)");
        uint256 balance = IERC20(usdc).balanceOf(msg.sender);
        require(balance >= strike, "Insufficient balance for seller (PUT)");
        IERC20(usdc).safeTransferFrom(msg.sender, address(this), strike);
        opts[optCount] = Opt({
            seller: msg.sender,
            buyer: address(0),
            strike: strike,
            premium: premium,
            expiry: expiry,
            asset: asset,
            amount: amount,
            assetSent: false,
            fundSent: true
        });
        emit OptCreated(optCount, msg.sender, strike, premium, asset, amount, expiry);
        if (dstEids.length > 0) {
            _propagateOptionChange{value: msg.value}(ACTION_CREATE, optCount, dstEids, options);
        }
        optCount++;
    }

    function deletePutOpt(
        uint256 optId,
        uint32[] calldata dstEids,
        bytes calldata options
    ) external payable {
        Opt storage opt = opts[optId];
        require(msg.sender == opt.seller, "Only the seller can call this function");
        require(opt.buyer == address(0), "Option already bought");
        require(opt.expiry > block.timestamp, "Option has expired");
        uint256 strike = opt.strike;
        address seller = opt.seller;
        emit OptDeleted(optId);
        delete opts[optId];
        IERC20(usdc).safeTransfer(seller, strike);
        if (dstEids.length > 0) {
            _propagateOptionChange{value: msg.value}(ACTION_DELETE, optId, dstEids, options);
        }
    }

    function buyOpt(
        uint256 optId,
        uint32[] calldata dstEids,
        bytes calldata options
    ) external payable {
        Opt storage opt = opts[optId];
        require(opt.buyer == address(0), "Option already bought");
        require(opt.expiry > block.timestamp, "Option has expired");
        uint256 allowance = IERC20(usdc).allowance(msg.sender, address(this));
        require(allowance >= opt.premium, "Insufficient allowance for buyer (PUT)");
        uint256 balance = IERC20(usdc).balanceOf(msg.sender);
        require(balance >= opt.premium, "Insufficient balance for buyer (PUT)");
        IERC20(usdc).safeTransferFrom(msg.sender, opt.seller, opt.premium);
        opt.buyer = msg.sender;
        emit OptBought(optId, msg.sender);
        if (dstEids.length > 0) {
            _propagateOptionChange{value: msg.value}(ACTION_BUY, optId, dstEids, options);
        }
    }

    function sendAsset(
        uint256 optId
    ) external payable {
        Opt storage opt = opts[optId];
        require(msg.sender == opt.buyer, "Only the buyer can call this function");
        require(!opt.assetSent, "Asset already sent");
        require(opt.expiry > block.timestamp, "Option has expired");
        if (opt.asset == ETH) {
            require(msg.value == opt.amount, "Incorrect ETH amount sent");
        } else {
            uint256 allowance = IERC20(opt.asset).allowance(msg.sender, address(this));
            require(allowance >= opt.amount, "Insufficient asset allowance for buyer (PUT)");
            IERC20(opt.asset).safeTransferFrom(msg.sender, address(this), opt.amount);}
        opt.assetSent = true;
        emit AssetSent(optId, msg.sender);
        // Pas de propagation cross-chain ici (état local seulement)
    }

    function reclaimAsset(
        uint256 optId
    ) external {
        Opt storage opt = opts[optId];
        require(msg.sender == opt.buyer, "Only the buyer can call this function");
        require(opt.assetSent, "No asset to reclaim");
        require(opt.expiry > block.timestamp, "Option has expired");
        if (opt.asset == ETH) {
            (bool success, ) = payable(msg.sender).call{value: opt.amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(opt.asset).safeTransfer(msg.sender, opt.amount);}
        opt.assetSent = false;
        emit AssetReclaimed(optId, msg.sender);
        // Pas de propagation cross-chain ici (état local seulement)
    }

    fallback() external payable {
        revert("Unknown function call");
    }

    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }
}
