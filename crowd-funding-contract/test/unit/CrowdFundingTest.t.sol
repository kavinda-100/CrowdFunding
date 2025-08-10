// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {CrowdFunding} from "../../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
    CrowdFunding crowdFundingContract;

    address public owner = makeAddr("owner");

    function setUp() public {
        crowdFundingContract = new CrowdFunding({
            _name: "TestCampaign",
            _description: "This is a test campaign for CrowdFunding",
            _goal: 100 wei,
            _deadline: 1,
            _owner: owner
        });
    }

    // --------------------------- CrowdFunding contract creation tests ---------------------------

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
