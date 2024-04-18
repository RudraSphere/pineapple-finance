// contracts/interfaces/IDiamondLoupe.sol

pragma solidity ^0.8.0;

interface IDiamondLoupe {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    function facets() external view returns (Facet[] memory);
    function facetFunctionSelectors(
        address _facet
    ) external view returns (bytes4[] memory);
    function facetAddresses() external view returns (address[] memory);
    function facetAddress(
        bytes4 _functionSelector
    ) external view returns (address);
}
