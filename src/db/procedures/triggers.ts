import { DB } from "@/db";

export async function createTriggers(db: DB) {
  //TRIGGERS PARA PROVEEDORES
  await db.execute(`
    CREATE OR REPLACE TRIGGER insert_audit_provider
    AFTER INSERT ON providers
    FOR EACH ROW
    EXECUTE FUNCTION audits_providers();
`);

await db.execute(`
    CREATE OR REPLACE TRIGGER update_audit_provider
    AFTER UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION audits_providers();
`);

await db.execute(`
    CREATE OR REPLACE TRIGGER delete_audit_provider
    AFTER DELETE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION audits_providers();
`);
//TRIGGERS PARA LOCALIDADES
await db.execute(`
  CREATE OR REPLACE TRIGGER insert_audit_locality
  AFTER INSERT ON localities
  FOR EACH ROW
  EXECUTE FUNCTION audits_localities();
`);
await db.execute(`
  CREATE OR REPLACE TRIGGER update_audit_locality
  AFTER UPDATE ON localities
  FOR EACH ROW
  EXECUTE FUNCTION audits_localities();
`);

await db.execute(`
  CREATE OR REPLACE TRIGGER delete_audit_locality
  AFTER DELETE ON localities
  FOR EACH ROW
  EXECUTE FUNCTION audits_localities();
`);
//TRIGGERS PARA CLIENTES
await db.execute(`
  CREATE OR REPLACE TRIGGER insert_audit_client
  AFTER INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION audits_clients();
`);
await db.execute(`
  CREATE OR REPLACE TRIGGER update_audit_client
  AFTER UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION audits_clients();
`);

await db.execute(`
  CREATE OR REPLACE TRIGGER delete_audit_client
  AFTER DELETE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION audits_clients();
`);
//TRIGGERS PARA ACCESOS
await db.execute(`
  CREATE OR REPLACE TRIGGER insert_audit_access
  AFTER INSERT ON access
  FOR EACH ROW
  EXECUTE FUNCTION audits_access();
`);
await db.execute(`
  CREATE OR REPLACE TRIGGER update_audit_access
  AFTER UPDATE ON access
  FOR EACH ROW
  EXECUTE FUNCTION audits_access();
`);

await db.execute(`
  CREATE OR REPLACE TRIGGER delete_audit_access
  AFTER DELETE ON access
  FOR EACH ROW
  EXECUTE FUNCTION audits_access();
`);


  console.log("Triggers creados correctamente.");
}
