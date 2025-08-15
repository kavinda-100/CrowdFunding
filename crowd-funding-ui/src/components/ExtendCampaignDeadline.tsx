"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useReadContracts, useWriteContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  newdate: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Deadline must be a valid positive number.",
    },
  ),
});

type ExtendCampaignDeadlineProps = {
  campaignAddress: string;
};

const ExtendCampaignDeadline = (props: ExtendCampaignDeadlineProps) => {
  const { queryKey } = useReadContracts();
  const queryClient = useQueryClient();

  // State to manage the new deadline
  const [newDeadlineFormOpen, setNewDeadlineFormOpen] = React.useState(false);
  const {
    data: txDataHash,
    isPending: isTxPending,
    writeContract,
  } = useWriteContract();

  // state to write contact
  const [newDeadlineStatusDialogOpen, setNewDeadlineStatusDialogOpen] =
    React.useState(false);
  const [txSuccess, setTxSuccess] = React.useState(false);
  const [txErrorMessage, setTxErrorMessage] = React.useState<string | null>(
    null,
  );

  // 1. Define form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newdate: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "extendDeadline",
        args: [BigInt(values.newdate)],
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey });
          setTxSuccess(true);
          setTxErrorMessage(null);
          setNewDeadlineFormOpen(false);
          setNewDeadlineStatusDialogOpen(true);
        },
        onError: (error) => {
          setTxSuccess(false);
          setTxErrorMessage(error.message ?? "Something went wrong");
          setNewDeadlineFormOpen(false);
          setNewDeadlineStatusDialogOpen(true);
        },
      },
    );
  }

  return (
    <section className="my-4 w-full">
      <h2 className="text-lg font-semibold">Extend Campaign Deadline</h2>
      <p>Campaign Address: {props.campaignAddress}</p>

      {/* Button to open the new deadline form */}
      <Button onClick={() => setNewDeadlineFormOpen(true)}>
        Set New Deadline
      </Button>

      {/* New deadline form */}
      <Dialog open={newDeadlineFormOpen} onOpenChange={setNewDeadlineFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Campaign Deadline</DialogTitle>
            <DialogDescription>
              Please enter the new deadline for the campaign.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="newdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Deadline</FormLabel>
                      <FormControl>
                        <Input placeholder="1" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many days should your campaign extend? (e.g., 1 = 1
                        day, 30 = 30 days)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {isTxPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* submit confirmation or error */}
      <Dialog
        open={newDeadlineStatusDialogOpen}
        onOpenChange={setNewDeadlineStatusDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tx status</DialogTitle>
            <DialogDescription>
              Your transaction has been {txSuccess ? "successful" : "failed"}.
            </DialogDescription>
          </DialogHeader>
          <div>
            {isTxPending
              ? "Transaction is pending..."
              : txErrorMessage
                ? `Transaction failed: ${txErrorMessage}`
                : `Transaction successful: ${txDataHash}`}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ExtendCampaignDeadline;
