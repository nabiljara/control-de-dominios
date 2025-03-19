import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-800 to-purple-50 dark:to-gray-900 px-4 min-h-screen">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8">
          <Link href="/" className="flex justify-center items-center gap-2 font-semibold">
              <Image
                src="/images/logo.svg"
                width={100}
                height={100}
                alt='Logo'
              />
          </Link>
          <h1 className="mt-4 font-bold text-gray-700 dark:text-blue-400 text-4xl">SICOM</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl mb-8 p-8 rounded-3xl">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-100 text-6xl">404</h2>
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
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/domains" className="flex justify-center items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar dominios
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

