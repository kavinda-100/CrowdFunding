"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";

const Header = () => {
  const { isConnected, address } = useAccount();

  const linkStyles = cn(
    "relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
    "text-foreground/70 hover:text-foreground",
    "before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0",
    "before:bg-gradient-to-r before:from-blue-500 before:to-purple-600",
    "before:transition-all before:duration-300 before:ease-in-out",
    "hover:before:left-0 hover:before:w-full",
    "active:scale-95 transform",
  );

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="Crowd Funding Logo"
                width={40}
                height={40}
                className="transition-all duration-300 group-hover:drop-shadow-lg dark:brightness-0 dark:contrast-200 dark:invert"
              />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20" />
            </div>
            <span className="hidden bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:block">
              CrowdFund
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center space-x-1 md:flex">
            {isConnected && (
              <Link href={`/dashboard/${address}`} className={linkStyles}>
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Dashboard
                </span>
              </Link>
            )}
            <Link href="/about" className={linkStyles}>
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </span>
            </Link>
          </nav>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <div className="custom-connect-button">
            <ConnectButton
              showBalance={false}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </div>

          <ModeToggle />

          <div className="md:hidden">
            {/* Mobile Header */}
            <MobileHeader />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const MobileHeader = () => {
  const { isConnected, address } = useAccount();

  const mobileNavItems = [
    ...(isConnected
      ? [
          {
            href: `/dashboard/${address}`,
            label: "Dashboard",
            icon: (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      href: "/about",
      label: "About",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-background hover:bg-accent flex items-center justify-center rounded-lg border p-2 transition-colors duration-200">
          <AlignJustify className="text-foreground h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 px-0">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle asChild>
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Crowd Funding Logo"
                  width={32}
                  height={32}
                  className="transition-all duration-300 group-hover:drop-shadow-lg dark:brightness-0 dark:contrast-200 dark:invert"
                />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                CrowdFund
              </span>
            </Link>
          </SheetTitle>
          <SheetDescription className="text-left">
            Navigate through your decentralized crowdfunding platform
          </SheetDescription>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 px-2 py-6">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group text-foreground/70 hover:text-foreground hover:bg-accent flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-all duration-200 group-hover:from-blue-500/20 group-hover:to-purple-500/20">
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute right-6 bottom-6 left-6 space-y-4">
          {/* Connection Status */}
          <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  isConnected ? "animate-pulse bg-green-500" : "bg-gray-400",
                )}
              />
              <div>
                <p className="text-sm font-medium">
                  {isConnected ? "Connected" : "Not Connected"}
                </p>
                {isConnected && address && (
                  <p className="text-muted-foreground font-mono text-xs">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              Built with ❤️ for Web3
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
