"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useReadContracts, useWriteContract } from "wagmi";
import CrowdFundingContractAbi from "@/abi/CrowdFunding.json";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Loader2,
  Plus,
  CalendarPlus,
  Timer,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
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
        functionName: "extendCampaignDeadline",
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
    <section className="w-full">
      {/* Extend Deadline Card */}
      <Card className="w-full rounded-none border-0 bg-gradient-to-br from-white to-purple-50 shadow-lg dark:from-gray-800 dark:to-purple-900/20">
        <CardHeader className="container mx-auto pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 p-3">
                <CalendarPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300">
                  Extend Campaign Deadline
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Give your campaign more time to reach its goals
                </p>
              </div>
            </div>

            {/* Feature Badge */}
            <Badge className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              <Timer className="mr-1 h-3 w-3" />
              Time Extension
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="container mx-auto space-y-4">
          {/* Information Section */}
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="mb-2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Deadline Extension Options
              </span>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Extend your campaign deadline to give supporters more time to
              contribute. You can add additional days to your current deadline
              to maximize funding potential.
            </p>
          </div>

          {/* Campaign Address Display */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="mb-1 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Campaign Address:
              </span>
            </div>
            <p className="rounded bg-blue-100 p-2 font-mono text-xs break-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              {props.campaignAddress}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => setNewDeadlineFormOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Set New Deadline</span>
              <Plus className="h-4 w-4" />
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* New deadline form */}
      <Dialog open={newDeadlineFormOpen} onOpenChange={setNewDeadlineFormOpen}>
        <DialogContent className="border-0 bg-gradient-to-br from-white to-purple-50 shadow-2xl sm:max-w-[500px] dark:from-gray-900 dark:to-purple-900/20">
          <DialogHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 p-3">
              <CalendarPlus className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              Extend Campaign Deadline
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Add more days to your campaign deadline to give supporters
              additional time to contribute.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="newdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-500">
                          <Timer className="h-3 w-3 text-white" />
                        </div>
                        Extension Duration (Days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="7"
                          type="number"
                          min="1"
                          {...field}
                          className="border-2 bg-white/50 transition-colors focus:border-purple-400 dark:bg-gray-800/50"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Enter the number of days to extend your campaign
                        deadline.
                        <br />
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          Examples: 7 = one week, 30 = one month
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Box */}
                <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <div className="mb-2 flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Important Information
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-purple-600 dark:text-purple-400">
                    <li>
                      • The extension will be added to your current deadline
                    </li>
                    <li>• This action cannot be undone once confirmed</li>
                    <li>
                      • Supporters will see the updated deadline immediately
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isTxPending}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                >
                  {isTxPending ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Extending Deadline...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CalendarPlus className="h-4 w-4" />
                      <span>Extend Deadline</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extension Status Dialog */}
      <Dialog
        open={newDeadlineStatusDialogOpen}
        onOpenChange={setNewDeadlineStatusDialogOpen}
      >
        <DialogContent className="border-0 shadow-2xl sm:max-w-[450px]">
          {txSuccess ? (
            <div className="rounded-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20">
              <DialogHeader className="pb-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                  Deadline Extended Successfully! 🎉
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
                  Your campaign deadline has been successfully extended.
                  Supporters now have more time to contribute!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6">
                {/* Extension Details */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="mb-3 flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <CalendarPlus className="h-5 w-5" />
                    <span className="font-semibold">Extension Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-300">
                        Extended Successfully
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Campaign:
                      </span>
                      <span className="font-mono text-xs font-medium text-gray-800 dark:text-gray-200">
                        {props.campaignAddress.slice(0, 8)}...
                        {props.campaignAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                {txDataHash && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Transaction Hash:
                      </span>
                    </div>
                    <p className="rounded bg-blue-100 p-2 font-mono text-xs break-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      {txDataHash}
                    </p>
                  </div>
                )}

                <div className="py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Your campaign timeline has been updated! ⏰
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => setNewDeadlineStatusDialogOpen(false)}
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
                  Extension Failed
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  We couldn&apos;t extend your campaign deadline at this time.
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
                    {txErrorMessage ??
                      "Transaction failed. Please check your wallet connection and try again."}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t worry! You can try extending the deadline again. 🔄
                </div>
              </div>

              <DialogFooter className="space-x-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setNewDeadlineStatusDialogOpen(false)}
                  className="flex-1 border-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setNewDeadlineStatusDialogOpen(false);
                    setNewDeadlineFormOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
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

export default ExtendCampaignDeadline;
