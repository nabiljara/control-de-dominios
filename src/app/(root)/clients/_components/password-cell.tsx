'use client'

import { useState } from 'react'
import { Check, Copy, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PasswordCellProps {
  password: string
}

export function PasswordCell({ password }: PasswordCellProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <span className="font-mono">
        {showPassword ? password : '••••••••'}
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
