import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, User, Activity, CheckCircle } from "lucide-react";
import { ContactType } from "@/validators/contacts-validator";
import { DomainWithRelations } from "@/db/schema";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactWithRelations } from "@/db/schema";
import {
  getContact,
  getActiveContactsByClientId,
  getActiveIndividualContacts,
  getIndividualContacts,
} from "@/actions/contacts-actions";
import { toast } from "sonner";
import { ContactPerDomain } from "../../../../../types/contact-types";
// import { ContactModal } from "./create-contact-modal";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  domains: Omit<
    DomainWithRelations,
    "history" | "domainAccess" | "contact" | "accessData"
  >[];
  onConfirm: (contactSelections: ContactPerDomain[]) => void; //Pruebas con contactId en nulo, acomodar cuando definamos el contacto default(propio de kernel)
  updatedContact: Omit<ContactWithRelations, "domains"> | undefined;
};

export function ConfirmationModal({
  isOpen,
  onClose,
  domains,
  onConfirm,
  updatedContact,
}: ConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oldContacts, setOldContacts] = useState<
    Omit<ContactWithRelations, "domains"> | undefined
  >(undefined);
  const [selectedContacts, setSelectedContacts] = useState<
    Record<number, number | null>
  >({});

  const [contactsByDomain, setContactsByDomain] = useState<
    Record<number, Omit<ContactWithRelations, "domains">[]>
  >({});
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] =
    useState(false);

  const fetchContacts = async () => {
    const result = await fetchContactsByDomain(domains);
    setContactsByDomain(result);
    const old = await getContact(updatedContact?.id as number);
    setOldContacts(old);
  };

  useEffect(() => {
    fetchContacts();
  }, [updatedContact, domains]);

  const handleNewContact = () => {
    setIsCreateContactModalOpen(false);
    fetchContacts();
  };

  const fetchContactsByDomain = async (
    domains: Omit<
      DomainWithRelations,
      "history" | "domainAccess" | "contact" | "accessData"
    >[],
  ) => {
    try {
      const contactsByDomain = await Promise.all(
        domains.map(async (domain) => {
          const contacts = domain.clientId
            ? (await getActiveContactsByClientId(domain.clientId)).map(contact => ({ ...contact, client: domain.client }))
            : (await getActiveIndividualContacts()).map(contact => ({ ...contact, client: null }));
          return { domainId: domain.id, contacts };
        }),
      );
      return contactsByDomain.reduce<
        Record<number, Omit<ContactWithRelations, "domains">[]>
      >((acc, curr) => {
        acc[curr.domainId] = curr.contacts;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error al obtener contactos por dominio:", error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    if (
      updatedContact?.status === "Inactivo" &&
      oldContacts?.status !== "Inactivo"
    ) {
      const missingContacts = domains.some(
        (domain) => !selectedContacts[domain.id],
      );
      if (missingContacts) {
        toast.error("No se selecciono un nuevo contacto para cada dominio");
        return;
      }
    }
    //Error cuando no selecciona un nuevo contacto para c/u de los dominios
    //TODO: Mejorarlo para que cuando no se tenga tenga dominios asociados -- DONE
    const contactSelections: ContactPerDomain[] = Object.entries(
      selectedContacts,
    ).map(([domainId, contactId]) => ({
      domainId: Number(domainId),
      contactId: contactId as number,
    }));
    setIsSubmitting(true);
    try {
      await onConfirm(contactSelections);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Información del Contacto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Nombre</p>
                      <p className="font-medium text-sm leading-none">
                        {updatedContact?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Teléfono</p>
                      <p className="font-medium text-sm leading-none">
                        {updatedContact?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p className="font-medium text-sm leading-none">
                        {updatedContact?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Estado</p>
                      <p
                        className={`text-sm font-medium leading-none ${
                          updatedContact?.status === "Inactivo"
                            ? "text-destructive"
                            : ""
                        }`}
                      >
                        {updatedContact?.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Tipo</p>
                      <p className="font-medium text-sm leading-none">
                        {updatedContact?.type === "Técnico"
                          ? "Técnico"
                          : updatedContact?.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 rounded-lg w-8 h-8">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Cliente</p>
                      <p className="font-medium text-sm leading-none">
                        {updatedContact?.client?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {updatedContact?.status === "Inactivo" &&
            oldContacts?.status !== "Inactivo" ? (
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-2">Dominios afectados</CardTitle>
                  <CardDescription className="mb-4">
                    Los siguientes dominios se verán afectados por la baja del
                    contacto, deberá seleccionar un nuevo contacto (del cliente
                    del dominio o individual) para cada uno.
                  </CardDescription>
                  {domains.length > 0 ? (
                    <ul className="space-y-4">
                      {domains.map((domain, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center gap-4"
                        >
                          <span className="font-medium text-sm">
                            {domain.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Select
                              onValueChange={(value) =>
                                setSelectedContacts((prev) => ({
                                  ...prev,
                                  [domain.id]: parseInt(value, 10),
                                }))
                              }
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Seleccione un contacto" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <div className="px-2 font-semibold text-gray-500 text-sm">
                                    Contactos de {domain.client?.name}
                                  </div>
                                  {contactsByDomain[domain.id]
                                    ?.filter(
                                      (contact) => contact.clientId !== null,
                                    )
                                    .map((contact) => (
                                      <SelectItem
                                        key={contact.id}
                                        value={contact.id.toString()}
                                      >
                                        {contact.name}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                                <div className="my-2 border-gray-200 border-t" />
                                <SelectGroup>
                                  <div className="px-2 font-semibold text-gray-500 text-sm">
                                    Contactos individuales
                                  </div>
                                  {contactsByDomain[domain.id]
                                    ?.filter(
                                      (contact) => contact.clientId === null,
                                    )
                                    .map((contact) => (
                                      <SelectItem
                                        key={contact.id}
                                        value={contact.id.toString()}
                                      >
                                        {contact.name}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => setIsCreateContactModalOpen(true)}
                            >
                              Crear
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex justify-center items-center">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <p className="text-muted-foreground text-sm">
                          No hay dominios asociados a este contacto.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-2">Dominios afectados</CardTitle>
                  <CardDescription className="mb-4">
                    Los siguientes dominios se verán afectados por los cambios
                    realizados:
                  </CardDescription>
                  {domains.length > 0 ? (
                    <ul className="space-y-4">
                      {domains.map((domain, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center gap-4"
                        >
                          <span className="font-medium text-sm">
                            {domain.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex justify-center items-center">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <p className="text-muted-foreground text-sm">
                          No hay dominios asociados a este contacto.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? "Aplicando..." : "Aplicar Cambios"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL PARA AGREGAR NUEVO CONTACTO  */}
      {isOpen && (
        <Dialog
          open={isCreateContactModalOpen}
          onOpenChange={setIsCreateContactModalOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contacto</DialogTitle>
            </DialogHeader>

            {/* <ContactModal from="contacts" /> */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
