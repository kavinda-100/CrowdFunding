// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {CrowdFunding} from "../../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
    // -------------------------- State Variables --------------------------

    CrowdFunding crowdFundingContract;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    uint256 public usersInitialBalance = 10 ether;

    // --------------------- Events ---------------------
    event CampaignFunded(address indexed donor, uint256 amount);
    event CampaignWithdrawn(address indexed owner, uint256 amount);
    event CampaignRefunded(address indexed backer, uint256 amount);

    // -------------------------- Setup Function --------------------------
    function setUp() public {
        // Set initial balances for users
        vm.deal(user1, usersInitialBalance);
        vm.deal(user2, usersInitialBalance);
    }

    // --------------------------- Modifier for tests ---------------------------

    /**
     * @param _owner The address of the owner of the campaign.
     * @notice This modifier deploys a new CrowdFunding contract instance.
     */
    modifier DeployCrowdFundingContract(address _owner) {
        vm.startPrank(_owner);

        // Create a new CrowdFunding contract instance
        crowdFundingContract = new CrowdFunding({
            _name: "TestCampaign",
            _description: "This is a test campaign for CrowdFunding",
            _goal: 100 wei,
            _deadline: 1,
            _owner: _owner
        });

        vm.stopPrank();
        _;
    }

    /**
     * @param _owner The address of the owner of the campaign.
     * @notice This modifier creates tiers for the CrowdFunding contract.
     */
    modifier CreateAnTiers(address _owner) {
        vm.startPrank(_owner);

        // Create a new Tier instances
        crowdFundingContract.addTier({_name: "Basic", _amount: 10 wei});
        crowdFundingContract.addTier({_name: "Standard", _amount: 20 wei});
        crowdFundingContract.addTier({_name: "Pro", _amount: 25 wei});

        vm.stopPrank();
        _;
    }

    // --------------------------- CrowdFunding contract creation tests ---------------------------

    /**
     * @notice This function tests the creation of a new CrowdFunding contract.
     */
    function test_createContract() public {
        // create an instance of the CrowdFunding contract
        CrowdFunding newCampaign = new CrowdFunding({
            _name: "NewCampaign",
            _description: "This is a new campaign",
            _goal: 200 wei,
            _deadline: 2,
            _owner: owner
        });

        // check that the new campaign is created successfully
        assertEq("NewCampaign", newCampaign.getCampaignName());
        assertEq("This is a new campaign", newCampaign.getCampaignDescription());
        assertEq(200 wei, newCampaign.getCampaignGoal());
        assertEq(block.timestamp + (2 * 1 days), newCampaign.getCampaignDeadline());
        assertEq(owner, newCampaign.owner());
        assert(newCampaign.getCampaignStatusRow() == newCampaign.getCampaignStatus());
    }

    // ---------------------------------- Fund function related tests ---------------------------

    /**
     * @notice This function tests the funding of a campaign.
     * It checks if the funding is successful and updates the campaign balance and backers.
     */
    function test_fundCampaign() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User1 funds the campaign
        // 0 -> is the tier index
        vm.startPrank(user1);
        crowdFundingContract.fund{value: 10 wei}(0); // 0 -> Basic tier

        // Check that the funding was successful
        assertEq(crowdFundingContract.getFundingTierInfo(0).backers, 1);
        assertEq(crowdFundingContract.getFundingTierInfo(0).amount, 10 wei);
        assertEq(crowdFundingContract.getCampaignBalance(), 10 wei);
        assert(crowdFundingContract.getCampaignStatusRow() == crowdFundingContract.getCampaignStatus());

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign emit an event.
     */
    function test_fundCampaignEmitEvent() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User1 funds the campaign
        // 0 -> is the tier index
        vm.startPrank(user1);

        // Expect the CampaignFunded event to be emitted
        vm.expectEmit(true, false, false, true);
        emit CampaignFunded(user1, 10 wei);

        // User1 funds the campaign
        crowdFundingContract.fund{value: 10 wei}(0); // 0 -> Basic tier

        // Check that the funding was successful
        assertEq(crowdFundingContract.getFundingTierInfo(0).backers, 1);
        assertEq(crowdFundingContract.getFundingTierInfo(0).amount, 10 wei);
        assertEq(crowdFundingContract.getCampaignBalance(), 10 wei);

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign with an invalid tier index.
     */
    function test_InvalidTierIndex() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User1 tries to fund with an invalid tier index
        vm.startPrank(user1);

        // Expect revert due to invalid tier index
        vm.expectRevert(CrowdFunding.CrowdFunding__InvalidTierIndex.selector);
        crowdFundingContract.fund{value: 10 wei}(3); // 3 -> Invalid tier index

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign with insufficient funds.
     * It checks that the transaction reverts with the correct error message.
     * 0 index is the Basic tier and it requires 10 wei to fund.
     */
    function test_InsufficientFunds() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User1 tries to fund with insufficient funds
        vm.startPrank(user1);

        // Expect revert due to insufficient funds
        vm.expectRevert(CrowdFunding.CrowdFunding__InsufficientFunds.selector);
        crowdFundingContract.fund{value: 5 wei}(0); // 5 wei < 10 wei required for Basic tier

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign by a backer.
     * It checks that the backer's details are updated correctly after funding.
     */
    function test_fundCampaign_BackerDetails() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User1 funds the campaign
        // 0 -> is the tier index
        vm.startPrank(user1);
        crowdFundingContract.fund{value: 10 wei}(0); // 0 -> Basic tier

        // Check that the funding was successful
        assertEq(crowdFundingContract.getBackerAmount(user1), 10 wei); // total contribution
        assertTrue(crowdFundingContract.getBackerHasFundedTier(user1, 0)); // check if Basic tier is funded

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign after the deadline.
     * @dev It checks that the transaction reverts with the correct error message.
     */
    function test_CanNotFundAfterDeadline() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Fast forward time to after the campaign deadline
        vm.warp(block.timestamp + 2 days + 1);

        // User1 tries to fund the campaign after the deadline
        vm.startPrank(user1);

        // Expect revert due to campaign has ended
        vm.expectRevert(CrowdFunding.CrowdFunding__CampaignHasEnded.selector);
        crowdFundingContract.fund{value: 10 wei}(0); // 0 -> Basic tier

        // Check the campaign status
        // 2 -> Failed (Enum)
        assertEq(2, uint256(crowdFundingContract.getCampaignStatus()));

        vm.stopPrank();
    }

    /**
     * @notice This function tests the funding of a campaign while it is paused.
     * @dev It checks that the transaction reverts with the correct error message.
     */
    function test_CanNotFundIfPaused() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Pause the campaign
        vm.startPrank(user1);
        crowdFundingContract.togglePause();

        // User1 tries to fund the campaign while it is paused
        vm.expectRevert(CrowdFunding.CrowdFunding__CampaignHasPaused.selector);
        crowdFundingContract.fund{value: 10 wei}(0); // 0 -> Basic tier

        vm.stopPrank();
    }

    // -------------------------------- Withdraw Function Test -------------------------------

    /**
     * @notice This function tests the withdrawal of funds from a campaign.
     * It checks that the owner can withdraw the funds successfully and the campaign balance is zero after withdrawal.
     */
    function test_withdrawFunds() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Debug: Check initial campaign state
        console2.log("Initial campaign status:", uint256(crowdFundingContract.getCampaignStatus()));
        console2.log("Campaign deadline:", crowdFundingContract.getCampaignDeadline());
        console2.log("Current timestamp:", block.timestamp);
        console2.log("Campaign goal:", crowdFundingContract.getCampaignGoal());

        // User2 funds the campaign to reach exactly the goal
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier
        console2.log("contract balance", crowdFundingContract.getCampaignBalance()); // for debugging
        vm.stopPrank();

        console2.log("contract status", uint256(crowdFundingContract.getCampaignStatus())); // for debugging

        // Owner (user1) withdraws the funds
        vm.startPrank(user1);

        // Expect the CampaignWithdrawn event to be emitted
        vm.expectEmit(true, false, false, true);
        emit CampaignWithdrawn(user1, 100 wei);

        // Withdraw the funds
        crowdFundingContract.withdraw();

        // Check that the campaign balance is zero after withdrawal
        assertEq(crowdFundingContract.getCampaignBalance(), 0 wei);

        vm.stopPrank();
    }

    /**
     * @notice This function tests the withdrawal of funds from a campaign when the goal is not met.
     * It checks that the user can withdraw their funds if the campaign goal is not met.
     */
    function test_withdrawFundIfGoalHasNotMet() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Fund the campaign with less than the goal
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier
        vm.stopPrank();

        // Fast forward time to after the campaign deadline
        vm.warp(block.timestamp + 2 days + 1);

        // User1 tries to withdraw funds before the goal is met
        vm.startPrank(user1);

        // Expect revert due to campaign goal not met
        vm.expectRevert(CrowdFunding.CrowdFunding__CampaignGoalNotMetYet.selector);
        crowdFundingContract.withdraw();

        // Check the campaign status
        // 2 -> Failed (Enum)
        assertEq(2, uint256(crowdFundingContract.getCampaignStatus()));

        // Check that the campaign balance is greater than zero
        assert(crowdFundingContract.getCampaignBalance() > 0);

        vm.stopPrank();
    }

    /**
     * @notice This function tests that only the owner can withdraw funds from the campaign.
     * It checks that a non-owner cannot withdraw funds and reverts with the correct error message.
     */
    function test_WithdrawCanOnlyCallByOwner() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 tries to withdraw funds
        vm.startPrank(user2);

        // Expect revert due to only owner can withdraw
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user2));
        crowdFundingContract.withdraw();

        vm.stopPrank();
    }

    // ---------------------------------- Campaign Tiers Tests (add Tier) ---------------------------

    /**
     * @notice This function tests the addition of tiers to the campaign.
     * It checks that the tiers are added successfully and the tier count is updated.
     */
    function test_addTier() public DeployCrowdFundingContract(user1) {
        vm.startPrank(user1);

        // Create a new Tier instances
        crowdFundingContract.addTier({_name: "Basic", _amount: 10 wei});
        crowdFundingContract.addTier({_name: "Standard", _amount: 20 wei});
        crowdFundingContract.addTier({_name: "Pro", _amount: 25 wei});

        vm.stopPrank();

        // Check updated tier count
        assertEq(crowdFundingContract.getTierCount(), 3);
    }

    /**
     * @notice This function tests that the tier amount must be greater than zero.
     * It checks that adding a tier with zero amount reverts with the correct error message.
     */
    function test_tierAmountMustBeGreaterThanZero() public DeployCrowdFundingContract(user1) {
        vm.startPrank(user1);

        // Expect revert due to tier amount must be greater than zero
        vm.expectRevert(CrowdFunding.CrowdFunding__TierAmountMustBeGreaterThanZero.selector);
        crowdFundingContract.addTier({_name: "Free", _amount: 0 wei});

        vm.stopPrank();
    }

    /**
     * @notice This function tests that only the owner can add a tier.
     * It checks that a non-owner cannot add a tier and reverts with the correct error message.
     */
    function test_OnlyOwnerCanAddTier() public DeployCrowdFundingContract(user1) {
        // User2 tries to add a tier
        vm.startPrank(user2);

        // Expect revert due to only owner can add tier
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user2));
        crowdFundingContract.addTier({_name: "Basic", _amount: 10 wei});

        vm.stopPrank();
    }

    /**
     * @notice This function tests the retrieval of tier information.
     * It checks that the tier information is returned correctly after funding.
     */
    function test_getTierInfo() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Check the tier information
        CrowdFunding.Tier memory tier = crowdFundingContract.getFundingTierInfo(0); // 0 -> Basic tier

        assertEq(tier.name, "Basic");
        assertEq(tier.amount, 10 wei);
        assertEq(tier.backers, 0); // No backers yet

        // fund the Basic tier
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 10 wei}(0);
        vm.stopPrank();

        // Check the updated tier information
        tier = crowdFundingContract.getFundingTierInfo(0); // 0 -> Basic tier
        assertEq(tier.backers, 1); // One backer now
    }

    /**
     * @notice This function tests that an invalid tier index reverts with the correct error message.
     * It checks that trying to access a non-existent tier index reverts.
     */
    function test_InvalidTierIndexInTierInfo() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Check the tier information
        vm.expectRevert(CrowdFunding.CrowdFunding__InvalidTierIndex.selector);
        crowdFundingContract.getFundingTierInfo(100); // Invalid index
    }

    // ---------------------------------- Campaign Tiers Tests (remove Tier) ---------------------------

    /**
     * @notice This function tests the removal of a tier from the campaign.
     * It checks that the tier is removed successfully and the tier count is updated.
     */
    function test_removeTier() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        vm.startPrank(user1);

        // Remove the first tier (Basic)
        crowdFundingContract.removeTier(0);

        vm.stopPrank();

        // Check updated tier count
        assertEq(crowdFundingContract.getTierCount(), 2);
    }

    /**
     * @notice This function tests that only the owner can remove a tier.
     * It checks that a non-owner cannot remove a tier and reverts with the correct error message.
     */
    function test_OnlyOwnerCanRemoveTier() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 tries to remove a tier
        vm.startPrank(user2);

        // Expect revert due to only owner can remove tier
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user2));
        crowdFundingContract.removeTier(0); // 0 -> Basic tier

        vm.stopPrank();
    }

    /**
     * @notice This function tests that an invalid tier index reverts with the correct error message.
     * It checks that trying to remove a non-existent tier index reverts.
     */
    function test_InvalidTierIndexInRemoveTier() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        vm.startPrank(user1);
        // Check the tier information
        vm.expectRevert(CrowdFunding.CrowdFunding__InvalidTierIndex.selector);
        crowdFundingContract.removeTier(100); // Invalid index
        vm.stopPrank();
    }

    // ------------------------------------------ Toggle Pause test ------------------------------------------

    /**
     * @notice This function tests the toggle pause functionality of the campaign.
     * It checks that the owner can pause and unpause the campaign successfully.
     */
    function test_togglePause() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Check initial pause state
        assertFalse(crowdFundingContract.getIsPaused());

        // Owner toggles pause
        vm.startPrank(user1);
        crowdFundingContract.togglePause();
        assertTrue(crowdFundingContract.getIsPaused());

        // Owner toggles pause again
        crowdFundingContract.togglePause();
        assertFalse(crowdFundingContract.getIsPaused());

        vm.stopPrank();
    }

    // ------------------------------------------ Extend deadline test ------------------------------------------

    /**
     * @notice This function tests the extend deadline functionality of the campaign.
     * It checks that the owner can extend the campaign deadline successfully.
     */
    function test_extendDeadline() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Check initial deadline
        uint256 initialDeadline = crowdFundingContract.getCampaignDeadline();
        assertEq(initialDeadline, block.timestamp + 1 days);

        // Owner extends the deadline
        vm.startPrank(user1);
        crowdFundingContract.extendCampaignDeadline(2); // Extend by 2 days (function converts 2 into 2 days)

        // Check updated deadline
        uint256 updatedDeadline = crowdFundingContract.getCampaignDeadline();
        assertEq(updatedDeadline, initialDeadline + 2 days);

        vm.stopPrank();
    }

    /**
     * @notice This function tests that only the owner can extend the campaign deadline.
     * It checks that a non-owner cannot extend the deadline and reverts with the correct error message.
     */
    function test_OnlyOwnerCanExtendDeadline() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 tries to extend the deadline
        vm.startPrank(user2);

        // Expect revert due to only owner can extend deadline
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user2));
        crowdFundingContract.extendCampaignDeadline(2); // Extend by 2 days

        vm.stopPrank();
    }

    /**
     * @notice This function tests that the campaign deadline can only be extended when the campaign is active.
     * It checks that trying to extend the deadline after the campaign has ended reverts with the correct error message.
     */
    function test_CanOnlyExtendWhenCampaignIsActive() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Fast forward time to after the campaign deadline
        vm.warp(block.timestamp + 2 days + 1);

        // User1 tries to extend the deadline after the campaign has ended
        vm.startPrank(user1);

        // Expect revert due to campaign has ended
        vm.expectRevert(CrowdFunding.CrowdFunding__CampaignHasEnded.selector);
        crowdFundingContract.extendCampaignDeadline(2); // Extend by 2 days

        vm.stopPrank();
    }

    // ----------------------------------  Refund tests --------------------------------------------------

    /**
     * @notice This function tests that users can refund their contributions after the campaign has failed.
     * It checks that the user's balance is restored after a successful refund.
     */
    function test_refund() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 funds the campaign
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier

        // Fast forward time to after the campaign deadline
        vm.warp(block.timestamp + 2 days + 1);

        // User2 tries to refund
        crowdFundingContract.refund();

        // Check that the user2 balance is restored
        assertEq(user2.balance, usersInitialBalance);

        // check that the user's total contribution is reset
        assertEq(crowdFundingContract.getBackerAmount(user2), 0);

        vm.stopPrank();
    }

    /**
     * @notice This function tests that users cannot refund their contributions while the campaign is active.
     */
    function test_CanNotRefundIfCampaignIsActive() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 funds the campaign
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier

        // User2 tries to refund while the campaign is active
        vm.expectRevert(CrowdFunding.CrowdFunding__CampaignRefundNotAllowed.selector);
        crowdFundingContract.refund();

        vm.stopPrank();
    }

    /**
     * @notice This function tests that users cannot refund their contributions if they have not contributed.
     */
    function test_CanNotRefundIfContributionIsZero() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 tries to refund without contributing
        vm.startPrank(user2);

        // pass the deadline
        vm.warp(block.timestamp + 2 days + 1);

        // Expect revert due to no contribution made
        vm.expectRevert(CrowdFunding.CrowdFunding__NoContributionMade.selector);
        crowdFundingContract.refund();

        vm.stopPrank();
    }

    /**
     * @notice This function tests that the CampaignRefunded event is emitted when a user successfully refunds.
     */
    function test_RefundEmitEvent() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // User2 funds the campaign
        vm.startPrank(user2);
        crowdFundingContract.fund{value: 25 wei}(2); // 2 -> Pro tier

        // Fast forward time to after the campaign deadline
        vm.warp(block.timestamp + 2 days + 1);

        // Expect the CampaignRefunded event to be emitted
        vm.expectEmit(true, false, false, true);
        emit CampaignRefunded(user2, 25 wei);

        // User2 tries to refund
        crowdFundingContract.refund();

        vm.stopPrank();
    }

    // ---------------------------------- Additional Coverage Tests ----------------------------------

    /**
     * @notice This function tests the getFundingTiers function.
     * It checks that all tiers are returned correctly.
     */
    function test_getFundingTiers() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Get all funding tiers
        CrowdFunding.Tier[] memory tiers = crowdFundingContract.getFundingTiers();

        // Check that 3 tiers are returned
        assertEq(tiers.length, 3);

        // Check tier details
        assertEq(tiers[0].name, "Basic");
        assertEq(tiers[0].amount, 10 wei);
        assertEq(tiers[0].backers, 0);

        assertEq(tiers[1].name, "Standard");
        assertEq(tiers[1].amount, 20 wei);
        assertEq(tiers[1].backers, 0);

        assertEq(tiers[2].name, "Pro");
        assertEq(tiers[2].amount, 25 wei);
        assertEq(tiers[2].backers, 0);
    }

    /**
     * @notice This function tests the getBackerHasFundedTier function with invalid tier index.
     * It checks that the function reverts with the correct error for invalid tier index.
     */
    function test_getBackerHasFundedTier_InvalidTierIndex()
        public
        DeployCrowdFundingContract(user1)
        CreateAnTiers(user1)
    {
        // Try to check if user has funded an invalid tier index
        vm.expectRevert(CrowdFunding.CrowdFunding__InvalidTierIndex.selector);
        crowdFundingContract.getBackerHasFundedTier(user1, 100); // Invalid tier index
    }

    // ---------------------------------- Transfer Failed Tests ----------------------------------

    /**
     * @notice This function tests the withdraw function when transfer fails.
     * We'll create a contract that cannot receive Ether to test the transfer failure.
     */
    function test_withdrawFunds_TransferFailed() public {
        // Deploy a contract that cannot receive Ether as the owner
        RejectEther rejectEtherContract = new RejectEther();

        vm.startPrank(address(rejectEtherContract));

        // Create crowdfunding contract with the RejectEther contract as owner
        CrowdFunding campaignWithBadOwner = new CrowdFunding({
            _name: "TestCampaign",
            _description: "This is a test campaign for CrowdFunding",
            _goal: 100 wei,
            _deadline: 1,
            _owner: address(rejectEtherContract)
        });

        // Add tiers
        campaignWithBadOwner.addTier({_name: "Basic", _amount: 10 wei});
        campaignWithBadOwner.addTier({_name: "Standard", _amount: 20 wei});
        campaignWithBadOwner.addTier({_name: "Pro", _amount: 25 wei});

        vm.stopPrank();

        // Fund the campaign to reach the goal
        vm.startPrank(user2);
        campaignWithBadOwner.fund{value: 100 wei}(2); // Fund with 100 wei to reach goal
        vm.stopPrank();

        // Try to withdraw as the owner (RejectEther contract)
        vm.startPrank(address(rejectEtherContract));

        // Expect the transfer to fail
        vm.expectRevert(CrowdFunding.CrowdFunding__TransferFailed.selector);
        campaignWithBadOwner.withdraw();

        vm.stopPrank();
    }

    /**
     * @notice This function tests the refund function when transfer fails.
     * We'll test by making the backer unable to receive Ether.
     */
    function test_refund_TransferFailed() public DeployCrowdFundingContract(user1) CreateAnTiers(user1) {
        // Deploy a contract that cannot receive Ether
        RejectEther rejectEtherContract = new RejectEther();

        // Fund the campaign from the RejectEther contract
        vm.deal(address(rejectEtherContract), 1000 wei);

        // Use a low-level call to fund from the contract (since it can send but not receive)
        vm.startPrank(address(rejectEtherContract));
        (bool success,) = address(crowdFundingContract).call{value: 25 wei}(abi.encodeWithSignature("fund(uint256)", 2));
        require(success, "Funding failed");
        vm.stopPrank();

        // Fast forward time to after the campaign deadline to make it failed
        vm.warp(block.timestamp + 2 days + 1);

        // Try to refund as the RejectEther contract
        vm.startPrank(address(rejectEtherContract));

        // Expect the refund transfer to fail
        vm.expectRevert(CrowdFunding.CrowdFunding__TransferFailed.selector);
        crowdFundingContract.refund();

        vm.stopPrank();
    }
}

/**
 * @notice Helper contract that rejects all Ether transfers
 * This is used to test transfer failure scenarios
 */
contract RejectEther {
// This contract will reject all Ether transfers by not having a receive or fallback function
// It can send Ether but cannot receive it
}
