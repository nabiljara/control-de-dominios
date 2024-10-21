import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { segments, statuses } from "./data"

const clients = Array.from({ length: 100 }, () => ({
  id: faker.number.int({ min: 1000, max: 9999 }),
  name: faker.person.fullName(),
  status: faker.helpers.arrayElement(statuses).value,
  segment: faker.helpers.arrayElement(segments).value,
}))

fs.writeFileSync(
  path.join(__dirname, "clients.json"),
  JSON.stringify(clients, null, 2)
)

console.log("✅ Clients data generated.")