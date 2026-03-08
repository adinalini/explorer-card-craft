ALTER TABLE deck_cards DROP CONSTRAINT IF EXISTS deck_cards_position_check;
ALTER TABLE deck_cards DROP CONSTRAINT IF EXISTS unique_position_per_deck;

UPDATE deck_cards SET position = position + 100 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646';

-- Cost 1
UPDATE deck_cards SET position = 1 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'the_firebird';
-- Cost 2: baby_bear, jack_in_the_box
UPDATE deck_cards SET position = 2 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'baby_bear';
UPDATE deck_cards SET position = 3 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'jack_in_the_box';
-- Cost 3: alice, black_knight, el_charro_negro, lightning_strike
UPDATE deck_cards SET position = 4 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'alice';
UPDATE deck_cards SET position = 5 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'black_knight';
UPDATE deck_cards SET position = 6 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'el_charro_negro';
UPDATE deck_cards SET position = 7 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'lightning_strike';
-- Cost 4: marian
UPDATE deck_cards SET position = 8 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'marian';
-- Cost 6: guy_of_gisborne, sandman
UPDATE deck_cards SET position = 9 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'guy_of_gisborne';
UPDATE deck_cards SET position = 10 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'sandman';
-- Cost 8: bandersnatch
UPDATE deck_cards SET position = 11 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'bandersnatch';
-- Cost 10: obliterate
UPDATE deck_cards SET position = 12 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'obliterate';
-- Legendary
UPDATE deck_cards SET position = 13 WHERE deck_id = 'c45b9dee-88aa-4d1b-a118-7a4b8ebed646' AND card_id = 'robinhood';

ALTER TABLE deck_cards ADD CONSTRAINT unique_position_per_deck UNIQUE (deck_id, position);
ALTER TABLE deck_cards ADD CONSTRAINT deck_cards_position_check CHECK (position >= 1 AND position <= 13);