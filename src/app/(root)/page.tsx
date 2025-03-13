"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainsDashboard } from "@/components/dashboard/domains-dashboard";
import { ClientsDashboard } from "@/components/dashboard/clients-dashboard";
import { ProvidersDashboard } from "@/components/dashboard/providers-dashboard";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-center space-y-2">
        <h2 className="flex flex-row items-center gap-2 font-bold text-2xl tracking-tight">
          <LayoutDashboard />
          Dashboard
        </h2>
      </div>
      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Dominios</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="providers">Proveedores</TabsTrigger>
        </TabsList>
        <TabsContent value="domains" className="space-y-4">
          <DomainsDashboard />
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <ClientsDashboard />
        </TabsContent>
        <TabsContent value="providers" className="space-y-4">
          <ProvidersDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
