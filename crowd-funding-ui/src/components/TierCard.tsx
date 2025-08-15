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
  CheckCircle,
  XCircle,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TierCardProps = {
  name: string;
  amount: number;
  isOwner: boolean;
  campaignAddress: string;
  tierIndex: number;
};

const TierCard = (props: TierCardProps) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const [isPausedAlertOpen, setIsPausedAlertOpen] = React.useState(false);

  // Convert amount to ETH for better readability
  const amountInEth = formatEther(BigInt(props.amount));
  const isHighValue = Number(amountInEth) >= 1;

  const { queryKey } = useReadContracts();
  const { queryKey: tiersQueryKey } = useReadContract();
  const queryClient = useQueryClient();

  // get the pause state
  const {
    data: isPausedData,
    isPending: isPausedPending,
    isError: isPausedError,
    error: pausedErrorMessage,
  } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "getIsPaused",
    args: [],
  });

  React.useEffect(() => {
    if (isPausedData && !isPausedPending && !isPausedError) {
      setIsPaused(isPausedData as boolean);
    } else {
      console.error("Error fetching pause state:", pausedErrorMessage);
    }
  }, [isPausedData, isPausedError, isPausedPending, pausedErrorMessage]);

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
  const [removeStatusModelOpen, setRemoveStatusModelOpen] =
    React.useState(false);
  const [isRemoveTxSuccess, setIsRemoveTxSuccess] = React.useState(false);
  const [removeErrorMessage, setRemoveErrorMessage] = React.useState<
    string | null
  >(null);

  // remove tier confirmation state
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    React.useState(false);

  // fund the Tier handler
  const handleFundTier = async () => {
    // if paused, show alert
    if (isPaused) {
      setIsPausedAlertOpen(true);
      return;
    }
    // else proceed with funding the tier
    fundTierWriteContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "fund",
        value: BigInt(props.amount),
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

  // Remove the Tier handler
  const handleRemoveTier = async () => {
    removeTierWriteContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "removeTier",
        args: [props.tierIndex],
      },
      {
        onSuccess: () => {
          setIsRemoveTxSuccess(true);
          setRemoveStatusModelOpen(true);
          setRemoveErrorMessage(null);
          void queryClient.invalidateQueries({ queryKey: tiersQueryKey });
        },
        onError: (error) => {
          console.error("Error removing tier:", error);
          setRemoveErrorMessage(error.message ?? "Something went wrong");
          setIsRemoveTxSuccess(false);
          setRemoveStatusModelOpen(true);
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
                onClick={() => setIsRemoveConfirmationDialogOpen(true)}
                variant="destructive"
                size={"lg"}
                className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-pink-600 py-2 font-semibold transition-all duration-300 hover:from-red-600 hover:to-pink-700"
              >
                {isRemoveTierPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span>Removing Tier...</span>
                    <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Tier</span>
                  </div>
                )}
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
        <DialogContent className="border-0 shadow-2xl sm:max-w-[450px]">
          {isFundTxSuccess ? (
            <div className="rounded-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20">
              <DialogHeader className="pb-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                  Funding Successful! 🎉
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
                  Your contribution to &ldquo;{props.name}&rdquo; tier has been
                  processed successfully!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Funding Details */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="mb-3 flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <Heart className="h-5 w-5" />
                    <span className="font-semibold">Funding Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tier:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {props.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Amount:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {amountInEth} ETH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                {fundTierHash && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Transaction Hash:
                      </span>
                    </div>
                    <p className="rounded bg-blue-100 p-2 font-mono text-xs break-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      {fundTierHash.slice(0, 15)}...{fundTierHash.slice(-4)}
                    </p>
                  </div>
                )}

                <div className="py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Thank you for supporting this campaign! 💝
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => setFundStatusModalOpen(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 font-semibold text-white hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Amazing!
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="rounded-lg bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20">
              <DialogHeader className="pb-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
                  <XCircle className="h-12 w-12 text-white" />
                </div>
                <DialogTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                  Funding Failed
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Unfortunately, your funding attempt was unsuccessful.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Error Details */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <div className="mb-2 flex items-center space-x-2 text-red-700 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Error Details:</span>
                  </div>
                  <p className="rounded bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
                    {fundErrorMessage ??
                      "Transaction failed. Please check your wallet balance and try again."}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t worry! You can try funding again. 🔄
                </div>
              </div>

              <DialogFooter className="space-x-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setFundStatusModalOpen(false)}
                  className="flex-1 border-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setFundStatusModalOpen(false);
                    void handleFundTier();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Tier Confirmation */}
      <AlertDialog
        open={isRemoveConfirmationDialogOpen}
        onOpenChange={setIsRemoveConfirmationDialogOpen}
      >
        <AlertDialogContent className="border-0 bg-gradient-to-br from-white to-red-50 shadow-2xl sm:max-w-[450px] dark:from-gray-900 dark:to-red-900/20">
          <AlertDialogHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
              <ShieldAlert className="h-12 w-12 text-white" />
            </div>
            <AlertDialogTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Remove Tier Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-lg text-gray-600 dark:text-gray-400">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="mb-2 flex items-center space-x-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">
                    Warning: This action cannot be undone!
                  </span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-300">
                  You are about to permanently remove the &ldquo;{props.name}
                  &rdquo; tier from your campaign. This will affect any
                  supporters who might be interested in this funding level.
                </p>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Are you absolutely sure you want to continue?
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 pt-6 sm:flex-row">
            <AlertDialogCancel
              onClick={() => setIsRemoveConfirmationDialogOpen(false)}
              className="w-full border-2 font-semibold hover:bg-gray-50 sm:w-auto dark:hover:bg-gray-800"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleRemoveTier();
                setIsRemoveConfirmationDialogOpen(false);
              }}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 font-semibold text-white hover:from-red-700 hover:to-pink-700 sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Tier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove tier status model */}
      <Dialog
        open={removeStatusModelOpen}
        onOpenChange={setRemoveStatusModelOpen}
      >
        <DialogContent className="border-0 shadow-2xl sm:max-w-[450px]">
          {isRemoveTxSuccess ? (
            <div className="rounded-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20">
              <DialogHeader className="pb-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                  Tier Removed Successfully! ✨
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
                  The &ldquo;{props.name}&rdquo; tier has been permanently
                  removed from your campaign.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Removal Details */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="mb-3 flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Removal Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Removed Tier:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {props.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Amount:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {amountInEth} ETH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                {removeTierHash && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Transaction Hash:
                      </span>
                    </div>
                    <p className="rounded bg-blue-100 p-2 font-mono text-xs break-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      {removeTierHash}
                    </p>
                  </div>
                )}

                <div className="py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Your campaign has been updated successfully! 🎯
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => setRemoveStatusModelOpen(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 font-semibold text-white hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Perfect!
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="rounded-lg bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20">
              <DialogHeader className="pb-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
                  <XCircle className="h-12 w-12 text-white" />
                </div>
                <DialogTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                  Removal Failed
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  We couldn&apos;t remove the tier from your campaign.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Error Details */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <div className="mb-2 flex items-center space-x-2 text-red-700 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Error Details:</span>
                  </div>
                  <p className="rounded bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
                    {removeErrorMessage ??
                      "Transaction failed. Please check your wallet connection and try again."}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t worry! You can try removing the tier again. 🔄
                </div>
              </div>

              <DialogFooter className="space-x-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setRemoveStatusModelOpen(false)}
                  className="flex-1 border-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setRemoveStatusModelOpen(false);
                    setIsRemoveConfirmationDialogOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Paused Alert dialog */}
      <AlertDialog open={isPausedAlertOpen} onOpenChange={setIsPausedAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You can not perform this action while the campaign is paused.
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be done. This campaign is currently paused due
              to an ongoing process. Please try again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsPausedAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TierCard;
