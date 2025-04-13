import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] text-white hover:from-[#F15BB5] hover:to-[#9B5DE5]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        destructiveGhost:
          "text-destructive hover:bg-destructive hover:text-destructive-foreground",
        outline:
          "border border-[#9B5DE5] bg-background hover:bg-[#9B5DE5] hover:text-white",
        secondary:
          "bg-gradient-to-r from-[#F15BB5] to-[#9B5DE5] text-white hover:from-[#9B5DE5] hover:to-[#F15BB5]",
        ghost: "hover:bg-[#9B5DE5] hover:text-white",
        link: "text-[#9B5DE5] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
