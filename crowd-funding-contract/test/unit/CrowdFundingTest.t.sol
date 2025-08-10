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

        vm.stopPrank();
    }
}
