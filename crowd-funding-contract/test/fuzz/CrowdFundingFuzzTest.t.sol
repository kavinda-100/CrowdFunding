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
}
