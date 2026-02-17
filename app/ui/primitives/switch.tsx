"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "~/lib/utils"

type SwitchTone = "default" | "theme"

const trackToneClasses: Record<SwitchTone, string> = {
  default:
    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
  theme:
    "data-[state=checked]:bg-indigo-500 data-[state=checked]:hover:bg-indigo-500/90 data-[state=unchecked]:bg-zinc-300 dark:data-[state=unchecked]:bg-zinc-700",
}

function Switch({
  className,
  size = "default",
  tone = "default",
  thumbContent,
  thumbClassName,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
  tone?: SwitchTone
  thumbContent?: React.ReactNode
  thumbClassName?: string
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        trackToneClasses[tone],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-zinc-900 dark:bg-white pointer-events-none flex items-center justify-center rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          thumbClassName
        )}
      >
        {thumbContent}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
