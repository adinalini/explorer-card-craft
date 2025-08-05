-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    DELETE FROM public.game_sessions 
    WHERE expires_at < NOW();
$$;

CREATE OR REPLACE FUNCTION public.validate_room_access(room_id_param TEXT, session_token_param TEXT)
RETURNS TABLE(
    can_interact BOOLEAN,
    player_role TEXT,
    player_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        (gs.player_role IN ('creator', 'joiner') AND gs.expires_at > NOW()) as can_interact,
        gs.player_role,
        gs.player_name
    FROM public.game_sessions gs
    WHERE gs.room_id = room_id_param 
    AND gs.session_token = session_token_param
    LIMIT 1;
$$;