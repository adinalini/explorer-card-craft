-- Update existing deck patches to new naming
UPDATE public.decks SET patch = 'winter-2025' WHERE patch = 'v1.0.0.41 (latest)';
UPDATE public.decks SET patch = 'summer-2025' WHERE patch LIKE 'v1.0.0.40%';
-- Update default
ALTER TABLE public.decks ALTER COLUMN patch SET DEFAULT 'winter-2025';