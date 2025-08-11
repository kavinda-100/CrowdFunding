"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProviderProps {
  children: React.ReactNode;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({
  isVisible: false,
  setIsVisible: () => {
    // Default empty function
  },
});

interface TooltipProps {
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ isVisible, setIsVisible }}>
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
      });
    }
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", children, ...props }, ref) => {
    const { isVisible } = React.useContext(TooltipContext);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm whitespace-nowrap shadow-md",
          side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
          side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2",
          side === "left" && "top-1/2 right-full mr-2 -translate-y-1/2",
          side === "right" && "top-1/2 left-full ml-2 -translate-y-1/2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
