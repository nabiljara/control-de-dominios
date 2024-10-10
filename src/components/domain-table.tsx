"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus } from "lucide-react"

type Domain = {
  id: number
  cliente: string
  proveedor: string
  contacto: string
  nombre: string
  estado: string
}

const stateOptions = [
  "Transferido",
  "Vencido",
  "En reposo",
  "Activo",
  "Baja permanentemente"
]

export default function DomainTable() {
  const [domains, setDomains] = useState<Domain[]>([
    { id: 1, cliente: "Cliente A", proveedor: "Proveedor X", contacto: "contacto@clientea.com", nombre: "dominio1.com", estado: "Activo" },
    { id: 2, cliente: "Cliente B", proveedor: "Proveedor Y", contacto: "contacto@clienteb.com", nombre: "dominio2.com", estado: "Vencido" },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null)

  const handleEdit = (domain: Domain) => {
    setCurrentDomain(domain)
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setDomains(domains.filter(domain => domain.id !== id))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const newDomain = Object.fromEntries(formData.entries()) as unknown as Domain

    if (currentDomain) {
      setDomains(domains.map(domain => domain.id === currentDomain.id ? { ...newDomain, id: currentDomain.id } : domain))
    } else {
      setDomains([...domains, { ...newDomain, id: Date.now() }])
    }

    setIsOpen(false)
    setCurrentDomain(null)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Domain Table</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentDomain(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentDomain ? 'Edit Domain' : 'Add New Domain'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cliente">Client</Label>
                <Input id="cliente" name="cliente" defaultValue={currentDomain?.cliente} required />
              </div>
              <div>
                <Label htmlFor="proveedor">Provider</Label>
                <Input id="proveedor" name="proveedor" defaultValue={currentDomain?.proveedor} required />
              </div>
              <div>
                <Label htmlFor="contacto">Contact</Label>
                <Input id="contacto" name="contacto" defaultValue={currentDomain?.contacto} required />
              </div>
              <div>
                <Label htmlFor="nombre">Name</Label>
                <Input id="nombre" name="nombre" defaultValue={currentDomain?.nombre} required />
              </div>
              <div>
                <Label htmlFor="estado">State</Label>
                <Select name="estado" defaultValue={currentDomain?.estado || stateOptions[0]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.cliente}</TableCell>
              <TableCell>{domain.proveedor}</TableCell>
              <TableCell>{domain.contacto}</TableCell>
              <TableCell>{domain.nombre}</TableCell>
              <TableCell>{domain.estado}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(domain)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(domain.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}