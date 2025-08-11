"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  Github,
  Twitter,
  Mail,
  Shield,
  Users,
  Zap,
  Heart,
  ExternalLink,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerLinks = {
    platform: [
      { label: "How it Works", href: "#" },
      { label: "Create Campaign", href: "#" },
      { label: "Browse Campaigns", href: "#" },
      { label: "Success Stories", href: "#" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/kavinda-100",
      label: "GitHub",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
    },
    {
      icon: Mail,
      href: "#",
      label: "Email",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Built on blockchain for maximum security",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Powered by a global community of supporters",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick transactions with minimal fees",
    },
  ];

  return (
    <>
      <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-t backdrop-blur">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Top Section */}
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-1">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src="/logo.svg"
                    alt="CrowdFund Logo"
                    width={40}
                    height={40}
                    className="transition-all duration-300 group-hover:drop-shadow-lg dark:brightness-0 dark:contrast-200 dark:invert"
                  />
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  CrowdFund
                </span>
              </Link>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering creators and innovators through decentralized
                crowdfunding. Building the future of fundraising on the
                blockchain.
              </p>

              {/* Features */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-all duration-200 group-hover:from-blue-500/20 group-hover:to-purple-500/20">
                      <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-foreground text-sm font-medium">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-3">
              {/* Platform Links */}
              <div className="space-y-4">
                <h3 className="text-foreground text-sm font-semibold">
                  Platform
                </h3>
                <ul className="space-y-3">
                  {footerLinks.platform.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-4">
                <h3 className="text-foreground text-sm font-semibold">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div className="space-y-4">
                <h3 className="text-foreground text-sm font-semibold">
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-4">
                <h3 className="text-foreground text-sm font-semibold">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground group flex items-center gap-1 text-sm transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Contact Information */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>San Francisco, CA, USA</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>www.crowdfund.com</span>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright */}
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>© 2025 CrowdFund. Built with</span>
              <Heart className="h-4 w-4 animate-pulse text-red-500" />
              <span>for Web3</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent group h-9 w-9 rounded-full"
                        asChild
                      >
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <social.icon className="h-4 w-4 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Version */}
            <div className="text-muted-foreground text-xs">
              v2.0.0 • Built on Ethereum
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              size="sm"
              className={cn(
                "fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "border-0 text-white hover:scale-110 hover:shadow-xl",
                showScrollTop
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-10 opacity-0",
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Scroll to top</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default Footer;
