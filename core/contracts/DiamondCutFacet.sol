// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDiamondCut} from "./interfaces/IDiamondCut.sol";
import {LibDiamond} from "./libraries/LibDiamond.sol";

contract DiamondCutFacet is IDiamondCut {
    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external override {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 originalSelectorCount = ds.selectorCount;
        uint256 selectorCount = originalSelectorCount;
        bytes32 selectorSlot;
        if (selectorCount & 7 > 0) {
            selectorSlot = ds.selectorSlots[selectorCount >> 3];
        }
        for (uint256 facetIndex; facetIndex < _diamondCut.length; ) {
            (selectorCount, selectorSlot) = LibDiamond
                .addReplaceRemoveFacetSelectors(
                    selectorCount,
                    selectorSlot,
                    _diamondCut[facetIndex].facetAddress,
                    _diamondCut[facetIndex].action,
                    _diamondCut[facetIndex].functionSelectors
                );

            unchecked {
                facetIndex++;
            }
        }
        if (selectorCount != originalSelectorCount) {
            ds.selectorCount = uint16(selectorCount);
        }
        if (selectorCount & 7 > 0) {
            ds.selectorSlots[selectorCount >> 3] = selectorSlot;
        }
        emit DiamondCut(_diamondCut, _init, _calldata);
        LibDiamond.initializeDiamondCut(_init, _calldata);
    }

    function updateSwapper(address _newSwapper) external {
        LibDiamond.enforceIsContractOwner();
        require(_newSwapper != address(0), "Invalid swapper address");
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(
            _newSwapper != ds.swapper,
            "New swapper address must be different"
        );
        ds.swapper = _newSwapper;
    }
}
