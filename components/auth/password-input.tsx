"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
      >
        {visible ? <EyeOff /> : <Eye />}
        <span className="sr-only">{visible ? "Hide password" : "Show password"}</span>
      </Button>
    </div>
  )
}
