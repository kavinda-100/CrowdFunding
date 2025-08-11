"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Eye,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Coins,
  Lock,
  Rocket,
  Code,
  Handshake,
} from "lucide-react";
import { useAccount } from "wagmi";

const AboutPage = () => {
  const { isConnected } = useAccount();

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description:
        "Every transaction is recorded on the blockchain, ensuring complete transparency and accountability for all stakeholders.",
    },
    {
      icon: Globe,
      title: "Decentralization",
      description:
        "No single point of control. Our platform operates on Ethereum's decentralized network, empowering global participation.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a global community of innovators, creators, and supporters who believe in the power of collective funding.",
    },
    {
      icon: Heart,
      title: "Empowerment",
      description:
        "Enabling anyone, anywhere to fund their dreams and support projects that matter to them, without traditional barriers.",
    },
  ];

  const features = [
    {
      icon: Lock,
      title: "Smart Contract Security",
      description:
        "Audited smart contracts ensure your funds are safe and automatically released based on predefined conditions.",
      highlight: "99.9% Secure",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Transactions are processed quickly on Ethereum, reducing gas fees and improving user experience.",
      highlight: "Sub-second",
    },
    {
      icon: Coins,
      title: "ETH Native",
      description:
        "Built specifically for Ethereum, leveraging the most trusted blockchain network for maximum reliability.",
      highlight: "Ethereum",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Available worldwide 24/7. No geographical restrictions or traditional banking requirements.",
      highlight: "Worldwide",
    },
  ];

  const team = [
    {
      role: "Blockchain Architects",
      description:
        "Expert developers with deep knowledge of Ethereum and smart contract development",
      icon: Code,
    },
    {
      role: "Security Specialists",
      description:
        "Cybersecurity experts ensuring the highest level of platform and user protection",
      icon: Shield,
    },
    {
      role: "Community Builders",
      description:
        "Dedicated team members focused on growing and supporting our global community",
      icon: Users,
    },
    {
      role: "Product Innovators",
      description:
        "UX/UI designers and product managers creating intuitive crowdfunding experiences",
      icon: Lightbulb,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Projects Funded", icon: Target },
    { value: "50M+", label: "ETH Raised", icon: TrendingUp },
    { value: "100K+", label: "Active Users", icon: Users },
    { value: "195", label: "Countries", icon: Globe },
  ];

  return (
    <div className="from-background to-background/80 min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/10 dark:via-purple-950/10 dark:to-pink-950/10" />

        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 mix-blend-multiply blur-xl filter" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-600/20 mix-blend-multiply blur-xl filter" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-300">
              <Rocket className="mr-2 h-4 w-4" />
              About Our Platform
            </Badge>

            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
              Revolutionizing{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Crowdfunding
              </span>
              <br />
              with{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Blockchain
              </span>
            </h1>

            <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
              We&apos;re building the future of decentralized funding, where
              innovation meets transparency, and dreams become reality through
              the power of community.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="transform bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <Link href={isConnected ? "/dashboard" : "/"}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#mission">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-background/80 border-border/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-foreground text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                  Our{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Mission
                  </span>
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  To democratize access to funding by creating a transparent,
                  secure, and decentralized platform where innovative projects
                  can thrive without traditional financial barriers.
                </p>
                <p className="text-muted-foreground mb-8 text-lg">
                  We believe that great ideas shouldn&apos;t be limited by
                  geography, connections, or institutional gatekeepers. Through
                  blockchain technology, we&apos;re making funding accessible to
                  everyone, everywhere.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-foreground">
                      Eliminate traditional funding barriers
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-foreground">
                      Ensure complete transparency
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-foreground">
                      Enable global participation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-foreground">
                      Support innovative projects worldwide
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="border-blue-200 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:border-blue-800">
                  <CardContent className="p-8">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-4 text-center text-xl font-semibold">
                      Our Vision
                    </h3>
                    <p className="text-muted-foreground text-center">
                      A world where every innovative idea has the opportunity to
                      receive funding and support from a global community,
                      powered by transparent and secure blockchain technology.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Our{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Values
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="bg-background/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                        <value.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Platform{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Features
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Cutting-edge technology meets user-friendly design
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group bg-gradient-to-br from-blue-500/3 to-purple-500/3 transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-purple-500/20">
                          <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          {feature.title}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-700 dark:text-green-300"
                      >
                        {feature.highlight}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Our{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Team
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Passionate experts dedicated to revolutionizing crowdfunding
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {team.map((member, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                        <member.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold">{member.role}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Card className="border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:border-blue-800">
              <CardContent className="p-12">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="mb-6 text-3xl font-bold">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Get Started?
                  </span>
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join thousands of innovators and supporters who are already
                  using our platform to bring amazing projects to life.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    className="transform bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                    asChild
                  >
                    <Link href={isConnected ? "/dashboard" : "/"}>
                      Launch Your Project
                      <Rocket className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href={isConnected ? "/dashboard" : "/"}>
                      Explore Projects
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
