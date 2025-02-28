import { Metadata } from "next";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { getProviders } from "@/actions/provider-actions";
import { Box } from "lucide-react";

export const metadata: Metadata = {
  title: "Proveedores",
};

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="flex flex-row items-center gap-2 text-2xl font-bold tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Box className="h-6 w-6 text-primary" />
              </div>
              Proveedores
            </h2>
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
    </>
  );
}
