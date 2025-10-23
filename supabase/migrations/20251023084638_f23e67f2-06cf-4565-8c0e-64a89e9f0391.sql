-- Update old decks with v1.0.0.40 (latest) to just v1.0.0.40
UPDATE decks 
SET patch = 'v1.0.0.40'
WHERE patch = 'v1.0.0.40 (latest)';

-- Fix typo: lv1.0.0.40 (latest) to v1.0.0.40
UPDATE decks 
SET patch = 'v1.0.0.40'
WHERE patch = 'lv1.0.0.40 (latest)';

-- Update the default value for new decks to v1.0.0.41 (latest)
ALTER TABLE decks 
ALTER COLUMN patch SET DEFAULT 'v1.0.0.41 (latest)';