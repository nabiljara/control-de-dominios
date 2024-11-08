import { DB } from "@/db";

export async function createFunctions(db: DB) {
    //PARA AUDITAR PROVEEDORES
    await db.execute(`
      CREATE OR REPLACE FUNCTION audits_providers()
      RETURNS TRIGGER AS $$
        DECLARE
            v_user_id TEXT := NULLIF(current_setting('my.user_id', true), '');
            v_audit_id INT;
        BEGIN

         IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), NEW.id)
                RETURNING id INTO v_audit_id;
    
                IF TG_OP = 'INSERT' THEN
                    INSERT INTO audits_details (audit_id, old_value, new_value, field)
                    VALUES (v_audit_id, NULL, NEW.name, 'Nombre');
    
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
                VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), OLD.id)
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
              v_user_id TEXT := NULLIF(current_setting('my.user_id', true), '');
              v_audit_id INT;
          BEGIN
            
              IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

                INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
                VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), NEW.id)
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
                VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), OLD.id)
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
            v_user_id TEXT := NULLIF(current_setting('my.user_id', true), '');
            v_audit_id INT;
        BEGIN
          
            IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), NEW.id)
              RETURNING id INTO v_audit_id;
  
              IF TG_OP = 'INSERT' THEN

                  INSERT INTO audits_details (audit_id, old_value, new_value, field)
                  VALUES (v_audit_id, NULL, NEW.name, 'Nombre'),
                  (v_audit_id, NULL, NEW.size, 'Tamaño'),
                  (v_audit_id, NULL, NEW.status, 'Estado'),
                  (v_audit_id, NULL, NEW.locality_id, 'Localidad'),
                  (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                  (v_audit_id, NULL, NEW.updated_at, 'Fecha de actualización');
  
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
                      VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Fecha de actualización');
                  END IF;
              END IF;
              
            ELSEIF TG_OP = 'DELETE' THEN
              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), OLD.id)
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
            v_user_id TEXT := NULLIF(current_setting('my.user_id', true), '');
            v_audit_id INT;
        BEGIN
          
            IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), NEW.id)
              RETURNING id INTO v_audit_id;
  
              IF TG_OP = 'INSERT' THEN

                  INSERT INTO audits_details (audit_id, old_value, new_value, field)
                  VALUES (v_audit_id, NULL, NEW.username, 'Usuario'),
                  (v_audit_id, NULL, NEW.notes, 'Notas'),
                  (v_audit_id, NULL, NEW.client_id, 'Cliente'),
                  (v_audit_id, NULL, NEW.provider_id, 'Proveedor'),
                  (v_audit_id, NULL, NEW.created_at, 'Fecha de creación'),
                  (v_audit_id, NULL, NEW.updated_at, 'Fecha de actualización');
  
              ELSEIF TG_OP = 'UPDATE' THEN
                  IF OLD.username IS DISTINCT FROM NEW.username THEN
                      INSERT INTO audits_details (audit_id, old_value, new_value, field)
                      VALUES (v_audit_id, OLD.username, NEW.username, 'Usuario');
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
                      VALUES (v_audit_id, OLD.updated_at, NEW.updated_at, 'Fecha de actualización');
                  END IF;
              END IF;
              
            ELSEIF TG_OP = 'DELETE' THEN
              INSERT INTO audits (user_id, action, entity, created_at, entity_id) 
              VALUES (v_user_id, TG_OP, TG_TABLE_NAME, NOW(), OLD.id)
              RETURNING id INTO v_audit_id;
            END IF;

            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    `);
  
    console.log("Stored procedures creados correctamente.");
  }