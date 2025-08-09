// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {CrowdFundingFactory} from "../src/CrowdFundingFactory.sol";

contract DeployCrowdFundingFactory is Script {
    string constant DEPLOYMENT_FILE = "deployment-summary.json";

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

        // Write deployment summary to JSON file
        _writeDeploymentSummaryToJson(address(factory));

        return factory;
    }

    function _writeDeploymentSummaryToJson(address factoryAddress) private {
        // Step 1: Check if file exists and Step 2: Remove it if exists
        if (vm.exists(DEPLOYMENT_FILE)) {
            vm.removeFile(DEPLOYMENT_FILE);
            console2.log("Existing deployment file removed.");
        }

        // Step 3: Create new JSON file with deployment summary
        string memory json = "deployment_summary";

        // Add deployment information to JSON
        vm.serializeString(json, "contract_name", "CrowdFundingFactory");
        vm.serializeAddress(json, "contract_address", factoryAddress);
        vm.serializeUint(json, "deployment_timestamp", block.timestamp);
        vm.serializeUint(json, "block_number", block.number);
        vm.serializeUint(json, "chain_id", block.chainid);
        string memory finalJson = vm.serializeString(json, "status", "deployed_successfully");

        // Write JSON to file
        vm.writeFile(DEPLOYMENT_FILE, finalJson);
        console2.log("Deployment summary written to:", DEPLOYMENT_FILE);
    }
}
