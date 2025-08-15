import React from "react";

type ExtendCampaignDeadlineProps = {
  campaignAddress: string;
};

const ExtendCampaignDeadline = (props: ExtendCampaignDeadlineProps) => {
  return <div>ExtendCampaignDeadline for {props.campaignAddress}</div>;
};

export default ExtendCampaignDeadline;
