-- Add new columns for triple draft functionality
ALTER TABLE public.rooms 
ADD COLUMN triple_draft_phase integer DEFAULT 1,
ADD COLUMN triple_draft_first_pick text;