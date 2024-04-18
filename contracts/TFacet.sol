// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TestFacet {
    function testFunction() external pure returns (string memory) {
        return "Hello, Diamond!";
    }
}
