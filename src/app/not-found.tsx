import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-800 to-purple-50 dark:to-gray-900 px-4 min-h-screen">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <Link href="/" className="flex justify-center items-center gap-2 font-semibold">
              <Image
                src="/images/logo.png"
                width={120}
                height={120}
                alt='Logo'
              />
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg mb-8 p-8 rounded-3xl">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-100 text-6xl">Página no encontrada</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-xl">
            Oops! Parece que te perdiste.
          </p>
          <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-8">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/" className="flex justify-center items-center gap-2">
                <Home className="w-4 h-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

