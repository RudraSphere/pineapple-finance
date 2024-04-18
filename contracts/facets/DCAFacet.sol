// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IDCA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DCAFacet is IDCA, ReentrancyGuard {
    struct DCAOrder {
        address tokenAddress;
        uint256 amount;
        uint256 interval;
        uint256 nextExecutionTime;
    }

    mapping(address => DCAOrder[]) public userOrders;

    function setupDCA(
        address _tokenAddress,
        uint256 _amount,
        uint256 _interval
    ) external override {
        require(_interval > 0, "Interval must be > 0");
        userOrders[msg.sender].push(
            DCAOrder({
                tokenAddress: _tokenAddress,
                amount: _amount,
                interval: _interval,
                nextExecutionTime: block.timestamp + _interval
            })
        );
        emit DCASetup(msg.sender, _tokenAddress, _amount, _interval);
    }

    function executeDCA(uint index) public override {
        DCAOrder storage order = userOrders[msg.sender][index];
        require(
            block.timestamp >= order.nextExecutionTime,
            "Execution too early"
        );
        require(
            IERC20(order.tokenAddress).transferFrom(
                msg.sender,
                address(this),
                order.amount
            ),
            "Transfer failed"
        );
        order.nextExecutionTime += order.interval;
        emit DCAExecuted(msg.sender, order.tokenAddress, order.amount);
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
