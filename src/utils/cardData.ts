// Card data with imports for all available cards
const cardImports = {
  'ali_baba': () => import('@/assets/cards/ali_baba.png'),
  'alice': () => import('@/assets/cards/alice.png'),
  'axe_throw': () => import('@/assets/cards/axe_throw.png'),
  'baloo': () => import('@/assets/cards/baloo.png'),
  'bandersnatch': () => import('@/assets/cards/bandersnatch.png'),
  'banshee': () => import('@/assets/cards/banshee.png'),
  'beast': () => import('@/assets/cards/beast.png'),
  'beautiful_swan': () => import('@/assets/cards/beautiful_swan.png'),
  'big_bad_wolf': () => import('@/assets/cards/big_bad_wolf.png'),
  'billy': () => import('@/assets/cards/billy.png'),
  'black_knight': () => import('@/assets/cards/black_knight.png'),
  'blow_the_house_down': () => import('@/assets/cards/blow_the_house_down.png'),
  'bridge_troll': () => import('@/assets/cards/bridge_troll.png'),
  'bullseye': () => import('@/assets/cards/bullseye.png'),
  'card_soldier': () => import('@/assets/cards/card_soldier.png'),
  'cheshire': () => import('@/assets/cards/cheshire.png'),
  'concentrate': () => import('@/assets/cards/concentrate.png'),
  'cowardly_lion': () => import('@/assets/cards/cowardly_lion.png'),
  'dark_omen': () => import('@/assets/cards/dark_omen.png'),
  'death': () => import('@/assets/cards/death.png'),
  'defense_matrix': () => import('@/assets/cards/defense_matrix.png'),
  'don_quixote': () => import('@/assets/cards/don_quixote.png'),
  'dorothy': () => import('@/assets/cards/dorothy.png'),
  'dr_frank': () => import('@/assets/cards/dr_frank.png'),
  'dracula': () => import('@/assets/cards/dracula.png'),
  'en_passant': () => import('@/assets/cards/en_passant.png'),
  'fairy_godmother': () => import('@/assets/cards/fairy_godmother.png'),
  'flying_monkey': () => import('@/assets/cards/flying_monkey.png'),
  'franks_monster': () => import('@/assets/cards/franks_monster.png'),
  'freeze': () => import('@/assets/cards/freeze.png'),
  'friar_tuck': () => import('@/assets/cards/friar_tuck.png'),
  'galahad': () => import('@/assets/cards/galahad.png'),
  'giant': () => import('@/assets/cards/giant.png'),
  'glinda': () => import('@/assets/cards/glinda.png'),
  'golden_egg': () => import('@/assets/cards/golden_egg.png'),
  'golden_goose': () => import('@/assets/cards/golden_goose.png'),
  'goldilocks': () => import('@/assets/cards/goldilocks.png'),
  'grendel': () => import('@/assets/cards/grendel.png'),
  'guy_of_gisborne': () => import('@/assets/cards/guy_of_gisborne.png'),
  'headless_horseman': () => import('@/assets/cards/headless_horseman.png'),
  'heroic_charge': () => import('@/assets/cards/heroic_charge.png'),
  'huntsman': () => import('@/assets/cards/huntsman.png'),
  'hyde': () => import('@/assets/cards/hyde.png'),
  'imhotep': () => import('@/assets/cards/imhotep.png'),
  'its_alive': () => import('@/assets/cards/its_alive.png'),
  'jack': () => import('@/assets/cards/jack.png'),
  'jack_in_the_box': () => import('@/assets/cards/jack_in_the_box.png'),
  'jekyll': () => import('@/assets/cards/jekyll.png'),
  'kanga': () => import('@/assets/cards/kanga.png'),
  'king_arthur': () => import('@/assets/cards/king_arthur.png'),
  'king_shahryar': () => import('@/assets/cards/king_shahryar.png'),
  'lady_of_the_lake': () => import('@/assets/cards/lady_of_the_lake.png'),
  'lancelot': () => import('@/assets/cards/lancelot.png'),
  'legion_of_the_dead': () => import('@/assets/cards/legion_of_the_dead.png'),
  'lightning_strike': () => import('@/assets/cards/lightning_strike.png'),
  'little_john': () => import('@/assets/cards/little_john.png'),
  'mad_hatter': () => import('@/assets/cards/mad_hatter.png'),
  'marian': () => import('@/assets/cards/marian.png'),
  'merlin': () => import('@/assets/cards/merlin.png'),
  'moby': () => import('@/assets/cards/moby.png'),
  'morgiana': () => import('@/assets/cards/morgiana.png'),
  'moriarty': () => import('@/assets/cards/moriarty.png'),
  'mouse': () => import('@/assets/cards/mouse.png'),
  'mowgli': () => import('@/assets/cards/mowgli.png'),
  'mummy': () => import('@/assets/cards/mummy.png'),
  'musketeer': () => import('@/assets/cards/musketeer.png'),
  'not_so_little_pig': () => import('@/assets/cards/not_so_little_pig.png'),
  'ogre': () => import('@/assets/cards/ogre.png'),
  'pegasus': () => import('@/assets/cards/pegasus.png'),
  'phantom_coachman': () => import('@/assets/cards/phantom_coachman.png'),
  'piggy_bank': () => import('@/assets/cards/piggy_bank.png'),
  'prince_charming': () => import('@/assets/cards/prince_charming.png'),
  'princess_aurora': () => import('@/assets/cards/princess_aurora.png'),
  'quasimodo': () => import('@/assets/cards/quasimodo.png'),
  'queen_guinevere': () => import('@/assets/cards/queen_guinevere.png'),
  'rain_of_arrows': () => import('@/assets/cards/rain_of_arrows.png'),
  'red': () => import('@/assets/cards/red.png'),
  'redcap': () => import('@/assets/cards/redcap.png'),
  'reinforcements': () => import('@/assets/cards/reinforcements.png'),
  'robin_hood': () => import('@/assets/cards/robin_hood.png'),
  'roo': () => import('@/assets/cards/roo.png'),
  'rumple': () => import('@/assets/cards/rumple.png'),
  'scarecrow': () => import('@/assets/cards/scarecrow.png'),
  'scorpion': () => import('@/assets/cards/scorpion.png'),
  'sea_witch': () => import('@/assets/cards/sea_witch.png'),
  'searing_light': () => import('@/assets/cards/searing_light.png'),
  'sheriff_of_nottingham': () => import('@/assets/cards/sheriff_of_nottingham.png'),
  'sherlock': () => import('@/assets/cards/sherlock.png'),
  'shield_maiden': () => import('@/assets/cards/shield_maiden.png'),
  'siren': () => import('@/assets/cards/siren.png'),
  'snow_white': () => import('@/assets/cards/snow_white.png'),
  'soldier': () => import('@/assets/cards/soldier.png'),
  'soul_surge': () => import('@/assets/cards/soul_surge.png'),
  'striga': () => import('@/assets/cards/striga.png'),
  'the_green_knight': () => import('@/assets/cards/the_green_knight.png'),
  'the_kraken': () => import('@/assets/cards/the_kraken.png'),
  'the_white_queen': () => import('@/assets/cards/the_white_queen.png'),
  'three_blind_mice': () => import('@/assets/cards/three_blind_mice.png'),
  'three_musketeers': () => import('@/assets/cards/three_musketeers.png'),
  'three_not_so_little_pigs': () => import('@/assets/cards/three_not_so_little_pigs.png'),
  'tin_woodman': () => import('@/assets/cards/tin_woodman.png'),
  'trash_for_treasure': () => import('@/assets/cards/trash_for_treasure.png'),
  'trojan_horse': () => import('@/assets/cards/trojan_horse.png'),
  'twister_toss': () => import('@/assets/cards/twister_toss.png'),
  'ugly_duckling': () => import('@/assets/cards/ugly_duckling.png'),
  'underworld_flare': () => import('@/assets/cards/underworld_flare.png'),
  'watson': () => import('@/assets/cards/watson.png'),
  'white_rabbit': () => import('@/assets/cards/white_rabbit.png'),
  'wicked_witch_of_the_west': () => import('@/assets/cards/wicked_witch_of_the_west.png'),
  'zorro': () => import('@/assets/cards/zorro.png'),
}

export interface Card {
  id: string
  name: string
  image: string
  isLegendary: boolean
  cost?: number
  isSpell?: boolean
}

// Card database with cost, spell status, and legendary information
export const cardDatabase: Card[] = [
  { id: 'baloo', name: 'Baloo', image: '/src/assets/cards/baloo.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'bandersnatch', name: 'Bandersnatch', image: '/src/assets/cards/bandersnatch.png', isLegendary: false, cost: 8, isSpell: false },
  { id: 'beautiful_swan', name: 'Beautiful Swan', image: '/src/assets/cards/beautiful_swan.png', isLegendary: false, cost: 1, isSpell: false },
  { id: 'blow_the_house_down', name: 'Blow the House Down', image: '/src/assets/cards/blow_the_house_down.png', isLegendary: false, cost: 7, isSpell: true },
  { id: 'death', name: 'Death', image: '/src/assets/cards/death.png', isLegendary: true, cost: 5, isSpell: false },
  { id: 'fairy_godmother', name: 'Fairy Godmother', image: '/src/assets/cards/fairy_godmother.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'grendel', name: 'Grendel', image: '/src/assets/cards/grendel.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'heroic_charge', name: 'Heroic Charge', image: '/src/assets/cards/heroic_charge.png', isLegendary: false, cost: 6, isSpell: true },
  { id: 'king_arthur', name: 'King Arthur', image: '/src/assets/cards/king_arthur.png', isLegendary: true, cost: 7, isSpell: false },
  { id: 'legion_of_the_dead', name: 'Legion of the Dead', image: '/src/assets/cards/legion_of_the_dead.png', isLegendary: true, cost: 7, isSpell: false },
  { id: 'merlin', name: 'Merlin', image: '/src/assets/cards/merlin.png', isLegendary: true, cost: 6, isSpell: false },
  { id: 'mowgli', name: 'Mowgli', image: '/src/assets/cards/mowgli.png', isLegendary: false, cost: 6, isSpell: false },
  { id: 'robin_hood', name: 'Robin Hood', image: '/src/assets/cards/robin_hood.png', isLegendary: true, cost: 5, isSpell: false },
  { id: 'snow_white', name: 'Snow White', image: '/src/assets/cards/snow_white.png', isLegendary: true, cost: 7, isSpell: false },
  { id: 'the_green_knight', name: 'The Green Knight', image: '/src/assets/cards/the_green_knight.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'three_musketeers', name: 'Three Musketeers', image: '/src/assets/cards/three_musketeers.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'beast', name: 'Beast', image: '/src/assets/cards/beast.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'bridge_troll', name: 'Bridge Troll', image: '/src/assets/cards/bridge_troll.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'cheshire', name: 'Cheshire Cat', image: '/src/assets/cards/cheshire.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'dark_omen', name: 'Dark Omen', image: '/src/assets/cards/dark_omen.png', isLegendary: false, cost: 4, isSpell: true },
  { id: 'dorothy', name: 'Dorothy', image: '/src/assets/cards/dorothy.png', isLegendary: true, cost: 5, isSpell: false },
  { id: 'dracula', name: 'Dracula', image: '/src/assets/cards/dracula.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'galahad', name: 'Sir Galahad', image: '/src/assets/cards/galahad.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'giant', name: 'Giant', image: '/src/assets/cards/giant.png', isLegendary: false, cost: 6, isSpell: false },
  { id: 'glinda', name: 'Glinda', image: '/src/assets/cards/glinda.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'goldilocks', name: 'Goldilocks', image: '/src/assets/cards/goldilocks.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'headless_horseman', name: 'Headless Horseman', image: '/src/assets/cards/headless_horseman.png', isLegendary: false, cost: 5, isSpell: false },
  { id: 'imhotep', name: 'Imhotep', image: '/src/assets/cards/imhotep.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'jack_in_the_box', name: 'Jack in the Box', image: '/src/assets/cards/jack_in_the_box.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'jekyll', name: 'Dr. Jekyll', image: '/src/assets/cards/jekyll.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'moby', name: 'Moby Dick', image: '/src/assets/cards/moby.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'phantom_coachman', name: 'Phantom Coachman', image: '/src/assets/cards/phantom_coachman.png', isLegendary: false, cost: 10, isSpell: false },
  { id: 'queen_guinevere', name: 'Queen Guinevere', image: '/src/assets/cards/queen_guinevere.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'the_kraken', name: 'The Kraken', image: '/src/assets/cards/the_kraken.png', isLegendary: false, cost: 8, isSpell: false },
  { id: 'three_not_so_little_pigs', name: 'Three Not So Little Pigs', image: '/src/assets/cards/three_not_so_little_pigs.png', isLegendary: false, cost: 7, isSpell: false },
  { id: 'tin_woodman', name: 'Tin Woodman', image: '/src/assets/cards/tin_woodman.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'trojan_horse', name: 'Trojan Horse', image: '/src/assets/cards/trojan_horse.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'jack', name: 'Jack', image: '/src/assets/cards/jack.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'kanga', name: 'Kanga', image: '/src/assets/cards/kanga.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'king_shahryar', name: 'King Shahryar', image: '/src/assets/cards/king_shahryar.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'lady_of_the_lake', name: 'Lady of the Lake', image: '/src/assets/cards/lady_of_the_lake.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'lancelot', name: 'Sir Lancelot', image: '/src/assets/cards/lancelot.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'lightning_strike', name: 'Lightning Strike', image: '/src/assets/cards/lightning_strike.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'little_john', name: 'Little John', image: '/src/assets/cards/little_john.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'marian', name: 'Maid Marian', image: '/src/assets/cards/marian.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'moriarty', name: 'Professor Moriarty', image: '/src/assets/cards/moriarty.png', isLegendary: false, cost: 7, isSpell: false },
  { id: 'mummy', name: 'Mummy', image: '/src/assets/cards/mummy.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'piggy_bank', name: 'Piggy Bank', image: '/src/assets/cards/piggy_bank.png', isLegendary: false, cost: 3, isSpell: true },
  { id: 'princess_aurora', name: 'Princess Aurora', image: '/src/assets/cards/princess_aurora.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'rain_of_arrows', name: 'Rain of Arrows', image: '/src/assets/cards/rain_of_arrows.png', isLegendary: false, cost: 4, isSpell: true },
  { id: 'red', name: 'Little Red Riding Hood', image: '/src/assets/cards/red.png', isLegendary: true, cost: 3, isSpell: false },
  { id: 'scorpion', name: 'Scorpion', image: '/src/assets/cards/scorpion.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'sea_witch', name: 'Sea Witch', image: '/src/assets/cards/sea_witch.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'sheriff_of_nottingham', name: 'Sheriff of Nottingham', image: '/src/assets/cards/sheriff_of_nottingham.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'sherlock', name: 'Sherlock Holmes', image: '/src/assets/cards/sherlock.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'shield_maiden', name: 'Shield Maiden', image: '/src/assets/cards/shield_maiden.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'siren', name: 'Siren', image: '/src/assets/cards/siren.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'striga', name: 'Striga', image: '/src/assets/cards/striga.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'wicked_witch_of_the_west', name: 'Wicked Witch of the West', image: '/src/assets/cards/wicked_witch_of_the_west.png', isLegendary: false, cost: 4, isSpell: false },
  { id: 'zorro', name: 'Zorro', image: '/src/assets/cards/zorro.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'alice', name: 'Alice', image: '/src/assets/cards/alice.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'axe_throw', name: 'Axe Throw', image: '/src/assets/cards/axe_throw.png', isLegendary: false, cost: 3, isSpell: true },
  { id: 'banshee', name: 'Banshee', image: '/src/assets/cards/banshee.png', isLegendary: false, cost: 2, isSpell: false },
  { id: 'big_bad_wolf', name: 'Big Bad Wolf', image: '/src/assets/cards/big_bad_wolf.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'black_knight', name: 'Black Knight', image: '/src/assets/cards/black_knight.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'bullseye', name: 'Bullseye', image: '/src/assets/cards/bullseye.png', isLegendary: false, cost: 2, isSpell: true },
  { id: 'concentrate', name: 'Concentrate', image: '/src/assets/cards/concentrate.png', isLegendary: false, cost: 2, isSpell: true },
  { id: 'cowardly_lion', name: 'Cowardly Lion', image: '/src/assets/cards/cowardly_lion.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'dr_frank', name: 'Dr. Frankenstein', image: '/src/assets/cards/dr_frank.png', isLegendary: false, cost: 2, isSpell: false },
  { id: 'en_passant', name: 'En Passant', image: '/src/assets/cards/en_passant.png', isLegendary: false, cost: 3, isSpell: true },
  { id: 'flying_monkey', name: 'Flying Monkey', image: '/src/assets/cards/flying_monkey.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'golden_egg', name: 'Golden Egg', image: '/src/assets/cards/golden_egg.png', isLegendary: false, cost: 3, isSpell: false },
  { id: 'guy_of_gisborne', name: 'Guy of Gisborne', image: '/src/assets/cards/guy_of_gisborne.png', isLegendary: false, cost: 2, isSpell: false },
  { id: 'huntsman', name: 'Huntsman', image: '/src/assets/cards/huntsman.png', isLegendary: false, cost: 2, isSpell: false },
  { id: 'its_alive', name: "It's Alive!", image: '/src/assets/cards/its_alive.png', isLegendary: false, cost: 3, isSpell: true },
  { id: 'mad_hatter', name: 'Mad Hatter', image: '/src/assets/cards/mad_hatter.png', isLegendary: false, cost: 2, isSpell: false },
  { id: 'morgiana', name: 'Morgiana', image: '/src/assets/cards/morgiana.png', isLegendary: false, cost: 2, isSpell: false },
]

// Get cards by cost
export const getCardsByCost = (cost: number): Card[] => {
  return cardDatabase.filter(card => card.cost === cost && !card.isLegendary)
}

// Get legendary cards
export const getLegendaryCards = (): Card[] => {
  return cardDatabase.filter(card => card.isLegendary)
}

// Get spell cards
export const getSpellCards = (): Card[] => {
  return cardDatabase.filter(card => card.isSpell)
}

// Generate draft choices with cost-based logic
export const generateDraftChoices = (usedCardIds: string[]): { cards: Card[], isLegendary: boolean, isSpell: boolean } | null => {
  const availableCards = cardDatabase.filter(card => !usedCardIds.includes(card.id) && card.cost !== undefined)
  
  if (availableCards.length < 4) return null

  // Determine if this should be a legendary round (random chance)
  const isLegendaryRound = Math.random() < 0.1 // 10% chance for legendary
  
  if (isLegendaryRound) {
    const availableLegendaries = availableCards.filter(card => card.isLegendary)
    if (availableLegendaries.length >= 4) {
      return { 
        cards: availableLegendaries.slice(0, 4),
        isLegendary: true,
        isSpell: false
      }
    }
  }

  // Determine if this should be a spell round (random chance)
  const isSpellRound = Math.random() < 0.1 // 10% chance for spell
  
  if (isSpellRound) {
    const availableSpells = availableCards.filter(card => card.isSpell)
    if (availableSpells.length >= 4) {
      // Ensure total cost is within range of 2
      const shuffledSpells = [...availableSpells].sort(() => Math.random() - 0.5)
      const selectedSpells = shuffledSpells.slice(0, 4)
      const totalCost = selectedSpells.reduce((sum, card) => sum + (card.cost || 0), 0)
      
      if (Math.abs(totalCost - selectedSpells.length * 3) <= 2) { // Average around 3, within range of 2
        return {
          cards: selectedSpells,
          isLegendary: false,
          isSpell: true
        }
      }
    }
  }

  // Regular cost-based selection
  const costs = Array.from(new Set(availableCards.map(card => card.cost!)))
  const shuffledCosts = costs.sort(() => Math.random() - 0.5)

  for (const cost of shuffledCosts) {
    const cardsOfCost = availableCards.filter(card => card.cost === cost && !card.isLegendary && !card.isSpell)
    
    if (cardsOfCost.length >= 4) {
      return {
        cards: cardsOfCost.slice(0, 4),
        isLegendary: false,
        isSpell: false
      }
    } else if (cardsOfCost.length >= 2) {
      // Mix with neighboring costs
      const neighboringCosts = [cost - 1, cost + 1].filter(c => costs.includes(c))
      for (const neighborCost of neighboringCosts) {
        const neighborCards = availableCards.filter(card => card.cost === neighborCost && !card.isLegendary && !card.isSpell)
        if (cardsOfCost.length + neighborCards.length >= 4) {
          const mixedCards = [...cardsOfCost, ...neighborCards].slice(0, 4)
          return {
            cards: mixedCards,
            isLegendary: false,
            isSpell: false
          }
        }
      }
    }
  }

  return null
}

export const getRandomCards = (count: number, excludeIds: string[] = []): Card[] => {
  const availableCards = cardDatabase.filter(card => !excludeIds.includes(card.id))
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const getCardById = (id: string): Card | undefined => {
  return cardDatabase.find(card => card.id === id)
}
