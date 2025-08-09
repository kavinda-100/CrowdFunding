// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {CrowdFundingFactory} from "../../src/CrowdFundingFactory.sol";
import {DeployCrowdFundingFactory} from "../../script/DeployCrowdFundingFactory.s.sol";

contract CrowdFundingFactoryTest is Test {
    CrowdFundingFactory factory;

    function setUp() public {
        DeployCrowdFundingFactory deployer = new DeployCrowdFundingFactory();
        factory = deployer.run();
    }

    function testFactoryDeployment() public view {
        console2.log("CrowdFundingFactory test");
        console2.log("CrowdFundingFactory deployed at:", address(factory));
    }
}
