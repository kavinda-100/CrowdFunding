"use client";

import React from "react";
import { useReadContract } from "wagmi";
import {
  Calendar,
  User,
  MapPin,
  Loader2,
  AlertTriangle,
  Sparkles,
  Target,
  Copy,
  ExternalLink,
  TrendingUp,
  Crown,
} from "lucide-react";
import CrowdFundingFactoryAbi from "@/abi/CrowdFundingFactory.json";
import type { CampaignType } from "@/types";
import { cn, formatTimestamp } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DashBoardPage = () => {
  const [campaigns, setCampaigns] = React.useState<CampaignType[]>([]);

  // Array of beautiful gradient combinations
  const gradientColors = [
    "from-blue-400 via-purple-500 to-pink-500",
    "from-emerald-400 via-cyan-500 to-blue-500",
    "from-orange-400 via-red-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-500",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-purple-400 via-pink-500 to-red-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-teal-400 via-green-500 to-blue-500",
    "from-rose-400 via-pink-500 to-purple-500",
    "from-amber-400 via-yellow-500 to-orange-500",
    "from-cyan-400 via-teal-500 to-green-500",
    "from-violet-400 via-purple-500 to-indigo-500",
  ];

  // Function to get a gradient based on index
  const getGradient = (index: number) => {
    return gradientColors[index % gradientColors.length];
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Function to truncate address
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "N/A";
    return `${address.slice(0, 16)}...${address.slice(-4)}`;
  };

  const {
    data: campaignsData,
    isPending,
    isError,
    error,
  } = useReadContract({
    address: process.env
      .NEXT_PUBLIC_CROWDFUNDING_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
    abi: CrowdFundingFactoryAbi.abi,
    functionName: "getAllCampaigns",
    args: [],
  });

  React.useEffect(() => {
    if (campaignsData && !isPending && !isError) {
      console.log("All Campaigns data:", campaignsData);
      // Type the campaigns data and update state
      setCampaigns(campaignsData as CampaignType[]);
    }
  }, [campaignsData, isError, isPending]);

  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching All campaigns:", error);
    }
  }, [error, isError]);

  return (
    <section className="from-background to-background/80 min-h-screen bg-gradient-to-br p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
                All Campaigns
              </h1>
              <p className="text-muted-foreground">
                View and fund all crowdfunding campaigns in one place
              </p>
            </div>
          </div>

          {campaigns.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="border-green-200 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:border-green-800 dark:text-green-300">
                <TrendingUp className="mr-1 h-3 w-3" />
                {campaigns.length} Active Campaign
                {campaigns.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Loading campaigns...</h3>
            <p className="text-muted-foreground">
              Fetching your latest projects from the blockchain
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-950/50 dark:to-rose-950/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-red-800 dark:text-red-200">
                    Failed to load campaigns
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error?.message ||
                      "Unable to fetch campaigns from the blockchain. Please try again."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaigns Grid */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.length > 0
            ? campaigns.map((campaign, index) => (
                <Card
                  key={campaign.campaignAddress || index}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                    "bg-gradient-to-br",
                    getGradient(
                      Math.floor(Math.random() * gradientColors.length),
                    ),
                  )}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <CardContent className="relative p-6 text-white">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                        <Target className="h-5 w-5" />
                      </div>
                      <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">
                        Active
                      </Badge>
                    </div>

                    {/* Campaign Name */}
                    <h3 className="mb-3 line-clamp-2 text-xl font-bold">
                      {campaign.campaignName || "Unnamed Campaign"}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3">
                      {campaign.campaignAddress && (
                        <div className="flex items-center gap-2 text-white/90">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="font-mono text-sm">
                            {truncateAddress(campaign.campaignAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              void copyToClipboard(campaign.campaignAddress);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {campaign.campaignOwnerAddress && (
                        <div className="flex items-center gap-2 text-white/90">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="font-mono text-sm">
                            {truncateAddress(campaign.campaignOwnerAddress)}
                          </span>
                        </div>
                      )}

                      {campaign.createdAt && (
                        <div className="flex items-center gap-2 text-white/90">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">
                            {formatTimestamp(campaign.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                        disabled={!campaign.campaignAddress}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (campaign.campaignAddress) {
                            window.open(
                              `/campaign/${campaign.campaignAddress}`,
                              "_blank",
                            );
                          }
                        }}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </CardContent>

                  {/* Sparkle Effect */}
                  <div className="absolute top-4 right-4 opacity-50">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </Card>
              ))
            : !isPending && (
                <div className="col-span-full">
                  <Card className="border-muted-foreground/25 border-2 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Target className="text-muted-foreground h-8 w-8" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        No campaigns yet
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md text-center">
                        Start your crowdfunding journey by creating your first
                        campaign. Turn your ideas into reality with the power of
                        community support.
                      </p>
                      <Badge className="border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Ready to launch
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              )}
        </div>
      </div>
    </section>
  );
};

export default DashBoardPage;
