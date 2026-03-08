-- Drop constraints to allow reshuffling
ALTER TABLE deck_cards DROP CONSTRAINT IF EXISTS deck_cards_position_check;
ALTER TABLE deck_cards DROP CONSTRAINT IF EXISTS unique_position_per_deck;

-- Replace Axe Throw with Lightning Strike
UPDATE deck_cards 
SET card_id = 'lightning_strike', card_name = 'Lightning Strike', card_image = '/src/assets/cards/lightning_strike.png'
WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'axe_throw';

-- Shift all to +100 to avoid conflicts
UPDATE deck_cards SET position = position + 100 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646';

-- Re-sort by cost (lightning_strike cost 3 goes among cost-3 cards)
-- Cost 1: the_firebird
UPDATE deck_cards SET position = 1 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'the_firebird';
-- Cost 2: baby_bear, guy_of_gisborne
UPDATE deck_cards SET position = 2 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'baby_bear';
UPDATE deck_cards SET position = 3 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'guy_of_gisborne';
-- Cost 3: alice, black_knight, el_charro_negro, jack_in_the_box, lightning_strike
UPDATE deck_cards SET position = 4 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'alice';
UPDATE deck_cards SET position = 5 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'black_knight';
UPDATE deck_cards SET position = 6 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'el_charro_negro';
UPDATE deck_cards SET position = 7 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'jack_in_the_box';
UPDATE deck_cards SET position = 8 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'lightning_strike';
-- Cost 4: marian
UPDATE deck_cards SET position = 9 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'marian';
-- Cost 6: sandman
UPDATE deck_cards SET position = 10 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'sandman';
-- Cost 8: bandersnatch
UPDATE deck_cards SET position = 11 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'bandersnatch';
-- Cost 10: obliterate
UPDATE deck_cards SET position = 12 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'obliterate';
-- Legendary: robinhood
UPDATE deck_cards SET position = 13 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'robinhood';

-- Re-add constraints
ALTER TABLE deck_cards ADD CONSTRAINT unique_position_per_deck UNIQUE (deck_id, position);
ALTER TABLE deck_cards ADD CONSTRAINT deck_cards_position_check CHECK (position >= 1 AND position <= 13);