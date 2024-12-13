
import { createTriggers } from './procedures/triggers';


async function main() {
  await createTriggers();
  console.log("Triggers creados correctamente.");
}

main()
  .catch((e) => {
    console.error("Error creando Triggers:", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Triggers ok.");
    process.exit(0);
  });
