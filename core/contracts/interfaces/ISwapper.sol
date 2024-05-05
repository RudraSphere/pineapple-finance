// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISwapper {
    event TokensSwapped(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 gasCost,
        uint256 slippage,
        address recipient
    );

    function getEstimateAmountOutForToken(
        address inputToken,
        address toToken,
        uint256 amount
    ) external returns (uint256[] memory);

    function getEstimateAmountOutForTokens(
        address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken
    ) external returns (uint256 outputAmount);

    function quickSwap(
        address fromToken,
        address toToken,
        uint256 amount,
        uint256 slippage,
        address recipient,
        address userAddress
    ) external returns (uint256, bool);
}
