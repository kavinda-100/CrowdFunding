"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  Layers,
  Users,
  Loader2,
  AlertTriangle,
  Trophy,
  Gift,
} from "lucide-react";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import type { CampaignTierType } from "@/types";
import AddTierToCampaign from "./AddTierToCampaign";
import TierCard from "./TierCard";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

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
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto space-y-8 px-4">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="mb-4 flex items-center justify-center space-x-3">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Campaign Tiers
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Explore different funding tiers and choose the one that matches your
            support level. Each tier comes with unique rewards and benefits.
          </p>
          {isOwner && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Trophy className="mr-1 h-4 w-4" />
              Campaign Owner
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {isPending && (
          <Card className="w-full border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg dark:from-gray-800 dark:to-gray-900">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
                  Loading Tiers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fetching campaign tiers from blockchain...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card className="w-full border-0 bg-gradient-to-br from-white to-red-50 shadow-lg dark:from-gray-800 dark:to-red-900/20">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-xl font-semibold text-transparent">
                  Error Loading Tiers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Unable to load campaign tiers. Please try again later.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tiers Grid */}
        {!isPending && !isError && tiers.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700"
              >
                <Users className="mr-1 h-4 w-4" />
                {tiers.length} Available Tier{tiers.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier, index) => (
                <TierCard
                  key={index}
                  name={tier.name}
                  amount={tier.amount}
                  isOwner={isOwner}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Tiers State */}
        {!isPending && !isError && tiers.length === 0 && (
          <Card className="w-full border-0 bg-gradient-to-br from-white to-yellow-50 shadow-lg dark:from-gray-800 dark:to-yellow-900/20">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
                <Gift className="h-12 w-12 text-white" />
              </div>
              <div className="max-w-md space-y-2 text-center">
                <h3 className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-xl font-semibold text-transparent">
                  No Tiers Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwner
                    ? "Start by creating your first funding tier to offer different support levels to your backers."
                    : "This campaign doesn't have any funding tiers set up yet. Check back later!"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Campaign Tier (only visible to owner of the campaign) */}
        {isOwner && (
          <div className="pt-6">
            <AddTierToCampaign campaignAddress={props.campaignAddress} />
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignTiers;
