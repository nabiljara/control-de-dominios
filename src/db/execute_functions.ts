import { createFunctions } from './procedures/functions';

async function main() {
  await createFunctions();
  console.log("Funciones creadas correctamente.");
}

main()
  .catch((e) => {
    console.error("Error creando funciones: ", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Funciones ok.");
    process.exit(0);
  });
