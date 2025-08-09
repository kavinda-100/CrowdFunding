// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {CrowdFundingFactory} from "../src/CrowdFundingFactory.sol";

contract DeployCrowdFundingFactory is Script {
    function run() external returns (CrowdFundingFactory) {
        console2.log("Deploying CrowdFundingFactory...");

        vm.startBroadcast();
        CrowdFundingFactory factory = new CrowdFundingFactory();
        vm.stopBroadcast();

        // Deployment summary
        console2.log("====================== Deploying summary ========================");
        console2.log("CrowdFundingFactory deployed successfully.");
        console2.log("CrowdFundingFactory deployed at:", address(factory));
        console2.log("================================================================");

        return factory;
    }
}
