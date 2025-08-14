"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  PlusIcon,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  Rocket,
} from "lucide-react";
import { parseEther, parseGwei } from "viem";
import { useWriteContract, useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import CrowdFundingFactoryAbi from "@/abi/CrowdFundingFactory.json";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  goal: z
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
        message: "Goal must be a valid positive number.",
      },
    ),
  amountType: z.enum(["gwei", "ether"]),
  deadline: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Deadline must be a valid positive number.",
    },
  ),
});

const CreateContract = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { queryKey } = useReadContract();
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
      description: "",
      goal: "1",
      amountType: "gwei",
      deadline: "1",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert goal to proper blockchain format
    let goalInWei: bigint;

    if (values.amountType === "gwei") {
      goalInWei = parseGwei(values.goal);
    } else {
      goalInWei = parseEther(values.goal);
    }

    // Create the final submission object
    const submissionData = {
      ...values,
      goal: goalInWei, // Now properly converted to bigint
    };

    console.log("Submission data:", submissionData);
    // Call the writeContract function
    writeContract(
      {
        address: process.env
          .NEXT_PUBLIC_CROWDFUNDING_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
        abi: CrowdFundingFactoryAbi.abi,
        functionName: "createCampaign",
        args: [
          values.name,
          values.description,
          submissionData.goal,
          BigInt(values.deadline),
        ],
      },
      {
        onSuccess(data) {
          console.log("Contract created successfully:", data);
          setDialogOpen(false);
          setIsTxSuccess(true);
          setModelOpen(true);
          // Invalidate all getUserCampaigns queries to refresh dashboard data
          void queryClient.invalidateQueries({
            queryKey: queryKey,
          });
        },
        onError(error) {
          console.error("Error creating contract:", error);
          setDialogOpen(false);
          setErrorMessage(error.message ?? "Error creating contract");
          setModelOpen(true);
        },
        onSettled() {
          // Reset form after submission
          form.reset();
        },
      },
    );
  }

  // for debugging
  //   console.log("Write Contract Hook Data:", { hash, isPending, error });

  return (
    <div className="w-full">
      {/* Create Contract Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="group relative w-full overflow-hidden rounded-lg border-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full w-full cursor-pointer items-center justify-center p-6 text-white">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <PlusIcon className="h-6 w-6 animate-bounce" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold">Create Campaign</h3>
                <p className="text-sm text-white/90">Launch your project</p>
              </div>
            </div>
            {/* Sparkle Effect */}
            <div className="absolute top-4 right-4 opacity-50">
              <Rocket className="h-5 w-5 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new contract</DialogTitle>
            <DialogDescription>
              Please fill in the details below to create your contract.
            </DialogDescription>
            <div>
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter campaign name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public Campaign Name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter campaign description"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public Campaign Description
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full items-center justify-between gap-3">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Goal</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter campaign goal"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your public Campaign Goal.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amountType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Amount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an amount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gwei">Gwei</SelectItem>
                              <SelectItem value="ether">Ether</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            You can select the amount type.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter campaign deadline"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public Campaign Deadline (e.g.: enter 1
                          for 1 day, 7 for 7 days)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    {isPending ? "Creating..." : "Create Campaign"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Success and error Modal */}
      <Dialog open={modelOpen} onOpenChange={setModelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto">
              {isTxSuccess ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <DialogTitle className="text-xl font-semibold">
              {isTxSuccess ? "Campaign Created!" : "Transaction Failed"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isTxSuccess ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-950/50 dark:to-emerald-950/50">
                  <div className="mb-3 flex items-center gap-3">
                    <Rocket className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Your campaign is now live on the blockchain!
                    </p>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Supporters can now discover and fund your project. Share
                    your campaign to get started!
                  </p>
                </div>

                {hash && (
                  <div className="bg-muted/50 rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-foreground text-sm font-medium">
                        Transaction Hash:
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => navigator.clipboard.writeText(hash)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/tx/${hash}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-mono text-sm break-all">
                      {hash}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 dark:border-red-800 dark:from-red-950/50 dark:to-rose-950/50">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="mb-1 font-medium text-red-800 dark:text-red-200">
                      Transaction Failed
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {errorMessage ??
                        "An unexpected error occurred. Please check your wallet and try again."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            {isTxSuccess ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModelOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    setModelOpen(false);
                  }}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  View Campaign
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => setModelOpen(false)}>
                Try Again
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContract;
