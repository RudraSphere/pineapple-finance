// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IUniswapV2Router.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "hardhat/console.sol";

contract MultiBatchSwapFacet is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IUniswapV2Router public immutable quickswapRouter;
    IUniswapV2Factory public immutable uniswapFactory;

    uint256 public feeBasisPoints = 250; // 2.5%
    uint256 public constant BPS_DIVISOR = 10_000;

    constructor(address _uniswapRouter, address _uniswapFactory) {
        require(_uniswapRouter != address(0), "ERR::ZERO_ADDRESS::ROUTER");
        require(_uniswapFactory != address(0), "ERR::ZERO_ADDRESS::FACTORY");

        quickswapRouter = IUniswapV2Router(_uniswapRouter);
        uniswapFactory = IUniswapV2Factory(_uniswapFactory);
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
                address(quickswapRouter),
                swapAmount
            );

            address[] memory path = new address[](2);
            path[0] = inputToken;
            path[1] = outputToken;

            console.log("Swapping %s to %s", inputToken, outputToken);
            uint256[] memory amountsOut = quickswapRouter
                .swapExactTokensForTokens(
                    swapAmount,
                    // (swapAmount * (BPS_DIVISOR - slippageTolerance)) /
                    //     BPS_DIVISOR, // May need to check it.
                    0,
                    path,
                    recipient,
                    (block.timestamp * 2)
                );

            console.log("Swapped %s to %s", inputToken, outputToken);
            console.log(
                "receipient balance after swap ",
                IERC20(outputToken).balanceOf(recipient),
                recipient
            );
            console.log(IERC20(inputToken).balanceOf(recipient));

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

    function batchSwapToSingleToken(
        address fromToken,
        address toToken,
        uint256 amount,
        address recipient
    ) external nonReentrant {
        console.log("calling batchSwapToSingleToken");
        IERC20(fromToken).safeApprove(address(quickswapRouter), amount);
        address _directPair = uniswapFactory.getPair(fromToken, toToken);
        console.log("direct pair %s", _directPair);
        address[] memory path;
        console.log(
            "receipient balance::Before:",
            IERC20(toToken).balanceOf(recipient)
        );
        console.log(
            "receipient balance::Before:",
            IERC20(fromToken).balanceOf(recipient)
        );

        IERC20(fromToken).safeTransferFrom(msg.sender, address(this), amount);

        if (_directPair != address(0)) {
            // if direct pair exists
            path = new address[](2);
            path[0] = fromToken;
            path[1] = toToken;
        } else {
            path = determineSwapPath(fromToken, toToken);
        }

        uint256[] memory amountsOut = quickswapRouter.swapExactTokensForTokens(
            amount,
            0, // TODO: calculate or use Dex's function
            path,
            recipient,
            (block.timestamp * 3)
        );

        console.log("Swapped %s to %s", fromToken, toToken);
        console.log(
            "receipient balance::After:",
            IERC20(toToken).balanceOf(recipient)
        );
        console.log(
            "receipient balance::After:",
            IERC20(fromToken).balanceOf(recipient)
        );
        emit TokensSwapped(
            msg.sender,
            fromToken,
            toToken,
            amount,
            amountsOut[amountsOut.length - 1],
            tx.gasprice,
            0 // for now
        );
    }

    function determineSwapPath(
        address fromToken,
        address toToken
    ) internal view returns (address[] memory) {
        address[] memory path = new address[](3);
        address intermediateToken = findIntermediateToken(fromToken, toToken);

        path[0] = fromToken;
        path[1] = intermediateToken;
        path[2] = toToken;

        return path;
    }

    function findIntermediateToken(
        address fromToken,
        address toToken
    ) internal pure returns (address) {
        return 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359; // USDC for now
    }

    function _collectFees(address token, uint256 feeAmount) internal {
        address feeCollector = owner();
        if (feeCollector != address(0)) {
            IERC20(token).safeTransfer(feeCollector, feeAmount);
            emit FeesCollected(feeCollector, feeAmount);
        }
    }

    function setFeeBasisPoints(uint256 newFeeBPS) external onlyOwner {
        require(newFeeBPS <= BPS_DIVISOR, "ERR::INVALID_FEE_BPS");

        feeBasisPoints = newFeeBPS;
    }

    function findBestSwapPath(
        address fromToken,
        address toToken
    ) internal view returns (address[] memory) {
        address directPair = uniswapFactory.getPair(fromToken, toToken);

        if (directPair != address(0)) {
            // Direct swap
            address[] memory directPath = new address[](2);
            directPath[0] = fromToken;
            directPath[1] = toToken;
            return directPath;
        } else {
            // Multi-hop
            address[] memory multiHopPath = new address[](3);
            multiHopPath[0] = fromToken;
            multiHopPath[1] = findIntermediateToken(fromToken, toToken);
            multiHopPath[2] = toToken;
            return multiHopPath;
        }
    }

    function estimateSwapOutput(
        address fromToken,
        address toToken,
        uint256 inputAmount
    ) public view returns (uint256[] memory) {
        address[] memory path = findBestSwapPath(fromToken, toToken);
        return quickswapRouter.getAmountsOut(inputAmount, path);
    }
}
