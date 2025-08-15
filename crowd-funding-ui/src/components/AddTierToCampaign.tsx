"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseEther, parseGwei } from "viem";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Coins,
  PlusIcon,
  Target,
  Sparkles,
  CheckCircle,
  XCircle,
  Gift,
  DollarSign,
} from "lucide-react";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

type AddTierToCampaignProps = {
  campaignAddress: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tier name must be at least 2 characters.",
  }),
  amount: z
    .string()
    .min(1, {
      message: "Goal must be at least 1.",
    })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: "Tier amount must be a valid positive number.",
      },
    ),
  amountType: z.enum(["gwei", "ether"]),
});

const AddTierToCampaign = (props: AddTierToCampaignProps) => {
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { queryKey } = useReadContract();
  const { queryKey: queryKeyMultiple } = useReadContracts();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [modelOpen, setModelOpen] = React.useState(false);
  const [isTxSuccess, setIsTxSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      amountType: "gwei", // Default to Gwei
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert goal to proper blockchain format
    let goalInWei: bigint;

    if (values.amountType === "gwei") {
      goalInWei = parseGwei(values.amount);
    } else {
      goalInWei = parseEther(values.amount);
    }

    // Create the final submission object
    const submissionData = {
      ...values,
      goal: goalInWei, // Now properly converted to bigint
    };

    console.log("Submission data:", submissionData);

    // write to contact
    writeContract(
      {
        address: props.campaignAddress as `0x${string}`,
        abi: CrowdFundingContractAbi.abi,
        functionName: "addTier",
        args: [values.name, submissionData.goal],
      },
      {
        onSuccess(data) {
          void queryClient.invalidateQueries({ queryKey });
          void queryClient.invalidateQueries({ queryKey: queryKeyMultiple });
          console.log("Tier added successfully:", data);
          setDialogOpen(false);
          setErrorMessage(null);
          setIsTxSuccess(true);
          setModelOpen(true);
        },
        onError(error) {
          console.error("Error adding tier:", error);
          setIsTxSuccess(false);
          setDialogOpen(false);
          setModelOpen(true);
          setErrorMessage(
            error.message ?? "Failed to add tier. Please try again.",
          );
        },
      },
    );
  }

  return (
    <div className="w-full">
      {/* Dialog for adding a new tier */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 transition-all duration-300 hover:border-blue-400 hover:from-blue-100 hover:to-purple-100 dark:border-gray-600 dark:from-gray-800 dark:to-gray-900 dark:hover:border-blue-500">
            <div className="flex items-center justify-center space-x-3 p-6">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-700">
                <PlusIcon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="text-center">
                <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent">
                  Add New Tier
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create a funding tier for your campaign
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </DialogTrigger>
        <DialogContent className="border-0 bg-gradient-to-br from-white to-blue-50 shadow-2xl sm:max-w-[500px] dark:from-gray-900 dark:to-gray-800">
          <DialogHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              Create New Funding Tier
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Set up a new tier with specific funding amount and rewards for
              your supporters.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-green-500 to-blue-500">
                          <Target className="h-3 w-3 text-white" />
                        </div>
                        Tier Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Gold Supporter, Premium Backer"
                          {...field}
                          className="border-2 bg-white/50 transition-colors focus:border-blue-400 dark:bg-gray-800/50"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Choose an attractive name for this funding tier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-start gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-yellow-500 to-orange-500">
                            <DollarSign className="h-3 w-3 text-white" />
                          </div>
                          Funding Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.1"
                            {...field}
                            className="border-2 bg-white/50 transition-colors focus:border-purple-400 dark:bg-gray-800/50"
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Minimum contribution for this tier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amountType"
                    render={({ field }) => (
                      <FormItem className="min-w-[120px]">
                        <FormLabel className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500">
                            <Coins className="h-3 w-3 text-white" />
                          </div>
                          Currency
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 bg-white/50 transition-colors focus:border-purple-400 dark:bg-gray-800/50">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gwei">
                              <div className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-gray-600" />
                                <span>Gwei</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ether">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <span>Ether</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-gray-600 dark:text-gray-400">
                          Choose currency type
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Creating Tier...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <PlusIcon className="h-4 w-4" />
                      <span>Create Tier</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success and Error modal */}
      <Dialog open={modelOpen} onOpenChange={setModelOpen}>
        <DialogContent className="border-0 bg-gradient-to-br from-white to-green-50 shadow-2xl sm:max-w-[400px] dark:from-gray-900 dark:to-green-900/20">
          {isTxSuccess ? (
            <div className="space-y-4 p-6 text-center">
              <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                  Success!
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Your tier has been created successfully!
                </p>
              </div>
              {hash && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <p className="mb-1 text-sm font-medium text-green-700 dark:text-green-400">
                    Transaction Hash:
                  </p>
                  <p className="rounded bg-green-100 p-2 font-mono text-xs text-green-600 dark:bg-green-900/30 dark:text-green-300">
                    {hash.slice(0, 20)}...{hash.slice(-8)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 bg-gradient-to-br from-white to-red-50 p-6 text-center dark:from-gray-900 dark:to-red-900/20">
              <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-4">
                <XCircle className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                  Error
                </h3>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {errorMessage ?? "Something went wrong. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setModelOpen(false)}
              className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTierToCampaign;
