import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-token',
}

interface Card {
  id: string
  name: string
  image: string
  cost?: number
  isLegendary?: boolean
  isSpell?: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { roomId, round, usedCardIds } = await req.json()
    
    if (!roomId || !round) {
      throw new Error('Missing required parameters')
    }

    console.log(`Generating cards for round ${round}`)

    // Complete card database
    const cardDatabase: Card[] = [
      // Cost 1 cards
      { id: "mouse", name: "Mouse", image: "mouse.png", cost: 1 },
      { id: "piggy_bank", name: "Piggy Bank", image: "piggy_bank.png", cost: 1 },
      { id: "bullseye", name: "Bullseye", image: "bullseye.png", cost: 1, isSpell: true },
      { id: "concentrate", name: "Concentrate", image: "concentrate.png", cost: 1, isSpell: true },
      { id: "freeze", name: "Freeze", image: "freeze.png", cost: 1, isSpell: true },
      { id: "twister_toss", name: "Twister Toss", image: "twister_toss.png", cost: 1, isSpell: true },
      
      // Cost 2 cards
      { id: "alice", name: "Alice", image: "alice.png", cost: 2 },
      { id: "banshee", name: "Banshee", image: "banshee.png", cost: 2 },
      { id: "billy", name: "Billy", image: "billy.png", cost: 2 },
      { id: "card_soldier", name: "Card Soldier", image: "card_soldier.png", cost: 2 },
      { id: "don_quixote", name: "Don Quixote", image: "don_quixote.png", cost: 2 },
      { id: "dr_frank", name: "Dr. Frank", image: "dr_frank.png", cost: 2 },
      { id: "golden_egg", name: "Golden Egg", image: "golden_egg.png", cost: 2 },
      { id: "guy_of_gisborne", name: "Guy of Gisborne", image: "guy_of_gisborne.png", cost: 2 },
      { id: "huntsman", name: "Huntsman", image: "huntsman.png", cost: 2 },
      { id: "jack_in_the_box", name: "Jack in the Box", image: "jack_in_the_box.png", cost: 2 },
      { id: "mad_hatter", name: "Mad Hatter", image: "mad_hatter.png", cost: 2 },
      { id: "morgiana", name: "Morgiana", image: "morgiana.png", cost: 2 },
      { id: "redcap", name: "Redcap", image: "redcap.png", cost: 2 },
      { id: "roo", name: "Roo", image: "roo.png", cost: 2 },
      { id: "scarecrow", name: "Scarecrow", image: "scarecrow.png", cost: 2 },
      { id: "scorpion", name: "Scorpion", image: "scorpion.png", cost: 2 },
      { id: "soldier", name: "Soldier", image: "soldier.png", cost: 2 },
      { id: "the_white_queen", name: "The White Queen", image: "the_white_queen.png", cost: 2 },
      { id: "ugly_duckling", name: "Ugly Duckling", image: "ugly_duckling.png", cost: 2 },
      { id: "white_rabbit", name: "White Rabbit", image: "white_rabbit.png", cost: 2 },
      { id: "axe_throw", name: "Axe Throw", image: "axe_throw.png", cost: 2, isSpell: true },
      { id: "dark_omen", name: "Dark Omen", image: "dark_omen.png", cost: 2, isSpell: true },
      { id: "trash_for_treasure", name: "Trash for Treasure", image: "trash_for_treasure.png", cost: 2, isSpell: true },
      
      // Cost 3 cards
      { id: "ali_baba", name: "Ali Baba", image: "ali_baba.png", cost: 3 },
      { id: "beautiful_swan", name: "Beautiful Swan", image: "beautiful_swan.png", cost: 3 },
      { id: "big_bad_wolf", name: "Big Bad Wolf", image: "big_bad_wolf.png", cost: 3 },
      { id: "black_knight", name: "Black Knight", image: "black_knight.png", cost: 3 },
      { id: "cheshire", name: "Cheshire", image: "cheshire.png", cost: 3 },
      { id: "cowardly_lion", name: "Cowardly Lion", image: "cowardly_lion.png", cost: 3 },
      { id: "dorothy", name: "Dorothy", image: "dorothy.png", cost: 3 },
      { id: "flying_monkey", name: "Flying Monkey", image: "flying_monkey.png", cost: 3 },
      { id: "goldilocks", name: "Goldilocks", image: "goldilocks.png", cost: 3 },
      { id: "jack", name: "Jack", image: "jack.png", cost: 3 },
      { id: "mowgli", name: "Mowgli", image: "mowgli.png", cost: 3 },
      { id: "not_so_little_pig", name: "Not So Little Pig", image: "not_so_little_pig.png", cost: 3 },
      { id: "princess_aurora", name: "Princess Aurora", image: "princess_aurora.png", cost: 3 },
      { id: "red", name: "Red", image: "red.png", cost: 3 },
      { id: "three_blind_mice", name: "Three Blind Mice", image: "three_blind_mice.png", cost: 3 },
      { id: "watson", name: "Watson", image: "watson.png", cost: 3 },
      { id: "zorro", name: "Zorro", image: "zorro.png", cost: 3 },
      { id: "blow_the_house_down", name: "Blow the House Down", image: "blow_the_house_down.png", cost: 3, isSpell: true },
      { id: "en_passant", name: "En Passant", image: "en_passant.png", cost: 3, isSpell: true },
      { id: "its_alive", name: "It's Alive!", image: "its_alive.png", cost: 3, isSpell: true },
      { id: "lightning_strike", name: "Lightning Strike", image: "lightning_strike.png", cost: 3, isSpell: true },
      { id: "soul_surge", name: "Soul Surge", image: "soul_surge.png", cost: 3, isSpell: true },
      
      // Cost 4 cards
      { id: "baloo", name: "Baloo", image: "baloo.png", cost: 4 },
      { id: "beast", name: "Beast", image: "beast.png", cost: 4 },
      { id: "dracula", name: "Dracula", image: "dracula.png", cost: 4 },
      { id: "friar_tuck", name: "Friar Tuck", image: "friar_tuck.png", cost: 4 },
      { id: "glinda", name: "Glinda", image: "glinda.png", cost: 4 },
      { id: "golden_goose", name: "Golden Goose", image: "golden_goose.png", cost: 4 },
      { id: "imhotep", name: "Imhotep", image: "imhotep.png", cost: 4 },
      { id: "jekyll", name: "Jekyll", image: "jekyll.png", cost: 4 },
      { id: "lady_of_the_lake", name: "Lady of the Lake", image: "lady_of_the_lake.png", cost: 4 },
      { id: "lancelot", name: "Lancelot", image: "lancelot.png", cost: 4 },
      { id: "little_john", name: "Little John", image: "little_john.png", cost: 4 },
      { id: "marian", name: "Marian", image: "marian.png", cost: 4 },
      { id: "moby", name: "Moby", image: "moby.png", cost: 4 },
      { id: "musketeer", name: "Musketeer", image: "musketeer.png", cost: 4 },
      { id: "queen_guinevere", name: "Queen Guinevere", image: "queen_guinevere.png", cost: 4 },
      { id: "sherlock", name: "Sherlock", image: "sherlock.png", cost: 4 },
      { id: "shield_maiden", name: "Shield Maiden", image: "shield_maiden.png", cost: 4 },
      { id: "siren", name: "Siren", image: "siren.png", cost: 4 },
      { id: "snow_white", name: "Snow White", image: "snow_white.png", cost: 4 },
      { id: "tin_woodman", name: "Tin Woodman", image: "tin_woodman.png", cost: 4 },
      { id: "wicked_witch_of_the_west", name: "Wicked Witch of the West", image: "wicked_witch_of_the_west.png", cost: 4 },
      { id: "defense_matrix", name: "Defense Matrix", image: "defense_matrix.png", cost: 4, isSpell: true },
      { id: "heroic_charge", name: "Heroic Charge", image: "heroic_charge.png", cost: 4, isSpell: true },
      { id: "rain_of_arrows", name: "Rain of Arrows", image: "rain_of_arrows.png", cost: 4, isSpell: true },
      { id: "searing_light", name: "Searing Light", image: "searing_light.png", cost: 4, isSpell: true },
      
      // Cost 5 cards
      { id: "bridge_troll", name: "Bridge Troll", image: "bridge_troll.png", cost: 5 },
      { id: "guy_of_gisborne", name: "Guy of Gisborne", image: "guy_of_gisborne.png", cost: 5 },
      { id: "kanga", name: "Kanga", image: "kanga.png", cost: 5 },
      { id: "king_shahryar", name: "King Shahryar", image: "king_shahryar.png", cost: 5 },
      { id: "mummy", name: "Mummy", image: "mummy.png", cost: 5 },
      { id: "phantom_coachman", name: "Phantom Coachman", image: "phantom_coachman.png", cost: 5 },
      { id: "prince_charming", name: "Prince Charming", image: "prince_charming.png", cost: 5 },
      { id: "quasimodo", name: "Quasimodo", image: "quasimodo.png", cost: 5 },
      { id: "sheriff_of_nottingham", name: "Sheriff of Nottingham", image: "sheriff_of_nottingham.png", cost: 5 },
      { id: "the_green_knight", name: "The Green Knight", image: "the_green_knight.png", cost: 5 },
      { id: "trojan_horse", name: "Trojan Horse", image: "trojan_horse.png", cost: 5 },
      
      // Cost 6 cards
      { id: "galahad", name: "Galahad", image: "galahad.png", cost: 6 },
      { id: "giant", name: "Giant", image: "giant.png", cost: 6 },
      { id: "headless_horseman", name: "Headless Horseman", image: "headless_horseman.png", cost: 6 },
      { id: "ogre", name: "Ogre", image: "ogre.png", cost: 6 },
      { id: "pegasus", name: "Pegasus", image: "pegasus.png", cost: 6 },
      { id: "princess_aurora", name: "Princess Aurora", image: "princess_aurora.png", cost: 6 },
      { id: "queen_guinevere", name: "Queen Guinevere", image: "queen_guinevere.png", cost: 6 },
      { id: "sea_witch", name: "Sea Witch", image: "sea_witch.png", cost: 6 },
      { id: "striga", name: "Striga", image: "striga.png", cost: 6 },
      { id: "three_not_so_little_pigs", name: "Three Not So Little Pigs", image: "three_not_so_little_pigs.png", cost: 6 },
      { id: "legion_of_the_dead", name: "Legion of the Dead", image: "legion_of_the_dead.png", cost: 6, isSpell: true },
      { id: "reinforcements", name: "Reinforcements", image: "reinforcements.png", cost: 6, isSpell: true },
      
      // Cost 7 cards
      { id: "bandersnatch", name: "Bandersnatch", image: "bandersnatch.png", cost: 7 },
      { id: "fairy_godmother", name: "Fairy Godmother", image: "fairy_godmother.png", cost: 7 },
      { id: "hyde", name: "Hyde", image: "hyde.png", cost: 7 },
      { id: "moriarty", name: "Moriarty", image: "moriarty.png", cost: 7 },
      { id: "rumple", name: "Rumple", image: "rumple.png", cost: 7 },
      { id: "three_musketeers", name: "Three Musketeers", image: "three_musketeers.png", cost: 7 },
      { id: "underworld_flare", name: "Underworld Flare", image: "underworld_flare.png", cost: 7, isSpell: true },
      
      // Cost 8+ cards
      { id: "dr_frank", name: "Dr. Frankenstein", image: "dr_frank.png", cost: 8 },
      { id: "franks_monster", name: "Frank's Monster", image: "franks_monster.png", cost: 8 },
      { id: "grendel", name: "Grendel", image: "grendel.png", cost: 8 },
      { id: "moby", name: "Moby Dick", image: "moby.png", cost: 8 },
      
      // Cost 9+ cards
      { id: "phantom_coachman", name: "Phantom Coachman", image: "phantom_coachman.png", cost: 10 },
      
      // Legendary cards
      { id: "death", name: "Death", image: "death.png", cost: 12, isLegendary: true },
      { id: "king_arthur", name: "King Arthur", image: "king_arthur.png", cost: 10, isLegendary: true },
      { id: "merlin", name: "Merlin", image: "merlin.png", cost: 9, isLegendary: true },
      { id: "the_kraken", name: "The Kraken", image: "the_kraken.png", cost: 9, isLegendary: true },
      { id: "robin_hood", name: "Robin Hood", image: "robin_hood.png", cost: 6, isLegendary: true },
      { id: "snow_white", name: "Snow White", image: "snow_white.png", cost: 7, isLegendary: true },
      { id: "dorothy", name: "Dorothy", image: "dorothy.png", cost: 5, isLegendary: true },
      { id: "red", name: "Little Red Riding Hood", image: "red.png", cost: 3, isLegendary: true }
    ]

    const excludeIds = usedCardIds || []
    console.log('Used card IDs:', excludeIds)

    // Apply card generation rules based on round
    let creatorCards: Card[] = []
    let joinerCards: Card[] = []
    const allChoices: Card[] = []

    // Rule 1: 1 legendary choice (no cost restriction)
    const availableLegendary = cardDatabase.filter(card => 
      card.isLegendary && !excludeIds.includes(card.id)
    )
    
    if (availableLegendary.length > 0) {
      const legendaryCard = availableLegendary[Math.floor(Math.random() * availableLegendary.length)]
      allChoices.push(legendaryCard)
      excludeIds.push(legendaryCard.id)
      console.log('Added legendary choice:', legendaryCard.name)
    }

    // Rule 2: 1 spell choice with balanced cost (sum within range of 2)
    const availableSpells = cardDatabase.filter(card => 
      card.isSpell && !excludeIds.includes(card.id)
    )
    
    if (availableSpells.length >= 2) {
      let bestSpellPair: Card[] = []
      let attempts = 0
      const maxAttempts = 100
      
      while (bestSpellPair.length === 0 && attempts < maxAttempts) {
        const shuffled = [...availableSpells].sort(() => Math.random() - 0.5)
        const spell1 = shuffled[0]
        const spell2 = shuffled[1]
        
        const costDiff = Math.abs((spell1.cost || 0) - (spell2.cost || 0))
        if (costDiff <= 2) {
          bestSpellPair = [spell1, spell2]
        }
        attempts++
      }
      
      if (bestSpellPair.length === 2) {
        allChoices.push(bestSpellPair[0])
        excludeIds.push(bestSpellPair[0].id)
        console.log('Added spell choice:', bestSpellPair[0].name, 'cost:', bestSpellPair[0].cost)
      }
    }

    // Rules 3-5: Cost-specific choices (1,2,3,4,5 + 4 random from specific pool + 2 range choices)
    const requiredCosts = [1, 2, 3, 4, 5]
    
    // Add one card for each required cost
    for (const cost of requiredCosts) {
      const availableForCost = cardDatabase.filter(card => 
        !card.isLegendary && !card.isSpell && card.cost === cost && !excludeIds.includes(card.id)
      )
      
      if (availableForCost.length > 0) {
        const selectedCard = availableForCost[Math.floor(Math.random() * availableForCost.length)]
        allChoices.push(selectedCard)
        excludeIds.push(selectedCard.id)
        console.log(`Added cost ${cost} choice:`, selectedCard.name)
      }
    }

    // Rule 4: 4 random selections from cost pool
    const costPool = [2, 2, 2, 2, 3, 3, 3, 4, 4]
    const shuffledPool = [...costPool].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < 4 && i < shuffledPool.length; i++) {
      const targetCost = shuffledPool[i]
      const availableForCost = cardDatabase.filter(card => 
        !card.isLegendary && !card.isSpell && card.cost === targetCost && !excludeIds.includes(card.id)
      )
      
      if (availableForCost.length >= 2) {
        // Pick 2 from target cost
        const shuffled = [...availableForCost].sort(() => Math.random() - 0.5)
        const selectedCard = shuffled[0]
        allChoices.push(selectedCard)
        excludeIds.push(selectedCard.id)
        console.log(`Added pool choice (cost ${targetCost}):`, selectedCard.name)
      } else if (availableForCost.length === 1) {
        // Use fallback rule: 1 from target, 1 from adjacent cost
        const selectedCard = availableForCost[0]
        allChoices.push(selectedCard)
        excludeIds.push(selectedCard.id)
        console.log(`Added pool choice with fallback (cost ${targetCost}):`, selectedCard.name)
      }
    }

    // Rule 5: 2 range choices (5-6 and 7-10)
    const range1Cards = cardDatabase.filter(card => 
      !card.isLegendary && !card.isSpell && 
      card.cost && card.cost >= 5 && card.cost <= 6 && 
      !excludeIds.includes(card.id)
    )
    
    if (range1Cards.length > 0) {
      const selectedCard = range1Cards[Math.floor(Math.random() * range1Cards.length)]
      allChoices.push(selectedCard)
      excludeIds.push(selectedCard.id)
      console.log('Added range 5-6 choice:', selectedCard.name, 'cost:', selectedCard.cost)
    }

    const range2Cards = cardDatabase.filter(card => 
      !card.isLegendary && !card.isSpell && 
      card.cost && card.cost >= 7 && card.cost <= 10 && 
      !excludeIds.includes(card.id)
    )
    
    if (range2Cards.length > 0) {
      const selectedCard = range2Cards[Math.floor(Math.random() * range2Cards.length)]
      allChoices.push(selectedCard)
      excludeIds.push(selectedCard.id)
      console.log('Added range 7-10 choice:', selectedCard.name, 'cost:', selectedCard.cost)
    }

    // Rule 6: Randomize order and split between players (2 cards each)
    const shuffledChoices = [...allChoices].sort(() => Math.random() - 0.5)
    
    if (shuffledChoices.length >= 4) {
      creatorCards = [shuffledChoices[0], shuffledChoices[1]]
      joinerCards = [shuffledChoices[2], shuffledChoices[3]]
    } else {
      // Fallback if not enough cards generated
      while (shuffledChoices.length < 4) {
        const fallbackCards = cardDatabase.filter(card => !excludeIds.includes(card.id))
        if (fallbackCards.length > 0) {
          const fallbackCard = fallbackCards[Math.floor(Math.random() * fallbackCards.length)]
          shuffledChoices.push(fallbackCard)
          excludeIds.push(fallbackCard.id)
        } else {
          break
        }
      }
      
      creatorCards = [shuffledChoices[0], shuffledChoices[1] || shuffledChoices[0]]
      joinerCards = [shuffledChoices[2] || shuffledChoices[0], shuffledChoices[3] || shuffledChoices[1]]
    }

    console.log('Final creator cards:', creatorCards.map(c => `${c.name} (${c.cost})`))
    console.log('Final joiner cards:', joinerCards.map(c => `${c.name} (${c.cost})`))

    if (creatorCards.length === 0 || joinerCards.length === 0) {
      throw new Error(`Unable to generate sufficient cards for round ${round}`)
    }

    // Insert cards into database
    const cardsToInsert = [
      ...creatorCards.map(card => ({
        room_id: roomId,
        round_number: round,
        side: 'creator',
        card_id: card.id,
        card_name: card.name,
        card_image: card.image,
        is_legendary: card.isLegendary || false,
        selected_by: null
      })),
      ...joinerCards.map(card => ({
        room_id: roomId,
        round_number: round,
        side: 'joiner',
        card_id: card.id,
        card_name: card.name,
        card_image: card.image,
        is_legendary: card.isLegendary || false,
        selected_by: null
      }))
    ]

    const { error } = await supabase
      .from('room_cards')
      .insert(cardsToInsert)

    if (error) {
      console.error('Error inserting cards:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        creatorCardsCount: creatorCards.length,
        joinerCardsCount: joinerCards.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Generate cards function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})