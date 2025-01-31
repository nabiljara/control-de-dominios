
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientHistory, ContactHistory, DomainWithRelations, ProviderHistory } from "@/db/schema";
import { Box, CalendarDays, Clock, Contact, ExternalLink, ExternalLinkIcon, Eye, Globe, Handshake, History, Mail, Phone, Tag, User } from "lucide-react";
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Key, FileText } from 'lucide-react'
import Link from "next/link";
import { UsernameCopy } from "@/app/(root)/clients/_components/username-copy";
import { PasswordCell } from "@/app/(root)/clients/_components/password-cell";
import { getHistory } from "@/actions/domains-actions";
import { useEffect, useState } from "react";
import { sizeConfig, statusConfig } from "@/constants";


interface DomainInfoCardProps {
  domain: DomainWithRelations
}


interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  href?: string
}

function Section({ title, icon, children, href }: SectionProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
          {href &&
            <Link
              href={href}
              className="ml-auto"
            >
              <Eye />
            </Link>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function DomainInfoCard({ domain }: DomainInfoCardProps) {
  const historyTabs = ['Clientes', 'Contactos', 'Proveedores']
  const [historyWithDetails, setHistoryWithDetails] = useState<{
    clientsHistory: ClientHistory[] | null;
    providersHistory: ProviderHistory[] | null;
    contactsHistory: ContactHistory[] | null;
  }>({
    clientsHistory: null,
    providersHistory: null,
    contactsHistory: null
  });

  useEffect(() => {
    const fetchHistoryWithDetails = async () => {
      try {
        const { clientsHistory, providersHistory, contactsHistory } = await getHistory(domain.history)
        setHistoryWithDetails({ clientsHistory, providersHistory, contactsHistory })
      } catch (error) {
        console.error("Error al cargar el historial del dominio:", error)
      }
    }
    fetchHistoryWithDetails()
  }, [domain.history])

  return (
    <Card className="w-full">
      <CardHeader className="xl:flex-row xl:justify-between xl:items-center gap-4 space-y-6 lg:space-y-0 pb-0">
        <CardTitle>
          <Link href={domain.name} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            <span className="flex items-center text-2xl">
              <ExternalLinkIcon className="mr-2" />
              {domain.name}
            </span>
          </Link>
        </CardTitle>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="mr-2" />
          <span>Expira: {formatDate(domain.expirationDate)}</span>
        </div>
        {/* <div className="flex items-center text-muted-foreground">
          <Clock className="mr-2" />
          <span>Actualizado: {formatDate(domain.updatedAt)}</span>
        </div> */}
        <Badge
          className={statusConfig[domain.status].color}
        >
          {domain.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <Separator className="my-6" />

        <div className={`gap-4 grid grid-cols-1 md:${domain.accessData ? 'grid-cols-2' : ''} lg:${domain.accessData ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
          <Section title="Cliente" icon={<Handshake />} href={`/clients/${domain.clientId}`}>
            <div className="space-y-2">
              <p className="font-medium">{domain.client.name}</p>
              <p>Tamaño: {' '}
                <Badge className={sizeConfig[domain.client.size].color}>
                  {domain.client.size}
                </Badge>
              </p>
              <p>Estado: {' '}
                <Badge className={statusConfig[domain.client.status].color}>
                  {domain.client.status}
                </Badge>
              </p>
            </div>
          </Section>

          <Section title="Contacto" icon={<Contact className="mr-2" />} href={`/contacts/${domain.contactId}`}>
            <div className="space-y-2">
              <p className="font-medium">{domain.contact.name}</p>
              <p className="flex items-center">
                <Mail className="mr-2" />
                <a href={`mailto:${domain.contact.email}`} className="text-blue-500 hover:underline">
                  {domain.contact.email}
                </a>
              </p>
              <p className="flex items-center">
                <Phone className="mr-2" />
                <Link href={`tel:${domain.contact.phone}`} className="text-blue-500 hover:underline">
                  {domain.contact.phone}
                </Link>
              </p>
              <div className='flex items-center gap-2'>
                <Tag />
                <Badge className="bg-gray-100 hover:bg-gray-300 text-black">
                  {domain.contact.type}
                </Badge>
              </div>
            </div>
          </Section>

          <Section title="Proveedor" icon={<Box className="mr-2" />}>
            <div className="space-y-2">
              <p className="font-medium">{domain.provider.name}</p>
              <Link href={domain.provider.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                <ExternalLink className="mr-2" />
                {domain.provider.url}
              </Link>
            </div>
          </Section>

          {domain.accessData && (
            <Section title="Acceso" icon={<Key className="mr-2" />}>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2" />
                  {/* <span>Usuario: {domain.accessData.access.username}</span> */}
                  <UsernameCopy username={domain.accessData.access.username} />
                </div>
                <div className="flex items-center">
                  <PasswordCell password={domain.accessData.access.password} />
                </div>
                {domain.accessData.access.notes &&
                  <p className="flex items-center">
                    <FileText className="mr-2" />
                    <span>Notas: {domain.accessData.access.notes}</span>
                  </p>
                }
              </div>
            </Section>
          )
          }
        </div>

        <Separator className="my-6" />

        <div className="mt-6">
          <h3 className="flex items-center mb-4 font-semibold text-xl">
            <History className="mr-2" />Historial
          </h3>
          <Tabs defaultValue="Clientes">
            <TabsList>
              {historyTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
              ))}
            </TabsList>
            {historyTabs.map((tab) => (
              <TabContent key={tab} tab={tab} />
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )

  function TabContent({ tab }: { tab: string }) {
    switch (tab) {
      case 'Clientes':
        return (
          <TabsContent value={tab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de inicio</TableHead>
                  <TableHead>Fecha de finalización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyWithDetails.clientsHistory && historyWithDetails.clientsHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.size}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[item.active ? 'Activo' : 'Inactivo'].color}
                        >
                          {item.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.startDate)}</TableCell>
                      <TableCell>{item.endDate ? formatDate(item.endDate) : '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        )
      case 'Contactos':
        return (
          <TabsContent value={tab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de alta</TableHead>
                  <TableHead>Fecha de finalización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyWithDetails.contactsHistory && historyWithDetails.contactsHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.email}</TableCell>
                      <TableCell>{item.data?.phone ? item.data?.phone : 'Sin información'}</TableCell>
                      <TableCell>{item.data?.type}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[item.active ? 'Activo' : 'Inactivo'].color}
                        >
                          {item.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.startDate)}</TableCell>
                      <TableCell>{item.endDate ? formatDate(item.endDate) : '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        )
      case 'Proveedores':
        return (
          <TabsContent value={tab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Url</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de alta</TableHead>
                  <TableHead>Fecha de finalización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyWithDetails.providersHistory && historyWithDetails.providersHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.url}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[item.active ? 'Activo' : 'Inactivo'].color}
                        >
                          {item.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.startDate)}</TableCell>
                      <TableCell>{item.endDate ? formatDate(item.endDate) : '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>

        )
    }

  }
}
