// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// ONLY FOR TESTING DIAMOND CALLS.

contract TestFacet {
    function testFunction() external pure returns (string memory) {
        return "Hello, Diamond!";
    }
}
