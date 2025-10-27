-- Fix the rooms UPDATE policy to properly restrict updates to room participants
DROP POLICY IF EXISTS "Only room participants can update rooms" ON rooms;

CREATE POLICY "Only room participants can update rooms"
ON rooms
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM game_sessions gs
    WHERE gs.room_id = rooms.id
    AND gs.player_role IN ('creator', 'joiner')
    AND gs.expires_at > NOW()
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM game_sessions gs
    WHERE gs.room_id = rooms.id
    AND gs.player_role IN ('creator', 'joiner')
    AND gs.expires_at > NOW()
    AND gs.session_token = ((current_setting('request.headers'::text))::json ->> 'x-session-token'::text)
  )
);