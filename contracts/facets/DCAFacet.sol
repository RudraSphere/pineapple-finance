// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IDCA.sol"; // ! TODO: later add this interface.
import "hardhat/console.sol";
import "../interfaces/IUniswapV2Router.sol";

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

    address public immutable priceAggregator;
    address public immutable uniswapRouter;
    uint256 public fees = 250; // 2.5%
    uint256 public feesDecimals = 10000; // 100%

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

    constructor(address _priceAggregator, address _uniswapRouter) {
        priceAggregator = _priceAggregator;
        uniswapRouter = _uniswapRouter;
    }

    // TODO: set modifier or make it ownable to only by governer.
    function setFees(uint256 _fees) external {
        require(_fees > 0 && _fees <= feesDecimals, "Fees must be 0 >= 100%");
        fees = _fees;
    }

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

        uint256 amountAfterFees = (_totalAmount * fees) / feesDecimals;

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

        address[] memory path = new address[](2);
        path[0] = order.fromToken;
        path[1] = order.toToken;

        // assuming, contract will always have enough balance to swap
        IERC20(order.fromToken).approve(uniswapRouter, order.amountPerInterval);

        IUniswapV2Router(uniswapRouter).swapExactTokensForTokens(
            order.amountPerInterval,
            0, // ! TODO: may use oracle to avoid impermanent loss
            path,
            msg.sender,
            block.timestamp
        );

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
