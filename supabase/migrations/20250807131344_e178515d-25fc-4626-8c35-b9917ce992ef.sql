-- Add new fields to rooms table for triple and mega draft functionality
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS first_pick_player text,
ADD COLUMN IF NOT EXISTS mega_draft_turn_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_phase text DEFAULT 'selection';

-- Add turn tracking for triple/mega draft
ALTER TABLE public.room_cards 
ADD COLUMN IF NOT EXISTS turn_order integer;