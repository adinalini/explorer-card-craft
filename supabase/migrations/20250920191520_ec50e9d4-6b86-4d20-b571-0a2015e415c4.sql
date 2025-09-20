-- Update default patch value for decks
ALTER TABLE public.decks ALTER COLUMN patch SET DEFAULT 'v1.0.0.40 (latest)';

-- Add new deck types: combo and midrange
ALTER TYPE deck_type ADD VALUE 'combo';
ALTER TYPE deck_type ADD VALUE 'midrange';