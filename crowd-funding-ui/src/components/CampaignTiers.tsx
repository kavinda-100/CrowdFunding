"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import type { CampaignTierType } from "@/types";
import AddTierToCampaign from "./AddTierToCampaign";
import TierCard from "./TierCard";

type CampaignTiersProps = {
  campaignAddress: string;
};

const CampaignTiers = (props: CampaignTiersProps) => {
  const { address } = useAccount();
  const [tiers, setTiers] = React.useState<CampaignTierType[]>([]);
  const [isOwner, setIsOwner] = React.useState<boolean>(false);

  const { data, isPending, isError, error } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "getFundingTiers",
    args: [],
  });

  const {
    data: owner,
    isPending: isOwnerPending,
    isError: isOwnerError,
    error: ownerError,
  } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "owner",
    args: [],
  });

  React.useEffect(() => {
    if (data) {
      console.log("Funding tiers:", data);
      setTiers(data as CampaignTierType[]);
    }
  }, [data]);

  React.useEffect(() => {
    if (owner && !isOwnerPending && !isOwnerError) {
      setIsOwner(owner === address);
    }
  }, [address, isOwnerError, isOwnerPending, owner, props.campaignAddress]);

  console.log("CampaignTiers Error:", error, isError);
  console.log("CampaignTiers Owner Error:", ownerError, isOwnerError);

  return (
    <section className="container mx-auto mb-10 flex size-full w-full flex-col gap-4">
      <h1>Campaign Tiers</h1>
      {isPending && <p>Loading...</p>}
      {!isPending && !isError && tiers.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <TierCard
              key={index}
              name={tier.name}
              amount={tier.amount}
              isOwner={isOwner}
            />
          ))}
        </div>
      ) : (
        <p>No tiers available for this campaign.</p>
      )}
      {/* add campaign tier (only visible to owner of the campaign) */}
      {isOwner && <AddTierToCampaign campaignAddress={props.campaignAddress} />}
    </section>
  );
};

export default CampaignTiers;
