import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GlobeIcon as GlobeOff } from 'lucide-react'
import Link from "next/link"

export default function DomainNotFound() {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-2 text-center">
            <GlobeOff className="w-12 h-12 text-gray-400" />
            <span>Dominio no encontrado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Lo sentimos, no pudimos encontrar el dominio que estás buscando.
            Es posible que la URL proporcionada no sea válida o que el dominio haya sido eliminado.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/domains">Volver al listado de dominios</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
