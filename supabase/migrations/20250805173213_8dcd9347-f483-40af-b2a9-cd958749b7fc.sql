-- Fix the RLS policy for player_decks to properly work with session-based authentication
DROP POLICY IF EXISTS "Only room participants can manage player decks" ON player_decks;

-- Create a new policy that allows inserts/updates for room participants based on session tokens
CREATE POLICY "Room participants can manage player decks" 
ON player_decks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM game_sessions gs 
    WHERE gs.room_id = player_decks.room_id 
    AND gs.player_role = ANY(ARRAY['creator'::text, 'joiner'::text])
    AND gs.expires_at > now()
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM game_sessions gs 
    WHERE gs.room_id = player_decks.room_id 
    AND gs.player_role = ANY(ARRAY['creator'::text, 'joiner'::text])
    AND gs.expires_at > now()
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
  )
);