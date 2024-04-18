// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IDiamondCut.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DiamondGovernance.sol";

contract DiamondCutFacet is IDiamondCut, DiamondGovernance {
    event FacetUpdated(address indexed facetAddress, bytes4 indexed selector);
    event FacetRemoved(bytes4 indexed selector);

    struct DiamondStorage {
        mapping(bytes4 => address) selectorToFacet;
    }

    function diamondCut(
        FacetCut[] calldata _facetCuts,
        address _init,
        bytes calldata _calldata
    ) external onlyUpgradeAdmin {
        DiamondStorage storage ds = diamondStorage();
        for (uint i = 0; i < _facetCuts.length; i++) {
            FacetCutAction action = _facetCuts[i].action;
            address facetAddress = _facetCuts[i].facetAddress;
            for (uint j = 0; j < _facetCuts[i].functionSelectors.length; j++) {
                bytes4 selector = _facetCuts[i].functionSelectors[j];
                if (action == FacetCutAction.Add) {
                    if (ds.selectorToFacet[selector] != address(0)) {
                        return;
                    }
                    // require(
                    //     ds.selectorToFacet[selector] == address(0),
                    //     "Selector already added"
                    // );
                    ds.selectorToFacet[selector] = facetAddress;
                } else if (action == FacetCutAction.Replace) {
                    require(
                        ds.selectorToFacet[selector] != address(0),
                        "Selector not found"
                    );
                    ds.selectorToFacet[selector] = facetAddress;
                } else if (action == FacetCutAction.Remove) {
                    require(
                        ds.selectorToFacet[selector] != address(0),
                        "Selector not found"
                    );
                    delete ds.selectorToFacet[selector];
                }
            }
        }

        if (_init != address(0)) {
            (bool success, ) = _init.delegatecall(_calldata);
            require(success, "Initialization failed");
        }
    }

    function diamondStorage()
        internal
        pure
        returns (DiamondStorage storage ds)
    {
        bytes32 position = keccak256("diamond.standard.diamond.storage");
        assembly {
            ds.slot := position
        }
    }

    // Public getter for facet addresses by selector
    function getFacetAddress(bytes4 selector) public view returns (address) {
        DiamondStorage storage ds = diamondStorage();
        return ds.selectorToFacet[selector];
    }
}
