"use client";

import React from "react";
import { formatEther, formatGwei } from "viem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CampaignDetailsProps = {
  campaignName: string;
  campaignDescription: string;
  campaignGoal: number;
  campaignDeadline: Date;
  campaignStatus: "Active" | "Successful" | "Failed";
  totalBalance: number;
};

const CampaignDetails = (props: CampaignDetailsProps) => {
  const [selectedFormat, setSelectedFormat] = React.useState<"ETH" | "WEI">(
    "WEI",
  );

  let progress = 0;
  if (props.campaignGoal > 0 && props.totalBalance > 0) {
    progress = (props.totalBalance / props.campaignGoal) * 100;
  }

  // Ensure campaignDeadline is a valid Date object
  const deadlineDate =
    props.campaignDeadline instanceof Date
      ? props.campaignDeadline
      : new Date(props.campaignDeadline);

  // Function to convert Wei to ETH with proper formatting
  const formatWeiToEth = (weiValue: number): string => {
    try {
      const ethValue = formatEther(BigInt(weiValue));
      const numValue = parseFloat(ethValue);

      // Format with appropriate decimal places
      if (numValue >= 1) {
        return `${numValue.toFixed(4)} ETH`;
      } else if (numValue >= 0.001) {
        return `${numValue.toFixed(6)} ETH`;
      } else {
        return `${numValue.toFixed(10)} ETH`;
      }
    } catch {
      return `${weiValue} Wei`;
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h3>Goal</h3>
        {/* ProgressBar */}
        <div
          className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <h1>Campaign Details</h1>
      <h2>{props.campaignName}</h2>
      <p>{props.campaignDescription}</p>
      <p>
        Goal:{" "}
        {selectedFormat == "ETH"
          ? formatWeiToEth(props.campaignGoal)
          : `${formatGwei(BigInt(props.campaignGoal))} WEI`}{" "}
      </p>
      <p>
        Balance:{" "}
        {selectedFormat == "ETH"
          ? formatWeiToEth(props.totalBalance)
          : `${formatGwei(BigInt(props.totalBalance))} WEI`}{" "}
      </p>
      <Select value={selectedFormat} onValueChange={setSelectedFormat as any}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select The Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ETH">ETH</SelectItem>
          <SelectItem value="WEI">WEI</SelectItem>
        </SelectContent>
      </Select>
      <p>Deadline: {deadlineDate.toDateString()}</p>
    </div>
  );
};

export default CampaignDetails;
