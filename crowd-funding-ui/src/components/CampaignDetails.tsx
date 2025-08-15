"use client";

import React from "react";
import { formatEther, formatGwei } from "viem";
import {
  Calendar,
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Coins,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type CampaignDetailsProps = {
  campaignName: string;
  campaignDescription: string;
  campaignGoal: number;
  campaignDeadline: Date;
  campaignStatus: 0 | 1 | 2; // "Active" = 0 | "Successful" = 1 | "Failed" = 2;
  totalBalance: number;
};

const CampaignDetails = (props: CampaignDetailsProps) => {
  const [selectedFormat, setSelectedFormat] = React.useState<"ETH" | "WEI">(
    "WEI",
  );

  // Calculate progress percentage
  let progress = 0;
  if (props.campaignGoal > 0) {
    progress = Math.min((props.totalBalance / props.campaignGoal) * 100, 100);
  }

  // Ensure campaignDeadline is a valid Date object
  const deadlineDate =
    props.campaignDeadline instanceof Date
      ? props.campaignDeadline
      : new Date(props.campaignDeadline);

  // Function to convert Wei to ETH with proper formatting
  const formatWeiToEth = (weiValue: number): string => {
    try {
      const ethValue = formatEther(BigInt(weiValue));
      const numValue = parseFloat(ethValue);

      // Format with appropriate decimal places
      if (numValue >= 1) {
        return `${numValue.toFixed(4)} ETH`;
      } else if (numValue >= 0.001) {
        return `${numValue.toFixed(6)} ETH`;
      } else {
        return `${numValue.toFixed(10)} ETH`;
      }
    } catch {
      return `${weiValue} Wei`;
    }
  };

  // Get status color and icon
  const getStatusConfig = (status: number) => {
    switch (status) {
      case 0:
        return {
          icon: <Activity className="h-5 w-5" />,
          color: "bg-gradient-to-r from-green-500 to-emerald-500",
          textColor: "text-green-700 dark:text-green-300",
          bgColor: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case 1:
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-gradient-to-r from-blue-500 to-purple-500",
          textColor: "text-blue-700 dark:text-blue-300",
          bgColor: "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
      case 2:
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: "bg-gradient-to-r from-red-500 to-rose-500",
          textColor: "text-red-700 dark:text-red-300",
          bgColor: "bg-gradient-to-r from-red-500/10 to-rose-500/10",
          borderColor: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
          textColor: "text-gray-700 dark:text-gray-300",
          bgColor: "bg-gradient-to-r from-gray-500/10 to-slate-500/10",
          borderColor: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  // get status in text
  const getStatusInText = (status: number) => {
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

  const statusConfig = getStatusConfig(props.campaignStatus);

  // Calculate time remaining with hours precision
  const now = new Date();
  const timeRemaining = deadlineDate.getTime() - now.getTime();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
  );

  // Format time remaining display
  const getTimeRemainingText = () => {
    if (timeRemaining <= 0) {
      return "Campaign ended";
    } else if (daysRemaining > 1) {
      return `${daysRemaining} days left`;
    } else if (daysRemaining === 1) {
      return `1 day ${hoursRemaining}h left`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${minutesRemaining}m left`;
    } else if (minutesRemaining > 0) {
      return `${minutesRemaining} minutes left`;
    } else {
      return "Less than 1 minute left";
    }
  };

  const timeRemainingText = getTimeRemainingText();

  return (
    <div className="from-background to-background/80 bg-gradient-to-br p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                {props.campaignName}
              </h1>
              <p className="text-muted-foreground text-lg">Campaign Details</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6 flex items-center gap-3">
            <Badge
              className={cn(
                "px-4 py-2",
                statusConfig.borderColor,
                statusConfig.bgColor,
                statusConfig.textColor,
              )}
            >
              {statusConfig.icon}
              <span className="ml-2 font-semibold">
                {getStatusInText(props.campaignStatus)}
              </span>
            </Badge>
            {timeRemaining > 0 && (
              <Badge className="border-orange-200 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 text-orange-700 dark:border-orange-800 dark:text-orange-300">
                <Clock className="mr-1 h-3 w-3" />
                {timeRemainingText}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Campaign Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description Card */}
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  About This Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {props.campaignDescription}
                </p>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                      Progress
                    </span>
                    <span className="text-sm font-bold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-6" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Raised
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Goal
                    </span>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center dark:border-green-800 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {selectedFormat === "ETH"
                        ? formatWeiToEth(props.totalBalance)
                        : `${formatGwei(BigInt(props.totalBalance))} WEI`}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Current Balance
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 text-center dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {selectedFormat === "ETH"
                        ? formatWeiToEth(props.campaignGoal)
                        : `${formatGwei(BigInt(props.campaignGoal))} WEI`}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Target Goal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Format Selector */}
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Coins className="h-4 w-4 text-white" />
                  </div>
                  Display Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedFormat}
                  onValueChange={setSelectedFormat as any}
                >
                  <SelectTrigger className="w-full border-2 transition-colors focus:border-purple-400">
                    <SelectValue placeholder="Select The Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Ethereum (ETH)
                      </div>
                    </SelectItem>
                    <SelectItem value="WEI">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Wei (WEI)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Campaign Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-3 dark:border-orange-800 dark:from-orange-950/20 dark:to-yellow-950/20">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <div className="font-semibold text-orange-700 dark:text-orange-300">
                      Deadline
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      {deadlineDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Remaining */}
                {props.campaignStatus === 0 && (
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 dark:border-green-800 dark:from-green-950/20 dark:to-emerald-950/20">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        Time Remaining
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {timeRemainingText}
                      </div>
                    </div>
                  </div>
                )}
                {/* If successful */}
                {props.campaignStatus === 1 && (
                  <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 dark:border-blue-800 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-semibold text-blue-700 dark:text-blue-300">
                        Campaign Successful
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Thank you for your support!
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
