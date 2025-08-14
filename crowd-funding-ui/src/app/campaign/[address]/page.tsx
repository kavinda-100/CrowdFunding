"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useReadContracts } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import CampaignDetails from "@/components/CampaignDetails";

const ContractDetailsPage = () => {
  const { address } = useParams<{ address: string }>();

  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignName",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignDescription",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignGoal",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignDeadline",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignStatus",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignBalance",
        args: [],
      },
    ],
  });

  const [
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignDeadline,
    campaignStatus,
    campaignBalance,
  ] = data ?? [];

  // debugging
  console.log("Campaign Details:", {
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignDeadline,
    campaignStatus,
    campaignBalance,
  });

  if (!address) {
    return <div>No campaign address provided</div>;
  }

  return (
    <section className="size-full min-h-screen">
      {/* Campaign Details */}
      {error ? (
        <div>Error loading campaign details</div>
      ) : !isPending && data ? (
        <CampaignDetails
          campaignName={campaignName?.result as string}
          campaignDescription={campaignDescription?.result as string}
          campaignGoal={campaignGoal?.result ? Number(campaignGoal.result) : 0}
          campaignDeadline={
            campaignDeadline?.result
              ? new Date(Number(campaignDeadline.result) * 1000)
              : new Date()
          }
          campaignStatus={
            campaignStatus?.result as "Active" | "Successful" | "Failed"
          }
          totalBalance={
            campaignBalance?.result ? Number(campaignBalance.result) : 0
          }
        />
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default ContractDetailsPage;
