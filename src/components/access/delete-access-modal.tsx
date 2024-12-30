"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AccessType } from "@/validators/client-validator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"
import { AtSign, Box, Eye, File, Lock, Router, Trash } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { PasswordCell } from "@/app/(root)/clients/_components/password-cell"
import { decryptPassword } from "@/lib/utils"
import { deleteAccess } from "@/actions/accesses-actions"
import { AccessWithRelations } from "@/db/schema"
import { toast } from "sonner"

interface DeleteAccessModalProps {
  access: Omit<AccessWithRelations, "client" | "domainAccess">
}

export function DeleteAccessModal({ access }: DeleteAccessModalProps) {
  const [isPending, setIsPending] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  async function handleDelete() {
    setIsPending(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await deleteAccess(access)
          resolve()
          setIsPending(false)
          setIsModalOpen(false)
          setIsConfirmationModalOpen(false)
        } catch (error) {
          if (error instanceof Error) {
            toast.error("Hubo un error al eliminar el acceso.", {
              description: error.message
            })
          }
          reject()
          setIsPending(false)
          setIsConfirmationModalOpen(false)
          setIsModalOpen(false)
        }
      }),
      {
        loading: "Eliminando acceso",
        success: "Acceso eliminado correctamente.",
        error: "Hubo un error al eliminar el acceso."
      }
    )
  }
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Trash className="h-4 w-4 text-red-500 opacity-100 hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="w-auto max-w-3xl">
          <DialogHeader>
            <DialogTitle>Eliminar acceso</DialogTitle>
            <DialogDescription>Esta acción es irreversible</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Datos del acceso</h4>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    <span className="font-medium">Username/email:</span>{" "}
                    {access?.username}
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Contraseña:</span>{" "}
                    <div className="items-center pt-1 text-sm">
                      {access?.password && (
                        <>
                          {(() => {
                            // const password = decryptPassword(access.password)
                            return <PasswordCell password={access.password} />
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="font-medium">Notas:</span> {access?.notes}
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    <span className="font-medium">Proveedor:</span>{" "}
                    {access?.provider?.name}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="h-8 w-full"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmationModalOpen(true)}
              className="h-8 w-full"
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
      >
        <DialogContent className="w-auto max-w-3xl">
          <h2 className="m-2 text-lg font-medium">
            ¿Seguro que quieres eliminar este acceso?
          </h2>

          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="h-8 w-full"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="h-8 w-full"
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
