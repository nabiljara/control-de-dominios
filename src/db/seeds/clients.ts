import { DB } from "@/db";
import { clients  } from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";


type ClientInsert = InferInsertModel<typeof clients>;

const mock = () => {
	const data: ClientInsert[] = [];

	for (let i = 0; i < 20; i++) {
		data.push({
      segment: faker.helpers.arrayElement(["small", "medium", "large"]),
      name: faker.person.lastName(),
      createdAt: faker.date.past().toDateString(),
      updatedAt: faker.date.past().toDateString(),
      status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
		});
	}
	return data;
};

export async function seed(db: DB) {
	await db.insert(clients).values(mock());
}
