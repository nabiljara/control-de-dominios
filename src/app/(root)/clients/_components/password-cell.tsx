'use client'

import { useState } from 'react'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface PasswordCellProps {
  password: string
  show?: boolean
}

export function PasswordCell({ password, show }: PasswordCellProps) {
  const [showPassword, setShowPassword] = useState(show ?? false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-start items-center gap-2">
      <span className={cn('font-mono', password === 'Contraseña mal generada' ? 'text-red-500' : '')}>
        {showPassword ? password : "•".repeat(8)}
      </span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Esconder contraseña' : 'Mostrar contraseña'}
          </span>
        </Button>
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
            {copied ? 'Copiar' : 'Contraseña copiada'}
          </span>
        </Button>
      </div>
    </div>
  )
}
