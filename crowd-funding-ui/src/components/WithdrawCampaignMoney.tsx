"use client";

import React from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { formatEther, formatGwei } from "viem";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import {
  Wallet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Shield,
  Banknote,
  Download,
  Trophy,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type WithdrawCampaignMoneyProps = {
  campaignAddress: string;
};

const WithdrawCampaignMoney = (props: WithdrawCampaignMoneyProps) => {
  const { address } = useAccount();
  const userAccountBalance = useBalance({ address: address, unit: "ether" });
  const [ownerPreviousBalance, setOwnerPreviousBalance] =
    React.useState<string>("0");
  const [ownerNewBalance, setOwnerNewBalance] = React.useState<string>("0");

  React.useEffect(() => {
    if (userAccountBalance.data) {
      setOwnerPreviousBalance(userAccountBalance.data.value.toString());
    }
  }, [userAccountBalance.data]);

  const [campaignStatus, setCampaignStatus] = React.useState<0 | 1 | 2>(0);
  const [withdrawConfirmationAlertOpen, setWithdrawConfirmationAlertOpen] =
    React.useState(false);

  const {
    data: writeDataHash,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();
  const [withdrawStatusModelOpen, setWithdrawStatusModelOpen] =
    React.useState(false);
  const [withdrawStatusModelType, setWithdrawStatusModelType] = React.useState<
    "status" | "warning"
  >("status");
  const [txSuccess, setTxSuccess] = React.useState(false);
  const [txErrorMessage, setTxErrorMessage] = React.useState<string | null>(
    null,
  );

  // get campaign status
  const { data, error, isError, isPending } = useReadContract({
    address: props.campaignAddress as `0x${string}`,
    abi: CrowdFundingContractAbi.abi,
    functionName: "getCampaignStatus",
    args: [],
  });

  React.useEffect(() => {
    if (data && !isPending && !isError) {
      setCampaignStatus(data as 0 | 1 | 2);
    }
  }, [data, isError, isPending]);

  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching campaign status:", error);
    }
  }, [error, isError]);

  // Refetch balance after successful withdrawal
  React.useEffect(() => {
    if (txSuccess && withdrawStatusModelOpen) {
      const refetchBalance = async () => {
        try {
          await userAccountBalance.refetch();
          if (userAccountBalance.data) {
            setOwnerNewBalance(userAccountBalance.data.value.toString());
          }
        } catch (error) {
          console.error("Error refetching balance:", error);
        }
      };
      void refetchBalance();
    }
  }, [txSuccess, withdrawStatusModelOpen, userAccountBalance]);

  // Get readable status
  const getReadableStatus = (status: 0 | 1 | 2) => {
    switch (status) {
      case 0:
        return "Active";
      case 1:
        return "Successful";
      case 2:
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const handleWithdraw = () => {
    // check if the campaign is successful
    if (campaignStatus !== 1) {
      setTxErrorMessage("Campaign is not successful");
      setWithdrawStatusModelType("warning");
      setWithdrawStatusModelOpen(true);
      return;
    }

    writeContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "withdraw",
        args: [],
      },
      {
        onSuccess: () => {
          setTxSuccess(true);
          setTxErrorMessage(null);
          setWithdrawStatusModelType("status");
          setWithdrawStatusModelOpen(true);
        },
        onError: (error) => {
          setTxSuccess(false);
          setTxErrorMessage(error.message ?? "Something went wrong");
          setWithdrawStatusModelType("warning");
          setWithdrawStatusModelOpen(true);
        },
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          Withdraw Campaign Funds
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Collect your successfully funded campaign money
        </p>
      </div>

      {/* Campaign Status Card */}
      <Card className="mb-6 border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Campaign Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Loading status...
                  </span>
                </>
              ) : (
                <>
                  {campaignStatus === 1 ? (
                    <Trophy className="h-5 w-5 text-emerald-500" />
                  ) : campaignStatus === 2 ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {getReadableStatus(campaignStatus)}
                  </span>
                </>
              )}
            </div>
            <Badge
              variant={
                campaignStatus === 1
                  ? "default"
                  : campaignStatus === 2
                    ? "destructive"
                    : "secondary"
              }
              className={`${
                campaignStatus === 1
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  : campaignStatus === 2
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              } border-0 text-white`}
            >
              {campaignStatus === 1
                ? "Ready to Withdraw"
                : campaignStatus === 2
                  ? "Cannot Withdraw"
                  : "Not Ready"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setWithdrawConfirmationAlertOpen(true)}
          disabled={campaignStatus !== 1 || isWritePending}
          className={cn(
            "rounded-xl px-8 py-6 text-lg font-semibold transition-all duration-300",
            {
              "transform cursor-pointer bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl":
                campaignStatus === 1,
              "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400":
                campaignStatus !== 1,
            },
          )}
        >
          <div className="flex items-center gap-3">
            {isWritePending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {isWritePending ? "Processing Withdrawal..." : "Withdraw Funds"}
          </div>
        </Button>

        {campaignStatus !== 1 && (
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-4 w-4" />
            {campaignStatus === 0
              ? "Campaign must be successful to withdraw funds"
              : "Failed campaigns cannot withdraw funds"}
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={withdrawConfirmationAlertOpen}
        onOpenChange={setWithdrawConfirmationAlertOpen}
      >
        <AlertDialogContent className="border-0 bg-gradient-to-br from-white via-orange-50 to-red-50 shadow-2xl dark:from-gray-900 dark:via-orange-950 dark:to-red-950">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <AlertDialogTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-bold text-transparent">
              Confirm Fund Withdrawal
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-base text-gray-600 dark:text-gray-300">
              This action cannot be undone. All campaign funds will be
              transferred to your wallet immediately.
            </AlertDialogDescription>
            <div className="mt-4 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-100 to-red-100 p-4 dark:border-orange-800 dark:from-orange-900/30 dark:to-red-900/30">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Security Notice</span>
              </div>
              <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                Ensure your wallet is secure and you&apos;re the campaign owner
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel
              onClick={() => setWithdrawConfirmationAlertOpen(false)}
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={isWritePending}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-red-700 hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                {isWritePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isWritePending ? "Processing..." : "Withdraw Funds"}
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for transaction status or warning */}
      <Dialog
        open={withdrawStatusModelOpen}
        onOpenChange={setWithdrawStatusModelOpen}
      >
        {withdrawStatusModelType === "status" ? (
          <DialogContent className="border-0 bg-gradient-to-br from-white via-emerald-50 to-green-50 shadow-2xl dark:from-gray-900 dark:via-emerald-950 dark:to-green-950">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500">
                {txSuccess ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <XCircle className="h-8 w-8 text-white" />
                )}
              </div>
              <DialogTitle className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-2xl font-bold text-transparent">
                {txSuccess ? "Withdrawal Successful!" : "Transaction Failed"}
              </DialogTitle>
              <DialogDescription className="mt-4 text-base text-gray-600 dark:text-gray-300">
                {txSuccess
                  ? "Your funds have been successfully transferred to your wallet"
                  : txErrorMessage}
              </DialogDescription>

              {/* Balance Comparison */}
              {txSuccess && ownerNewBalance !== "0" && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 p-4 dark:border-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <div className="mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Wallet Balance Update
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Previous Balance */}
                    <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Previous Balance
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {formatEther(BigInt(ownerPreviousBalance))} ETH
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatGwei(BigInt(ownerPreviousBalance))} GWEI
                        </div>
                      </div>
                    </div>

                    {/* New Balance */}
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          New Balance
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                          {formatEther(BigInt(ownerNewBalance))} ETH
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          {formatGwei(BigInt(ownerNewBalance))} GWEI
                        </div>
                      </div>
                    </div>

                    {/* Difference */}
                    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Amount Received
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-900 dark:text-green-100">
                          +
                          {formatEther(
                            BigInt(ownerNewBalance) -
                              BigInt(ownerPreviousBalance),
                          )}{" "}
                          ETH
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          +
                          {formatGwei(
                            BigInt(ownerNewBalance) -
                              BigInt(ownerPreviousBalance),
                          )}{" "}
                          GWEI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {writeDataHash && txSuccess && (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-100 to-green-100 p-4 dark:border-emerald-800 dark:from-emerald-900/30 dark:to-green-900/30">
                  <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Banknote className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Transaction Hash
                    </span>
                  </div>
                  <p className="rounded border bg-white p-2 font-mono text-xs break-all text-emerald-600 dark:bg-gray-800 dark:text-emerald-400">
                    {writeDataHash}
                  </p>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        ) : (
          <DialogContent className="border-0 bg-gradient-to-br from-white via-red-50 to-orange-50 shadow-2xl dark:from-gray-900 dark:via-red-950 dark:to-orange-950">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-500">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                Withdrawal Not Available
              </DialogTitle>
              <DialogDescription className="mt-4 text-base text-gray-600 dark:text-gray-300">
                {txErrorMessage}
              </DialogDescription>
              <div className="mt-6 rounded-lg border border-red-200 bg-gradient-to-r from-red-100 to-orange-100 p-4 dark:border-red-800 dark:from-red-900/30 dark:to-orange-900/30">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Campaign Requirement
                  </span>
                </div>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Only successfully funded campaigns can withdraw funds
                </p>
              </div>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default WithdrawCampaignMoney;
