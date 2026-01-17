"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
        xxl: "h-14 rounded-md px-10 has-[>svg]:px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
    },
  }
)

function GlassFilter() {
  return (
    <svg className="absolute h-0 w-0">
      <defs>
        <filter id="liquify" x="-50%" y="-50%" width="200%" height="200%">
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="2"
            seed="5"
            result="noise"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur in="noise" stdDeviation="3" result="blurredNoise" />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="25"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation="0.7" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        className={cn(
          "group relative",
          liquidbuttonVariants({ variant, size, className })
        )}
        {...props}
      >
        <GlassFilter />

        {/* Outer glow ring */}
        <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/50 via-accent/30 to-primary/50 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />

        {/* Glass surface with distortion filter */}
        <span
          className="absolute inset-0 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md transition-all duration-300 group-hover:border-white/40 group-hover:from-white/20"
          style={{ filter: "url(#liquify)" }}
        />

        {/* Inner highlight line at top */}
        <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-50" />

        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide drop-shadow-lg">
          {children}
        </span>

        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 -translate-x-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Comp>
    </>
  )
}

export { LiquidButton, liquidbuttonVariants }