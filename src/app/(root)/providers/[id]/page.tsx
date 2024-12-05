"use client";
import { getProvider, updateProvider } from "@/actions/provider-actions";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface Domain {
  name: string;
  status: "active" | "inactive" | "suspended";
  id: number;
  createdAt: string;
  updatedAt: string;
  clientId: number;
  providerId: number;
  contactId: number;
  providerRegistrationDate: string;
  expirationDate: string;
}
interface Provider {
  id: number;
  name: string;
  url: string;
  domains: Domain[];
}

export default function ProvidersEditPage({
  params,
}: {
  params: { id: number };
}) {
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [editedProvider, setEditedProvider] = useState<Provider | undefined>(
    undefined,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchProvider = async () => {
    try {
      const prov = await getProvider(params.id);
      setProvider(prov);
      setEditedProvider(prov);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
        toast.error("Error al obtener proveedor", { description: e.message });
      }
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProvider) {
      setEditedProvider({ ...editedProvider, [e.target.name]: e.target.value });
      setHasChanges(true);
    }
  };

  const handleApply = async () => {
    if (editedProvider) {
      try {
        const updatedProvider = await updateProvider(editedProvider);
        setProvider(updatedProvider);
        setIsEditing(false);
        setHasChanges(false);
        toast.success("Cambios guardados exitosamente");
      } catch (e) {
        if (e instanceof Error) {
          toast.error("Error al guardar cambios", { description: e.message });
        }
      }
    }
  };

  return (
    <>
      <Toaster richColors />
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Proveedor</h2>
          </div>
        </div>
        {provider && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={editedProvider?.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL
                </label>
                <Input
                  type="text"
                  id="url"
                  name="url"
                  value={editedProvider?.url || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {!isEditing && <Button onClick={handleEdit}>Editar</Button>}
              {isEditing && (
                <Button onClick={handleApply} disabled={!hasChanges}>
                  Aplicar cambios
                </Button>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Dominios asociados</h3>
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
                            "es-ES",
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
    </>
  );
}
