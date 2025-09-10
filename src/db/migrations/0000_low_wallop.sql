CREATE TYPE "public"."client_size" AS ENUM('Chico', 'Mediano', 'Grande');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('Activo', 'Inactivo', 'Suspendido');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('Activo', 'Inactivo');--> statement-breakpoint
CREATE TYPE "public"."contact_type" AS ENUM('Administrativo', 'Auditor', 'Dueño directo', 'Director financiero', 'Marketer', 'Comercial', 'Asesor', 'Asistente', 'Director', 'Socio Gerente', 'Coordinador', 'Jefe de Operaciones', 'Partner', 'Proveedor', 'Recursos Humanos', 'Soporte');--> statement-breakpoint
CREATE TYPE "public"."domain_history_entity_enum" AS ENUM('clients', 'contacts', 'providers');--> statement-breakpoint
CREATE TYPE "public"."domain_status" AS ENUM('Activo', 'Vencido', 'Dejar vencer', 'Baja permanente');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('Vence hoy', 'Vence en una semana', 'Vence en un mes', 'Vencido', 'Email no entregado', 'Simple');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "access" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer,
	"provider_id" integer,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "audits_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" integer NOT NULL,
	"old_value" text,
	"new_value" text,
	"field" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" varchar(255) NOT NULL,
	"entity" varchar(255) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"user_id" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_user_id_credentialID_pk" PRIMARY KEY("user_id","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"locality_id" integer,
	"size" "client_size" DEFAULT 'Chico' NOT NULL,
	"status" "client_status" DEFAULT 'Activo' NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(255),
	"type" "contact_type" NOT NULL,
	"status" "contact_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_email_unique" UNIQUE("email"),
	CONSTRAINT "contacts_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "domain_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain_id" integer NOT NULL,
	"access_id" integer NOT NULL,
	CONSTRAINT "domain_access_domain_id_unique" UNIQUE("domain_id")
);
--> statement-breakpoint
CREATE TABLE "domain_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain_id" integer,
	"entity_id" integer NOT NULL,
	"entity" varchar(255) NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "domains" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"contact_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"status" "domain_status" DEFAULT 'Activo' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "domains_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "localities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "localities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"domain_id" integer,
	"domain_name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	CONSTRAINT "providers_name_unique" UNIQUE("name"),
	CONSTRAINT "providers_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_notifications" (
	"user_id" text NOT NULL,
	"notification_id" integer NOT NULL,
	"readed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_notifications_user_id_notification_id_pk" PRIMARY KEY("user_id","notification_id")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "access" ADD CONSTRAINT "access_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access" ADD CONSTRAINT "access_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits_details" ADD CONSTRAINT "audits_details_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_locality_id_localities_id_fk" FOREIGN KEY ("locality_id") REFERENCES "public"."localities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_access" ADD CONSTRAINT "domain_access_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_access" ADD CONSTRAINT "domain_access_access_id_access_id_fk" FOREIGN KEY ("access_id") REFERENCES "public"."access"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_history" ADD CONSTRAINT "domain_history_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domains" ADD CONSTRAINT "domains_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domains" ADD CONSTRAINT "domains_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domains" ADD CONSTRAINT "domains_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_notifications" ADD CONSTRAINT "users_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_notifications" ADD CONSTRAINT "users_notifications_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" USING btree (lower("email"));