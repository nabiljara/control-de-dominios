import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function MaintenancePage() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-green-100 to-green-50 p-4 min-h-screen text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 font-bold text-green-800 text-4xl">Estamos en mantenimiento</h1>
        <p className="mb-8 text-green-700 text-xl">
          Estamos trabajando para mejorar nuestro sitio. Volveremos pronto con nuevas características increíbles.
        </p>
        <p className="mb-8 text-green-600">
          Gracias por tu paciencia. Estamos haciendo todo lo posible para volver en línea lo antes posible.
        </p>
        <Button asChild className="inline-flex items-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-bold text-white">
          <Link href="/">
            Verificar si estamos de vuelta
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
