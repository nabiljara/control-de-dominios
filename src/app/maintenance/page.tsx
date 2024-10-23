import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 flex flex-col items-center justify-center p-4 text-center">
      {/* <div className="flex aspect-square size-28 items-center justify-center rounded-lg text-sidebar-primary-foreground"> */}
        {/* <Image
          src="/images/logo.svg"
          width={200}
          height={200}
          alt='Logo'
          className='mb-5'
        /> */}
      {/* </div> */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Estamos en mantenimiento</h1>
        <p className="text-xl text-green-700 mb-8">
          Estamos trabajando para mejorar nuestro sitio. Volveremos pronto con nuevas características increíbles.
        </p>
        <p className="text-green-600 mb-8">
          Gracias por tu paciencia. Estamos haciendo todo lo posible para volver en línea lo antes posible.
        </p>
        <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <Link href="/">
            Verificar si estamos de vuelta
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
