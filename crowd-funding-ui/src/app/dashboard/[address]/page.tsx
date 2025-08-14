"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import CrowdFundingFactoryAbi from "@/abi/CrowdFundingFactory.json";
import CreateContract from "@/components/CreateContract";
import type { CampaignType } from "@/types";

const DashBoardPage = () => {
  const params = useParams<{ address: string }>();
  const [campaigns, setCampaigns] = React.useState<CampaignType[]>([]);

  const {
    data: campaignsData,
    isPending,
    isError,
    error,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_CROWDFUNDING_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
    abi: CrowdFundingFactoryAbi.abi,
    functionName: "getUserCampaigns",
    args: [params.address],
    query: {
      enabled: !!params.address,
    },
  });

  console.log("Read Contract Hook Data:", {
    campaignsData,
    isPending,
    isError,
    error,
  });

  React.useEffect(() => {
    if (campaignsData && !isPending && !isError) {
      console.log("Campaigns data:", campaignsData);
      // Type the campaigns data and update state
      setCampaigns(campaignsData as CampaignType[]);
    }
  }, [campaignsData, isError, isPending]);

  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching campaigns:", error);
    }
  }, [error, isError]);

  return (
    <section className="size-full p-6">
      <h1 className="mb-6 text-2xl font-bold">My Campaigns</h1>

      {isPending && (
        <div className="py-8 text-center">
          <p>Loading campaigns...</p>
        </div>
      )}

      {isError && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>Error loading campaigns: {error?.message}</p>
        </div>
      )}

      <div className="my-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {campaigns.length > 0
          ? campaigns.map((campaign, index) => (
              <div
                key={campaign.campaignAddress || index}
                className="rounded-lg border p-4"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {campaign.campaignName}
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Address: {campaign.campaignAddress}
                </p>
                <p className="mb-2 text-sm text-gray-600">
                  Owner: {campaign.campaignOwnerAddress}
                </p>
                <p className="text-sm text-gray-600">
                  Created:{" "}
                  {new Date(
                    parseInt(campaign.createdAt) * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          : !isPending && (
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-500">
                  No campaigns found for this address.
                </p>
              </div>
            )}

        <CreateContract />
      </div>
    </section>
  );
};

export default DashBoardPage;
