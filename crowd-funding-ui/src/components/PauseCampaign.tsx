"use client";

import React from "react";
import { useReadContract, useWriteContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
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
    <section className="container mx-auto w-full">
      {/* Pause Campaign Button */}
      <Button onClick={() => setIsPausedAlertOpen(true)}>
        {isPaused ? "Unpause Campaign" : "Pause Campaign"}
      </Button>

      {/* Pause Campaign Alert */}
      <AlertDialog open={isPausedAlertOpen} onOpenChange={setIsPausedAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will {isPaused ? "unpause" : "pause"} the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsPausedAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                togglePaused();
              }}
            >
              {isWritePending
                ? "Processing..."
                : (isPaused ? "Unpause" : "Pause") + " Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Campaign Status Dialog */}
      <Dialog
        open={pausedStatusModelOpen}
        onOpenChange={setPausedStatusModelOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Campaign</DialogTitle>
            <DialogDescription>
              {isPausedTxSuccess
                ? "Campaign paused successfully."
                : pausedError
                  ? `Error pausing campaign: ${pausedError}`
                  : "Processing..."}
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>tx hash:</p>
            {writeDataHash && (
              <span>
                {writeDataHash.slice(0, 15)}...{writeDataHash.slice(-4)}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PauseCampaign;
