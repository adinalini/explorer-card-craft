-- Update patch for Face is the Place and Pig Farm decks to 'old'
UPDATE decks 
SET patch = 'old', updated_at = now() 
WHERE id IN ('898f189a-dfdf-468c-99a5-2609b6e7965b', '153658cd-a19c-4d05-979a-4ac221ac029a');