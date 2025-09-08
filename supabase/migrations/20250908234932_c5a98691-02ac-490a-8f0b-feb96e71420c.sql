-- Update notes for specific decks with corrected text
UPDATE decks 
SET notes = 'Alpha Tournament #2 Runner-up'
WHERE name = 'Face is the Place';

UPDATE decks 
SET notes = 'Casual Tournament Runner-up'
WHERE name = 'Good Cards';

UPDATE decks 
SET notes = 'Alpha Tournament #1 Winner'
WHERE name = 'Pig Farm';

UPDATE decks 
SET notes = E'Casual Tournament Winner\nAlpha Tournament #2 Runner-up'
WHERE name = 'Snow Bunnies';