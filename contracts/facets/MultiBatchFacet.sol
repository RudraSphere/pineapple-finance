// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IUniswapV2Router.sol";

contract MultiBatchSwapFacet is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IUniswapV2Router public immutable uniswapRouter;

    uint256 public feeBasisPoints = 250; // 2.5%
    uint256 public constant BPS_DIVISOR = 10_000;

    constructor(address _uniswapRouter) {
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }

    event TokensSwapped(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 gasCost,
        uint256 slippage
    );

    event FeesCollected(address indexed collector, uint256 feeAmount);

    function advancedBatchSwap(
        address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken,
        address recipient,
        uint256 slippageTolerance
    ) external nonReentrant {
        require(
            inputTokens.length == inputAmounts.length,
            "Input lengths mismatch"
        );

        for (uint256 i = 0; i < inputTokens.length; i++) {
            address inputToken = inputTokens[i];
            uint256 inputAmount = inputAmounts[i];

            IERC20(inputToken).safeTransferFrom(
                msg.sender,
                address(this),
                inputAmount
            );

            uint256 feeAmount = (inputAmount * feeBasisPoints) / BPS_DIVISOR;
            uint256 swapAmount = inputAmount - feeAmount;

            _collectFees(inputToken, feeAmount);

            IERC20(inputToken).safeApprove(address(uniswapRouter), swapAmount);

            address[] memory path = new address[](2);
            path[0] = inputToken;
            path[1] = outputToken;

            uint256[] memory amountsOut = uniswapRouter
                .swapExactTokensForTokens(
                    swapAmount,
                    (swapAmount * (BPS_DIVISOR - slippageTolerance)) /
                        BPS_DIVISOR,
                    path,
                    recipient,
                    block.timestamp
                );

            emit TokensSwapped(
                msg.sender,
                inputToken,
                outputToken,
                swapAmount,
                amountsOut[1],
                tx.gasprice,
                slippageTolerance
            );
        }
    }

    function _collectFees(address token, uint256 feeAmount) internal {
        address feeCollector = owner();
        IERC20(token).safeTransfer(feeCollector, feeAmount);
        emit FeesCollected(feeCollector, feeAmount);
    }

    function setFeeBasisPoints(uint256 newFeeBPS) external onlyOwner {
        require(newFeeBPS <= BPS_DIVISOR, "ERR::INVALID_FEE_BPS");

        feeBasisPoints = newFeeBPS;
    }
}
