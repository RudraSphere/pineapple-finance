// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDCA {
    event DCASetup(
        address indexed user,
        address token,
        uint256 amount,
        uint256 interval,
        uint256 orderCount
    );
    event DCAExecuted(address indexed user, address token, uint256 amount);

    function setupDCA(
        address _tokenAddress,
        uint256 _amount,
        uint256 _interval,
        uint256 _orderCount
    ) external;

    function executeDCA(uint index) external;
}
