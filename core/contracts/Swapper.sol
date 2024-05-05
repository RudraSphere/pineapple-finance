// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/ISwapper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libraries/LibDiamond.sol";
import "hardhat/console.sol";

contract Swapper is ReentrancyGuard, Ownable, ISwapper {
    using SafeERC20 for IERC20;

    IUniswapV2Router public immutable quickswapRouter;
    IUniswapV2Factory public immutable uniswapFactory;

    constructor(address _uniswapRouter, address _uniswapFactory) {
        require(_uniswapRouter != address(0), "ERR::ZERO_ADDRESS::ROUTER");
        require(_uniswapFactory != address(0), "ERR::ZERO_ADDRESS::FACTORY");

        quickswapRouter = IUniswapV2Router(_uniswapRouter);
        uniswapFactory = IUniswapV2Factory(_uniswapFactory);
    }

    function findIntermediateToken(
        address fromToken,
        address toToken
    ) internal pure returns (address) {
        return 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359; // USDC for now
    }

    function updateSwapper(address _newSwapper) external {
        LibDiamond.enforceIsContractOwner();
        require(_newSwapper != address(0), "Invalid swapper address");
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(
            _newSwapper != ds.swapper,
            "New swapper address must be different"
        );
        ds.swapper = _newSwapper;
    }

    function determineSwapPath(
        address fromToken,
        address toToken
    ) internal view returns (address[] memory) {
        address _directPair = uniswapFactory.getPair(fromToken, toToken);
        console.log("direct pair %s", _directPair);
        address[] memory path;

        address intermediateToken = findIntermediateToken(fromToken, toToken);

        if (_directPair != address(0)) {
            // if direct pair exists
            path = new address[](2);
            path[0] = fromToken;
            path[1] = toToken;
        } else {
            // Multi-hop
            path[0] = fromToken;
            path[1] = intermediateToken;
            path[2] = toToken;
        }

        return path;
    }

    function getEstimateAmountOutForToken(
        address inputToken,
        address toToken,
        uint256 amount
    ) external returns (uint256[] memory) {
        address[] memory path = determineSwapPath(inputToken, toToken);
        return quickswapRouter.getAmountsOut(amount, path);
    }

    function getEstimateAmountOutForTokens(
        address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken
    ) external returns (uint256 outputAmount) {
        outputAmount = 0;

        for (uint i = 0; i < inputTokens.length; i++) {
            address[] memory path = determineSwapPath(
                inputTokens[i],
                outputToken
            );

            uint256[] memory amountsOut = quickswapRouter.getAmountsOut(
                inputAmounts[i],
                path
            );
            outputAmount += amountsOut[1];
        }
        return outputAmount;
    }

    function quickSwap(
        address fromToken,
        address toToken,
        uint256 amount,
        uint256 slippage,
        address recipient,
        address userAddress
    ) external returns (uint256, bool) {
        IERC20(fromToken).safeTransferFrom(msg.sender, address(this), amount);
        console.log("Transferred %s", amount, recipient, userAddress);

        IERC20(fromToken).approve(address(quickswapRouter), amount);

        address[] memory path = determineSwapPath(fromToken, toToken);
        uint256[] memory amountsOut = quickswapRouter.swapExactTokensForTokens(
            amount,
            // (swapAmount * (BPS_DIVISOR - slippageTolerance)) /
            //     BPS_DIVISOR, // May need to check it.
            0,
            path,
            recipient,
            (block.timestamp + 800)
        );
        console.log("Swapped %s", amountsOut[1], recipient, userAddress);

        emit TokensSwapped(
            userAddress,
            fromToken,
            toToken,
            amount,
            amountsOut[1],
            tx.gasprice,
            slippage,
            recipient
        );

        return (amountsOut[1], true);
    }
}
