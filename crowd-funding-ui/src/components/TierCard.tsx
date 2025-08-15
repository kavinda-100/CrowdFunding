"use client";

import React from "react";
import { formatEther } from "viem";
import { Coins, Heart, Trash2, Crown, Target, Zap, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type TierCardProps = {
  name: string;
  amount: number;
  isOwner: boolean;
};

const TierCard = (props: TierCardProps) => {
  // Convert amount to ETH for better readability
  const amountInEth = formatEther(BigInt(props.amount));
  const isHighValue = Number(amountInEth) >= 1;

  return (
    <Card className="group relative transform overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:from-gray-800 dark:to-gray-900">
      {/* Premium Badge for high-value tiers */}
      {isHighValue && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="border-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="mr-1 h-3 w-3" />
            Premium
          </Badge>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <CardHeader className="relative pb-3">
        <div className="mb-2 flex items-center space-x-3">
          <div
            className={`rounded-full p-2 ${
              isHighValue
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            }`}
          >
            {isHighValue ? (
              <Star className="h-5 w-5 text-white" />
            ) : (
              <Target className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300">
              {props.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Amount Display */}
        <div className="rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50 py-4 text-center dark:from-gray-700 dark:to-gray-800">
          <div className="mb-1 flex items-center justify-center space-x-2">
            <Coins className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Minimum Contribution
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            {amountInEth} ETH
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            ≈ {props.amount} Wei
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Fund Button */}
          <Button className="group w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Fund This Tier</span>
              <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </Button>

          {/* Remove Button (Owner Only) */}
          {props.isOwner && (
            <Button
              variant="destructive"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 py-2 font-semibold transition-all duration-300 hover:from-red-600 hover:to-pink-700"
            >
              <div className="flex items-center justify-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Remove Tier</span>
              </div>
            </Button>
          )}
        </div>
      </CardContent>

      {/* Owner Badge */}
      {props.isOwner && (
        <div className="absolute bottom-4 left-4">
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-700"
          >
            <Crown className="mr-1 h-3 w-3" />
            Owner
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default TierCard;
