-- Fix RLS policies to prevent data leaks and unauthorized access

-- Update rooms table RLS policies for stricter access control
DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Only room participants can update rooms" ON public.rooms;

-- Only allow viewing rooms if user has valid session for that room
CREATE POLICY "Users can only view their rooms" 
ON public.rooms 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = rooms.id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.expires_at > now()
  )
);

-- Only allow room participants to update rooms
CREATE POLICY "Only room participants can update rooms" 
ON public.rooms 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = rooms.id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.player_role IN ('creator', 'joiner') 
    AND gs.expires_at > now()
  )
);

-- Update room_cards RLS policies for stricter access
DROP POLICY IF EXISTS "Anyone can view room cards" ON public.room_cards;
DROP POLICY IF EXISTS "Only system can manage room cards" ON public.room_cards;

-- Only allow viewing room cards if user has valid session for that room
CREATE POLICY "Users can only view their room cards" 
ON public.room_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = room_cards.room_id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.expires_at > now()
  )
);

-- Only allow room participants to manage room cards
CREATE POLICY "Only room participants can manage room cards" 
ON public.room_cards 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = room_cards.room_id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.player_role IN ('creator', 'joiner') 
    AND gs.expires_at > now()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = room_cards.room_id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.player_role IN ('creator', 'joiner') 
    AND gs.expires_at > now()
  )
);

-- Update player_decks RLS policies - already secure but ensure consistency
DROP POLICY IF EXISTS "Anyone can view player decks" ON public.player_decks;

-- Only allow viewing player decks if user has valid session for that room
CREATE POLICY "Users can only view their room player decks" 
ON public.player_decks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM game_sessions gs 
    WHERE gs.room_id = player_decks.room_id 
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
    AND gs.expires_at > now()
  )
);

-- Create edge function to manage server-side timers
CREATE OR REPLACE FUNCTION public.update_round_timer(room_id_param text, session_token_param text)
RETURNS TABLE(success boolean, round_start_time timestamp with time zone, server_time timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    room_exists boolean := false;
    user_valid boolean := false;
BEGIN
    -- Validate room exists and user has access
    SELECT EXISTS(
        SELECT 1 FROM rooms r
        JOIN game_sessions gs ON r.id = gs.room_id
        WHERE r.id = room_id_param 
        AND gs.session_token = session_token_param
        AND gs.player_role IN ('creator', 'joiner')
        AND gs.expires_at > now()
    ) INTO user_valid;
    
    IF NOT user_valid THEN
        RETURN QUERY SELECT false, NULL::timestamp with time zone, now();
        RETURN;
    END IF;
    
    -- Update the round start time atomically
    UPDATE rooms 
    SET round_start_time = now()
    WHERE id = room_id_param;
    
    -- Return success and timing info
    RETURN QUERY 
    SELECT true, r.round_start_time, now() as server_time
    FROM rooms r 
    WHERE r.id = room_id_param;
END;
$$;