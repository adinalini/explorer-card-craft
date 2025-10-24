-- Replace Ugly Duckling with Animated Broomstick in Disscard deck
UPDATE deck_cards
SET
  card_id = 'animated_broomstick',
  card_name = 'Animated Broomstick',
  card_image = '/src/assets/cards/Animated_Broomstick.png'
WHERE deck_id = '190895bb-070a-4360-93bb-c355e9dbb2e9'
AND card_id = 'ugly_duckling';