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
      .NEXT_PUBLIC_CROWD_FUNDING_FACTORY_ADDRESS as `0x${string}`,
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
    }
  }, [campaignsData, isError, isPending]);

  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching campaigns:", error);
    }
  }, [error, isError]);

  return (
    <section className="size-full">
      <h1>My contracts</h1>

      <div className="my-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="border p-4">Contract 1</div>
        <div className="border p-4">Contract 2</div>
        <div className="border p-4">Contract 3</div>
        <div className="border p-4">Contract 4</div>

        <CreateContract />
      </div>
    </section>
  );
};

export default DashBoardPage;
