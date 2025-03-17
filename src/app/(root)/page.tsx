"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainsDashboard } from "@/components/dashboard/domains/domains-dashboard";
import { ClientsDashboard } from "@/components/dashboard/clients/clients-dashboard";
import { ProvidersDashboard } from "@/components/dashboard/providers/providers-dashboard";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="flex flex-row items-center gap-2 text-2xl font-bold tracking-tight">
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
