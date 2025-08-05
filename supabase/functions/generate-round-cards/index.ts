import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '3600',
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    })
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

    // Complete card database with corrected costs
    const cardDatabase: Card[] = [
      // Cost 0
      { id: "searing_light", name: "Searing Light", image: "searing_light.png", cost: 0, isSpell: true },
      
      // Cost 1 cards
      { id: "ali_baba", name: "Ali Baba", image: "ali_baba.png", cost: 1 },
      { id: "friar_tuck", name: "Friar Tuck", image: "friar_tuck.png", cost: 1 },
      { id: "ugly_duckling", name: "Ugly Duckling", image: "ugly_duckling.png", cost: 1 },
      { id: "white_rabbit", name: "White Rabbit", image: "white_rabbit.png", cost: 1 },
      { id: "defense_matrix", name: "Defense Matrix", image: "defense_matrix.png", cost: 1, isSpell: true },
      { id: "freeze", name: "Freeze", image: "freeze.png", cost: 1, isSpell: true },
      { id: "reinforcements", name: "Reinforcements", image: "reinforcements.png", cost: 1, isSpell: true },
      { id: "trash_for_treasure", name: "Trash for Treasure", image: "trash_for_treasure.png", cost: 1, isSpell: true },
      { id: "twister_toss", name: "Twister Toss", image: "twister_toss.png", cost: 1, isSpell: true },
      
      // Cost 2 cards
      { id: "banshee", name: "Banshee", image: "banshee.png", cost: 2 },
      { id: "billy", name: "Billy", image: "billy.png", cost: 2 },
      { id: "card_soldier", name: "Card Soldier", image: "card_soldier.png", cost: 2 },
      { id: "don_quixote", name: "Don Quixote", image: "don_quixote.png", cost: 2 },
      { id: "dr_frank", name: "Dr. Frank", image: "dr_frank.png", cost: 2 },
      { id: "guy_of_gisborne", name: "Guy of Gisborne", image: "guy_of_gisborne.png", cost: 2 },
      { id: "huntsman", name: "Huntsman", image: "huntsman.png", cost: 2 },
      { id: "mad_hatter", name: "Mad Hatter", image: "mad_hatter.png", cost: 2 },
      { id: "morgiana", name: "Morgiana", image: "morgiana.png", cost: 2 },
      { id: "ogre", name: "Ogre", image: "ogre.png", cost: 2 },
      { id: "pegasus", name: "Pegasus", image: "pegasus.png", cost: 2 },
      { id: "prince_charming", name: "Prince Charming", image: "prince_charming.png", cost: 2 },
      { id: "quasimodo", name: "Quasimodo", image: "quasimodo.png", cost: 2 },
      { id: "redcap", name: "Redcap", image: "redcap.png", cost: 2 },
      { id: "roo", name: "Roo", image: "roo.png", cost: 2 },
      { id: "rumple", name: "Rumple", image: "rumple.png", cost: 2 },
      { id: "scarecrow", name: "Scarecrow", image: "scarecrow.png", cost: 2 },
      { id: "the_white_queen", name: "The White Queen", image: "the_white_queen.png", cost: 2 },
      { id: "three_blind_mice", name: "Three Blind Mice", image: "three_blind_mice.png", cost: 2 },
      { id: "bullseye", name: "Bullseye", image: "bullseye.png", cost: 2, isSpell: true },
      { id: "concentrate", name: "Concentrate", image: "concentrate.png", cost: 2, isSpell: true },
      { id: "soul_surge", name: "Soul Surge", image: "soul_surge.png", cost: 2, isSpell: true },
      { id: "underworld_flare", name: "Underworld Flare", image: "underworld_flare.png", cost: 2, isSpell: true },
      
      // Cost 3 cards
      { id: "alice", name: "Alice", image: "alice.png", cost: 3 },
      { id: "big_bad_wolf", name: "Big Bad Wolf", image: "big_bad_wolf.png", cost: 3 },
      { id: "black_knight", name: "Black Knight", image: "black_knight.png", cost: 3 },
      { id: "cowardly_lion", name: "Cowardly Lion", image: "cowardly_lion.png", cost: 3 },
      { id: "flying_monkey", name: "Flying Monkey", image: "flying_monkey.png", cost: 3 },
      { id: "golden_egg", name: "Golden Egg", image: "golden_egg.png", cost: 3 },
      { id: "jack", name: "Jack", image: "jack.png", cost: 3 },
      { id: "jack_in_the_box", name: "Jack in the Box", image: "jack_in_the_box.png", cost: 3 },
      { id: "kanga", name: "Kanga", image: "kanga.png", cost: 3 },
      { id: "king_shahryar", name: "King Shahryar", image: "king_shahryar.png", cost: 3 },
      { id: "lightning_strike", name: "Lightning Strike", image: "lightning_strike.png", cost: 3 },
      { id: "mummy", name: "Mummy", image: "mummy.png", cost: 3 },
      { id: "princess_aurora", name: "Princess Aurora", image: "princess_aurora.png", cost: 3 },
      { id: "scorpion", name: "Scorpion", image: "scorpion.png", cost: 3 },
      { id: "sea_witch", name: "Sea Witch", image: "sea_witch.png", cost: 3 },
      { id: "sheriff_of_nottingham", name: "Sheriff of Nottingham", image: "sheriff_of_nottingham.png", cost: 3 },
      { id: "shield_maiden", name: "Shield Maiden", image: "shield_maiden.png", cost: 3 },
      { id: "siren", name: "Siren", image: "siren.png", cost: 3 },
      { id: "striga", name: "Striga", image: "striga.png", cost: 3 },
      { id: "zorro", name: "Zorro", image: "zorro.png", cost: 3 },
      { id: "axe_throw", name: "Axe Throw", image: "axe_throw.png", cost: 3, isSpell: true },
      { id: "en_passant", name: "En Passant", image: "en_passant.png", cost: 3, isSpell: true },
      { id: "its_alive", name: "It's Alive!", image: "its_alive.png", cost: 3, isSpell: true },
      { id: "piggy_bank", name: "Piggy Bank", image: "piggy_bank.png", cost: 3, isSpell: true },
      { id: "red", name: "Red", image: "red.png", cost: 3, isLegendary: true },
      
      // Cost 4 cards
      { id: "beast", name: "Beast", image: "beast.png", cost: 4 },
      { id: "cheshire", name: "Cheshire", image: "cheshire.png", cost: 4 },
      { id: "dracula", name: "Dracula", image: "dracula.png", cost: 4 },
      { id: "glinda", name: "Glinda", image: "glinda.png", cost: 4 },
      { id: "goldilocks", name: "Goldilocks", image: "goldilocks.png", cost: 4 },
      { id: "imhotep", name: "Imhotep", image: "imhotep.png", cost: 4 },
      { id: "jekyll", name: "Jekyll", image: "jekyll.png", cost: 4 },
      { id: "lady_of_the_lake", name: "Lady of the Lake", image: "lady_of_the_lake.png", cost: 4 },
      { id: "lancelot", name: "Lancelot", image: "lancelot.png", cost: 4 },
      { id: "little_john", name: "Little John", image: "little_john.png", cost: 4 },
      { id: "marian", name: "Marian", image: "marian.png", cost: 4 },
      { id: "moby", name: "Moby", image: "moby.png", cost: 4 },
      { id: "queen_guinevere", name: "Queen Guinevere", image: "queen_guinevere.png", cost: 4 },
      { id: "sherlock", name: "Sherlock", image: "sherlock.png", cost: 4 },
      { id: "tin_woodman", name: "Tin Woodman", image: "tin_woodman.png", cost: 4 },
      { id: "trojan_horse", name: "Trojan Horse", image: "trojan_horse.png", cost: 4 },
      { id: "wicked_witch_of_the_west", name: "Wicked Witch of the West", image: "wicked_witch_of_the_west.png", cost: 4 },
      { id: "dark_omen", name: "Dark Omen", image: "dark_omen.png", cost: 4, isSpell: true },
      { id: "rain_of_arrows", name: "Rain of Arrows", image: "rain_of_arrows.png", cost: 4, isSpell: true },
      { id: "dorothy", name: "Dorothy", image: "dorothy.png", cost: 5, isLegendary: true },
      
      // Cost 5 cards
      { id: "baloo", name: "Baloo", image: "baloo.png", cost: 5 },
      { id: "bridge_troll", name: "Bridge Troll", image: "bridge_troll.png", cost: 5 },
      { id: "death", name: "Death", image: "death.png", cost: 5, isLegendary: true },
      { id: "fairy_godmother", name: "Fairy Godmother", image: "fairy_godmother.png", cost: 5 },
      { id: "galahad", name: "Galahad", image: "galahad.png", cost: 5 },
      { id: "grendel", name: "Grendel", image: "grendel.png", cost: 5 },
      { id: "headless_horseman", name: "Headless Horseman", image: "headless_horseman.png", cost: 5 },
      { id: "the_green_knight", name: "The Green Knight", image: "the_green_knight.png", cost: 5 },
      { id: "three_musketeers", name: "Three Musketeers", image: "three_musketeers.png", cost: 5 },
      { id: "robin_hood", name: "Robin Hood", image: "robin_hood.png", cost: 5, isLegendary: true },
      
      // Cost 6 cards
      { id: "giant", name: "Giant", image: "giant.png", cost: 6 },
      { id: "mowgli", name: "Mowgli", image: "mowgli.png", cost: 6 },
      { id: "heroic_charge", name: "Heroic Charge", image: "heroic_charge.png", cost: 6, isSpell: true },
      { id: "merlin", name: "Merlin", image: "merlin.png", cost: 6, isLegendary: true },
      
      // Cost 7 cards
      { id: "moriarty", name: "Moriarty", image: "moriarty.png", cost: 7 },
      { id: "three_not_so_little_pigs", name: "Three Not So Little Pigs", image: "three_not_so_little_pigs.png", cost: 7 },
      { id: "blow_the_house_down", name: "Blow the House Down", image: "blow_the_house_down.png", cost: 7, isSpell: true },
      { id: "king_arthur", name: "King Arthur", image: "king_arthur.png", cost: 7, isLegendary: true },
      { id: "legion_of_the_dead", name: "Legion of the Dead", image: "legion_of_the_dead.png", cost: 7, isLegendary: true },
      { id: "snow_white", name: "Snow White", image: "snow_white.png", cost: 7, isLegendary: true },
      
      // Cost 8+ cards
      { id: "bandersnatch", name: "Bandersnatch", image: "bandersnatch.png", cost: 8 },
      { id: "the_kraken", name: "The Kraken", image: "the_kraken.png", cost: 8 },
      
      // Cost 10+ cards
      { id: "phantom_coachman", name: "Phantom Coachman", image: "phantom_coachman.png", cost: 10 }
    ]

    const excludeIds = usedCardIds || []
    console.log('Used card IDs:', excludeIds)

    // Helper function to balance costs between two sides
    function balanceCosts(cards: Card[]): { creator: Card[], joiner: Card[] } {
      if (cards.length !== 4) {
        throw new Error('Expected exactly 4 cards to balance')
      }
      
      // Sort cards by cost
      const sortedCards = [...cards].sort((a, b) => (a.cost || 0) - (b.cost || 0))
      
      // Try different distributions and pick the one with minimum cost difference
      const distributions = [
        { creator: [sortedCards[0], sortedCards[1]], joiner: [sortedCards[2], sortedCards[3]] },
        { creator: [sortedCards[0], sortedCards[2]], joiner: [sortedCards[1], sortedCards[3]] },
        { creator: [sortedCards[0], sortedCards[3]], joiner: [sortedCards[1], sortedCards[2]] }
      ]
      
      let bestDistribution = distributions[0]
      let minDifference = Math.abs(
        (bestDistribution.creator[0].cost || 0) + (bestDistribution.creator[1].cost || 0) -
        (bestDistribution.joiner[0].cost || 0) - (bestDistribution.joiner[1].cost || 0)
      )
      
      for (const dist of distributions.slice(1)) {
        const creatorSum = (dist.creator[0].cost || 0) + (dist.creator[1].cost || 0)
        const joinerSum = (dist.joiner[0].cost || 0) + (dist.joiner[1].cost || 0)
        const difference = Math.abs(creatorSum - joinerSum)
        
        if (difference < minDifference) {
          minDifference = difference
          bestDistribution = dist
        }
      }
      
      return bestDistribution
    }

    // Generate all 52 cards for 13 rounds
    const allRoundsCards: Array<{ round: number, creator: Card[], joiner: Card[] }> = []
    const usedIds = new Set(excludeIds)

    // Round structures based on the simulation
    const roundStructures = [
      { type: 'cost', cost: 2, description: 'Cost 2' },
      { type: 'legendary', description: 'Legendary Choice' },
      { type: 'spell', description: 'Spell Choice' },
      { type: 'cost', cost: 1, description: 'Cost 1' },
      { type: 'cost', cost: 3, description: 'Cost 3' },
      { type: 'cost', cost: 4, description: 'Cost 4' },
      { type: 'cost', cost: 5, description: 'Cost 5' },
      { type: 'pool', description: 'Cost Pool (2,2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,2,3,3,3,4,4)' },
      { type: 'range', range: [5, 6], description: 'Range (5-6)' },
      { type: 'range', range: [7, 10], description: 'Range (7-10)' }
    ]

    for (let roundIndex = 0; roundIndex < 13; roundIndex++) {
      const roundNum = roundIndex + 1
      const structure = roundStructures[roundIndex]
      const roundCards: Card[] = []

      console.log(`Generating round ${roundNum}: ${structure.description}`)

      if (structure.type === 'legendary') {
        // Select 4 legendary cards
        const availableLegendary = cardDatabase.filter(card => 
          card.isLegendary && !usedIds.has(card.id)
        )
        
        for (let i = 0; i < 4 && i < availableLegendary.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableLegendary.length)
          const selected = availableLegendary.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
        
      } else if (structure.type === 'spell') {
        // Select 4 spells with cost balancing
        const availableSpells = cardDatabase.filter(card => 
          card.isSpell && !usedIds.has(card.id)
        )
        
        for (let i = 0; i < 4 && i < availableSpells.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableSpells.length)
          const selected = availableSpells.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
        
      } else if (structure.type === 'cost') {
        // Select 4 cards of specific cost
        const availableForCost = cardDatabase.filter(card => 
          !card.isLegendary && !card.isSpell && 
          card.cost === structure.cost && !usedIds.has(card.id)
        )
        
        for (let i = 0; i < 4 && i < availableForCost.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableForCost.length)
          const selected = availableForCost.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
        
      } else if (structure.type === 'pool') {
        // Select 4 cards from cost pool [2,2,2,2,3,3,3,4,4]
        const costPool = [2, 2, 2, 2, 3, 3, 3, 4, 4]
        const shuffledPool = [...costPool].sort(() => Math.random() - 0.5)
        
        for (let i = 0; i < 4; i++) {
          const targetCost = shuffledPool[i]
          const availableForCost = cardDatabase.filter(card => 
            !card.isLegendary && !card.isSpell && 
            card.cost === targetCost && !usedIds.has(card.id)
          )
          
          if (availableForCost.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableForCost.length)
            const selected = availableForCost[randomIndex]
            roundCards.push(selected)
            usedIds.add(selected.id)
          }
        }
        
      } else if (structure.type === 'range') {
        // Select 4 cards from cost range
        const [minCost, maxCost] = structure.range!
        const availableInRange = cardDatabase.filter(card => 
          !card.isLegendary && !card.isSpell && 
          card.cost && card.cost >= minCost && card.cost <= maxCost && 
          !usedIds.has(card.id)
        )
        
        for (let i = 0; i < 4 && i < availableInRange.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableInRange.length)
          const selected = availableInRange.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
      }

      // Balance and distribute cards for this round
      if (roundCards.length >= 4) {
        if (structure.type === 'spell' || structure.type === 'range') {
          // Use cost balancing for spells and ranges
          const balanced = balanceCosts(roundCards.slice(0, 4))
          allRoundsCards.push({
            round: roundNum,
            creator: balanced.creator,
            joiner: balanced.joiner
          })
        } else {
          // Random distribution for other types
          const shuffled = [...roundCards.slice(0, 4)].sort(() => Math.random() - 0.5)
          allRoundsCards.push({
            round: roundNum,
            creator: [shuffled[0], shuffled[1]],
            joiner: [shuffled[2], shuffled[3]]
          })
        }
      }

      console.log(`Round ${roundNum} cards:`, roundCards.slice(0, 4).map(c => `${c.name} (${c.cost})`))
    }

    // If generating all rounds, insert all cards at once
    if (round === 'all') {
      const allCardsToInsert = allRoundsCards.flatMap(({ round: roundNum, creator, joiner }) => [
        ...creator.map(card => ({
          room_id: roomId,
          round_number: roundNum,
          side: 'creator',
          card_id: card.id,
          card_name: card.name,
          card_image: card.image,
          is_legendary: card.isLegendary || false,
          selected_by: null
        })),
        ...joiner.map(card => ({
          room_id: roomId,
          round_number: roundNum,
          side: 'joiner',
          card_id: card.id,
          card_name: card.name,
          card_image: card.image,
          is_legendary: card.isLegendary || false,
          selected_by: null
        }))
      ])

      const { error } = await supabase
        .from('room_cards')
        .insert(allCardsToInsert)

      if (error) {
        console.error('Error inserting all rounds cards:', error)
        throw error
      }

      console.log(`Successfully generated all ${allRoundsCards.length} rounds with ${allCardsToInsert.length} total cards`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          roundsGenerated: allRoundsCards.length,
          totalCards: allCardsToInsert.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For single round generation (backwards compatibility)
    const targetRound = allRoundsCards.find(r => r.round === parseInt(round))
    if (!targetRound) {
      throw new Error(`Unable to generate cards for round ${round}`)
    }

    const cardsToInsert = [
      ...targetRound.creator.map(card => ({
        room_id: roomId,
        round_number: parseInt(round),
        side: 'creator',
        card_id: card.id,
        card_name: card.name,
        card_image: card.image,
        is_legendary: card.isLegendary || false,
        selected_by: null
      })),
      ...targetRound.joiner.map(card => ({
        room_id: roomId,
        round_number: parseInt(round),
        side: 'joiner',
        card_id: card.id,
        card_name: card.name,
        card_image: card.image,
        is_legendary: card.isLegendary || false,
        selected_by: null
      }))
    ]

    console.log(`Round ${round} enhanced logging - About to insert ${cardsToInsert.length} cards`)
    console.log(`Round ${round} cards breakdown:`, {
      creator: targetRound.creator.map(c => `${c.name} (${c.cost})`),
      joiner: targetRound.joiner.map(c => `${c.name} (${c.cost})`)
    })

    // Check if cards for this round already exist
    const { data: existingCards } = await supabase
      .from('room_cards')
      .select('*')
      .eq('room_id', roomId)
      .eq('round_number', round)

    if (existingCards && existingCards.length > 0) {
      console.log(`Round ${round} already has ${existingCards.length} cards, skipping insertion`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Round ${round} cards already exist`,
          existingCardsCount: existingCards.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabase
      .from('room_cards')
      .insert(cardsToInsert)

    if (error) {
      console.error(`Round ${round} insertion error:`, error)
      throw error
    }

    console.log(`Round ${round} cards inserted successfully`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        creatorCardsCount: targetRound.creator.length,
        joinerCardsCount: targetRound.joiner.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error(`Round ${round} generate cards function error:`, error)
    return new Response(
      JSON.stringify({ 
        error: `Round ${round} failed: ${error?.message || 'Unknown error'}`,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})