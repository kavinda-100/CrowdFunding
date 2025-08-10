// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {CrowdFundingFactory} from "../../src/CrowdFundingFactory.sol";
import {DeployCrowdFundingFactory} from "../../script/DeployCrowdFundingFactory.s.sol";

contract CrowdFundingFactoryTest is Test {
    // -------------------------- State Variables --------------------------

    // Instance of the CrowdFundingFactory contract
    CrowdFundingFactory factory;
    address public factoryContractOwner;

    // User addresses for testing
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    // users initial balances
    uint256 public usersInitialBalance = 10 ether;

    // -------------------------- Events --------------------------
    event CampaignCreated(address indexed campaignAddress, address indexed owner, string campaignName);

    // -------------------------- Setup Function --------------------------
    function setUp() public {
        DeployCrowdFundingFactory deployer = new DeployCrowdFundingFactory();
        factory = deployer.run();
        factoryContractOwner = factory.owner();

        // set initial balances for users
        vm.deal(user1, usersInitialBalance);
        vm.deal(user2, usersInitialBalance);
    }

    // --------------------------- Modifier for tests ---------------------------

    /**
     * @param _owner The address of the owner of the campaign.
     * @notice This modifier deploys a new CrowdFunding contract instance via the factory.
     */
    modifier DeployCrowdFundingContractViaFactory(address _owner) {
        // deploy a CrowdFunding contract
        vm.startPrank(_owner);

        factory.createCampaign({
            _name: "Test Campaign",
            _description: "This is a test campaign",
            _goal: 100 wei,
            _deadline: 1
        });

        vm.stopPrank();
        _;
    }

    // -------------------------- Tests for deployment of CrowdFunding contract --------------------------

    /**
     * @notice Test the deployment of a CrowdFunding contract via the factory contract
     */
    function test_ContactDeployViaFactory() public {
        // Check the number of campaigns
        uint256 campaignCount = factory.getCampaignCount();
        assertEq(campaignCount, 0);

        // deploy a CrowdFunding contract
        vm.startPrank(user1);

        factory.createCampaign({
            _name: "Test Campaign",
            _description: "This is a test campaign",
            _goal: 100 wei,
            _deadline: 1
        });

        vm.stopPrank();

        // Check the number of campaigns
        campaignCount = factory.getCampaignCount();
        assertEq(campaignCount, 1);
    }

    /**
     * @notice Test the deployment of a CrowdFunding contract via the factory contract
     * emit an event.
     */
    function test_ContactDeployViaFactoryEmitAnEvent() public {
        // deploy a CrowdFunding contract
        vm.startPrank(user1);

        // Expect the CampaignCreated event to be emitted
        vm.expectEmit(false, false, false, true);
        emit CampaignCreated(address(0), user1, "Test Campaign");

        factory.createCampaign({
            _name: "Test Campaign",
            _description: "This is a test campaign",
            _goal: 100 wei,
            _deadline: 1
        });

        vm.stopPrank();
    }

    /**
     * @notice Test the deployment of a CrowdFunding contract with a Invalid address
     * and check for invalid address revert.
     */
    function test_ContactDeployWithInvalidAddress() public DeployCrowdFundingContractViaFactory(user1) {
        // Check the number of campaigns
        uint256 campaignCount = factory.getCampaignCount();
        assertEq(campaignCount, 1);

        // try with invalid address
        vm.startPrank(address(0));
        vm.expectRevert(CrowdFundingFactory.CrowdFundingFactory__InvalidAddress.selector);
        factory.createCampaign({
            _name: "Test Campaign",
            _description: "This is a test campaign",
            _goal: 100 wei,
            _deadline: 1
        });
        vm.stopPrank();

        // Get the campaign details
        uint256 campaignCountAfter = factory.getCampaignCount();
        assertEq(campaignCountAfter, 1);
    }

    /**
     * @notice Test the details of a deployed campaign that belongs to a deployer has updated correctly
     */
    function test_IsDeployedContactDetailsAreCorrect() public DeployCrowdFundingContractViaFactory(user1) {
        // Get the deployed campaign details
        CrowdFundingFactory.Campaign[] memory userCampaigns = factory.getUserCampaigns(user1);

        assertEq(userCampaigns.length, 1);
        assertEq(userCampaigns[0].owner, user1);
        assertEq(userCampaigns[0].campaignName, "Test Campaign");
        assertEq(userCampaigns[0].createdAt, block.timestamp);
    }

    /**
     * @notice Test the campaign array has been updated after deploying a new campaign
     */
    function test_CampaignArrayHasUpdated() public DeployCrowdFundingContractViaFactory(user1) {
        // Get the deployed campaign details
        CrowdFundingFactory.Campaign[] memory allCampaigns = factory.getAllCampaigns();

        assertEq(allCampaigns.length, 1);
        assertEq(allCampaigns[0].owner, user1);
        assertEq(allCampaigns[0].campaignName, "Test Campaign");
        assertEq(allCampaigns[0].createdAt, block.timestamp);
    }
}
