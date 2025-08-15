"use client";

import React from "react";
import { useReadContract, useWriteContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pause,
  Play,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PauseCampaignProps = {
  campaignAddress: string;
};

const PauseCampaign = (props: PauseCampaignProps) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const [isPausedAlertOpen, setIsPausedAlertOpen] = React.useState(false);

  const {
    data: writeDataHash,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();
  const [pausedStatusModelOpen, setPausedStatusModelOpen] =
    React.useState(false);
  const [isPausedTxSuccess, setIsPausedTxSuccess] = React.useState(false);
  const [pausedError, setPausedError] = React.useState<string | null>(null);

  const { queryKey: tiersQueryKey } = useReadContract();
  const queryClient = useQueryClient();

  // get the pause state
  const {
    data: isPausedData,
    isPending: isPausedPending,
    isError: isPausedError,
    error: pausedErrorMessage,
    refetch: refetchPausedState,
  } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "getIsPaused",
    args: [],
  });

  React.useEffect(() => {
    if (isPausedData && !isPausedPending && !isPausedError) {
      setIsPaused(isPausedData as boolean);
    }
  }, [isPausedData, isPausedError, isPausedPending]);

  React.useEffect(() => {
    if (isPausedError) {
      console.error("error getting paused state", pausedErrorMessage);
    }
  }, [isPausedError, pausedErrorMessage]);

  // handle toggle paused
  const togglePaused = () => {
    writeContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "togglePause",
        args: [],
      },
      {
        onSuccess: () => {
          setIsPausedAlertOpen(false);
          void queryClient.invalidateQueries({ queryKey: tiersQueryKey });
          void refetchPausedState();
          setIsPausedTxSuccess(true);
          setPausedError(null);
          setPausedStatusModelOpen(true);
        },
        onError: (error) => {
          setIsPausedAlertOpen(false);
          console.error("Error pausing campaign:", error);
          setIsPausedTxSuccess(false);
          setPausedError(error.message ?? "Something went wrong");
          setPausedStatusModelOpen(true);
        },
      },
    );
  };

  return (
    <section className="my-4 w-full">
      {/* Campaign Status Card */}
      <Card className="w-full rounded-none border-0 border-none bg-gradient-to-br from-white to-blue-50 shadow-none dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="container mx-auto pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-full p-3 ${
                  isPaused
                    ? "bg-gradient-to-r from-red-500 to-pink-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                }`}
              >
                {isPaused ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300">
                  Campaign Status
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your campaign visibility
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              className={`px-3 py-1 ${
                isPaused
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
                  : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
              }`}
            >
              {isPaused ? (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Paused</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Active</span>
                </div>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="container mx-auto space-y-4">
          {/* Status Description */}
          <div
            className={`rounded-lg border p-4 ${
              isPaused
                ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            }`}
          >
            <div className="mb-2 flex items-center space-x-2">
              <Shield
                className={`h-4 w-4 ${isPaused ? "text-red-600" : "text-green-600"}`}
              />
              <span
                className={`text-sm font-medium ${isPaused ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}
              >
                Campaign Status: {isPaused ? "Paused" : "Active"}
              </span>
            </div>
            <p
              className={`text-sm ${isPaused ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
            >
              {isPaused
                ? "Your campaign is currently paused. No new contributions can be made until you reactivate it."
                : "Your campaign is active and accepting contributions. Supporters can fund your tiers and help you reach your goals."}
            </p>
          </div>

          {/* Control Button */}
          <Button
            onClick={() => setIsPausedAlertOpen(true)}
            disabled={isPausedPending || isWritePending}
            className={`w-full py-3 font-semibold transition-all duration-300 ${
              isPaused
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
            }`}
          >
            {isWritePending ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Reactivate Campaign</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause Campaign</span>
                  </>
                )}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pause/Unpause Campaign Confirmation */}
      <AlertDialog open={isPausedAlertOpen} onOpenChange={setIsPausedAlertOpen}>
        <AlertDialogContent className="border-0 bg-gradient-to-br from-white to-orange-50 shadow-2xl sm:max-w-[450px] dark:from-gray-900 dark:to-orange-900/20">
          <AlertDialogHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 p-4">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <AlertDialogTitle className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
              {isPaused ? "Reactivate Campaign?" : "Pause Campaign?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-lg text-gray-600 dark:text-gray-400">
              <div
                className={`rounded-lg border p-4 ${
                  isPaused
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
                }`}
              >
                <div className="mb-2 flex items-center space-x-2">
                  {isPaused ? (
                    <Play className="h-5 w-5 text-green-600" />
                  ) : (
                    <Pause className="h-5 w-5 text-orange-600" />
                  )}
                  <span
                    className={`font-semibold ${isPaused ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"}`}
                  >
                    {isPaused ? "Reactivation Effect:" : "Pause Effect:"}
                  </span>
                </div>
                <p
                  className={`text-sm ${isPaused ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
                >
                  {isPaused
                    ? "Your campaign will become active again and supporters will be able to make contributions to your funding tiers."
                    : "Your campaign will be temporarily disabled and no new contributions can be made until you reactivate it."}
                </p>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to {isPaused ? "reactivate" : "pause"}{" "}
                this campaign?
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 pt-6 sm:flex-row">
            <AlertDialogCancel
              onClick={() => setIsPausedAlertOpen(false)}
              className="w-full border-2 font-semibold hover:bg-gray-50 sm:w-auto dark:hover:bg-gray-800"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                togglePaused();
              }}
              disabled={isWritePending}
              className={`w-full font-semibold sm:w-auto ${
                isPaused
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                  : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
              }`}
            >
              {isWritePending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Reactivate</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause Campaign</span>
                    </>
                  )}
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campaign Status Change Result */}
      <Dialog
        open={pausedStatusModelOpen}
        onOpenChange={setPausedStatusModelOpen}
      >
        <DialogContent className="border-0 shadow-2xl sm:max-w-[450px]">
          {isPausedTxSuccess ? (
            <div
              className={`rounded-lg ${
                isPaused
                  ? "bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20"
                  : "bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20"
              }`}
            >
              <DialogHeader className="pb-6 text-center">
                <div
                  className={`mx-auto mb-4 rounded-full p-4 ${
                    isPaused
                      ? "bg-gradient-to-r from-red-500 to-pink-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                >
                  {isPaused ? (
                    <Pause className="h-12 w-12 text-white" />
                  ) : (
                    <CheckCircle className="h-12 w-12 text-white" />
                  )}
                </div>
                <DialogTitle
                  className={`bg-gradient-to-r text-2xl font-bold ${
                    isPaused
                      ? "from-red-600 to-pink-600"
                      : "from-green-600 to-emerald-600"
                  } bg-clip-text text-transparent`}
                >
                  {isPaused
                    ? "Campaign Paused Successfully! ⏸️"
                    : "Campaign Reactivated Successfully! ✨"}
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
                  {isPaused
                    ? "Your campaign has been paused and is no longer accepting contributions."
                    : "Your campaign is now active and ready to accept contributions from supporters!"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Status Details */}
                <div
                  className={`rounded-lg border p-4 ${
                    isPaused
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  }`}
                >
                  <div className="mb-3 flex items-center space-x-2">
                    <Shield
                      className={`h-5 w-5 ${isPaused ? "text-red-600" : "text-green-600"}`}
                    />
                    <span
                      className={`font-semibold ${isPaused ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}
                    >
                      Status Update Details
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Campaign Status:
                      </span>
                      <span
                        className={`font-medium ${isPaused ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"}`}
                      >
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Contributions:
                      </span>
                      <span
                        className={`font-medium ${isPaused ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"}`}
                      >
                        {isPaused ? "Disabled" : "Enabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                {writeDataHash && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Transaction Hash:
                      </span>
                    </div>
                    <p className="rounded bg-blue-100 p-2 font-mono text-xs break-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      {writeDataHash}
                    </p>
                  </div>
                )}

                <div className="py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  {isPaused
                    ? "Your campaign will remain paused until you choose to reactivate it. 🎯"
                    : "Your campaign is now live and ready to receive support! 🚀"}
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => setPausedStatusModelOpen(false)}
                  className={`w-full font-semibold ${
                    isPaused
                      ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                  }`}
                >
                  {isPaused ? (
                    <div className="flex items-center space-x-2">
                      <Pause className="h-4 w-4" />
                      <span>Got it!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Excellent!</span>
                    </div>
                  )}
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
                  Operation Failed
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  We couldn&apos;t {isPaused ? "reactivate" : "pause"} your
                  campaign.
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
                    {pausedError ??
                      "Transaction failed. Please check your wallet connection and try again."}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t worry! You can try again. 🔄
                </div>
              </div>

              <DialogFooter className="space-x-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setPausedStatusModelOpen(false)}
                  className="flex-1 border-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setPausedStatusModelOpen(false);
                    setIsPausedAlertOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PauseCampaign;
