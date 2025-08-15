"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import { useAccount, useReadContracts } from "wagmi";
import {
  Loader2,
  AlertTriangle,
  Target,
  RefreshCw,
  ArrowLeft,
  XCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import CampaignDetails from "@/components/CampaignDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CampaignTiers from "@/components/CampaignTiers";
import PauseCampaign from "@/components/PauseCampaign";

const ContractDetailsPage = () => {
  const { address } = useParams<{ address: string }>();
  const { address: userAddress } = useAccount();

  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignName",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignDescription",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignGoal",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignDeadline",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignStatus",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "getCampaignBalance",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "owner",
        args: [],
      },
    ],
  });

  const [
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignDeadline,
    campaignStatus,
    campaignBalance,
    campaignOwner,
  ] = data ?? [];

  // debugging
  console.log("Campaign Details:", {
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignDeadline,
    campaignStatus,
    campaignBalance,
  });

  // if no address is found
  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto w-full max-w-md border-0 bg-gradient-to-br from-white to-yellow-50 shadow-2xl dark:from-gray-800 dark:to-yellow-900/20">
            <CardHeader className="pb-8 text-center">
              <div className="mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 p-4">
                <MapPin className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                Invalid Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-8 text-center">
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                No campaign address was provided in the URL.
              </p>
              <Button variant="outline" asChild>
                <Link href="/all">
                  <ArrowLeft size={16} className="mr-2" />
                  View All Campaigns
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <section className="size-full min-h-screen">
      {/* Campaign Details */}

      {/* if error */}
      {error ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/all"
                  className="flex items-center space-x-2 text-blue-600 transition-colors hover:text-blue-800"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Back to Campaigns</span>
                </Link>
              </div>
              <Badge
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-700"
              >
                <XCircle size={14} className="mr-1" />
                Error Loading
              </Badge>
            </div>

            {/* Error Card */}
            <Card className="w-full border-0 bg-gradient-to-br from-white to-red-50 shadow-2xl dark:from-gray-800 dark:to-red-900/20">
              <CardHeader className="pb-8 text-center">
                <div className="mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
                  <AlertTriangle className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                  Error Loading Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    We encountered an issue while loading the campaign details.
                  </p>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="mb-2 flex items-center space-x-2 text-red-700 dark:text-red-400">
                      <MapPin size={16} />
                      <span className="font-medium">Error Details:</span>
                    </div>
                    <p className="rounded bg-red-100 p-2 font-mono text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
                      {error.message ||
                        "Failed to load campaign data from blockchain"}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Try Again
                    </Button>

                    <Button variant="outline" asChild>
                      <Link href="/all">
                        <ArrowLeft size={16} className="mr-2" />
                        View All Campaigns
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : !isPending && data ? (
        <CampaignDetails
          campaignName={campaignName?.result as string}
          campaignDescription={campaignDescription?.result as string}
          campaignGoal={campaignGoal?.result ? Number(campaignGoal.result) : 0}
          campaignDeadline={
            campaignDeadline?.result
              ? new Date(Number(campaignDeadline.result) * 1000)
              : new Date()
          }
          campaignStatus={
            campaignStatus?.result as 0 | 1 | 2 // "Active" = 0 | "Successful" = 1 | "Failed" = 2
          }
          totalBalance={
            campaignBalance?.result ? Number(campaignBalance.result) : 0
          }
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/all"
                  className="flex items-center space-x-2 text-blue-600 transition-colors hover:text-blue-800"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Back to Campaigns</span>
                </Link>
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                <Sparkles size={14} className="mr-1" />
                Loading Campaign
              </Badge>
            </div>

            {/* Loading Card */}
            <Card className="w-full border-0 bg-gradient-to-br from-white to-blue-50 shadow-2xl dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-8 text-center">
                <div className="mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <Loader2 className="h-12 w-12 animate-spin text-white" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  Loading Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                {/* Loading Skeleton */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-blue-200"></div>
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-transparent"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-purple-200"></div>
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-transparent"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-green-200"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-green-200 to-transparent"></div>
                  </div>
                </div>

                <div className="py-4 text-center">
                  <p className="mb-2 text-gray-600 dark:text-gray-400">
                    Fetching campaign information from blockchain...
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                    <Target size={16} />
                    <span>Connecting to smart contract</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tier functionality */}
      <CampaignTiers campaignAddress={address} />

      {/* Pause Campaign Button (only visible to owner) */}
      {campaignOwner?.result === userAddress && <PauseCampaign />}

      {/* extend the deadline of the campaign (only visible to owner) */}
      {/* campaignOwner?.result === userAddress && <ExtendCampaignDeadline /> */}

      {/* Withdraw money from the campaign (only visible to owner) */}
      {/* campaignOwner?.result === userAddress && <WithdrawCampaignMoney /> */}
    </section>
  );
};

export default ContractDetailsPage;
