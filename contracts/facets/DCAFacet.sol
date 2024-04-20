// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IDCA.sol"; // ! TODO: later add this interface.
import "hardhat/console.sol";

interface IAggregatorV3 {
    function getLatestPrice(address token) external view returns (int);
}

contract DCAFacet is ReentrancyGuard {
    struct DCAOrder {
        address tokenAddress;
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
    address public priceAggregator;

    event AllOrdersExecuted(address indexed user, uint256 index);
    event DCASetup(
        address indexed user,
        address token,
        uint256 amount,
        uint256 interval,
        uint256 orderCount
    );
    event DCAExecuted(address indexed user, address token, uint256 amount);

    mapping(address => DCAOrder[]) public userOrders;

    constructor(address _priceAggregator) {
        priceAggregator = _priceAggregator;
    }

    function setupDCA(
        address _tokenAddress,
        uint256 _totalAmount,
        uint256 _interval,
        uint256 _orderCount
    ) external {
        require(_interval > 0, "Interval must be > 0");
        require(_orderCount > 0, "Order count must be > 0");
        require(_totalAmount >= _orderCount, "Total amount too low");
        uint256 amountPerOrder = _totalAmount / _orderCount;

        userOrders[msg.sender].push(
            DCAOrder({
                tokenAddress: _tokenAddress,
                totalAmount: _totalAmount,
                amountPerInterval: amountPerOrder,
                interval: _interval,
                nextExecutionTime: block.timestamp + _interval,
                orderCount: _orderCount,
                ordersPlaced: 0
            })
        );
        emit DCASetup(
            msg.sender,
            _tokenAddress,
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
        int price = IAggregatorV3(priceAggregator).getLatestPrice(
            order.tokenAddress
        );

        uint256 currentValue = (remainingAmount * uint256(price)) / 1e18;

        return
            OrderDetail({
                id: index,
                order: order,
                remainingAmount: remainingAmount,
                currentValue: currentValue,
                currentPrice: price
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
            "Execution too early"
        );
        require(order.ordersPlaced < order.orderCount, "All orders executed");

        // Transfer partial token
        require(
            IERC20(order.tokenAddress).transferFrom(
                msg.sender,
                address(this),
                order.amountPerInterval
            ),
            "Transfer failed"
        );
        order.ordersPlaced++;
        order.nextExecutionTime += order.interval;
        emit DCAExecuted(
            msg.sender,
            order.tokenAddress,
            order.amountPerInterval
        );

        // !TODO: #pending check if all orders are placed and clean up or reset the order
        if (order.ordersPlaced == order.orderCount) {
            emit AllOrdersExecuted(msg.sender, index);
            // ....
        }
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = false;
        for (uint256 i = 0; i < userOrders[msg.sender].length; i++) {
            if (
                block.timestamp >= userOrders[msg.sender][i].nextExecutionTime
            ) {
                upkeepNeeded = true;
                break;
            }
        }
        return (upkeepNeeded, bytes(""));
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external nonReentrant {
        for (uint256 i = 0; i < userOrders[msg.sender].length; i++) {
            if (
                block.timestamp >= userOrders[msg.sender][i].nextExecutionTime
            ) {
                executeDCA(i);
            }
        }
    }
}
