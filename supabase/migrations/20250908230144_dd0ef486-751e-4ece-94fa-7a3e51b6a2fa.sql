-- Add patch column to decks table with default value 'latest'
ALTER TABLE public.decks 
ADD COLUMN patch text NOT NULL DEFAULT 'latest';