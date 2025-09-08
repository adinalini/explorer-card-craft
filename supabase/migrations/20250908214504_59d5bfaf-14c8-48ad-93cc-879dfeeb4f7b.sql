-- Create deck types enum
CREATE TYPE public.deck_type AS ENUM ('aggro', 'control', 'destroy', 'discard', 'move', 'ramp');

-- Create decks table
CREATE TABLE public.decks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type public.deck_type NOT NULL,
  description TEXT,
  author_name TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deck_cards table to store the 13 cards per deck
CREATE TABLE public.deck_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id uuid NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  card_name text NOT NULL,
  card_image text NOT NULL,
  is_legendary BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 13),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to ensure no duplicate cards in same deck
ALTER TABLE public.deck_cards ADD CONSTRAINT unique_card_per_deck UNIQUE (deck_id, card_id);

-- Create unique constraint to ensure only one card per position in deck
ALTER TABLE public.deck_cards ADD CONSTRAINT unique_position_per_deck UNIQUE (deck_id, position);

-- Enable RLS
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_cards ENABLE ROW LEVEL SECURITY;

-- RLS policies for decks
CREATE POLICY "Anyone can view decks" 
ON public.decks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create decks" 
ON public.decks 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for deck_cards
CREATE POLICY "Anyone can view deck cards" 
ON public.deck_cards 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage deck cards" 
ON public.deck_cards 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE TRIGGER update_decks_updated_at
BEFORE UPDATE ON public.decks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_decks_type ON public.decks(type);
CREATE INDEX idx_decks_featured ON public.decks(is_featured);
CREATE INDEX idx_decks_created_at ON public.decks(created_at DESC);
CREATE INDEX idx_deck_cards_deck_id ON public.deck_cards(deck_id);
CREATE INDEX idx_deck_cards_position ON public.deck_cards(deck_id, position);