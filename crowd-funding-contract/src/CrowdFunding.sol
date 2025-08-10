// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CrowdFunding
 * @author Kavinda Rathnayake
 * @notice This contract allows users to create and manage crowdfunding campaigns.
 */
contract CrowdFunding is Ownable {
    // --------------------- Errors ---------------------
    error CrowdFunding__InsufficientFunds();
    error CrowdFunding__CampaignHasEnded();
    error CrowdFunding__CampaignGoalNotMetYet();
    error CrowdFunding__TransferFailed();
    error CrowdFunding__InvalidTierIndex();
    error CrowdFunding__TierAmountMustBeGreaterThanZero();
    error CrowdFunding__CampaignRefundNotAllowed();
    error CrowdFunding__NoContributionMade();
    error CrowdFunding__CampaignHasPaused();

    // --------------------- Events ---------------------
    event CampaignFunded(address indexed donor, uint256 amount);
    event CampaignWithdrawn(address indexed owner, uint256 amount);
    event CampaignRefunded(address indexed backer, uint256 amount);

    // --------------------- State Variables ---------------------
    string private campaignName; // Name of the crowdfunding campaign
    string private campaignDescription; // Description of the campaign
    uint256 private campaignGoal; // Funding goal for the campaign example: 100 wei
    uint256 private campaignDeadline; // Deadline for the campaign example: block.timestamp + 30 days
    bool private pause; // Pause state of the contract

    struct Tier {
        string name; // Name of the tier
        uint256 amount; // Amount required to fund this tier
        uint256 backers; // Number of backers for this tier
    } // tiers for the campaign

    struct Backer {
        uint256 totalContribution; // Total amount contributed by the backer
        mapping(uint256 => bool) fundedTiers; // Mapping of tier index to contribution status
    }

    Tier[] private tiers; // Array to store different funding tiers
    mapping(address => Backer) private backers; // Mapping of backer addresses to their information

    enum CampaignStatus {
        Active,
        Successful,
        Failed
    } // Status of the campaign

    CampaignStatus private currentCampaignStatus; // Current status of the campaign

    // ------------------------------ Modifiers ------------------------------

    /**
     * @notice This modifier checks if the campaign is active.
     * @dev It reverts if the campaign is not active.
     */
    modifier onlyActiveCampaign() {
        // Only check if campaign ended due to deadline, not due to goal reached
        if (block.timestamp >= campaignDeadline) {
            currentCampaignStatus =
                address(this).balance >= campaignGoal ? CampaignStatus.Successful : CampaignStatus.Failed;
        }

        if (currentCampaignStatus != CampaignStatus.Active) {
            revert CrowdFunding__CampaignHasEnded();
        }
        _;
    }

    modifier onlyWhenNotPaused() {
        if (pause) {
            revert CrowdFunding__CampaignHasPaused();
        }
        _;
    }

    // ------------------------------ Constructor ------------------------------

    constructor(string memory _name, string memory _description, uint256 _goal, uint256 _deadline, address _owner)
        Ownable(_owner)
    {
        campaignName = _name;
        campaignDescription = _description;
        campaignGoal = _goal;
        /**
         * user needs to specify the duration in numbers, here it converts to days.
         * (example: user passes 1 for 1 day)
         */
        campaignDeadline = block.timestamp + (_deadline * 1 days);
        currentCampaignStatus = CampaignStatus.Active;
    }

    // -------------------------- Public/External Functions --------------------------

    /**
     * @notice This function allows users to fund the campaign.
     * @dev This function can only be called before the campaign deadline.
     */
    function fund(uint256 _tierIndex) external payable onlyActiveCampaign onlyWhenNotPaused {
        // check if the tier index is valid
        if (_tierIndex >= tiers.length) {
            revert CrowdFunding__InvalidTierIndex();
        }
        // check the values
        if (msg.value < tiers[_tierIndex].amount) {
            revert CrowdFunding__InsufficientFunds();
        }
        // Update the backers count for the selected tier
        tiers[_tierIndex].backers += 1;

        // Update the backer's total contribution
        backers[msg.sender].totalContribution += msg.value;
        backers[msg.sender].fundedTiers[_tierIndex] = true;

        // Check the campaign status and update it if necessary
        _checkCampaignStatus();

        // Emit the CampaignFunded event
        emit CampaignFunded(msg.sender, msg.value);
    }

    /**
     * @notice This function allows the owner to withdraw funds from the campaign.
     * @dev This function can only be called by the owner of the contract.
     */
    function withdraw() external onlyOwner {
        // Check the campaign status
        _checkCampaignStatus();

        // check the goal has met
        if (currentCampaignStatus != CampaignStatus.Successful) {
            revert CrowdFunding__CampaignGoalNotMetYet();
        }
        // transfer the balance to the owner
        uint256 balance = address(this).balance;
        (bool success,) = payable(owner()).call{value: balance}("");
        if (!success) {
            revert CrowdFunding__TransferFailed();
        }

        // Emit the CampaignWithdrawn event
        emit CampaignWithdrawn(owner(), balance);
    }

    /**
     * @notice This function allows the owner to add a new funding tier to the campaign.
     * @param _name The name of the funding tier.
     * @param _amount The amount required to fund this tier.
     */
    function addTier(string memory _name, uint256 _amount) external onlyOwner {
        // _amount must be greater than 0
        if (_amount == 0) {
            revert CrowdFunding__TierAmountMustBeGreaterThanZero();
        }
        // Create a new tier and add it to the tiers array
        Tier memory newTier = Tier({name: _name, amount: _amount, backers: 0});
        tiers.push(newTier);
    }

    /**
     * @notice This function allows the owner to remove a funding tier from the campaign.
     * @param _index The index of the funding tier to remove.
     */
    function removeTier(uint256 _index) external onlyOwner {
        // Check if the index is valid
        if (_index >= tiers.length) {
            revert CrowdFunding__InvalidTierIndex();
        }
        // Remove the tier by replacing it with the last tier and then popping the array
        tiers[_index] = tiers[tiers.length - 1];
        tiers.pop();
    }

    /**
     * @notice This function allows backers to refund their contributions if the campaign has failed.
     * @dev This function can only be called by backers who have contributed to the campaign.
     */
    function refund() external {
        // check camping state
        _checkCampaignStatus();

        // Check if the campaign has ended
        if (currentCampaignStatus != CampaignStatus.Failed) {
            revert CrowdFunding__CampaignRefundNotAllowed();
        }

        // Check if the backer has contributed
        Backer storage backer = backers[msg.sender];
        if (backer.totalContribution == 0) {
            revert CrowdFunding__NoContributionMade();
        }

        // Refund the backer's contribution
        uint256 amountToRefund = backer.totalContribution;
        backer.totalContribution = 0; // Reset the contribution to prevent re-entrancy attacks

        (bool success,) = payable(msg.sender).call{value: amountToRefund}("");
        if (!success) {
            revert CrowdFunding__TransferFailed();
        }

        emit CampaignRefunded(msg.sender, amountToRefund);
    }

    /**
     * @notice This function allows the owner to pause or unpause the campaign.
     * @dev This function can only be called by the owner of the contract.
     */
    function togglePause() external onlyOwner {
        pause = !pause; // Toggle the pause state
    }

    /**
     * @notice This function allows the owner to extend the campaign deadline.
     * @param _additionalDays The number of additional days to extend the deadline.
     */
    function extendCampaignDeadline(uint256 _additionalDays) external onlyOwner onlyActiveCampaign {
        // Extend the campaign deadline by the specified number of days
        campaignDeadline += _additionalDays * 1 days;
    }

    // ------------------------------ Internal Functions ------------------------------

    /**
     * @notice This function checks the status of the campaign and updates it accordingly.
     * @dev It is called internally to update the campaign status based on the current time and balance.
     */
    function _checkCampaignStatus() internal {
        if (currentCampaignStatus == CampaignStatus.Active) {
            if (block.timestamp >= campaignDeadline) {
                currentCampaignStatus =
                    address(this).balance >= campaignGoal ? CampaignStatus.Successful : CampaignStatus.Failed; // Mark as failed if goal not met
            } else {
                currentCampaignStatus =
                    address(this).balance >= campaignGoal ? CampaignStatus.Successful : CampaignStatus.Active; // Mark as active if goal not met
            }
        }
    }

    // -------------------------- View Functions --------------------------

    /**
     * @notice This function allows users to view the current balance of the campaign.
     */
    function getCampaignBalance() external view returns (uint256) {
        return address(this).balance; // Returns the contract's balance
    }

    /**
     * @notice This function allows users to view the different funding tiers for the campaign.
     */
    function getFundingTiers() external view returns (Tier[] memory) {
        return tiers;
    }
    /**
     * @notice This function allows users to view information about a specific funding tier.
     * @param _index The index of the funding tier to view.
     */

    function getFundingTierInfo(uint256 _index) external view returns (Tier memory) {
        if (_index >= tiers.length) {
            revert CrowdFunding__InvalidTierIndex();
        }
        return tiers[_index];
    }

    /**
     * @notice This function allows users to view the total number of funding tiers.
     */
    function getTierCount() external view returns (uint256) {
        return tiers.length;
    }

    /**
     * @notice This function allows users to view the total contribution made by a specific backer.
     * @param _backer The address of the backer.
     */
    function getBackerAmount(address _backer) external view returns (uint256) {
        // Return the total contribution made by the backer
        return backers[_backer].totalContribution;
    }

    /**
     * @notice This function allows users to check if a specific backer has funded a particular tier.
     * @param _backer The address of the backer.
     * @param _tierIndex The index of the funding tier to check.
     */
    function getBackerHasFundedTier(address _backer, uint256 _tierIndex) external view returns (bool) {
        // Check if the tier index is valid
        if (_tierIndex >= tiers.length) {
            revert CrowdFunding__InvalidTierIndex();
        }
        // Return whether the backer has funded the specified tier
        return backers[_backer].fundedTiers[_tierIndex];
    }

    /**
     * @notice This function allows users to check the current status of the campaign.
     * @dev It returns the status based on the current time and balance.
     */
    function getCampaignStatus() external view returns (CampaignStatus) {
        if (currentCampaignStatus == CampaignStatus.Active) {
            // If the campaign is still active, check the deadline and balance
            if (block.timestamp >= campaignDeadline) {
                return address(this).balance >= campaignGoal ? CampaignStatus.Successful : CampaignStatus.Failed; // Mark as failed if goal not met
            }
        }
        return currentCampaignStatus; // Returns the current status of the campaign
    }

    /**
     * @notice This function allows users to view the current status of the campaign.
     * @dev It returns the status as it is without any modifications.
     */
    function getCampaignStatusRow() external view returns (CampaignStatus) {
        return currentCampaignStatus;
    }

    /**
     * @notice This function allows users to check if the campaign is paused.
     * @dev It returns the pause state of the contract.
     */
    function getIsPaused() external view returns (bool) {
        return pause; // Returns the current pause state of the contract
    }

    /**
     * @notice This function allows users to view the campaign name.
     */
    function getCampaignName() external view returns (string memory) {
        return campaignName;
    }

    /**
     * @notice This function allows users to view the campaign description.
     */
    function getCampaignDescription() external view returns (string memory) {
        return campaignDescription;
    }

    /**
     * @notice This function allows users to view the campaign goal.
     */
    function getCampaignGoal() external view returns (uint256) {
        return campaignGoal;
    }

    /**
     * @notice This function allows users to view the campaign deadline.
     */
    function getCampaignDeadline() external view returns (uint256) {
        return campaignDeadline;
    }
}
