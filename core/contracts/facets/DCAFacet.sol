// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IDCA.sol"; // ! TODO: later add this interface.
import "hardhat/console.sol";
import "../interfaces/IUniswapV2Router.sol";
import "../interfaces/ISwapper.sol";
import "../libraries/LibDiamond.sol";

interface IAggregatorV3 {
    function getLatestPrice(address token) external view returns (int);
}

contract DCAFacet is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct DCAOrder {
        address fromToken;
        address toToken;
        uint256 totalAmount;
        uint256 amountPerInterval;
        uint256 interval;
        uint256 nextExecutionTime;
        uint256 orderCount;
        uint256 ordersPlaced;
    }

    struct OrderDetail {
        uint256 id;
        DCAOrder order;
        uint256 remainingAmount;
        uint256 currentValue;
        int currentPrice;
    }

    uint256 public constant FEE_DECIMALS = 10_000; // Represents 100.00%
    uint256 public feeRate = 250; // 2.5%

    event AllOrdersExecuted(address indexed user, uint256 index);
    event DCASetup(
        address indexed user,
        address fromToken,
        address toToken,
        uint256 amount,
        uint256 interval,
        uint256 orderCount
    );
    event DCAExecuted(
        address indexed user,
        address fromToken,
        address toToken,
        uint256 amount
    );

    mapping(address => DCAOrder[]) public userOrders;

    constructor() {}

    function setupDCA(
        address _fromToken,
        address _toToken,
        uint256 _totalAmount,
        uint256 _interval,
        uint256 _orderCount
    ) external {
        require(_interval > 0, "Interval must be > 0");
        require(_orderCount > 0, "Order count must be > 0");
        require(_totalAmount >= _orderCount, "Total amount too low");

        IERC20(_fromToken).safeTransferFrom(
            msg.sender,
            address(this),
            _totalAmount
        );

        console.log(
            "DCA::Balance After Transfer",
            IERC20(_fromToken).balanceOf(address(this))
        );

        uint256 feeAmount = (_totalAmount * feeRate) / FEE_DECIMALS;
        uint256 amountAfterFees = (_totalAmount - feeAmount);

        // ! convert fees to native currency so, contract can itself call some functions later.

        uint256 amountPerOrder = amountAfterFees / _orderCount;
        userOrders[msg.sender].push(
            DCAOrder({
                fromToken: _fromToken,
                toToken: _toToken,
                totalAmount: amountAfterFees,
                amountPerInterval: amountPerOrder,
                interval: _interval,
                nextExecutionTime: block.timestamp + _interval,
                orderCount: _orderCount,
                ordersPlaced: 0
            })
        );

        // auto execute orders if any order is due
        if (checkUpkeep()) {
            performUpkeep();
        }

        emit DCASetup(
            msg.sender,
            _fromToken,
            _toToken,
            _totalAmount,
            _interval,
            _orderCount
        );
    }

    function getOrderDetails(
        address user,
        uint index
    ) public view returns (OrderDetail memory) {
        require(index < userOrders[user].length, "Order index out of bounds");
        DCAOrder storage order = userOrders[user][index];
        uint256 remainingOrders = order.orderCount - order.ordersPlaced;
        uint256 remainingAmount = remainingOrders * order.amountPerInterval;

        // ! TODO: #pending: will need to provide it with oracle contracts first.
        // int price = IAggregatorV3(priceAggregator).getLatestPrice(
        //     order.tokenAddress
        // );

        // uint256 currentValue = (remainingAmount * uint256(price)) / 1e18;

        return
            OrderDetail({
                id: index,
                order: order,
                remainingAmount: remainingAmount,
                currentValue: 1e16,
                currentPrice: 0
            });
    }

    function getAllOrders(
        address user
    ) public view returns (DCAOrder[] memory) {
        return userOrders[user];
    }

    function getAllActiveOrders(
        address user
    ) public view returns (OrderDetail[] memory) {
        uint activeCount = 0;
        for (uint i = 0; i < userOrders[user].length; i++) {
            if (
                userOrders[user][i].ordersPlaced <
                userOrders[user][i].orderCount
            ) {
                activeCount++;
            }
        }

        OrderDetail[] memory activeOrders = new OrderDetail[](activeCount);
        uint j = 0;
        for (uint i = 0; i < userOrders[user].length; i++) {
            if (
                userOrders[user][i].ordersPlaced <
                userOrders[user][i].orderCount
            ) {
                activeOrders[j] = getOrderDetails(user, i);
                j++;
            }
        }

        return activeOrders;
    }

    function executeDCA(uint index) public {
        DCAOrder storage order = userOrders[msg.sender][index];
        require(
            block.timestamp >= order.nextExecutionTime,
            "Too early to execute"
        );
        require(
            order.ordersPlaced < order.orderCount,
            "Order already completed"
        );
        console.log("Executing DCA for user %s", msg.sender, address(this));

        IERC20(order.fromToken).approve(
            address(LibDiamond.getSwapperAddress()),
            order.amountPerInterval
        );

        (, bool isSuccess) = ISwapper(LibDiamond.getSwapperAddress()).quickSwap(
            order.fromToken,
            order.toToken,
            order.amountPerInterval,
            0,
            msg.sender,
            address(this)
        );

        require(isSuccess, "DCAFacet::executeDCA: Swap failed");

        order.ordersPlaced++;
        order.nextExecutionTime += order.interval;

        emit DCAExecuted(
            msg.sender,
            order.fromToken,
            order.toToken,
            order.amountPerInterval
        );

        // !TODO: #pending check if all orders are placed and clean up or reset the order
        if (order.ordersPlaced == order.orderCount) {
            emit AllOrdersExecuted(msg.sender, index);
            // ....
        }
    }

    function checkUpkeep() public view returns (bool upkeepNeeded) {
        upkeepNeeded = false;
        for (uint256 i = 0; i < userOrders[msg.sender].length; i++) {
            if (
                block.timestamp >= userOrders[msg.sender][i].nextExecutionTime
            ) {
                upkeepNeeded = true;
                break;
            }
        }
        return (upkeepNeeded);
    }

    function performUpkeep() public nonReentrant {
        for (uint256 i = 0; i < userOrders[msg.sender].length; i++) {
            if (
                block.timestamp >= userOrders[msg.sender][i].nextExecutionTime
            ) {
                executeDCA(i);
            }
        }
    }
}
