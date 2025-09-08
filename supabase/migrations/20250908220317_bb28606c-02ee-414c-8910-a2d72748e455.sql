-- Add notes column to decks table for featured deck notes
ALTER TABLE public.decks 
ADD COLUMN notes TEXT;