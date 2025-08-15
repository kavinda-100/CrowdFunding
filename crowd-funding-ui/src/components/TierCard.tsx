"use client";

import React from "react";
import { formatEther, formatGwei } from "viem";
import {
  Coins,
  Heart,
  Trash2,
  Crown,
  Target,
  Zap,
  Star,
  Loader2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useReadContracts, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther } from "viem";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { is } from "zod/v4/locales";

type TierCardProps = {
  name: string;
  amount: number;
  isOwner: boolean;
  campaignAddress: string;
  tierIndex: number;
};

const TierCard = (props: TierCardProps) => {
  // Convert amount to ETH for better readability
  const amountInEth = formatEther(BigInt(props.amount));
  const isHighValue = Number(amountInEth) >= 1;

  const { queryKey } = useReadContracts();
  const queryClient = useQueryClient();

  // Fund Tier states
  const {
    data: fundTierHash,
    isPending: isFundTierPending,
    writeContract: fundTierWriteContract,
  } = useWriteContract();
  const [fundStatusModalOpen, setFundStatusModalOpen] = React.useState(false);
  const [isFundTxSuccess, setIsFundTxSuccess] = React.useState(false);
  const [fundErrorMessage, setFundErrorMessage] = React.useState<string | null>(
    null,
  );

  // Remove Tier states
  const {
    data: removeTierHash,
    isPending: isRemoveTierPending,
    writeContract: removeTierWriteContract,
  } = useWriteContract();
  const [removeSStatusModelOpen, setRemoveStatusModelOpen] =
    React.useState(false);
  const [isRemoveTxSuccess, setIsRemoveTxSuccess] = React.useState(false);
  const [removeErrorMessage, setRemoveErrorMessage] = React.useState<
    string | null
  >(null);

  // fund the Tier handler
  const handleFundTier = async () => {
    fundTierWriteContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "fund",
        value: parseEther(props.amount.toString()),
        args: [props.tierIndex],
      },
      {
        onSuccess: () => {
          setIsFundTxSuccess(true);
          setFundStatusModalOpen(true);
          setFundErrorMessage(null);
          void queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => {
          console.error("Error funding tier:", error);
          setFundErrorMessage(error.message ?? "Something went wrong");
          setIsFundTxSuccess(false);
          setFundStatusModalOpen(true);
        },
      },
    );
  };

  return (
    <>
      {/* Tier Card */}
      <Card className="group relative transform overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:from-gray-800 dark:to-gray-900">
        {/* Premium Badge for high-value tiers */}
        {isHighValue && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="border-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Crown className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <CardHeader className="relative pb-3">
          <div className="mb-2 flex items-center space-x-3">
            <div
              className={`rounded-full p-2 ${
                isHighValue
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
            >
              {isHighValue ? (
                <Star className="h-5 w-5 text-white" />
              ) : (
                <Target className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300">
                {props.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Amount Display */}
          <div className="rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50 py-4 text-center dark:from-gray-700 dark:to-gray-800">
            <div className="mb-1 flex items-center justify-center space-x-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Minimum Contribution
              </span>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              {amountInEth} ETH
            </div>
            <div className="text-md text-gray-500 dark:text-gray-400">
              ≈ {formatGwei(BigInt(props.amount))} WEI
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Fund Button */}
            <Button
              onClick={handleFundTier}
              size={"lg"}
              className="group w-full cursor-pointer rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg"
            >
              {!isFundTierPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Fund This Tier</span>
                  <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>Funding Tier...</span>
                  <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
              )}
            </Button>

            {/* Remove Button (Owner Only) */}
            {props.isOwner && (
              <Button
                variant="destructive"
                size={"lg"}
                className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-pink-600 py-2 font-semibold transition-all duration-300 hover:from-red-600 hover:to-pink-700"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Remove Tier</span>
                </div>
              </Button>
            )}
          </div>
        </CardContent>

        {/* Owner Badge */}
        {props.isOwner && (
          <div className="absolute bottom-4 left-4">
            <Badge
              variant="outline"
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            >
              <Crown className="mr-1 h-3 w-3" />
              Owner
            </Badge>
          </div>
        )}
      </Card>

      {/* Fund Tier Status modal */}
      <Dialog open={fundStatusModalOpen} onOpenChange={setFundStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Tier Status</DialogTitle>
            <DialogDescription>Tier status</DialogDescription>
          </DialogHeader>
          <div>
            {isFundTxSuccess ? (
              <div>
                <p>Your funding was successful!</p>
                <p>Transaction Hash:</p>
                {fundTierHash && (
                  <p>
                    {fundTierHash.slice(0, 15)}...{fundTierHash.slice(-4)}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p>Your funding is unsuccessful.</p>
                {fundErrorMessage ? (
                  <p>Error: {fundErrorMessage}</p>
                ) : (
                  <p>Please try again later.</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TierCard;
