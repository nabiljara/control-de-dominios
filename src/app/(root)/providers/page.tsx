import { Metadata } from "next";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { getProviders } from "@/actions/provider-actions";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Proveedores",
};

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proveedores</h2>
          <p className="text-muted-foreground">
            Listado de todos los proveedores
          </p>
        </div>
      </div>
      <DataTable
        data={providers}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        from="providers"
      />
    </div>
  );
}
