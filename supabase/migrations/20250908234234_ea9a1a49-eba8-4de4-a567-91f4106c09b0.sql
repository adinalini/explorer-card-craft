-- Make all current decks featured
UPDATE decks SET is_featured = true;

-- Update notes for specific decks with proper formatting (newlines instead of commas)
UPDATE decks 
SET notes = 'Casual Tournament Runner up'
WHERE name = 'Good Cards';

UPDATE decks 
SET notes = '2nd Alpha Tournament Runner up'
WHERE name = 'Face is the Place';

UPDATE decks 
SET notes = '1st Alpha Tournament Winner'
WHERE name = 'Pig Farm';

UPDATE decks 
SET notes = E'Casual Tournament Winner\n2nd Alpha Tournament Runner up'
WHERE name = 'Snow Bunnies';