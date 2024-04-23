// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV2Factory {
    function getPair(
        address _inputToken,
        address _outputToken
    ) external returns (address);
}
