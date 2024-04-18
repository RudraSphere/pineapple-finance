
pragma solidity ^0.8.0;

import "./interfaces/IDiamondLoupe.sol";
import "./DiamondCutFacet.sol";

contract Diamond {
    fallback() external payable {
        address facet = DiamondCutFacet(msg.sender).getFacetAddress(msg.sig);
        require(facet != address(0), "Function does not exist.");
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
}
