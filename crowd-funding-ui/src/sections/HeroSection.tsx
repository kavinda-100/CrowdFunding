"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Coins,
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useAccount } from "wagmi";

const HeroSection = () => {
  const { isConnected } = useAccount();
  const stats = [
    { value: "10K+", label: "Campaigns Funded", icon: TrendingUp },
    { value: "50M+", label: "ETH Raised", icon: Coins },
    { value: "100K+", label: "Active Users", icon: Users },
    { value: "100%", label: "Uptime", icon: Shield },
  ];

  const features = [
    { text: "100% Decentralized", icon: Globe },
    { text: "Smart Contract Security", icon: Shield },
    { text: "Lightning Fast Transactions", icon: Zap },
    { text: "Global Community", icon: Users },
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 mix-blend-multiply blur-xl filter" />
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 opacity-20 mix-blend-multiply blur-xl filter" />
        <div className="animate-blob animation-delay-4000 absolute top-40 left-40 h-80 w-80 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600 opacity-20 mix-blend-multiply blur-xl filter" />
      </div>

      {/* Grid Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Built on Ethereum Blockchain
                </Badge>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
                  <span className="text-foreground">Fund the</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Future
                  </span>
                  <br />
                  <span className="text-foreground">with</span>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    ETH
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed md:text-2xl">
                The world&apos;s first truly decentralized crowdfunding
                platform. Create, fund, and support innovative projects with
                complete transparency and security on the Ethereum blockchain.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 transition-all duration-200 group-hover:from-green-500/20 group-hover:to-emerald-500/20">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-foreground/80 text-sm font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Button
                  size="lg"
                  className="transform border-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  asChild
                >
                  <Link href={isConnected ? "/dashboard" : "/"}>
                    Start Your Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-accent border-2 px-8 py-6 text-lg"
                  asChild
                >
                  <Link href={isConnected ? "/dashboard" : "/"}>
                    Explore Projects
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="space-y-6">
              {/* Main Stats Card */}
              <Card className="via-background/80 border-border/50 bg-gradient-to-br from-blue-500/3 to-purple-500/3 shadow-xs backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-8 space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                      <Coins className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-foreground/90 text-xl font-semibold">
                      Platform Statistics
                    </h3>
                    <p className="text-muted-foreground/80 text-sm">
                      Real-time blockchain data
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="group space-y-3 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/8 to-purple-500/8 transition-all duration-200 group-hover:from-blue-500/15 group-hover:to-purple-500/15">
                          <stat.icon className="h-5 w-5 text-blue-600/80 dark:text-blue-400/80" />
                        </div>
                        <div>
                          <div className="text-foreground/90 text-xl font-semibold">
                            {stat.value}
                          </div>
                          <div className="text-muted-foreground/70 text-xs">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:border-blue-800">
                  <CardContent className="p-6 text-center">
                    <Shield className="mx-auto mb-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-foreground mb-2 font-semibold">
                      Secure
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Smart contract audited by leading security firms
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:border-purple-800">
                  <CardContent className="p-6 text-center">
                    <Zap className="mx-auto mb-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-foreground mb-2 font-semibold">Fast</h4>
                    <p className="text-muted-foreground text-sm">
                      Lightning-fast transactions on Ethereum L2
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center justify-center gap-3 rounded-lg border border-green-200 bg-green-500/10 p-4 dark:border-green-800">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Live on Ethereum Mainnet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="border-foreground/20 flex h-10 w-6 justify-center rounded-full border-2">
          <div className="bg-foreground/40 mt-2 h-3 w-1 animate-pulse rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
