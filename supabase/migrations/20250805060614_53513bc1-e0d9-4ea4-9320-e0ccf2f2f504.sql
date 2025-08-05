-- Create secure session management system
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE NOT NULL,
    room_id TEXT NOT NULL,
    player_role TEXT CHECK (player_role IN ('creator', 'joiner', 'spectator')) NOT NULL,
    player_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on game_sessions
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for game_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.game_sessions 
FOR SELECT 
USING (session_token = current_setting('request.headers')::json->>'x-session-token');

CREATE POLICY "Users can create their own sessions" 
ON public.game_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own sessions" 
ON public.game_sessions 
FOR UPDATE 
USING (session_token = current_setting('request.headers')::json->>'x-session-token');

-- Update RLS policies for rooms table
DROP POLICY IF EXISTS "Anyone can create rooms" ON public.rooms;
DROP POLICY IF EXISTS "Anyone can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON public.rooms;

CREATE POLICY "Anyone can view rooms" 
ON public.rooms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create rooms" 
ON public.rooms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only room participants can update rooms" 
ON public.rooms 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.game_sessions 
        WHERE room_id = rooms.id 
        AND player_role IN ('creator', 'joiner')
        AND expires_at > NOW()
    )
);

-- Update RLS policies for room_cards table
DROP POLICY IF EXISTS "Anyone can manage room cards" ON public.room_cards;
DROP POLICY IF EXISTS "Room cards are viewable by everyone" ON public.room_cards;

CREATE POLICY "Anyone can view room cards" 
ON public.room_cards 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage room cards" 
ON public.room_cards 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.game_sessions 
        WHERE room_id = room_cards.room_id 
        AND player_role IN ('creator', 'joiner')
        AND expires_at > NOW()
    )
);

-- Update RLS policies for player_decks table
DROP POLICY IF EXISTS "Anyone can manage player decks" ON public.player_decks;
DROP POLICY IF EXISTS "Player decks are viewable by everyone" ON public.player_decks;

CREATE POLICY "Anyone can view player decks" 
ON public.player_decks 
FOR SELECT 
USING (true);

CREATE POLICY "Only room participants can manage player decks" 
ON public.player_decks 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.game_sessions 
        WHERE room_id = player_decks.room_id 
        AND player_role IN ('creator', 'joiner')
        AND expires_at > NOW()
    )
);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
    DELETE FROM public.game_sessions 
    WHERE expires_at < NOW();
$$;

-- Create function to validate room access
CREATE OR REPLACE FUNCTION public.validate_room_access(room_id_param TEXT, session_token_param TEXT)
RETURNS TABLE(
    can_interact BOOLEAN,
    player_role TEXT,
    player_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
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