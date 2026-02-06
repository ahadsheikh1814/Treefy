"use client"

import { useState } from "react"

type CopyButtonProps = {
  url: string
}

export function CopyButton({ url }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-6 py-3 text-sm font-medium text-black hover:bg-[#F7F7F7]"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  )
}