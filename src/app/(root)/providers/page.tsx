import { Metadata } from "next";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getProviders } from "@/actions/provider-actions";

export const metadata: Metadata = {
  title: "Provedores",
};

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Provedores</h2>
            <p className="text-muted-foreground">
              Listado de todos los provedores
            </p>
          </div>
        </div>
        <DataTable data={providers} columns={columns} />
      </div>
    </>
  );
}
