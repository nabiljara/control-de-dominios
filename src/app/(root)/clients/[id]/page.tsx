import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Mail, Phone, Shield } from 'lucide-react'

// Esta función simula la obtención de datos del cliente. En una aplicación real, 
// aquí se haría una llamada a una API o base de datos.
async function getClienteData(id: string) {
  // Simulamos una llamada a API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id,
    nombre: "Empresa Innovadora S.A.",
    estado: "Activo",
    tamano: "Mediana",
    contactos: [
      { nombre: "Juan Pérez", email: "juan@empresa.com", telefono: "+34 123 456 789" },
      { nombre: "María García", email: "maria@empresa.com", telefono: "+34 987 654 321" },
    ],
    accesos: [
      { sistema: "CRM", nivel: "Administrador" },
      { sistema: "Facturación", nivel: "Editor" },
      { sistema: "Inventario", nivel: "Lector" },
    ]
  }
}

export default async function ClientePage({ params }: { params: { id: string } }) {
  const cliente = await getClienteData(params.id)

  return (
    <div className="px-10 py-10">
      <Card className="mb-8">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-bold text-2xl">{cliente.nombre}</CardTitle>
          <Avatar className="w-20 h-20">
            <AvatarImage src={`https://avatar.vercel.sh/${cliente.id}.png`} alt={cliente.nombre} />
            <AvatarFallback>{cliente.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mt-4">
            <Badge variant={cliente.estado === "Activo" ? "default" : "destructive"}>
              {cliente.estado}
            </Badge>
            <div className="flex items-center">
              <Building2 className="opacity-70 mr-2 w-4 h-4" />
              <span className="text-muted-foreground text-sm">{cliente.tamano}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="gap-8 grid md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contactos</CardTitle>
            <CardDescription>Información de contacto de la empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cliente.contactos.map((contacto, index) => (
                  <TableRow key={index}>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="opacity-70 mr-2 w-4 h-4" />
                        {contacto.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="opacity-70 mr-2 w-4 h-4" />
                        {contacto.telefono}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos</CardTitle>
            <CardDescription>Niveles de acceso a sistemas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sistema</TableHead>
                  <TableHead>Nivel de Acceso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cliente.accesos.map((acceso, index) => (
                  <TableRow key={index}>
                    <TableCell>{acceso.sistema}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className="opacity-70 mr-2 w-4 h-4" />
                        {acceso.nivel}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button>Editar Información</Button>
      </div>
    </div>
  )
}