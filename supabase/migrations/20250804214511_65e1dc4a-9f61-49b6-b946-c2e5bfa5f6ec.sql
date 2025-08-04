-- Drop existing tables to start fresh for draft tournament site
DROP TABLE IF EXISTS tournament_participants CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS deck_cards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

-- Create rooms table for draft sessions
CREATE TABLE public.rooms (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  draft_type TEXT NOT NULL DEFAULT 'default',
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, ready, drafting, completed
  creator_name TEXT NOT NULL,
  joiner_name TEXT,
  creator_ready BOOLEAN DEFAULT false,
  joiner_ready BOOLEAN DEFAULT false,
  current_round INTEGER DEFAULT 0
);

-- Create room_cards table to track cards presented in each round
CREATE TABLE public.room_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  side TEXT NOT NULL, -- 'creator' or 'joiner'
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_image TEXT NOT NULL,
  is_legendary BOOLEAN DEFAULT false,
  selected_by TEXT -- 'creator' or 'joiner' when selected
);

-- Create player_decks table to track selected cards
CREATE TABLE public.player_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_side TEXT NOT NULL, -- 'creator' or 'joiner'
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_image TEXT NOT NULL,
  is_legendary BOOLEAN DEFAULT false,
  selection_order INTEGER NOT NULL
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_decks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this app)
CREATE POLICY "Rooms are viewable by everyone" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON public.rooms FOR UPDATE USING (true);

CREATE POLICY "Room cards are viewable by everyone" ON public.room_cards FOR SELECT USING (true);
CREATE POLICY "Anyone can manage room cards" ON public.room_cards FOR ALL USING (true);

CREATE POLICY "Player decks are viewable by everyone" ON public.player_decks FOR SELECT USING (true);
CREATE POLICY "Anyone can manage player decks" ON public.player_decks FOR ALL USING (true);

-- Enable realtime
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_cards REPLICA IDENTITY FULL;
ALTER TABLE public.player_decks REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_decks;