-- Replace Defense Matrix with Baby Bear in deck 3899e2a2-69b6-40d4-818e-4d7ac6a9a8e0
UPDATE deck_cards
SET
  card_id = 'baby_bear',
  card_name = 'Baby Bear',
  card_image = '/src/assets/cards/Baby_Bear.png'
WHERE deck_id = '3899e2a2-69b6-40d4-818e-4d7ac6a9a8e0'
AND card_id = 'defense_matrix';