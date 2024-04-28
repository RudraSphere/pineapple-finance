// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DiamondCutFacet.sol";
import "hardhat/console.sol";

contract Diamond {
    address private diamondCutFacet;

    constructor(address _diamondCutFacet) {
        diamondCutFacet = _diamondCutFacet;
    }

    fallback() external payable {
        console.log("calling this signature:");
        console.logBytes4(msg.sig);
        console.log("Function Signature called.");

        address facet = DiamondCutFacet(diamondCutFacet).getFacetAddress(
            msg.sig
        );
        require(facet != address(0), "Function does not exist.");
        console.log("Delegating to facet:", facet);

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
