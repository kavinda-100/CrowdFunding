"use client";

import React from "react";
import { useReadContract } from "wagmi";
import Link from "next/link";
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
  ArrowRight,
  Grid3X3,
  Zap,
} from "lucide-react";
import CrowdFundingFactoryAbi from "@/abi/CrowdFundingFactory.json";
import type { CampaignType } from "@/types";
import { cn, formatTimestamp } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FeaturedCampaignsSection = () => {
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
    return `${address.slice(0, 12)}...${address.slice(-4)}`;
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
      console.log("Featured Campaigns data:", campaignsData);
      // Type the campaigns data and show only first 4
      const allCampaigns = campaignsData as CampaignType[];
      setCampaigns(allCampaigns.slice(0, 4)); // Only show first 4 campaigns
    }
  }, [campaignsData, isError, isPending]);

  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching featured campaigns:", error);
    }
  }, [error, isError]);

  return (
    <section className="px-6 py-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-xl">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>

          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Campaigns
            </span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Discover innovative projects that are making a difference. Support
            creators and entrepreneurs who are turning their visions into
            reality.
          </p>

          {campaigns.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              <Badge className="border-emerald-200 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                <Sparkles className="mr-1 h-3 w-3" />
                {campaigns.length} Active Campaign
                {campaigns.length !== 1 ? "s" : ""} Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Loading featured campaigns...
            </h3>
            <p className="text-muted-foreground max-w-md text-center">
              Discovering the most innovative projects on the blockchain
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="mx-auto mb-8 max-w-2xl border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-950/50 dark:to-rose-950/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
                    Unable to load featured campaigns
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    {error?.message ||
                      "There was an issue connecting to the blockchain. Please try again later."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Campaigns Grid */}
        {!isPending && !isError && (
          <>
            {campaigns.length > 0 ? (
              <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {campaigns.map((campaign, index) => (
                  <Card
                    key={campaign.campaignAddress || index}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden border-0 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl",
                      "bg-gradient-to-br",
                      getGradient(index),
                    )}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <CardContent className="relative flex h-full flex-col p-6 text-white">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                          <Target className="h-5 w-5" />
                        </div>
                        <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">
                          Featured
                        </Badge>
                      </div>

                      {/* Campaign Name */}
                      <h3 className="mb-4 line-clamp-2 min-h-[3.5rem] text-lg font-bold">
                        {campaign.campaignName || "Innovative Campaign"}
                      </h3>

                      {/* Details */}
                      <div className="flex-grow space-y-3">
                        {campaign.campaignAddress && (
                          <div className="flex items-center gap-2 text-white/90">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="font-mono text-xs">
                              {truncateAddress(campaign.campaignAddress)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 text-white hover:bg-white/20"
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
                            <span className="font-mono text-xs">
                              {truncateAddress(campaign.campaignOwnerAddress)}
                            </span>
                          </div>
                        )}

                        {campaign.createdAt && (
                          <div className="flex items-center gap-2 text-white/90">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">
                              {formatTimestamp(campaign.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
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
                          View Details
                        </Button>
                      </div>
                    </CardContent>

                    {/* Sparkle Effect */}
                    <div className="absolute top-4 right-4 opacity-60">
                      <Sparkles className="h-5 w-5 animate-pulse text-white" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="bg-muted/50 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <Target className="text-muted-foreground h-10 w-10" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  No campaigns available
                </h3>
                <p className="text-muted-foreground mx-auto mb-8 max-w-md">
                  New campaigns will appear here as creators launch their
                  projects. Check back soon!
                </p>
                <Badge className="border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                  <Zap className="mr-1 h-3 w-3" />
                  Coming Soon
                </Badge>
              </div>
            )}

            {/* View All Campaigns Button */}
            {campaigns.length > 0 && (
              <div className="text-center">
                <Link href="/all">
                  <Button
                    size="lg"
                    className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-2xl"
                  >
                    <Grid3X3 className="mr-3 h-5 w-5" />
                    View All Campaigns
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCampaignsSection;
