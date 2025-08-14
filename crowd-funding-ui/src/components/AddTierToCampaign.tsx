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
import { Coins, PlusIcon } from "lucide-react";
import { useWriteContract } from "wagmi";

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
          console.log("Tier added successfully:", data);
        },
        onError(error) {
          console.error("Error adding tier:", error);
        },
      },
    );
  }

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="flex w-full gap-4 border p-4">
          <PlusIcon className="size-5 animate-bounce" />
          Add Tier
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new Tier</DialogTitle>
            <DialogDescription>
              Please fill out the form below to add a new tier to your campaign.
            </DialogDescription>
          </DialogHeader>
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
                      <FormLabel>Tier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gold Tier" {...field} />
                      </FormControl>
                      <FormDescription>This is your tier name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-center gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tier Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="25" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your tier amount.
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
                <Button type="submit">
                  {isPending ? "Adding..." : "Add Tier"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTierToCampaign;
