"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Trash } from "lucide-react";
import { deleteAccess } from "@/actions/accesses-actions";
import { AccessWithRelations, domainAccess } from "@/db/schema";
import { toast } from "sonner";
import { AccessInfoCard } from "@/app/(root)/clients/_components/access-info-card";
import { ResponsiveDialog } from "../responsive-dialog";
import { Card, CardContent, CardTitle } from "../ui/card";
interface DeleteAccessModalProps {
  access: Omit<AccessWithRelations, "client">;
}

export function DeleteAccessModal({ access }: DeleteAccessModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleDelete = () => {
    setIsSubmitting(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await deleteAccess(access.id)
          resolve();
          setIsModalOpen(false);
          setIsConfirmationModalOpen(false);
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: "Eliminando acceso...",
        success: "Acceso eliminado satisfactoriamente.",
        error: "No se pudo eliminar el acceso correctamente."
      }
    )
  }
  return (
    <>
      <Button
        variant="outline"
        className="gap-3 px-2 lg:px-3 h-8"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash className="w-4 h-4 text-red-500" />
      </Button>
      <ResponsiveDialog
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false)
        }}
        title="Eliminar acceso."
        description="Confirme la eliminación del acceso."
      >
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Datos del acceso</h4>
          <AccessInfoCard access={access} provider={access.provider?.name} index={1} readOnly />
          {
            access.domainAccess.length > 0 &&
            <Card className="shadow-sm hover:shadow-md">
              <h4 className="px-4 py-2 font-medium">Dominios asociados a este acceso:</h4>
              <CardContent>
                <ul className="">
                  {access.domainAccess.map((a) => (
                    <li key={a.id}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4"/>
                        {a.domain?.name}
                        </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          }
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full h-8"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmationModalOpen(true)}
              className="w-full h-8"
              disabled={isSubmitting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
      <ResponsiveDialog
        title="¿Seguro que quieres eliminar este acceso? "
        open={isConfirmationModalOpen}
        onOpenChange={() => setIsConfirmationModalOpen(false)}
      >
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsConfirmationModalOpen(false)}
            className="w-full h-8"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full h-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Eliminando..." : "Confirmar"}
          </Button>
        </div>
      </ResponsiveDialog>
    </>
  );
}
