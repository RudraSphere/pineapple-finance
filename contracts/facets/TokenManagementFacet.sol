pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenManagementFacet {
    function getTokenBalance(
        address _tokenAddress,
        address _user
    ) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(_user);
    }
}
