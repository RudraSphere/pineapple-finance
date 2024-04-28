// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DiamondGovernance is AccessControl {
    bytes32 public constant UPGRADE_ADMIN_ROLE =
        keccak256("UPGRADE_ADMIN_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPGRADE_ADMIN_ROLE, msg.sender);
    }

    modifier onlyUpgradeAdmin() {
        require(
            hasRole(UPGRADE_ADMIN_ROLE, msg.sender),
            "DiamondGovernance: must have upgrade admin role to interact"
        );
        _;
    }

    function addUpgradeAdmin(
        address newAdmin
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(UPGRADE_ADMIN_ROLE, newAdmin);
    }

    function removeUpgradeAdmin(
        address admin
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(UPGRADE_ADMIN_ROLE, admin);
    }
}
