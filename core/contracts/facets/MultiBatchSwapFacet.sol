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

/// @title MultiBatchSwapFacet
/// @notice Handles multiple token swaps in batches, collecting fees and ensuring proper execution.
/// @dev Extends ReentrancyGuard to prevent reentrant calls to sensitive functions.
contract MultiBatchSwapFacet is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public feeBasisPoints = 250; // 2.5%
    uint256 public constant BPS_DIVISOR = 10_000;

    constructor() {}

    // -------------------------------- EVENTS --------------------------------
    event FeesCollected(address indexed collector, uint256 feeAmount);

    /// @notice Executes multiple token swaps using Swapper Contract.
    /// @param inputTokens Array of addresses representing the tokens to swap from.
    /// @param inputAmounts Array of amounts corresponding to each token in `inputTokens`.
    /// @param outputToken token address to which all input tokens are swapped.
    /// @param recipient address that will receive the output tokens.
    /// @param slippageTolerance maximum tolerated slippage for the swaps.
    /// @dev This function uses the external `ISwapper` interface to perform swaps and handle fees.
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

    /// @notice Performs a single token swap.
    /// @param fromToken token address to swap from.
    /// @param toToken token address to swap to.
    /// @param amount amount of `fromToken` to swap.
    /// @param recipient address that will receive the `toToken`.
    /// @return _amountGot amount of `toToken` received from the swap.
    /// @return isSuccess True if the swap was successful.
    /// @dev Approves the `ISwapper` to handle the specified amount of `fromToken`.
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

    /// @notice Collects fees by transferring the specified `feeAmount` of `token` to the `feeCollector`.
    /// @param token token from which fees are collected.
    /// @param feeAmount amount of fees to collect.
    /// @dev fee collector address is retrieved from the LibDiamond contract owner.
    function _collectFees(address token, uint256 feeAmount) internal {
        address feeCollector = LibDiamond.contractOwner();
        if (feeCollector != address(0)) {
            console.log("Collecting fees", feeAmount, feeCollector);
            IERC20(token).safeTransfer(feeCollector, feeAmount);
            emit FeesCollected(feeCollector, feeAmount);
        }
    }

    /// @notice Updates the fee basis points.
    /// @param newFeeBPS new fee basis points to set.
    /// @dev Ensures that only the contract owner can update fee rates and that the new fee is within a valid range.
    function setFeeBasisPoints(uint256 newFeeBPS) external {
        LibDiamond.enforceIsContractOwner();
        require(newFeeBPS <= BPS_DIVISOR, "ERR::INVALID_FEE_BPS");

        feeBasisPoints = newFeeBPS;
    }

    /// @notice Estimates the output amount for a swap from `fromToken` to `toToken` given `inputAmount`.
    /// @param fromToken token being swapped from.
    /// @param toToken token being swapped to.
    /// @param inputAmount amount of `fromToken` being swapped.
    /// @return estimated output amount in `toToken`.
    function estimateSwapOutput(
        address fromToken,
        address toToken,
        uint256 inputAmount
    ) public returns (uint256[] memory) {
        return
            ISwapper(LibDiamond.getSwapperAddress())
                .getEstimateAmountOutForToken(fromToken, toToken, inputAmount);
    }

    /// @notice Estimates the output amounts for swaps from multiple `inputTokens` to a single `outputToken`.
    /// @param inputTokens Array of token addresses being swapped from.
    /// @param inputAmounts Array of amounts for each token in `inputTokens`.
    /// @param outputToken token address being swapped to.
    /// @return outputAmount total estimated output amount in `outputToken`.
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
