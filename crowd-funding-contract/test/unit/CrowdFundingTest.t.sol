// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {CrowdFunding} from "../../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
    CrowdFunding crowdFundingContract;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    uint256 public usersInitialBalance = 10 ether;

    // --------------------- Events ---------------------
    event CampaignFunded(address indexed donor, uint256 amount);
    event CampaignWithdrawn(address indexed owner, uint256 amount);

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
}
