// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IUniswapV2Router.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "../interfaces/ISwapper.sol";
import "../libraries/LibDiamond.sol";
import "hardhat/console.sol";

contract MultiBatchSwapFacet is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public feeBasisPoints = 250; // 2.5%
    uint256 public constant BPS_DIVISOR = 10_000;

    constructor() {}

    event FeesCollected(address indexed collector, uint256 feeAmount);

    function batchSwapsToSingleToken(
        address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken,
        address recipient,
        uint256 slippageTolerance
    ) external nonReentrant {
        console.log("call init");
        require(
            inputTokens.length == inputAmounts.length,
            "Input lengths mismatch"
        );

        for (uint256 i = 0; i < inputTokens.length; i++) {
            console.log("Swapping token %s", inputTokens[i]);
            console.log("Amount %s", inputAmounts[i]);

            address inputToken = inputTokens[i];
            uint256 inputAmount = inputAmounts[i];

            IERC20(inputToken).safeTransferFrom(
                msg.sender,
                address(this),
                inputAmount
            );
            console.log("Transferred %s", inputAmount);

            uint256 feeAmount = (inputAmount * feeBasisPoints) / BPS_DIVISOR;
            uint256 swapAmount = inputAmount - feeAmount;

            console.log("Fee amount %s", feeAmount);
            console.log("Swap amount %s", swapAmount);

            _collectFees(inputToken, feeAmount);
            console.log("Fees collected");

            IERC20(inputToken).safeApprove(
                address(LibDiamond.getSwapperAddress()),
                swapAmount
            );

            (, bool isSuccess) = ISwapper(LibDiamond.getSwapperAddress())
                .quickSwap(
                    inputToken,
                    outputToken,
                    swapAmount,
                    slippageTolerance,
                    recipient,
                    msg.sender
                );
            require(isSuccess, "ERR::SWAP_FAILED");
        }
    }

    function batchSwapToSingleToken(
        address fromToken,
        address toToken,
        uint256 amount,
        address recipient
    ) external nonReentrant returns (uint256 _amountGot, bool isSuccess) {
        console.log("calling batchSwapToSingleToken");
        IERC20(fromToken).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(fromToken).safeApprove(
            address(LibDiamond.getSwapperAddress()),
            amount
        );
        console.log(
            "receipient balance::Before:",
            IERC20(toToken).balanceOf(recipient)
        );
        console.log(
            "receipient balance::Before:",
            IERC20(fromToken).balanceOf(recipient)
        );

        (_amountGot, isSuccess) = ISwapper(LibDiamond.getSwapperAddress())
            .quickSwap(fromToken, toToken, amount, 0, recipient, msg.sender);
        require(isSuccess, "ERR::SWAP_FAILED");

        console.log("Swapped %s to %s", fromToken, toToken);
        console.log(
            "receipient balance::After:",
            IERC20(toToken).balanceOf(recipient)
        );
        console.log(
            "receipient balance::After:",
            IERC20(fromToken).balanceOf(recipient)
        );
    }

    function _collectFees(address token, uint256 feeAmount) internal {
        address feeCollector = LibDiamond.contractOwner();
        if (feeCollector != address(0)) {
            console.log("Collecting fees", feeAmount, feeCollector);
            IERC20(token).safeTransfer(feeCollector, feeAmount);
            emit FeesCollected(feeCollector, feeAmount);
        }
    }

    function setFeeBasisPoints(uint256 newFeeBPS) external {
        LibDiamond.enforceIsContractOwner();
        require(newFeeBPS <= BPS_DIVISOR, "ERR::INVALID_FEE_BPS");

        feeBasisPoints = newFeeBPS;
    }

    function estimateSwapOutput(
        address fromToken,
        address toToken,
        uint256 inputAmount
    ) public returns (uint256[] memory) {
        return
            ISwapper(LibDiamond.getSwapperAddress())
                .getEstimateAmountOutForToken(fromToken, toToken, inputAmount);
    }

    function estimateSwapOutputs(
        address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken
    ) external returns (uint256 outputAmount) {
        require(
            inputTokens.length == inputAmounts.length,
            "Input arrays must be of the same length"
        );

        return
            ISwapper(LibDiamond.getSwapperAddress())
                .getEstimateAmountOutForTokens(
                    inputTokens,
                    inputAmounts,
                    outputToken
                );
    }
}
