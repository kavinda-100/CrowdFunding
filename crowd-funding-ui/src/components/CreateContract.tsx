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
  Type,
  FileText,
  Target,
  Calendar,
  DollarSign,
  Coins,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";

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
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <PlusIcon className="h-6 w-6 animate-bounce" />
              </div>
              <div className="flex flex-col items-center justify-center text-center">
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
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                Create New Campaign
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Launch your crowdfunding project and turn your vision into
                reality
              </DialogDescription>
            </div>
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
                        <FormLabel className="flex items-center gap-2 font-semibold">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-500">
                            <Type className="h-3 w-3 text-white" />
                          </div>
                          Campaign Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your campaign name (e.g., Save the Ocean)"
                              className="border-2 pl-10 transition-colors focus:border-blue-400"
                              {...field}
                            />
                            <Type className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-xs">
                          Choose a compelling name that captures your
                          project&apos;s essence
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
                        <FormLabel className="flex items-center gap-2 font-semibold">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-emerald-500 to-teal-500">
                            <FileText className="h-3 w-3 text-white" />
                          </div>
                          Description
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Describe your campaign (e.g., Help us clean 100 beaches worldwide)"
                              className="border-2 pl-10 transition-colors focus:border-emerald-400"
                              {...field}
                            />
                            <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-xs">
                          Explain what your campaign is about and why people
                          should support it
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2 font-semibold">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-yellow-500 to-orange-500">
                              <Target className="h-3 w-3 text-white" />
                            </div>
                            Funding Goal
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter amount (e.g., 10)"
                                type="number"
                                className="border-2 pl-10 transition-colors focus:border-yellow-400"
                                {...field}
                              />
                              <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-muted-foreground text-xs">
                            Set your funding target amount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-semibold">
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
                              <SelectTrigger className="border-2 transition-colors focus:border-purple-400">
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gwei">
                                <div className="flex items-center gap-2">
                                  <Coins className="h-4 w-4" />
                                  Gwei
                                </div>
                              </SelectItem>
                              <SelectItem value="ether">
                                <div className="flex items-center gap-2">
                                  <Coins className="h-4 w-4" />
                                  Ether
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-muted-foreground text-xs">
                            Choose currency type
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
                        <FormLabel className="flex items-center gap-2 font-semibold">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-pink-500">
                            <Calendar className="h-3 w-3 text-white" />
                          </div>
                          Campaign Duration
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter duration in days (e.g., 30)"
                              type="number"
                              className="border-2 pl-10 transition-colors focus:border-red-400"
                              {...field}
                            />
                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-xs">
                          How many days should your campaign run? (e.g., 1 = 1
                          day, 30 = 30 days)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating Campaign...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            Launch Campaign
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
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
