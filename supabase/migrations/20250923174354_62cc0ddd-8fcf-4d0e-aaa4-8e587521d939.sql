-- Update card_id, card_name, and card_image from "striga" to "stryga" in all tables
UPDATE room_cards 
SET 
  card_id = 'stryga',
  card_name = 'Stryga',
  card_image = 'stryga.png'
WHERE card_id = 'striga';

UPDATE player_decks 
SET 
  card_id = 'stryga',
  card_name = 'Stryga', 
  card_image = 'stryga.png'
WHERE card_id = 'striga';

-- Also update any potential entries in deck_cards for consistency
UPDATE deck_cards 
SET 
  card_id = 'stryga',
  card_name = 'Stryga',
  card_image = 'stryga.png' 
WHERE card_id = 'striga';