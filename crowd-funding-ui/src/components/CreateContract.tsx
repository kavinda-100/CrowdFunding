import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { parseEther, parseGwei } from "viem";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useWriteContract } from "wagmi";
import CrowdFundingFactoryAbi from "@/abi/CrowdFundingFactory.json";

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
  const { data: hash, isPending, error, writeContract } = useWriteContract();

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
        },
        onError(error) {
          console.error("Error creating contract:", error);
          setDialogOpen(false);
          setErrorMessage(error.message ?? "Error creating contract");
          setModelOpen(true);
        },
      },
    );
  }

  // for debugging
  console.log("Write Contract Hook Data:", { hash, isPending, error });

  return (
    <div className="w-full">
      {/* Create Contract Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="flex w-full cursor-pointer items-center justify-center border p-4">
          <div className="flex items-center gap-4">
            <PlusIcon className="size-5 animate-bounce" />
            <span>Create a Contract</span>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Status</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {isTxSuccess ? (
              <div>
                Your campaign has been created successfully!
                <p>Transaction Hash: {hash}</p>
              </div>
            ) : (
              <p>{errorMessage ?? "An error occurred. Please try again."}</p>
            )}
          </div>
          <Button
            onClick={() => {
              setModelOpen(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContract;
