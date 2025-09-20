-- Update existing decks to change 'striga' card_id to 'stryga'
UPDATE deck_cards 
SET card_id = 'stryga' 
WHERE card_id = 'striga';