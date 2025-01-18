import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, GlobeIcon as GlobeOff } from 'lucide-react'
import Link from "next/link"

interface EntityNotFoundProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  linkText: string
}

export function EntityNotFound({icon,title,description,href,linkText}: EntityNotFoundProps) {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-2 text-center">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            {description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={href}>{linkText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
