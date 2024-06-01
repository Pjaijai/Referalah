set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_post_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF OLD.id IS DISTINCT FROM NEW.id THEN
        RAISE EXCEPTION 'Updating id is not allowed.';
    END IF;

    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
        RAISE EXCEPTION 'Updating created_at is not allowed.';
    END IF;

    IF OLD.created_by IS DISTINCT FROM NEW.created_by THEN
        RAISE EXCEPTION 'Updating created_by is not allowed.';
    END IF;

    IF OLD.uuid IS DISTINCT FROM NEW.uuid THEN
        RAISE EXCEPTION 'Updating uuid is not allowed.';
    END IF;

    IF OLD.type IS DISTINCT FROM NEW.type THEN
        RAISE EXCEPTION 'Updating type is not allowed.';
    END IF;

    RETURN NEW;
END;$function$
;


