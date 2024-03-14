set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_message_body_and_document()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (NEW.body = '' AND NEW.document IS NULL) OR (NEW.body IS NULL AND NEW.document IS NULL) THEN
        RAISE EXCEPTION 'Both body and document cannot be empty';
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER before_insert_message BEFORE INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION check_message_body_and_document();


