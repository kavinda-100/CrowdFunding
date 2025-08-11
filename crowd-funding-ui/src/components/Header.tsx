"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  return (
    <header className="flex size-full items-center justify-between px-4 py-2">
      <h1 className="text-lg font-bold">🏦 Crowd Funding</h1>

      <nav className="flex items-center gap-3">
        <ConnectButton
          showBalance={false}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Header;
