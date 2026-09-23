import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline: "border border-border bg-surface text-foreground hover:bg-secondary",
        secondary: "border border-border bg-surface text-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        nav: "w-full justify-start text-muted-foreground hover:bg-secondary hover:text-foreground",
        navActive: "w-full justify-start bg-primary text-primary-foreground",
        warning: "bg-warning text-warning-foreground hover:bg-warning-strong"
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        icon: "size-9 p-0"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";
export {
  Button,
  buttonVariants
};
