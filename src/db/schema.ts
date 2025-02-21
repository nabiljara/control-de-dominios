import { InferInsertModel, InferSelectModel, relations, sql, SQL } from "drizzle-orm"
import { clientSize, clientStatus, contactStatus, contactTypes, domainStatus} from "@/constants";

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
export const clientSizeEnum = pgEnum("client_size", clientSize)
export const clientStatusEnum = pgEnum("client_status", clientStatus)
export const domainStatusEnum = pgEnum("domain_status", domainStatus)
export const contactTypeEnum = pgEnum("contact_type", contactTypes)
export const contactStatusEnum = pgEnum("contact_status", contactStatus )
export const notificationStatusEnum = pgEnum("notification_status", ["delivered", "bounced"])
export const domainHistoryEntityEnum = pgEnum("domain_history_entity_enum", ["clients", "contacts", "providers"])

export const localities = pgTable("localities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
})

export const localitiesRelations = relations(localities, ({ many }) => ({
  clients: many(clients),
}))

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
  locality: one(localities, {
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
  expirationDate: timestamp("expiration_date", { mode: "string" }).notNull(),
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
  accessData: one(domainAccess)
}))

export const domainAccess = pgTable("domain_access", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull()
    .references(() => domains.id, { onDelete: "cascade" }).unique(),
  accessId: integer("access_id").notNull()
    .references(() => access.id, { onDelete: "cascade" }),
},
)

export const domainAccessRelations = relations(domainAccess, ({ one }) => ({
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
  entity: varchar("entity", { length: 255 }).notNull(),
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
  field: varchar("field", { length: 255 }).notNull(),
});


export const auditsDetailsRelations = relations(auditDetails, ({ many, one }) => ({
  audits: one(audits, {
    fields: [auditDetails.auditId],
    references: [audits.id]
  })
}))

//AUTHJS


export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
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

// LOCALIDADES
export type Locality = InferSelectModel<typeof localities>;
export type LocalityInsert = InferInsertModel<typeof localities>;
export type LocalityWithRelations = Locality & {
  clients: Client[];
};


// PROVEEDORES
export type Provider = InferSelectModel<typeof providers>;
export type ProviderInsert = InferInsertModel<typeof providers>;
export type ProviderWithRelations = Provider & {
  access: Access[],
  domains: Domain[],
};

//CLIENTES
export type Client = InferSelectModel<typeof clients>
export type ClientInsert = InferInsertModel<typeof clients>
export type ClientWithRelations = Client & {
  domains: Domain[];
  locality: Locality;
  access: Access[];
  contacts: Contact[];
};

//CONTACTOS
export type Contact = InferSelectModel<typeof contacts>;
export type ContactInsert = InferInsertModel<typeof contacts>;
export type ContactWithRelations = Contact & {
  client: Client | null
  domains: Domain[],
}

//ACCESOS
export type Access = InferSelectModel<typeof access>;
export type AccessInsert = InferInsertModel<typeof access>;
export type AccessWithRelations = Access & {
  client: Client
  provider: Provider | null
  domainAccess: DomainAccessWithRelations[],
}

//DOMAIN ACCESS
export type DomainAccess = InferSelectModel<typeof domainAccess>;
export type DomainAccessInsert = InferInsertModel<typeof domainAccess>;
export type DomainAccessWithRelations = DomainAccess & {
  access: Access,
  domain: Domain,
}

//DOMINIOS
export type Domain = InferSelectModel<typeof domains>;
export type DomainInsert = InferInsertModel<typeof domains>;
export type DomainWithRelations = Domain & {
  client: Client,
  provider: Provider,
  contact: Contact,
  history: DomainHistory[]
  accessData: Omit<DomainAccessWithRelations, 'domain'> | null
}

//HISTORIAL DE DOMINIO
export type DomainHistory = InferSelectModel<typeof domainHistory>
export type DomainHistoryInsert = InferInsertModel<typeof domainHistory>
export type DomainHistoryWithRelations = Domain & {
  domain: Domain
}
export type ProviderHistory = DomainHistory & {
  data: Provider
};
export type ClientHistory = DomainHistory & {
  data: Client
};
export type ContactHistory = DomainHistory & {
  data: Contact
};

//USERS
export type User = InferSelectModel<typeof users>

//AUDITS
export type Audit = InferSelectModel<typeof audits>
export type AuditInsert = InferInsertModel<typeof audits>
export type AuditWithRelations = Audit & {
  user: User,
  audit_details: AuditDetails[]
  entityDetails: Client | Provider | Contact | Domain | null | Access | Locality | User
}

export type AuditDetails = InferSelectModel<typeof auditDetails>

//NOTIFICATIONS
export type Notifications = InferSelectModel<typeof notifications>
export type NotificationInsert = InferInsertModel<typeof notifications>;
export type UserNotification = InferSelectModel<typeof usersNotifications>
export type UserNotificationWithRelations = UserNotification & {
  notification: Notifications
}



