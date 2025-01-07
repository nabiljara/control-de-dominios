"use client"
import { getProvider, updateProvider } from "@/actions/provider-actions"
import { Toaster, toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ProviderWithRelations } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { providerSchema } from "@/validators/provider-validator"

export default function ProvidersEditPage({
  params
}: {
  params: { id: number }
}) {
  const [provider, setProvider] = useState<
    Omit<ProviderWithRelations, "access"> | undefined
  >(undefined)
  const [editedProvider, setEditedProvider] = useState<
    Omit<ProviderWithRelations, "access"> | undefined
  >(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm({
    resolver: zodResolver(providerSchema),
    defaultValues: provider
  })
  const fetchProvider = async () => {
    try {
      const prov = await getProvider(params.id)
      setProvider(prov)
      setEditedProvider(prov)
      if (prov) {
        setValue("name", prov.name)
        setValue("url", prov.url)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener proveedor", { description: e.message })
      }
    }
  }

  useEffect(() => {
    fetchProvider()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProvider) {
      setEditedProvider({ ...editedProvider, [e.target.name]: e.target.value })
      setHasChanges(true)
    }
  }

  const handleApply = async () => {
    if (editedProvider) {
      try {
        if (
          editedProvider.name !== provider?.name ||
          editedProvider.url !== provider?.url
        ) {
          const updatedProvider = await updateProvider(editedProvider)
          setProvider(updatedProvider)
          setIsEditing(false)
          setHasChanges(false)
          toast.success("Cambios guardados exitosamente")
        } else {
          toast.info("No se han modificado los datos")
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes("nombre")) {
            setError("name", { type: "server", message: e.message })
          }
          if (e.message.includes("url")) {
            setError("url", { type: "server", message: e.message })
          }
          toast.error("Error al guardar los cambios", {
            description: e.message
          })
        }
      }
    }
  }

  return (
      <form onSubmit={handleSubmit(handleApply)}>
        <div className="md:flex flex-col flex-1 space-y-8 p-8 h-full">
          <div className="flex justify-between items-center space-y-2">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">Proveedor</h2>
            </div>
          </div>
          {provider && (
            <div className="space-y-4">
              <div className="gap-4 grid grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-medium text-gray-700 text-sm"
                  >
                    Nombre
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editedProvider?.name || ""}
                    // value={editedProvider?.name || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="url"
                    className="block font-medium text-gray-700 text-sm"
                  >
                    URL
                  </label>
                  <Input
                    type="text"
                    id="url"
                    name="url"
                    defaultValue={editedProvider?.url || ""}
                    // value={editedProvider?.url || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm">{errors.url.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                {!isEditing && <Button onClick={handleEdit}>Editar</Button>}
                {isEditing && (
                  <Button type="submit" disabled={!hasChanges}>
                    Aplicar cambios
                  </Button>
                )}
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-lg">
                  Dominios asociados
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dominio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Vencimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.domains.length === 0 ? (
                      <TableRow>
                        <TableCell>No hay dominios asociados</TableCell>
                      </TableRow>
                    ) : (
                      provider.domains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell>{domain.name}</TableCell>
                          <TableCell>{domain.status}</TableCell>
                          <TableCell>
                            {new Date(domain.expirationDate).toLocaleDateString(
                              "es-ES"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </form>
  )
}
