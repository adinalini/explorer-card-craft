-- Revert all database changes back to original state

-- Remove realtime settings added in Change 5
ALTER publication supabase_realtime DROP TABLE public.rooms;
ALTER publication supabase_realtime DROP TABLE public.room_cards;
ALTER publication supabase_realtime DROP TABLE public.player_decks;
ALTER publication supabase_realtime DROP TABLE public.game_sessions;

ALTER TABLE public.rooms REPLICA IDENTITY DEFAULT;
ALTER TABLE public.room_cards REPLICA IDENTITY DEFAULT;
ALTER TABLE public.player_decks REPLICA IDENTITY DEFAULT;
ALTER TABLE public.game_sessions REPLICA IDENTITY DEFAULT;

-- Drop functions created in Changes 1, 2, and 4
DROP FUNCTION IF EXISTS public.update_round_timer(text, text);
DROP FUNCTION IF EXISTS public.validate_room_for_joining(text);

-- Drop all the strict RLS policies created in Changes 1-4
DROP POLICY IF EXISTS "Users can only view their rooms" ON public.rooms;
DROP POLICY IF EXISTS "Only room participants can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can only view their room cards" ON public.room_cards;
DROP POLICY IF EXISTS "Only room participants can manage room cards" ON public.room_cards;
DROP POLICY IF EXISTS "Users can only view their room player decks" ON public.player_decks;
DROP POLICY IF EXISTS "Public access for room validation" ON public.rooms;
DROP POLICY IF EXISTS "Public room validation function access" ON public.rooms;

-- Restore original permissive RLS policies

-- Original rooms policies
CREATE POLICY "Anyone can view rooms" 
ON public.rooms 
FOR SELECT 
USING (true);

CREATE POLICY "Only room participants can update rooms" 
ON public.rooms 
FOR UPDATE 
USING (true);

-- Original room_cards policies  
CREATE POLICY "Anyone can view room cards" 
ON public.room_cards 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage room cards" 
ON public.room_cards 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Original player_decks policies
CREATE POLICY "Anyone can view player decks" 
ON public.player_decks 
FOR SELECT 
USING (true);