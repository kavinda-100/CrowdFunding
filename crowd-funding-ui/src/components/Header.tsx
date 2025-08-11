"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";

const Header = () => {
  const { isConnected, address } = useAccount();
  return (
    <header className="flex size-full items-center justify-between px-4 py-2">
      <div className="flex items-center justify-center gap-5">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Crowd Funding Logo"
            width={40}
            height={40}
            className="dark:invert-100"
          />
        </Link>
        {isConnected && <Link href={`/dashboard/${address}`}>Dashboard</Link>}
        <Link href="/about">About</Link>
      </div>

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
