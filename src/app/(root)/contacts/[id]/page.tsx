"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ConfirmationModal } from "../_components/confirmation-modal";
import { DomainTable } from "../_components/domains-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import {
  getDomainsByContact,
  updateDomainContact,
} from "@/actions/domains-actions";
import { getContact, updateContact } from "@/actions/contacts-actions";
import { toast } from "sonner";
import { getClients } from "@/actions/client-actions";
import { Client, DomainWithRelations, ContactWithRelations } from "@/db/schema";
import { contactSchema } from "@/validators/contacts-validator";
import { ContactPerDomain } from "../../../../../types/contact-types";

export default function ContactDetailsPage({
  params,
}: {
  params: { id: number };
}) {
  const [contact, setContact] = useState<
    Omit<ContactWithRelations, "domains"> | undefined
  >(undefined);
  const [editedContact, setEditedContact] = useState<
    Omit<ContactWithRelations, "domains"> | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [domains, setDomains] = useState<
    Omit<
      DomainWithRelations,
      "history" | "domainAccess" | "contact" | "accessData"
    >[]
  >([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeDomains, setActiveDomains] = useState<
    Omit<
      DomainWithRelations,
      "history" | "domainAccess" | "contact" | "accessData"
    >[]
  >([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm<Omit<ContactWithRelations, "domains">>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fecthDomains = async () => {
    try {
      const data = await getDomainsByContact(params.id);
      setDomains(data);
      setActiveDomains(data.filter((domain) => domain.status === "Activo"));
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Error al obtener los dominios", {
          description: e.message,
        });
      }
    }
  };
  const fetchContact = async () => {
    try {
      const con = await getContact(params.id);
      setContact(con);
      setEditedContact(con);
      //Por el useEffect se carga primero el select que el contacto, con esto seteo los select que no se alcanzan a setear
      //TODO: Mejorar esto
      if (con) {
        setValue("type", con.type);
        setValue("status", con.status);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Error al obtener el contacto", { description: e.message });
      }
    }
  };
  const fetchClients = async () => {
    try {
      const cli = await getClients();
      setClients(cli);
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Error al obtener los clientes", {
          description: e.message,
        });
      }
    }
  };
  useEffect(() => {
    //TODO: mejorar POST's y evitar useEffect
    fetchContact();
    fecthDomains();
    fetchClients();
  }, []);

  // useEffect(() => {
  //   if (contact && !editedContact) {
  //     reset(contact)
  //     setEditedContact(contact)
  //   }
  // }, [contact, reset, editedContact])

  // const toggleEdit = () => {
  //   setIsEditing(!isEditing)
  // }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<ContactWithRelations, "domains">,
  ) => {
    if (editedContact) {
      setValue(field, e.target.value);
      setEditedContact({ ...editedContact, [e.target.name]: e.target.value });
      setHasChanges(true);
    }
  };
  const handleChangeSelect = (
    value: string,
    field: keyof Omit<ContactWithRelations, "domains">,
  ) => {
    if (editedContact) {
      if (field === "clientId") {
        const selectedClient = clients.find(
          (client) => client.id === parseInt(value, 10),
        );
        setEditedContact({
          ...editedContact,
          clientId:
            selectedClient && selectedClient.id ? selectedClient.id : null,
          client: selectedClient ?? null,
        });
        setValue(field, parseInt(value));
      } else {
        setEditedContact({ ...editedContact, [field]: value });
        setValue(field, value);
      }
      setHasChanges(true);
    }
  };
  const handleApply = async (data: Omit<ContactWithRelations, "domains">) => {
    if (Object.keys(errors).length === 0) {
      setIsModalOpen(true);
    } else {
      console.log("Errores en el formulario:", errors);
    }
  };

  const applyChanges = async (contactSelections: ContactPerDomain[]) => {
    if (editedContact) {
      const toastId = toast.loading("Guardando cambios...");
      try {
        await updateDomainContact(contactSelections);
        const response = await updateContact(editedContact);
        const updatedContact = await getContact(response.id);
        setContact(updatedContact);
        setEditedContact(updatedContact);
        setIsEditing(false);
        setHasChanges(false);
        toast.success("Cambios guardados exitosamente", { id: toastId });
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes("email")) {
            setError("email", { type: "server", message: e.message });
          }
          if (e.message.includes("teléfono")) {
            setError("phone", { type: "server", message: e.message });
          }
          toast.error("Error al guardar los datos", {
            description: e.message,
            id: toastId,
          });
        }
      }
    }
    setIsModalOpen(false);
  };
  if (!contact) {
    return <div>Cargando...</div>;
  } else {
    return (
      <>
        <form onSubmit={handleSubmit(handleApply)}>
          <Card className="mx-2 w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Información del Contacto</CardTitle>
              <div className="flex items-center space-x-2">
                <span>Habilitar edición</span>
                <Switch checked={isEditing} onCheckedChange={setIsEditing} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      {...register("name")}
                      defaultValue={contact.name}
                      onChange={(e) => handleChange(e, "name")}
                    />
                  ) : (
                    <span
                      id="clientValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.name || "\u00A0"}
                    </span>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      onChange={(e) => handleChange(e, "email")}
                      defaultValue={contact.email}
                    />
                  ) : (
                    <span
                      id="clientValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.email || "\u00A0"}
                    </span>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      {...register("phone")}
                      onChange={(e) => handleChange(e, "phone")}
                      defaultValue={contact.phone?.toString()}
                    />
                  ) : (
                    <span
                      id="clientValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.phone || "\u00A0"}
                    </span>
                  )}
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  {isEditing ? (
                    <Select
                      onValueChange={(value) =>
                        handleChangeSelect(value, "type")
                      }
                      defaultValue={contact.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tecnico">Técnico</SelectItem>
                        <SelectItem value="Administrativo">
                          Administrativo
                        </SelectItem>
                        <SelectItem value="Financiero">Financiero</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      id="clientValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.type || "\u00A0"}
                    </span>
                  )}
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  {isEditing ? (
                    <Select
                      onValueChange={(value) =>
                        handleChangeSelect(value, "status")
                      }
                      defaultValue={contact.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      id="statusValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.status || "\u00A0"}
                    </span>
                  )}
                  {errors.status && (
                    <p className="text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  {isEditing ? (
                    <Select
                      onValueChange={(value) =>
                        handleChangeSelect(value, "clientId")
                      }
                      defaultValue={contact?.client?.id.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id ? client.id.toString() : ""}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      id="clientValue"
                      className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    >
                      {contact.client?.name || "\u00A0"}
                    </span>
                  )}
                  {errors.clientId && (
                    <p className="text-sm text-red-500">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>
              </div>
              <CardContent className="flex justify-end space-x-4">
                {isEditing && (
                  <>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={!hasChanges}
                    >
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(!isEditing);
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </CardContent>
              <Card>
                <CardHeader>
                  <CardTitle>Dominios Asociados</CardTitle>
                </CardHeader>
                <CardContent>
                  <DomainTable domains={domains} />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </form>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          domains={activeDomains}
          onConfirm={applyChanges}
          updatedContact={editedContact}
        />
      </>
    );
  }
}
