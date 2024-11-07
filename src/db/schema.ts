// import { access } from '@/db/schema';
import { en } from '@faker-js/faker';
import { InferSelectModel, relations, sql, SQL } from "drizzle-orm"
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  type AnyPgColumn,
  uniqueIndex,
  serial,
  varchar
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"
import * as v from "valibot";


export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`
}

export const userRoleEnum = pgEnum("role", ["user", "admin"])
export const clientSizeEnum = pgEnum("segment", ["small", "medium", "large"])
export const clientStatusEnum = pgEnum("client_status", ["active", "inactive", "suspended"])
export const domainStatusEnum = pgEnum("domain_status", ["active", "inactive", "suspended"])
export const contactTypeEnum = pgEnum("contact_type", ["technical", "administrative", "financial"])
export const contactStatusEnum = pgEnum("contact_status", ["active", "inactive"])
export const notificationStatusEnum = pgEnum("notification_status", ["delivered", "bounced"])


// * * OK
export const localities = pgTable("localities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
})

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  localityId:integer("locality_id")
  .references(() => localities.id, { onDelete: "cascade" }),
  size: clientSizeEnum("size").notNull().default("small"),
  status: clientStatusEnum("status").notNull().default("active"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
})

export const clientRelations = relations(clients, ({ many, one }) => ({
  localities: one(localities, {
    fields: [clients.localityId],
    references: [localities.id],
  }),
  contacts: many(contacts),
  access: many(access),
  domains: many(domains),
}))

// * * OK


export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" }), // Should be null if the domain has its own contact.
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  type: contactTypeEnum("contact_type"),
  status: contactStatusEnum("contact_status"),
  created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow()
});

export const contactRelations = relations(contacts, ({ one, many }) => ({
  client: one(clients, {
    fields: [contacts.clientId],
    references: [clients.id],
  }),
  domains: many(domains),
})) 


//** OK */

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
})

export const providersRelations = relations(providers, ({ many }) => ({
  access: many(access),
  domains: many(domains),
}))

export const access = pgTable("access", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" }),
  providerId: integer("provider_id")
    .references(() => providers.id, { onDelete: "cascade" }),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  notes: text("notes"),
})

export const accessRelations = relations(access, ({ one, many }) => ({
  client: one(clients, {
    fields: [access.clientId],
    references: [clients.id],
  }),
  provider: one(providers, {
    fields: [access.providerId],
    references: [providers.id],
  }),
  domainAccess: many(domainAccess),
}))

//** OK */


export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }).notNull(),
  registrationDate: timestamp("registration_date", { mode: "string" }).notNull().defaultNow(),
  expirationDate: timestamp("expiration_date", { mode: "string" }).notNull().defaultNow(),
  status: domainStatusEnum("status").notNull().default("active"),
})

export const domainAccess = pgTable("domain_access", {
  domainId: integer("domain_id"),
  accessId: integer("access_id"),
},
  (table) => ({
    pk: primaryKey({ columns: [table.domainId, table.accessId] }),
  }))

export const domainAccessRelations = relations(domainAccess, ({ one, many }) => ({
    access: one(access, {
      fields: [domainAccess.accessId],
      references: [access.id],
    }),
    domain: one(domains, {
      fields: [domainAccess.domainId],
      references: [domains.id],
    }),
  }))


export const domainHistory = pgTable("domain_history", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id")
    .references(() => domains.id, { onDelete: "cascade" }),
  entityId: integer("entity_id")
    .notNull(),
  entity: varchar("name", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: timestamp("start_date", { mode: "string" }).notNull().defaultNow(),
  endDate: timestamp("end_date", { mode: "string" }),
  active: boolean("active").default(true)
})

export const domainsRelation = relations(domains, ({ one, many }) => ({

  client: one(clients, {
    fields: [domains.clientId],
    references: [clients.id],
  }),
  provider: one(providers, {
    fields: [domains.providerId],
    references: [providers.id],
  }),
  contact: one(contacts, {
    fields: [domains.contactId],
    references: [contacts.id],
  }),
  history: many(domainHistory)
}))

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").notNull(),
  created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
})

export const notificationsRelations = relations(notifications, ({ many }) => ({
  notificationToUser: many(usersNotifications),
}))


export const usersNotifications = pgTable("users_notifications", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  notificationId: integer("notification_id")
    .notNull()
    .references(() => notifications.id, { onDelete: "cascade" }),
  readed: boolean("readed").notNull().default(false),
},
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.notificationId] }),
  }))

export const usersNotificationsRelations = relations(usersNotifications, ({ one }) => ({
  user: one(users, {
    fields: [usersNotifications.userId],
    references: [users.id],
  }),
  notification: one(notifications, {
    fields: [usersNotifications.notificationId],
    references: [notifications.id],
  }),
}))


//AUTHJS

// * * OK 
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").notNull().default("user")
},

  (table) => ({
    emailUniqueIndex: uniqueIndex('enailUniqueIndex').on(lower(table.email)),
  })
)

export const audits = pgTable("audits", {
  id: serial("id")
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("name").notNull(),
  entity: text("entity").notNull(),
  entityId: integer("entity_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const auditDetails = pgTable("audits", {
  id: serial("id")
    .primaryKey(),
  auditId: integer("audit_id")
    .notNull()
    .references(() => audits.id, { onDelete: "cascade" }),
  oldValue: text("old_value"),
  newValue: text("old_value"),
  field: text("field").notNull(),
});

export const auditsRelations = relations(audits, ({ many, one }) => ({
  users: one(users),
  audit_details: many(auditDetails),
}))

export const auditsDetailsRelations = relations(auditDetails, ({ many, one }) => ({
  audits: one(audits)
}))

export const usersRelatinos = relations(users, ({ many }) => ({
  notifications: many(usersNotifications),
  audits: many(audits),
}))
// * * OK

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
)

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    compositePk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  })
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (table) => ({
    compositePK: primaryKey({
      columns: [table.userId, table.credentialID],
    }),
  })
)