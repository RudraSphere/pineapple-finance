// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IAggregatorV3.sol";
import "./PriceFeedRegistery.sol";

contract PriceAggregator {
    PriceFeedRegistry public registry;

    constructor(address _registry) {
        registry = PriceFeedRegistry(_registry);
    }

    function getLatestPrice(address token) public view returns (int) {
        address feedAddress = registry.getPriceFeed(token);
        IAggregatorV3 priceFeed = IAggregatorV3(feedAddress);
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
