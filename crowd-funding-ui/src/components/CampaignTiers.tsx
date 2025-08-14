"use client";

import React from "react";
import { useReadContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import type { CampaignTierType } from "@/types";
import AddTierToCampaign from "./AddTierToCampaign";

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
    <section className="size-full">
      CampaignTiers
      {isPending && <p>Loading...</p>}
      {!isPending && !isError && tiers.length > 0 ? (
        <ul>
          {tiers.map((tier, index) => (
            <li key={index}>{tier.name}</li>
          ))}
        </ul>
      ) : (
        <p>No tiers available for this campaign.</p>
      )}
      <AddTierToCampaign campaignAddress={props.campaignAddress} />
    </section>
  );
};

export default CampaignTiers;
