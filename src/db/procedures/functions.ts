import dotenv from 'dotenv';
import * as schema from "@/db/schema";
import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL ?? "";
const sql_ = postgres(
  DATABASE_URL
);
const db = drizzle(sql_, { schema });

export async function createFunctions() {
    //PARA AUDITAR PROVEEDORES
    await db.execute(`
      CREATE OR REPLACE FUNCTION audits_providers()
      RETURNS TRIGGER AS $$
        DECLARE
            v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
            v_audit_id INT;
        BEGIN

         IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Proveedores', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                    (v_audit_id, NULL, NEW.url, 'URL');
    
                ELSEIF TG_OP = 'UPDATE' THEN
                    IF OLD.name IS DISTINCT FROM NEW.name THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                    END IF;

                    IF OLD.url IS DISTINCT FROM NEW.url THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.url, NEW.url, 'Url');
                    END IF;
                END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Proveedores', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;
              END IF;
  
              RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // PARA AUDITAR LOCALIDADES
    await db.execute(`
        CREATE OR REPLACE FUNCTION audits_localities()
        RETURNS TRIGGER AS $$
          DECLARE
              v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
              v_audit_id INT;
          BEGIN
            
              IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Localidades', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.name, 'Nombre');
    
                ELSEIF TG_OP = 'UPDATE' THEN
                    IF OLD.name IS DISTINCT FROM NEW.name THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                    END IF;
                END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Localidades', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;
              END IF;
  
              RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
      `);

    // PARA AUDITAR CLIENTES
    await db.execute(`
      CREATE OR REPLACE FUNCTION audits_clients()
      RETURNS TRIGGER AS $$
        DECLARE
            v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
            v_audit_id INT;
        BEGIN
          
            IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, 'Clientes', NOW(), NEW.id)
              RETURNING id INTO v_audit_id;
  
              IF TG_OP = 'INSERT' THEN

                  INSERT INTO audits_details (audit_id, old_value, new_value, field)
                  VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                  (v_audit_id, NULL, NEW.size, 'Tamaño'),
                  (v_audit_id, NULL, NEW.status, 'Estado'),
                  (v_audit_id, NULL, NEW.locality_id, 'Localidad'),
                  (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                  (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
  
              ELSEIF TG_OP = 'UPDATE' THEN
                  IF OLD.name IS DISTINCT FROM NEW.name THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                  END IF;

                  IF OLD.size IS DISTINCT FROM NEW.size THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.size, NEW.size, 'Tamaño');
                  END IF;

                  IF OLD.status IS DISTINCT FROM NEW.status THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.status, NEW.status, 'Estado');
                  END IF;

                  IF OLD.locality_id IS DISTINCT FROM NEW.locality_id THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.locality_id, NEW.locality_id, 'Localidad');
                  END IF;

                  IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                  END IF;

                  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                  END IF;
              END IF;
              
            ELSEIF TG_OP = 'DELETE' THEN
              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, 'Clientes', NOW(), OLD.id)
              RETURNING id INTO v_audit_id;

              INSERT INTO audits_details (audit_id, old_value, new_value, field)
              VALUES (v_audit_id, OLD.name, NULL, 'Nombre');

            END IF;

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // PARA AUDITAR ACCESOS
    // no se audita la contraseña
    await db.execute(`
      CREATE OR REPLACE FUNCTION audits_access()
      RETURNS TRIGGER AS $$
        DECLARE
            v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
            v_audit_id INT;
            v_provider_name TEXT;
            v_client_name TEXT;
        BEGIN
          
            IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, 'Accesos', NOW(), NEW.id)
              RETURNING id INTO v_audit_id;
  
              IF TG_OP = 'INSERT' THEN

                  INSERT INTO audits_details (audit_id, old_value, new_value, field)
                  VALUES (v_audit_id, NULL, NEW.username, 'Usuario'),
                  (v_audit_id, NULL, NEW.notes, 'Notas'),
                  (v_audit_id, NULL, NEW.client_id, 'Cliente'),
                  (v_audit_id, NULL, NEW.provider_id, 'Proveedor'),
                  (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                  (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
  
              ELSEIF TG_OP = 'UPDATE' THEN
                  IF OLD.username IS DISTINCT FROM NEW.username THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.username, NEW.username, 'Nombre de usuario');
                  END IF;

                  IF OLD.notes IS DISTINCT FROM NEW.notes THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.notes, NEW.notes, 'Notas');
                  END IF;

                  IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.client_id, NEW.client_id, 'Cliente');
                  END IF;

                  IF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.provider_id, NEW.provider_id, 'Localidad');
                  END IF;

                  IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                  END IF;

                  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                  END IF;
              END IF;
              
            ELSEIF TG_OP = 'DELETE' THEN
              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, 'Accesos', NOW(), OLD.id)
              RETURNING id INTO v_audit_id;

              SELECT name FROM providers WHERE id = OLD.provider_id INTO v_provider_name;
              SELECT name FROM clients WHERE id = OLD.client_id INTO v_client_name;

              INSERT INTO audits_details (audit_id, old_value, new_value, field)
              VALUES (v_audit_id, OLD.username, NULL, 'Nombre de usuario'),
                     (v_audit_id, v_client_name, NULL, 'Cliente'),
                     (v_audit_id, v_provider_name, NULL, 'Proveedor');

            END IF;

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);
    // PARA AUDITAR CONTACTOS
    await db.execute(`
        CREATE OR REPLACE FUNCTION audits_contacts()
        RETURNS TRIGGER AS $$
          DECLARE
              v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
              v_audit_id INT;
          BEGIN
            
              IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Contactos', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
  
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.client_id, 'ID Cliente'),
                    (v_audit_id, NULL, NEW.name, 'Nombre'),
                    (v_audit_id, NULL, NEW.email, 'Email'),
                    (v_audit_id, NULL, NEW.phone, 'Telefono'),
                    (v_audit_id, NULL, NEW.type, 'Tipo de contacto'),
                    (v_audit_id, NULL, NEW.status, 'Estado del contacto'),
                    (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                    (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
    
                ELSEIF TG_OP = 'UPDATE' THEN
                    IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.client_id, NEW.client_id, 'ID Cliente');
                    END IF;
  
                    IF OLD.email IS DISTINCT FROM NEW.email THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.email, NEW.email, 'Email');
                    END IF;

                    IF OLD.name IS DISTINCT FROM NEW.name THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                    END IF;
  
                    IF OLD.phone IS DISTINCT FROM NEW.phone THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.phone, NEW.phone, 'Telefono');
                    END IF;

                    IF OLD.type IS DISTINCT FROM NEW.type THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.type, NEW.type, 'Tipo de contacto');
                    END IF;
                    
                    IF OLD.status IS DISTINCT FROM NEW.status THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.status, NEW.status, 'Estado del contacto');
                    END IF;
  
                    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                    END IF;
  
                    IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                    END IF;
                END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Contactos', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.client_id, NULL, 'ID del cliente');

              END IF;
  
              RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
      `);
    // PARA AUDITAR DOMINIOS
    await db.execute(`
        CREATE OR REPLACE FUNCTION audits_domains()
        RETURNS TRIGGER AS $$
          DECLARE
              v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
              v_audit_id INT;
          BEGIN
            
              IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Dominios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
  
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.client_id, 'ID Cliente'),
                    (v_audit_id, NULL, NEW.provider_id, 'ID Proveedor'),
                    (v_audit_id, NULL, NEW.contact_id, 'ID Contacto'),
                    (v_audit_id, NULL, NEW.name, 'Nombre'),
                    (v_audit_id, NULL, NEW.expiration_date, 'Fecha de expiración'),
                    (v_audit_id, NULL, NEW.status, 'Estado del contacto'),
                    (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                    (v_audit_id, NULL, NEW.updated_at, 'Última modificación');

                    INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                    VALUES (NEW.id, NEW.provider_id, 'Proveedores', NOW(), NULL, true),
                    (NEW.id, NEW.contact_id, 'Contactos', NOW(), NULL, true),
                    (NEW.id, NEW.client_id, 'Clientes', NOW(), NULL, true);
    
                ELSEIF TG_OP = 'UPDATE' THEN
                    IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.client_id, NEW.client_id, 'ID Cliente');

                        UPDATE domain_history SET active = false, end_date = NOW()
                        WHERE (domain_id = OLD.id AND entity = 'Clientes' AND active = true); 

                        INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                        VALUES (OLD.id, NEW.client_id, 'Clientes', NOW(), NULL, true);

                    END IF;
  
                    IF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.provider_id, NEW.provider_id, 'provider_id');

                        UPDATE domain_history SET active = false, end_date = NOW()
                        WHERE (domain_id = OLD.id AND entity = 'Proveedores' AND active = true); 

                        INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                        VALUES (OLD.id, NEW.provider_id, 'Proveedores', NOW(), NULL, true);


                    END IF;
  
                    IF OLD.contact_id IS DISTINCT FROM NEW.contact_id THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.contact_id, NEW.contact_id, 'Telefono');

                        UPDATE domain_history SET active = false, end_date = NOW()
                        WHERE (domain_id = OLD.id AND entity = 'Contactos' AND active = true); 

                        INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                        VALUES (OLD.id, NEW.contact_id, 'Contactos', NOW(), NULL, true); 

                    END IF;

                    IF OLD.name IS DISTINCT FROM NEW.name THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.name, NEW.name, 'Dominio');
                    END IF;

                    IF OLD.expiration_date IS DISTINCT FROM NEW.expiration_date THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.expiration_date, NEW.expiration_date, 'Fecha de vencimiento');
                    END IF;

                    IF OLD.status IS DISTINCT FROM NEW.status THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.status, NEW.status, 'Estado');
                    END IF;
  
                    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                    END IF;
  
                    IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                    END IF;
                END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Dominios', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.name, NULL, 'Nombre');

                UPDATE domain_history SET active = false, end_date = NOW()
                WHERE (domain_id = OLD.id AND entity = 'clients' AND active = true);

                UPDATE domain_history SET active = false, end_date = NOW()
                WHERE (domain_id = OLD.id AND entity = 'providers' AND active = true);
                
                UPDATE domain_history SET active = false, end_date = NOW()
                WHERE (domain_id = OLD.id AND entity = 'contacts' AND active = true); 

              END IF;
  
              RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
      `);
    // PARA AUDITAR USUARIOS
    await db.execute(`
        CREATE OR REPLACE FUNCTION audits_users()
        RETURNS TRIGGER AS $$
          DECLARE
              v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
              v_audit_id INT;
          BEGIN
            
              IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Usuarios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
  
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                    (v_audit_id, NULL, NEW.email, 'Email'),
                    (v_audit_id, NULL, NEW.image, 'Imagen'),
                    (v_audit_id, NULL, NEW.role, 'Rol');
    
                ELSEIF TG_OP = 'UPDATE' THEN
                    IF OLD.name IS DISTINCT FROM NEW.name THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                    END IF;
  
                    IF OLD.email IS DISTINCT FROM NEW.email THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.email, NEW.email, 'Email');
                    END IF;
  
                    IF OLD.image IS DISTINCT FROM NEW.image THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.image, NEW.image, 'Imagen');
                    END IF;

                    IF OLD.role IS DISTINCT FROM NEW.role THEN
                        INSERT INTO audits_details (audit_id, old_value, new_value, field)
                        VALUES (v_audit_id, OLD.role, NEW.role, 'Rol');
                    END IF;

                END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, 'Usuarios', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.name, NULL, 'Nombre');

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.email, NULL, 'Email');

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.role, NULL, 'Rol');

              END IF;
  
              RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
      `);
    //SETEA USER_ID A USAR EN LOS TRIGGERS
    await db.execute(`
        CREATE OR REPLACE FUNCTION set_user_id(uid TEXT) RETURNS VOID AS $$
            BEGIN
                PERFORM set_config('audit.user_id', uid, false);
            END;
        $$ LANGUAGE plpgsql;`);
    console.log("Stored procedures creados correctamente.");
  }