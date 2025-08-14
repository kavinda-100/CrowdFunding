import type { CampaignType } from "@/types";
import React from "react";

const CampaignOverviewCard = ({
  campaignAddress,
  campaignOwnerAddress,
  campaignName,
  createdAt,
}: CampaignType) => {
  return (
    <div className="w-full border p-4">
      <h2 className="text-lg font-bold">{campaignName}</h2>
      <p>
        <strong>Owner:</strong> {campaignOwnerAddress}
      </p>
      <p>
        <strong>Contract:</strong> {campaignAddress}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(Number(createdAt) * 1000).toLocaleString()}
      </p>
    </div>
  );
};

export default CampaignOverviewCard;
