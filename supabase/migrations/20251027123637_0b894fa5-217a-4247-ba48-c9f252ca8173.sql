-- Replace Animated Broomstick with Run Over in Disscard deck
UPDATE deck_cards
SET 
  card_id = 'run_over',
  card_name = 'Run Over',
  card_image = '/src/assets/cards/Run_Over.png'
WHERE deck_id = '190895bb-070a-4360-93bb-c355e9dbb2e9' 
  AND card_id = 'animated_broomstick' 
  AND position = 2;