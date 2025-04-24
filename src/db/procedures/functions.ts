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

        IF TG_OP = 'INSERT' THEN

            INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
            VALUES (v_user_id, 'Agregar', 'Proveedores', NOW(), NEW.id)
            RETURNING id INTO v_audit_id;

            INSERT INTO audits_details (audit_id, old_value, new_value, field)
            VALUES (v_audit_id, NULL, NEW.name, 'Nombre'), (v_audit_id, NULL, NEW.url, 'URL');

        ELSEIF TG_OP = 'UPDATE' THEN
                
            INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
            VALUES (v_user_id, 'Actualizar', 'Proveedores', NOW(), NEW.id)
            RETURNING id INTO v_audit_id;
            
            IF OLD.name IS DISTINCT FROM NEW.name THEN
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
            END IF;

            IF OLD.url IS DISTINCT FROM NEW.url THEN
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.url, NEW.url, 'URL');
            END IF;
                
        ELSEIF TG_OP = 'DELETE' THEN

            INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
            VALUES (v_user_id, 'Eliminar', 'Proveedores', NOW(), OLD.id)
            RETURNING id INTO v_audit_id;

            INSERT INTO audits_details (audit_id, old_value, new_value, field)
            VALUES (v_audit_id, OLD.url, NULL, 'Url'),
            (v_audit_id, OLD.name, NULL, 'Nombre');

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
            
            IF TG_OP = 'INSERT' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Agregar', 'Localidades', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, NULL, NEW.name, 'Nombre');
    
            ELSEIF TG_OP = 'UPDATE' THEN
                
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Localidades', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;

                IF OLD.name IS DISTINCT FROM NEW.name THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                END IF;
                
            ELSEIF TG_OP = 'DELETE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Eliminar', 'Localidades', NOW(), OLD.id)
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
            old_locality_name TEXT;
            new_locality_name TEXT;
        BEGIN
          
            IF TG_OP = 'INSERT' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Agregar', 'Clientes', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;

                SELECT name FROM localities WHERE id = NEW.locality_id INTO new_locality_name;
  
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                (v_audit_id, NULL, NEW.size, 'Tamaño'),
                (v_audit_id, NULL, NEW.status, 'Estado'),
                (v_audit_id, NULL, new_locality_name, 'Localidad'),
                (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
  
            ELSEIF TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Clientes', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
                
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
                    SELECT name FROM localities WHERE id = OLD.locality_id INTO old_locality_name;
                    SELECT name FROM localities WHERE id = NEW.locality_id INTO new_locality_name;
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_locality_name, new_locality_name, 'Localidad');
                END IF;

                IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                END IF;

                IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                END IF;

            ELSEIF TG_OP = 'DELETE' THEN

              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, 'Eliminar', 'Clientes', NOW(), OLD.id)
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
            old_client_name TEXT;
            new_client_name TEXT;
            new_provider_name TEXT;
            old_provider_name TEXT;
        BEGIN
          
            IF TG_OP = 'INSERT' THEN

            INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
            VALUES (v_user_id, 'Agregar', 'Accesos', NOW(), NEW.id)
            RETURNING id INTO v_audit_id;

            SELECT name FROM providers WHERE id = NEW.provider_id INTO new_provider_name;
            SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;

            INSERT INTO audits_details (audit_id, old_value, new_value, field)
            VALUES (v_audit_id, NULL, NEW.username, 'Usuario / Email'),
            (v_audit_id, NULL, NEW.notes, 'Notas'),
            (v_audit_id, NULL, new_client_name, 'Cliente'),
            (v_audit_id, NULL, new_provider_name, 'Proveedor'),
            (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
            (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
  
            ELSEIF TG_OP = 'UPDATE' THEN
                
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Accesos', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
                
                IF OLD.username IS DISTINCT FROM NEW.username THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.username, NEW.username, 'Nombre de usuario');
                END IF;

                IF OLD.notes IS DISTINCT FROM NEW.notes THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.notes, NEW.notes, 'Notas');
                END IF;

                IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                    SELECT name FROM clients WHERE id = OLD.client_id INTO old_client_name;
                    SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_client_name, new_client_name, 'Cliente');
                END IF;

                IF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN
                    SELECT name FROM providers WHERE id = OLD.provider_id INTO old_provider_name;
                    SELECT name FROM providers WHERE id = NEW.provider_id INTO new_provider_name;
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_provider_name, new_provider_name, 'Proveedor');
                END IF;

                IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                END IF;

                IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                END IF;
              
            ELSEIF TG_OP = 'DELETE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Eliminar', 'Accesos', NOW(), OLD.id)
                RETURNING id INTO v_audit_id;

                SELECT name FROM providers WHERE id = OLD.provider_id INTO old_provider_name;
                SELECT name FROM clients WHERE id = OLD.client_id INTO old_client_name;

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, OLD.username, NULL, 'Nombre de usuario'),
                    (v_audit_id, old_client_name, NULL, 'Cliente'),
                    (v_audit_id, old_provider_name, NULL, 'Proveedor');

            END IF;

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);
    // PARA AUDITAR DOMAIN_ACCESS
    //HAY UPDATE, INSERT Y DELETE DE DOMAIN_ACCESS, SE PODRIA MOSTRAR EL NOMBRE DEL DOMINIO, ID DEL ACCESO Y EL CLIENTE
    await db.execute(`
        CREATE OR REPLACE FUNCTION audits_domain_access()
        RETURNS TRIGGER AS $$
          DECLARE
              v_user_id TEXT := NULLIF(current_setting('audit.user_id', true), '');
              v_audit_id INT;
              new_domain_name TEXT;
              old_domain_name TEXT;
              new_client_name TEXT;
              old_client_name TEXT;
              new_username TEXT;
              old_username TEXT;
              new_provider TEXT;
              old_provider TEXT;
          BEGIN
            
              IF TG_OP = 'INSERT' THEN
  
              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, 'Agregar', 'Acceso del dominio', NOW(), NEW.id)
              RETURNING id INTO v_audit_id;
  
              SELECT name FROM domains WHERE id = NEW.domain_id INTO new_domain_name;
              SELECT name FROM clients INNER JOIN access on clients.id = access.client_id WHERE access.id = NEW.access_id INTO new_client_name;
              SELECT username FROM access WHERE access.id = NEW.access_id INTO new_username;
              SELECT name FROM providers INNER JOIN access on providers.id = access.provider_id WHERE access.id = NEW.access_id INTO new_provider;

  
              INSERT INTO audits_details (audit_id, old_value, new_value, field)
              VALUES (v_audit_id, NULL, new_domain_name, 'Dominio'),
              (v_audit_id, NULL, new_username, 'Usuario / Email'),
              (v_audit_id, NULL, new_client_name, 'Cliente del acceso'),
              (v_audit_id, NULL, new_provider, 'Proveedor');
    
              ELSEIF TG_OP = 'UPDATE' THEN
                  
                  INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                  VALUES (v_user_id, 'Actualizar', 'Acceso del dominio', NOW(), NEW.id)
                  RETURNING id INTO v_audit_id;
                  
                  IF OLD.domain_id IS DISTINCT FROM NEW.domain_id THEN

                      SELECT name FROM domains WHERE id = NEW.domain_id INTO new_domain_name;
                      SELECT name FROM domains WHERE id = OLD.domain_id INTO old_domain_name;

                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, old_domain_name, new_domain_name, 'Dominio');
                  ELSE
                      SELECT name FROM domains WHERE id = OLD.domain_id INTO old_domain_name;
                      
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, '', old_domain_name, 'Dominio implicado');
                  END IF;
  
                  IF OLD.access_id IS DISTINCT FROM NEW.access_id THEN
                    
                      SELECT name FROM clients INNER JOIN access on clients.id = access.client_id WHERE access.id = NEW.access_id INTO new_client_name;
                      SELECT name FROM clients INNER JOIN access on clients.id = access.client_id WHERE access.id = OLD.access_id INTO old_client_name;
                      SELECT username FROM access WHERE access.id = OLD.access_id INTO old_username;
                      SELECT username FROM access WHERE access.id = NEW.access_id INTO new_username;
                      SELECT name FROM providers INNER JOIN access on providers.id = access.provider_id WHERE access.id = OLD.access_id INTO old_provider;
                      SELECT name FROM providers INNER JOIN access on providers.id = access.provider_id WHERE access.id = NEW.access_id INTO new_provider;


                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, old_username, new_username, 'Usuario / Email'),
                      (v_audit_id, old_client_name, new_client_name, 'Cliente del acceso');
                      
                      IF old_provider IS DISTINCT FROM new_provider THEN
                            INSERT INTO audits_details (audit_id, old_value, new_value, field)
                            VALUES (v_audit_id, old_provider, new_provider, 'Cliente del acceso');
                      ELSE
                            INSERT INTO audits_details (audit_id, old_value, new_value, field)
                            VALUES (v_audit_id, old_provider, old_provider, 'Proveedor');
                      END IF;
                  ELSE
                       SELECT username FROM access WHERE access.id = OLD.access_id INTO old_username;
                       SELECT name FROM clients INNER JOIN access on clients.id = access.client_id WHERE access.id = OLD.access_id INTO old_client_name;
                       SELECT name FROM providers INNER JOIN access on providers.id = access.provider_id WHERE access.id = OLD.access_id INTO old_provider;
                       
                       INSERT INTO audits_details (audit_id, old_value, new_value, field)
                       VALUES (v_audit_id, old_username, '', 'Usuario / Email'),
                       (v_audit_id, old_client_name, '', 'Cliente del acceso'),
                       (v_audit_id, old_client_name, '', 'Proveedor');
                  END IF;
                
              ELSEIF TG_OP = 'DELETE' THEN
  
                  INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                  VALUES (v_user_id, 'Eliminar', 'Acceso del dominio', NOW(), OLD.id)
                  RETURNING id INTO v_audit_id;
  
                  SELECT name FROM domains WHERE id = OLD.domain_id INTO old_domain_name;
                  SELECT name FROM clients INNER JOIN access on clients.id = access.client_id WHERE access.id = OLD.access_id INTO old_client_name;
                  SELECT username FROM access WHERE access.id = OLD.access_id INTO old_username;
                  SELECT name FROM providers INNER JOIN access on providers.id = access.provider_id WHERE access.id = OLD.access_id INTO old_provider;

                  INSERT INTO audits_details (audit_id, old_value, new_value, field)
                  VALUES (v_audit_id, old_domain_name, NULL, 'Dominio'),
                      (v_audit_id, old_client_name, NULL, 'Cliente del acceso'),
                      (v_audit_id, old_username, NULL, 'Usuario / Email'),
                      (v_audit_id, old_provider, NULL, 'Proveedor');
  
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
            new_client_name TEXT;
            old_client_name TEXT;
        BEGIN
            
            IF TG_OP = 'INSERT' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Agregar', 'Contactos', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
  
                SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;

                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, NULL, new_client_name, 'Cliente'),
                (v_audit_id, NULL, NEW.name, 'Nombre'),
                (v_audit_id, NULL, NEW.email, 'Email'),
                (v_audit_id, NULL, NEW.phone, 'Teléfono'),
                (v_audit_id, NULL, NEW.type, 'Tipo'),
                (v_audit_id, NULL, NEW.status, 'Estado'),
                (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
    
            ELSEIF TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Contactos', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;

                IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                    SELECT name FROM clients WHERE id = OLD.client_id INTO old_client_name;
                    SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_client_name, new_client_name, 'Cliente');
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
                    VALUES (v_audit_id, OLD.phone, NEW.phone, 'Teléfono');
                END IF;

                IF OLD.type IS DISTINCT FROM NEW.type THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.type, NEW.type, 'Tipo');
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

                
            ELSEIF TG_OP = 'DELETE' THEN
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Eliminar', 'Contactos', NOW(), OLD.id)
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
            new_client_name TEXT;
            old_client_name TEXT;
            new_provider_name TEXT;
            old_provider_name TEXT;
            new_contact_email TEXT;
            old_contact_email TEXT;
            old_notes TEXT;
            new_notes TEXT;
          
        BEGIN
            
            IF TG_OP = 'INSERT' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Agregar', 'Dominios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;

                SELECT name FROM providers WHERE id = NEW.provider_id INTO new_provider_name;
                SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;
                SELECT email FROM contacts WHERE id = NEW.contact_id INTO new_contact_email;
    
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, NULL, new_client_name, 'Cliente'),
                (v_audit_id, NULL, new_provider_name, 'Proveedor'),
                (v_audit_id, NULL, new_contact_email, 'Contacto'),
                (v_audit_id, NULL, NEW.name, 'Nombre'),
                (v_audit_id, NULL, NEW.expiration_date, 'Fecha de vencimiento'),
                (v_audit_id, NULL, NEW.status, 'Estado'),
                (v_audit_id, NULL, NEW.notes, 'Notas'),
                (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                (v_audit_id, NULL, NEW.updated_at, 'Última modificación');
                
                INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                VALUES (NEW.id, NEW.provider_id, 'Proveedores', NOW(), NULL, true),
                (NEW.id, NEW.contact_id, 'Contactos', NOW(), NULL, true),
                (NEW.id, NEW.client_id, 'Clientes', NOW(), NULL, true);
    
            ELSEIF TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Dominios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;

                IF OLD.client_id IS DISTINCT FROM NEW.client_id THEN
                                
                    SELECT name FROM clients WHERE id = OLD.client_id INTO old_client_name;
                    SELECT name FROM clients WHERE id = NEW.client_id INTO new_client_name;
                
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_client_name, new_client_name, 'Cliente');

                    UPDATE domain_history SET active = false, end_date = NOW()
                    WHERE (domain_id = OLD.id AND entity = 'Clientes' AND active = true); 

                    INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                    VALUES (OLD.id, NEW.client_id, 'Clientes', NOW(), NULL, true);

                END IF;

                IF OLD.provider_id IS DISTINCT FROM NEW.provider_id THEN
                    
                    SELECT name FROM providers WHERE id = OLD.provider_id INTO old_provider_name;
                    SELECT name FROM providers WHERE id = NEW.provider_id INTO new_provider_name;
                
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_provider_name, new_provider_name, 'Proveedor');

                    UPDATE domain_history SET active = false, end_date = NOW()
                    WHERE (domain_id = OLD.id AND entity = 'Proveedores' AND active = true); 

                    INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                    VALUES (OLD.id, NEW.provider_id, 'Proveedores', NOW(), NULL, true);

                END IF;

                IF OLD.contact_id IS DISTINCT FROM NEW.contact_id THEN
 
                    SELECT email FROM contacts WHERE id = OLD.contact_id INTO old_contact_email;
                    SELECT email FROM contacts WHERE id = NEW.contact_id INTO new_contact_email;

                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, old_contact_email, new_contact_email, 'Contacto');

                    UPDATE domain_history SET active = false, end_date = NOW()
                    WHERE (domain_id = OLD.id AND entity = 'Contactos' AND active = true); 

                    INSERT INTO domain_history (domain_id, entity_id, entity, start_date, end_date, active)
                    VALUES (OLD.id, NEW.contact_id, 'Contactos', NOW(), NULL, true); 

                END IF;

                IF OLD.name IS DISTINCT FROM NEW.name THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.name, NEW.name, 'Nombre');
                END IF;

                IF OLD.expiration_date IS DISTINCT FROM NEW.expiration_date THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.expiration_date, NEW.expiration_date, 'Fecha de vencimiento');
                END IF;

                IF OLD.status IS DISTINCT FROM NEW.status THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.status, NEW.status, 'Estado');
                END IF;

                IF OLD.notes IS DISTINCT FROM NEW.notes THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.notes, NEW.notes, 'Notas');
                END IF;

                IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.created_at, NEW.created_at, 'Fecha de creación');
                END IF;

                IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Última modificación');
                END IF;

                
            ELSEIF TG_OP = 'DELETE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Eliminar', 'Dominios', NOW(), OLD.id)
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
            
            IF TG_OP = 'INSERT' THEN
  
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Agregar', 'Usuarios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                INSERT INTO audits_details (audit_id, old_value, new_value, field)
                VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                (v_audit_id, NULL, NEW.email, 'Email'),
                (v_audit_id, NULL, NEW.image, 'Imagen'),
                (v_audit_id, NULL, NEW.role, 'Rol');
    
            ELSEIF TG_OP = 'UPDATE' THEN
                
                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Actualizar', 'Usuarios', NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
                
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
                
            ELSEIF TG_OP = 'DELETE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, 'Eliminar', 'Usuarios', NOW(), OLD.id)
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