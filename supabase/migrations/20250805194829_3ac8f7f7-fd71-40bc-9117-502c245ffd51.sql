-- Update session duration to 30 minutes instead of 2 minutes
ALTER TABLE public.game_sessions 
ALTER COLUMN expires_at SET DEFAULT (now() + '00:30:00'::interval);

-- Create function to extend session expiry
CREATE OR REPLACE FUNCTION public.extend_session_expiry(session_token_param text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    UPDATE public.game_sessions 
    SET expires_at = now() + '00:30:00'::interval,
        last_activity = now()
    WHERE session_token = session_token_param 
    AND expires_at > now();
$function$;