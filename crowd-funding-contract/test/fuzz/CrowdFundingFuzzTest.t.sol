// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {CrowdFunding} from "../../src/CrowdFunding.sol";

contract CrowdFundingFuzzTest is Test {
    // -------------------------- Setup Function --------------------------
    function setUp() public {}

    // --------------------------- CrowdFunding contract creation tests ---------------------------

    /**
     * @notice This function tests the creation of a new CrowdFunding contract.
     */
    function test_fuzzCreateContract(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _deadline,
        address _owner
    ) public {
        // More permissive constraints to avoid too many rejections
        _goal = bound(_goal, 1, 100 ether); // Use bound instead of assume
        _deadline = bound(_deadline, 1, 365); // 1 to 365 days
        vm.assume(_owner != address(0));

        vm.deal(_owner, 1000 ether);

        vm.startPrank(_owner);
        // create an instance of the CrowdFunding contract
        CrowdFunding newCampaign = new CrowdFunding({
            _name: _name,
            _description: _description,
            _goal: _goal,
            _deadline: _deadline,
            _owner: _owner
        });

        // Calculate expected deadline (constructor adds _deadline * 1 days to block.timestamp)
        uint256 expectedDeadline = block.timestamp + (_deadline * 1 days);

        // check that the new campaign is created successfully
        assertEq(_name, newCampaign.getCampaignName());
        assertEq(_description, newCampaign.getCampaignDescription());
        assertEq(_goal, newCampaign.getCampaignGoal());
        assertEq(expectedDeadline, newCampaign.getCampaignDeadline());
        assertEq(_owner, newCampaign.owner());

        vm.stopPrank();
    }

    /**
     * @notice This function tests the creation of a new CrowdFunding contract with a specific owner.
     * then check that the owner can withdraw funds successfully
     */
    function test_fuzzWithdrawFunds(
        string memory _name,
        string memory _description,
        address _owner,
        address _user,
        string memory _tier_name
    ) public {
        // constraints
        vm.assume(_owner != address(0));
        vm.assume(_user != address(0));

        vm.deal(_owner, 1000 ether);
        vm.deal(_user, 1000 ether);

        uint256 _tier_amount = 100 wei; // Fixed amount for the tier

        vm.startPrank(_owner);
        // create an instance of the CrowdFunding contract
        CrowdFunding newCampaign =
            new CrowdFunding({_name: _name, _description: _description, _goal: 100 wei, _deadline: 1, _owner: _owner});
        // Create a tier in the campaign
        newCampaign.addTier(_tier_name, _tier_amount);
        vm.stopPrank();

        // fund the tier
        vm.startPrank(_user);
        newCampaign.fund{value: _tier_amount}(0); // 0 -> first tier
        vm.stopPrank();

        // Check that the tier was funded successfully
        CrowdFunding.Tier memory tier = newCampaign.getFundingTierInfo(0);
        assertEq(tier.backers, 1); // One backer
        assertEq(tier.amount, _tier_amount);

        // Check that the contract balance is correct
        assertEq(newCampaign.getCampaignBalance(), _tier_amount);

        // warp the day
        vm.warp(block.timestamp + 2 days);

        // Withdraw funds from the campaign
        vm.startPrank(_owner);
        newCampaign.withdraw();
        vm.stopPrank();

        // Check that the owner can withdraw funds successfully
        assertEq(newCampaign.getCampaignBalance(), 0);
    }

    /**
     * @notice This function tests the creation of a new tier in the CrowdFunding contract.
     */
    function test_fuzzCreateTiers(string memory _name, uint256 _amount) public {
        // More permissive constraints to avoid too many rejections
        _amount = bound(_amount, 1 ether, 100 ether); // Use bound instead of assume

        vm.startPrank(msg.sender);

        // Create a new CrowdFunding contract instance
        CrowdFunding newCampaign = new CrowdFunding({
            _name: "Test Campaign",
            _description: "This is a test campaign",
            _goal: 100 ether,
            _deadline: 30,
            _owner: msg.sender
        });

        // Create a tier in the campaign
        newCampaign.addTier(_name, _amount);

        // Check that the tier was created successfully
        // Check the tier information
        CrowdFunding.Tier memory tier = newCampaign.getFundingTierInfo(0); // 0 -> what ever the tier
        assertEq(tier.name, _name);
        assertEq(tier.amount, _amount);
        assertEq(tier.backers, 0); // No backers yet
    }
}
