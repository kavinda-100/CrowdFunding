import React from "react";
import AddTierToCampaign from "./AddTierToCampaign";

type CampaignTiersProps = {
  campaignAddress: string;
};

const CampaignTiers = (props: CampaignTiersProps) => {
  return (
    <section className="size-full">
      CampaignTiers
      <AddTierToCampaign campaignAddress={props.campaignAddress} />
    </section>
  );
};

export default CampaignTiers;
