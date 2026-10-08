import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08874f] focus-visible:ring-offset-2 disabled:pointer-events-none select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Solid Green #08874f, Hover darker green #06683d, Disable grey #e2e4e8
        default:
          "bg-[#08874f] text-white hover:bg-[#06683d] active:scale-[0.98] disabled:bg-[#e2e4e8] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",
        primary:
          "bg-[#08874f] text-white hover:bg-[#06683d] active:scale-[0.98] disabled:bg-[#e2e4e8] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",
        
        // Secondary: White bg with green border #08874f, Hover soft green #e1f0e8 with green border, Disable grey border
        secondary:
          "border border-[#08874f] text-[#08874f] dark:text-emerald-400 bg-white dark:bg-slate-800 hover:bg-[#e1f0e8] dark:hover:bg-emerald-950/50 hover:border-[#08874f] active:scale-[0.98] disabled:border-[#e2e4e8] disabled:bg-[#f8f9fa] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",
        outline:
          "border border-[#08874f] text-[#08874f] dark:text-emerald-400 bg-white dark:bg-slate-800 hover:bg-[#e1f0e8] dark:hover:bg-emerald-950/50 hover:border-[#08874f] active:scale-[0.98] disabled:border-[#e2e4e8] disabled:bg-[#f8f9fa] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",

        // Danger: Solid Red #dc2626, Hover darker red #991b1b, Disable grey
        danger:
          "bg-[#dc2626] text-white hover:bg-[#991b1b] active:scale-[0.98] disabled:bg-[#e2e4e8] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",
        destructive:
          "bg-[#dc2626] text-white hover:bg-[#991b1b] active:scale-[0.98] disabled:bg-[#e2e4e8] disabled:text-[#9ca3af] disabled:opacity-100 shadow-xs",

        // Tertiary: Transparent bg with green text, Hover soft grey box #e9ecef, Disable grey text
        tertiary:
          "text-[#08874f] dark:text-emerald-400 bg-transparent hover:bg-[#e9ecef] dark:hover:bg-slate-800 hover:text-[#08874f] dark:hover:text-emerald-300 disabled:text-[#9ca3af] disabled:bg-transparent disabled:opacity-100",
        ghost:
          "text-[#08874f] dark:text-emerald-400 bg-transparent hover:bg-[#e9ecef] dark:hover:bg-slate-800 hover:text-[#08874f] dark:hover:text-emerald-300 disabled:text-[#9ca3af] disabled:bg-transparent disabled:opacity-100",

        // Link: Green text with underline on hover, Disable grey
        link:
          "text-[#08874f] underline-offset-4 hover:underline disabled:text-[#9ca3af] disabled:no-underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-6 text-sm",
        icon: "h-9 w-9 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
