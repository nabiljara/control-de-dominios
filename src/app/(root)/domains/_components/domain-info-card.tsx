
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientHistory, ContactHistory, DomainWithRelations, ProviderHistory } from "@/db/schema";
import {
  BarChart2,
  Box,
  CalendarArrowDown,
  CheckCircle,
  Contact,
  ExternalLink,
  ExternalLinkIcon,
  Eye,
  Handshake,
  History,
  KeySquare,
  Mail,
  Phone,
  StickyNote,
  Tag,
  User
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { UsernameCopy } from "@/app/(root)/clients/_components/username-copy";
import { PasswordCell } from "@/app/(root)/clients/_components/password-cell";
import { sizeConfig, statusConfig } from "@/constants";


interface DomainInfoCardProps {
  domain: DomainWithRelations
  domainHistory?: {
    clientsHistory: ClientHistory[] | null;
    providersHistory: ProviderHistory[] | null;
    contactsHistory: ContactHistory[] | null;
  }
}


interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  href?: string
  className?: string
}

function Section({ title, icon, children, href, className }: SectionProps) {
  return (
    <Card className={cn("flex-1", className)}>
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

export default function DomainInfoCard({ domain, domainHistory }: DomainInfoCardProps) {
  const historyTabs = ['Clientes', 'Contactos', 'Proveedores']
  const { clientsHistory, providersHistory, contactsHistory } = domainHistory || {}

  return (
    <Card className="w-full">
      <CardHeader className="xl:flex-row xl:justify-between xl:items-center gap-4 lg:space-y-0 pb-0">
        <CardTitle>
          <Link href={domain.name} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            <p className="flex items-center text-base md:text-2xl truncate">
              <ExternalLinkIcon className="mr-2 w-5 md:w-8 h-5 md:h-8 shrink-0" />
              {domain.name}
            </p>
          </Link>
        </CardTitle>
        <div className="flex items-center text-muted-foreground text-base md:text-xl truncate">
          <CalendarArrowDown className="mr-2 w-5 md:w-8 h-5 md:h-8 shrink-0" />
          <span>Expira: {formatDate(domain.expirationDate)}</span>
        </div>
        <Badge
          variant='outline'
          className={`${statusConfig[domain.status].color} w-min truncate`}
        >
          {domain.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <Separator className="my-6" />
        <div className={`gap-4 grid grid-cols-1 lg:${domain.accessData || domain.notes ? 'grid-cols-2' : 'grid-cols-1'} xl:${domain.accessData || domain.notes ? 'grid-cols-2' : 'grid-cols-3'} mb-6`}>
          <Section title="Cliente" icon={<Handshake />} href={`/clients/${domain.clientId}`}>
            <div className="flex flex-col space-y-2">
              <p className="font-medium truncate">{domain.client.name}</p>
              <div className="flex">
                <BarChart2 className="mr-2" />
                <Badge variant='outline' className={sizeConfig[domain.client.size].color}>
                  {domain.client.size}
                </Badge>
              </div>
              <div className="flex gap-2">
                <CheckCircle />
                <Badge variant='outline' className={statusConfig[domain.client.status].color}>
                  {domain.client.status}
                </Badge>
              </div>
            </div>
          </Section>

          <Section title="Contacto" icon={<Contact className="mr-2" />} href={`/contacts/${domain.contactId}`}>
            <div className="space-y-2">
              <p className="font-medium truncate">{domain.contact.name}</p>
              <p className="flex items-center">
                <Mail className="mr-2 shrink-0" />
                <a href={`mailto:${domain.contact.email}`} className="text-blue-500 hover:underline truncate">
                  {domain.contact.email}
                </a>
              </p>
              {
                domain.contact.phone && <p className="flex items-center">
                  <Phone className="mr-2" />
                  <Link href={`tel:${domain.contact.phone}`} className="text-blue-500 hover:underline truncate">
                    {domain.contact.phone}
                  </Link>
                </p>}
              <div className='flex items-center gap-2'>
                <Tag />
                <Badge variant='outline'>
                  {domain.contact.type}
                </Badge>
              </div>
            </div>
          </Section>

          <Section title="Proveedor" icon={<Box className="mr-2" />}>
            <div className="space-y-2">
              <p className="font-medium">{domain.provider.name}</p>
              <Link href={domain.provider.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline truncate">
                <ExternalLink className="mr-2 shrink-0" />
                {domain.provider.url}
              </Link>
            </div>
          </Section>

          {domain.accessData && (
            <Section title="Acceso" icon={<KeySquare className="mr-2" />}>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 shrink-0" />
                  <UsernameCopy username={domain.accessData.access.username} />
                </div>
                <div className="flex items-center">
                  <KeySquare className="mr-2 shrink-0" />
                  <PasswordCell password={domain.accessData.access.password} />
                </div>
                {domain.accessData.access.notes &&
                  <p className="flex items-start">
                    <StickyNote className="mr-2 shrink-0" />
                    <span className="font-medium text-muted-foreground">{domain.accessData.access.notes}</span>
                  </p>
                }
              </div>
            </Section>
          )
          }

          {domain.notes &&
            <Section title="Notas" icon={<StickyNote />} className={cn(domain.accessData ? 'col-span-2' : 'col-span-1')}>
              <p className="font-medium text-muted-foreground text-start">{domain.notes}</p>
            </Section>}
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
                {clientsHistory && clientsHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.size}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
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
                {contactsHistory && contactsHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.email}</TableCell>
                      <TableCell>{item.data?.phone ? item.data?.phone : '-'}</TableCell>
                      <TableCell>{item.data?.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
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
                {providersHistory && providersHistory
                  .filter(item => item.entity === tab)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.data?.name}</TableCell>
                      <TableCell>{item.data?.url}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
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
