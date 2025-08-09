// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {CrowdFunding} from "./CrowdFunding.sol";

/**
 * @title CrowdFundingFactory
 * @author Kavinda Rathnayake
 * @notice This contract is responsible for creating and managing crowd funding campaigns.
 */
contract CrowdFundingFactory is Ownable {
    constructor() Ownable(msg.sender) {}

    function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _deadline)
        external
        onlyOwner
        returns (address)
    {
        CrowdFunding campaign = new CrowdFunding(_name, _description, _goal, _deadline, msg.sender);
        return address(campaign);
    }
}
