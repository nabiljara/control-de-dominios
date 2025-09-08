import { columns } from "./_components/columns";
import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "./_components/data-table-toolbar";
import { getProviders } from "@/actions/provider-actions";
import { Box } from "lucide-react";
import HeaderPage from "@/components/header-page";

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="flex flex-col space-y-8 p-8">
      <HeaderPage
        icon={<Box className="shrink-0" />}
        title="Proveedores"
        description="Listado de todos tus proveedores"
      />
      <DataTable
        data={providers}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
        from="providers"
      />
    </div>
  );
}
