// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract PriceFeedRegistry is AccessControl {
    bytes32 public constant FEED_MANAGER_ROLE =
        keccak256("FMR:FEED_MANAGER_ROLE");
    mapping(address => address) public tokenToPriceFeed;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(FEED_MANAGER_ROLE, msg.sender);
    }

    function setPriceFeed(
        address token,
        address feed
    ) public onlyRole(FEED_MANAGER_ROLE) {
        tokenToPriceFeed[token] = feed;
    }

    function getPriceFeed(address token) public view returns (address) {
        require(
            tokenToPriceFeed[token] != address(0),
            "No price feed available"
        );
        return tokenToPriceFeed[token];
    }
}
