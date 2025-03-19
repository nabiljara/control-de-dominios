import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Box, Link2, Loader2 } from "lucide-react"
import Link from "next/link"
export function CreateProviderConfirmationModal(
  {
    handleSubmit,
    isSubmitting,
    name,
    url,
    setIsConfirmationModalOpen
  }: {
    handleSubmit: () => void
    name: string
    url: string
    isSubmitting: boolean
    setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
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
          <div className='flex gap-2'>
            <Button
              type="button"
              variant='destructive'
              onClick={() => {
                setIsConfirmationModalOpen(false)
              }}
              disabled={isSubmitting}
              className='w-full'
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='w-full'
            >
              {isSubmitting ? (
                <>
                  <div className='flex items-center gap-1'>
                    <Loader2 className='animate-spin' />
                    Confirmando
                  </div>
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
