"use client";

import React from "react";
import { formatGwei } from "viem";
import { Button } from "./ui/button";

type TierCardProps = {
  name: string;
  amount: number;
};

const TierCard = (props: TierCardProps) => {
  return (
    <div className="border p-4">
      <h2 className="text-lg font-semibold">{props.name}</h2>
      <p className="text-sm text-gray-500">
        Goal: {formatGwei(BigInt(props.amount))} WEI
      </p>
      {/* fund button */}
      <Button>Fund Tier</Button>

      {/* remove tier if the owner */}
    </div>
  );
};

export default TierCard;
