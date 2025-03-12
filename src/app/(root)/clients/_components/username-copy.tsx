'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface UsernameCopyProps {
  username: string
}

export function UsernameCopy({ username }: UsernameCopyProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(username)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 truncate">
      <span className='overflow-hidden'>{username}</span>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="sr-only">
          {copied ? 'Copiado' : 'Copiar nombre de usuario'}
        </span>
      </Button>
    </div>
  )
}
