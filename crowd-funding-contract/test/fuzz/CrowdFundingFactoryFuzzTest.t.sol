// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {CrowdFundingFactory} from "../../src/CrowdFundingFactory.sol";

contract CrowdFundingFactoryFuzzTest is Test {
    CrowdFundingFactory factory;

    function setUp() public {
        factory = new CrowdFundingFactory();
    }

    // ---------------------------------------- Tests ----------------------------------------

    /**
     * @notice This function tests the creation of a new CrowdFunding contract via the factory.
     * @param _name The name of the campaign.
     * @param _description The description of the campaign.
     * @param _goal The funding goal of the campaign.
     * @param _deadline The deadline of the campaign.
     * @param _owner The owner of the campaign.
     * @param _deployRounds The number of times to deploy the campaign.
     */
    function test_fuzzContactDeployViaFactory(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _deadline,
        address _owner,
        uint256 _deployRounds
    ) public {
        _goal = bound(_goal, 1, 100 ether); // Use bound instead of assume
        _deadline = bound(_deadline, 1, 365); // 1 to 365 days
        _deployRounds = bound(_deployRounds, 1, 10); // 1 to 10 rounds
        vm.assume(_owner != address(0));

        for (uint256 i = 0; i < _deployRounds; i++) {
            vm.deal(_owner, 1000 ether);

            vm.startPrank(_owner);
            // create an instance of the CrowdFunding contract via factory
            factory.createCampaign({_name: _name, _description: _description, _goal: _goal, _deadline: _deadline});
            vm.stopPrank();

            // check that the campaign was created successfully
            CrowdFundingFactory.Campaign[] memory campaigns = factory.getUserCampaigns(_owner);
            assertEq(campaigns[0].campaignName, _name);
            assertEq(campaigns[0].createdAt, block.timestamp);
            assertEq(campaigns[0].owner, _owner);
        }

        assertEq(factory.getCampaignCount(), _deployRounds);
    }
}
