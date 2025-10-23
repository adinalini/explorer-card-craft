-- Use temp prefix to avoid conflicts during the swap
UPDATE deck_cards
SET card_id = 'temp_' || card_id
WHERE deck_id = '9a5a212a-1ee6-4e06-b8ab-450104167881'
AND card_id IN ('impundulu', 'tortoise', 'flying_dutchman');

-- Now do the actual swaps
UPDATE deck_cards
SET 
  card_id = CASE
    WHEN card_id = 'temp_impundulu' THEN 'flying_dutchman'
    WHEN card_id = 'temp_tortoise' THEN 'impundulu'
    WHEN card_id = 'temp_flying_dutchman' THEN 'tortoise'
  END,
  card_name = CASE
    WHEN card_id = 'temp_impundulu' THEN 'Flying Dutchman'
    WHEN card_id = 'temp_tortoise' THEN 'Impundulu'
    WHEN card_id = 'temp_flying_dutchman' THEN 'Tortoise'
  END,
  card_image = CASE
    WHEN card_id = 'temp_impundulu' THEN '/src/assets/cards/Flying_Dutchman.png'
    WHEN card_id = 'temp_tortoise' THEN '/src/assets/cards/Impundulu.png'
    WHEN card_id = 'temp_flying_dutchman' THEN '/src/assets/cards/Tortoise.png'
  END
WHERE deck_id = '9a5a212a-1ee6-4e06-b8ab-450104167881'
AND card_id IN ('temp_impundulu', 'temp_tortoise', 'temp_flying_dutchman');