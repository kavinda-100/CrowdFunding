"use client";

import React from "react";
import { formatGwei } from "viem";

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
    </div>
  );
};

export default TierCard;
