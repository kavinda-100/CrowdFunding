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
    // ------------------------------ Errors ------------------------------
    error CrowdFundingFactory__InvalidAddress();

    // -------------------------- Events --------------------------
    event CampaignCreated(address indexed campaignAddress, address indexed owner, string campaignName);

    // -------------------------- State Variables --------------------------
    struct Campaign {
        address campaignAddress;
        address owner;
        string campaignName;
        uint256 createdAt;
    } // Campaign struct

    Campaign[] private campaigns; // Array to store all campaigns
    mapping(address => Campaign[]) private userCampaigns; // Mapping from user address to their campaigns

    // -------------------------- Modifiers --------------------------

    /**
     * @dev Modifier to check if an address is valid (not zero).
     */
    modifier IsValidAddress(address _address) {
        if (_address == address(0)) {
            revert CrowdFundingFactory__InvalidAddress();
        }
        _;
    }

    // -------------------------- Constructor --------------------------
    constructor() Ownable(msg.sender) {}

    // -------------------------- Public/External Functions --------------------------

    /**
     * @dev Creates a new crowdfunding campaign.
     * @param _name The name of the campaign.
     * @param _description The description of the campaign.
     * @param _goal The funding goal for the campaign.
     * @param _deadline The deadline for the campaign.
     */
    function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _deadline)
        external
        IsValidAddress(msg.sender)
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

        // Emit the CampaignCreated event
        emit CampaignCreated(address(campaign), msg.sender, _name);
    }

    // -------------------------- View Functions --------------------------

    /**
     * @dev Returns all campaigns.
     */
    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    /**
     * @dev Returns all campaigns created by a user.
     */
    function getUserCampaigns(address _user) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    /**
     * @dev Returns the total number of campaigns.
     */
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
}
