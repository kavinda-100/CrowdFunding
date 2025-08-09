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
    // -------------------------- State Variables --------------------------
    struct Campaign {
        address campaignAddress;
        address owner;
        string campaignName;
        uint256 createdAt;
    } // Campaign struct

    Campaign[] private campaigns; // Array to store all campaigns
    mapping(address => Campaign[]) private userCampaigns; // Mapping from user address to their campaigns

    // -------------------------- Constructor --------------------------
    constructor() Ownable(msg.sender) {}

    function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _deadline)
        external
        returns (address)
    {
        // deploy the CrowdFunding contract
        CrowdFunding campaign = new CrowdFunding(_name, _description, _goal, _deadline, msg.sender);

        Campaign memory newCampaign = Campaign({
            campaignAddress: address(campaign),
            owner: msg.sender,
            campaignName: _name,
            createdAt: block.timestamp
        });

        // save the campaign details
        campaigns.push(newCampaign);
        userCampaigns[msg.sender].push(newCampaign);

        return address(campaign);
    }
}
