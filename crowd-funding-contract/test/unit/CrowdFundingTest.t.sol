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

    function setUp() public {
        crowdFundingContract = new CrowdFunding({
            _name: "TestCampaign",
            _description: "This is a test campaign for CrowdFunding",
            _goal: 100 wei,
            _deadline: 1,
            _owner: owner
        });

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
}
