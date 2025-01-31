import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Box, Check, Link2, Loader2 } from "lucide-react"
import Link from "next/link"
export function CreateProviderConfirmationModal(
  {
    handleSubmit,
    isSubmitting,
    name,
    url
  }: {
    handleSubmit: () => void
    name: string
    url: string
    isSubmitting: boolean
  }
) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            <span className="font-medium">Nombre:</span>{" "}
            {name}
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span className="font-medium">URL:</span>{" "}
            <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            >
              {url}
            </Link>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >

              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
