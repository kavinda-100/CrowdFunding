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
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: "1",
      amountType: "ether",
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
  }

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="flex w-full cursor-pointer items-center justify-center border p-4">
          <div className="flex items-center gap-4">
            <PlusIcon className="size-5 animate-bounce" />
            <span>create a contract</span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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
                  <Button type="submit">Create Campaign</Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContract;
