"use client";

import React from "react";
import { useReadContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import type { CampaignTierType } from "@/types";
import AddTierToCampaign from "./AddTierToCampaign";
import TierCard from "./TierCard";

type CampaignTiersProps = {
  campaignAddress: string;
};

const CampaignTiers = (props: CampaignTiersProps) => {
  const [tiers, setTiers] = React.useState<CampaignTierType[]>([]);

  const { data, isPending, isError, error } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "getFundingTiers",
    args: [],
  });

  React.useEffect(() => {
    if (data) {
      console.log("Funding tiers:", data);
      setTiers(data as CampaignTierType[]);
    }
  }, [data]);

  console.log("CampaignTiers Error:", error, isError);

  return (
    <section className="container mx-auto size-full w-full">
      <h1>Campaign Tiers</h1>
      {isPending && <p>Loading...</p>}
      {!isPending && !isError && tiers.length > 0 ? (
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <TierCard key={index} name={tier.name} amount={tier.amount} />
          ))}
        </div>
      ) : (
        <p>No tiers available for this campaign.</p>
      )}
      <AddTierToCampaign campaignAddress={props.campaignAddress} />
    </section>
  );
};

export default CampaignTiers;
