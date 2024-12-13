import { InferInsertModel, InferSelectModel, relations, sql, SQL } from "drizzle-orm"
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


export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`
}

export const userRoleEnum = pgEnum("user_role", ["user", "admin"])
export const clientSizeEnum = pgEnum("client_size", ["Chico", "Medio", "Grande"])
export const clientStatusEnum = pgEnum("client_status", ["Activo", "Inactivo", "Suspendido"])
export const domainStatusEnum = pgEnum("domain_status", ["Activo", "Inactivo", "Suspendido"])
export const contactTypeEnum = pgEnum("contact_type", ["Tecnico", "Administrativo", "Financiero"])
export const contactStatusEnum = pgEnum("contact_status", ["Activo", "Inactivo"])
export const notificationStatusEnum = pgEnum("notification_status", ["delivered", "bounced"])
// export const auditsActionEnum = pgEnum("audit_action_enum", ["insert", "update", "delete"])
// export const auditsEntityEnum = pgEnum("audits_entity_enum", ["localities", "clients", "contacts","providers", "access", "domains", "users"])
export const domainHistoryEntityEnum = pgEnum("domain_history_entity_enum", ["clients", "contacts","providers"])

export const localities = pgTable("localities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
})

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  localityId: integer("locality_id")
    .references(() => localities.id, { onDelete: "set null" }),
  size: clientSizeEnum("size").notNull().default("Chico"),
  status: clientStatusEnum("status").notNull().default("Activo"),
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

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "set null" }), // Should be null if the domain has its own contact.
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).unique(),
  type: contactTypeEnum("type").notNull(),
  status: contactStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const contactRelations = relations(contacts, ({ one, many }) => ({
  client: one(clients, {
    fields: [contacts.clientId],
    references: [clients.id],
  }),
  domains: many(domains),
}))

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  url: varchar("url", { length: 255 }).notNull().unique(),
})

export const providersRelations = relations(providers, ({ many }) => ({
  access: many(access),
  domains: many(domains),
}))

export const access = pgTable("access", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "set null" }),
  providerId: integer("provider_id")
    .references(() => providers.id, { onDelete: "set null" }),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
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

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "set null" }),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "set null" }),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "set null" }),

  name: varchar("name", { length: 255 }).notNull().unique(),
  providerRegistrationDate: timestamp("provider_registration_date", { mode: "string" }).notNull(),
  expirationDate: timestamp("expiration_date", { mode: "string" }).notNull().defaultNow(),
  status: domainStatusEnum("status").notNull().default("Activo"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
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
  history: many(domainHistory),
}))

export const domainAccess = pgTable("domain_access", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull()
    .references(() => domains.id, { onDelete: "cascade" }).unique(),
  accessId: integer("access_id").notNull()
    .references(() => access.id, { onDelete: "cascade" }),
},
)

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
  entityId: integer("entity_id").notNull(),
  entity: domainHistoryEntityEnum("entity").notNull(),
  startDate: timestamp("start_date", { mode: "string" }).notNull().defaultNow(),
  endDate: timestamp("end_date", { mode: "string" }),
  active: boolean("active").default(true)
})

export const domainHistoryRelations = relations(domainHistory, ({ one }) => ({
  domain: one(domains, {
    fields: [domainHistory.domainId],
    references: [domains.id],
  })
}))

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
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

export const audits = pgTable("audits", {
  id: serial("id")
    .primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  entity: varchar("entity", { length: 255 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const auditsRelations = relations(audits, ({ many, one }) => ({
  user: one(users, {
    fields: [audits.userId],
    references: [users.id],
  }),
  audit_details: many(auditDetails),
}))

export const auditDetails = pgTable("audits_details", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id")
    .notNull()
    .references(() => audits.id, { onDelete: "cascade" }),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  field:  varchar("field", { length: 255 }).notNull(),
});


export const auditsDetailsRelations = relations(auditDetails, ({ many, one }) => ({
  audits: one(audits,{
    fields: [auditDetails.auditId],
    references: [audits.id]
  })
}))

//AUTHJS


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
    emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  })
)

export const usersRelatinos = relations(users, ({ many }) => ({
  notifications: many(usersNotifications),
  audits: many(audits),
}))



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

export type Locality = InferSelectModel<typeof localities>;
export type Client = InferSelectModel<typeof clients> & {
  localities: Locality;
};
export type ClientInsert = InferInsertModel<typeof clients>
export type ClientWithRelations = Client & {
  domains: Domain[];
  localities: Locality;
  access: Access[];
  contacts: Contact[];
};
export type Contact = InferInsertModel<typeof contacts>;
export type Domain = InferInsertModel<typeof domains>;
export type Access = InferInsertModel<typeof domains>;