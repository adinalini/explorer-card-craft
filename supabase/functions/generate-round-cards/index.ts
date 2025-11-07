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
  isItem?: boolean
}

// Triple Draft Card Generation Logic
// Fisher-Yates shuffle for true randomization
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const generateTripleDraftChoices = (usedCardIds: string[], cardDatabase: Card[]): Card[][] => {
  const availableCards = cardDatabase.filter(card => !usedCardIds.includes(card.id) && card.cost !== undefined)
  
  const choices: Card[][] = []
  const usedInChoices: Set<string> = new Set()

  // 1. Guaranteed cost rounds - 1,2,3,4,5 (5 rounds) - allow spells
  const guaranteedCosts = [1, 2, 3, 4, 5]
  for (const cost of guaranteedCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length >= 3) {
      const shuffled = shuffleArray(cardsOfCost)
      const costChoice = shuffled.slice(0, 3)
      choices.push(costChoice)
      costChoice.forEach(card => usedInChoices.add(card.id))
    }
  }

  // 2. 1 Guaranteed legendary choice round
  const legendaryCards = availableCards.filter(card => card.isLegendary && !usedInChoices.has(card.id))
  if (legendaryCards.length >= 3) {
    const shuffled = shuffleArray(legendaryCards)
    const legendaryChoice = shuffled.slice(0, 3)
    choices.push(legendaryChoice)
    legendaryChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 3. 3 rounds where cards are in cost range (1-3) - randomly select costs first
  for (let i = 0; i < 3; i++) {
    const rangeChoice: Card[] = []
    
    // Randomly select 3 costs from range 1-3 (with repeats allowed)
    const selectedCosts = [
      Math.floor(Math.random() * 3) + 1, // Random 1-3
      Math.floor(Math.random() * 3) + 1, // Random 1-3
      Math.floor(Math.random() * 3) + 1  // Random 1-3
    ]
    
    // For each selected cost, pick one random card
    for (const cost of selectedCosts) {
      const cardsOfCost = availableCards.filter(card => 
        card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
      )
      
      if (cardsOfCost.length > 0) {
        const shuffled = shuffleArray(cardsOfCost)
        const selectedCard = shuffled[0]
        rangeChoice.push(selectedCard)
        usedInChoices.add(selectedCard.id)
      }
    }
    
    if (rangeChoice.length === 3) {
      choices.push(rangeChoice)
    }
  }

  // 4. 2 rounds where cards are in cost range (4-6) - randomly select costs first
  for (let i = 0; i < 2; i++) {
    const rangeChoice: Card[] = []
    
    // Randomly select 3 costs from range 4-6 (with repeats allowed)
    const selectedCosts = [
      Math.floor(Math.random() * 3) + 4, // Random 4-6
      Math.floor(Math.random() * 3) + 4, // Random 4-6
      Math.floor(Math.random() * 3) + 4  // Random 4-6
    ]
    
    // For each selected cost, pick one random card
    for (const cost of selectedCosts) {
      const cardsOfCost = availableCards.filter(card => 
        card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
      )
      
      if (cardsOfCost.length > 0) {
        const shuffled = shuffleArray(cardsOfCost)
        const selectedCard = shuffled[0]
        rangeChoice.push(selectedCard)
        usedInChoices.add(selectedCard.id)
      }
    }
    
    if (rangeChoice.length === 3) {
      choices.push(rangeChoice)
    }
  }

  // 5. 1 round where cards are in cost range (7-10) - randomly select costs first
  const highRangeChoice: Card[] = []
  
  // Randomly select 3 costs from range 7-10 (with repeats allowed)
  const selectedHighCosts = [
    Math.floor(Math.random() * 4) + 7, // Random 7-10
    Math.floor(Math.random() * 4) + 7, // Random 7-10
    Math.floor(Math.random() * 4) + 7  // Random 7-10
  ]
  
  // For each selected cost, pick one random card
  for (const cost of selectedHighCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length > 0) {
      const shuffled = shuffleArray(cardsOfCost)
      const selectedCard = shuffled[0]
      highRangeChoice.push(selectedCard)
      usedInChoices.add(selectedCard.id)
    }
  }
  
  if (highRangeChoice.length === 3) {
    choices.push(highRangeChoice)
  }

  // 6. 1 guaranteed spell round- 3 random spells selected (including items, excluding legendaries)
  const spellCards = availableCards.filter(card => (card.isSpell || card.isItem) && !card.isLegendary && !usedInChoices.has(card.id))
  if (spellCards.length >= 3) {
    const shuffled = shuffleArray(spellCards)
    const spellChoice = shuffled.slice(0, 3)
    choices.push(spellChoice)
    spellChoice.forEach(card => usedInChoices.add(card.id))
  }

  // Fallback: ensure we always return exactly 13 choices to avoid modulo reuse
  while (choices.length < 13) {
    const pool = availableCards.filter(c => !c.isLegendary && !usedInChoices.has(c.id))
    if (pool.length < 3) break
    const shuffled = shuffleArray(pool)
    const filler = [shuffled[0], shuffled[1], shuffled[2]]
    choices.push(filler)
    filler.forEach(c => usedInChoices.add(c.id))
  }

  // Shuffle all choices to randomize order, clamp to 13
  return shuffleArray(choices).slice(0, 13)
}

// Mega Draft Card Generation Logic  
const generateMegaDraftCards = (usedCardIds: string[], cardDatabase: Card[]): Card[] => {
  const availableCards = cardDatabase.filter(card => !usedCardIds.includes(card.id) && card.cost !== undefined)
  
  const selectedCards: Card[] = []
  const usedInSelection: Set<string> = new Set()

  // 1. Include 2 from the following costs: 1,2,3,4,5,6 (12 cards total) - allow spells
  const guaranteedCosts = [1, 2, 3, 4, 5, 6]
  for (const cost of guaranteedCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInSelection.has(card.id)
    )
    
    if (cardsOfCost.length >= 2) {
      const shuffled = shuffleArray(cardsOfCost)
      const selected = shuffled.slice(0, 2)
      selectedCards.push(...selected)
      selected.forEach(card => usedInSelection.add(card.id))
    }
  }

  // 2. Include 2 from the range (7-10) (2 cards total) - allow spells
  const highCostCards = availableCards.filter(card => 
    card.cost && card.cost >= 7 && card.cost <= 10 && !card.isLegendary && !usedInSelection.has(card.id)
  )
  
  if (highCostCards.length >= 2) {
    const shuffled = shuffleArray(highCostCards)
    const selected = shuffled.slice(0, 2)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 3. Include 3 random legendaries (3 cards total)
  const legendaryCards = availableCards.filter(card => card.isLegendary && !usedInSelection.has(card.id))
  
  if (legendaryCards.length >= 3) {
    const shuffled = shuffleArray(legendaryCards)
    const selected = shuffled.slice(0, 3)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 4. Add 2 random spells (including items, excluding legendaries) (2 cards total)
  const spellCards = availableCards.filter(card => (card.isSpell || card.isItem) && !card.isLegendary && !usedInSelection.has(card.id))
  
  if (spellCards.length >= 2) {
    const shuffled = shuffleArray(spellCards)
    const selected = shuffled.slice(0, 2)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 5. Fill the remaining 17 choices with random cards from the entire pool left barring legendary
  const remainingCards = availableCards.filter(card => 
    !card.isLegendary && !usedInSelection.has(card.id)
  )
  
  const needed = 36 - selectedCards.length
  if (remainingCards.length >= needed) {
    const shuffled = shuffleArray(remainingCards)
    const selected = shuffled.slice(0, needed)
    selectedCards.push(...selected)
  }

  // Sort cards by cost then name, but keep legendaries at the end
  const nonLegendaryCards = selectedCards.filter(card => !card.isLegendary)
  const legendaries = selectedCards.filter(card => card.isLegendary)
  
  // Sort non-legendary cards by cost then name
  nonLegendaryCards.sort((a, b) => {
    if (a.cost !== b.cost) {
      return (a.cost || 0) - (b.cost || 0)
    }
    return a.name.localeCompare(b.name)
  })
  
  // Return array with non-legendaries first (33 cards) then legendaries (3 cards) at the end
  return [...nonLegendaryCards, ...legendaries]
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
    
    console.log('🚀 EDGE FUNCTION: Starting request processing')
    
    let requestBody
    try {
      requestBody = await req.json()
    } catch (jsonError) {
      console.error('🚨 EDGE FUNCTION: Failed to parse request JSON:', jsonError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          success: false 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const { roomId, round, usedCardIds, roundType, draftType } = requestBody
    console.log('🚀 EDGE FUNCTION: Request parameters:', { 
      roomId, 
      round, 
      usedCardIds: usedCardIds?.length || 0,
      roundType,
      draftType 
    })
    
    if (!roomId || (!round && round !== 'all')) {
      console.error('🚨 EDGE FUNCTION: Missing required parameters:', { roomId, round })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: roomId and round are required',
          success: false 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`🚀 EDGE FUNCTION: Starting card generation for round ${round} in room ${roomId}`)
    
    // Check if cards already exist for this specific round to prevent duplicates
    const { data: existingCards, error: checkError } = await supabase
      .from('room_cards')
      .select('id, round_number, card_id')
      .eq('room_id', roomId)
    
    if (checkError) {
      console.error('🚨 EDGE FUNCTION: Error checking existing cards:', checkError)
    } else {
      console.log(`🔍 EDGE FUNCTION: Found ${existingCards?.length || 0} existing cards in room`)
      
      // For single round generation, check if THIS round already has cards
      if (round !== 'all' && existingCards && existingCards.length > 0) {
        const roundNumber = parseInt(round)
        const existingForRound = existingCards.filter(c => c.round_number === roundNumber)
        if (existingForRound.length > 0) {
          console.log(`⚠️ EDGE FUNCTION: Cards already exist for round ${round}!`)
          return new Response(
            JSON.stringify({ 
              message: `Cards already exist for round ${round}`,
              success: true,
              cardsGenerated: 0
            }),
            { 
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
      
      // For 'all' generation, return early if ANY cards exist
      if (round === 'all' && existingCards && existingCards.length > 0) {
        console.log(`⚠️ EDGE FUNCTION: Cards already exist! Existing rounds:`, 
          [...new Set(existingCards.map(card => card.round_number))].sort()
        )
        return new Response(
          JSON.stringify({ 
            message: 'Cards already exist for this room',
            success: true,
            cardsGenerated: 0
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

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
      { id: "mortal_coil", name: "Mortal Coil", image: "mortal_coil.png", cost: 1, isItem: true },
      
      // Cost 2 cards
      { id: "banshee", name: "Banshee", image: "banshee.png", cost: 2 },
      { id: "billy", name: "Billy", image: "billy.png", cost: 2 },
      { id: "card_soldier", name: "Card Soldier", image: "card_soldier.png", cost: 2 },
      { id: "don_quixote", name: "Don Quixote", image: "don_quixote.png", cost: 2 },
      { id: "dr_frank", name: "Dr. Frank", image: "dr_frank.png", cost: 2 },
      { id: "guy_of_gisborne", name: "Guy of Gisborne", image: "guy_of_gisborne.png", cost: 2 },
      { id: "hansel_gretel", name: "Hansel & Gretel", image: "hansel_gretel.png", cost: 2 },
      { id: "huntsman", name: "Huntsman", image: "huntsman.png", cost: 2 },
      { id: "jack_in_the_box", name: "Jack in the Box", image: "jack_in_the_box.png", cost: 2 },
      { id: "lady_of_the_lake", name: "Lady of the Lake", image: "lady_of_the_lake.png", cost: 2 },
      { id: "mad_hatter", name: "Mad Hatter", image: "mad_hatter.png", cost: 2 },
      { id: "morgiana", name: "Morgiana", image: "morgiana.png", cost: 2 },
      { id: "pegasus", name: "Pegasus", image: "pegasus.png", cost: 2 },
      { id: "prince_charming", name: "Prince Charming", image: "prince_charming.png", cost: 2 },
      { id: "quasimodo", name: "Quasimodo", image: "quasimodo.png", cost: 2 },
      { id: "redcap", name: "Redcap", image: "redcap.png", cost: 2 },
      { id: "roo", name: "Roo", image: "roo.png", cost: 2 },
      { id: "rumple", name: "Rumple", image: "rumple.png", cost: 2 },
      { id: "scarecrow", name: "Scarecrow", image: "scarecrow.png", cost: 2 },
      { id: "the_white_queen", name: "The White Queen", image: "the_white_queen.png", cost: 2 },
      { id: "three_blind_mice", name: "Three Blind Mice", image: "three_blind_mice.png", cost: 2 },
      { id: "tin_woodman", name: "Tin Woodman", image: "tin_woodman.png", cost: 2 },
      { id: "axe_throw", name: "Axe Throw", image: "axe_throw.png", cost: 2, isSpell: true },
      { id: "bullseye", name: "Bullseye", image: "bullseye.png", cost: 1, isSpell: true },
      { id: "concentrate", name: "Concentrate", image: "concentrate.png", cost: 2, isSpell: true },
      { id: "soul_surge", name: "Soul Surge", image: "soul_surge.png", cost: 2, isSpell: true },
      { id: "underworld_flare", name: "Underworld Flare", image: "underworld_flare.png", cost: 2, isSpell: true },
      { id: "cake", name: "Cake", image: "cake.png", cost: 2, isItem: true },
      
      // Cost 3 cards
      { id: "alice", name: "Alice", image: "alice.png", cost: 3 },
      { id: "beast", name: "Beast", image: "beast.png", cost: 3 },
      { id: "big_bad_wolf", name: "Big Bad Wolf", image: "big_bad_wolf.png", cost: 3 },
      { id: "black_knight", name: "Black Knight", image: "black_knight.png", cost: 3 },
      { id: "cheshire", name: "Cheshire", image: "cheshire.png", cost: 3 },
      { id: "cowardly_lion", name: "Cowardly Lion", image: "cowardly_lion.png", cost: 3 },
      { id: "flying_monkey", name: "Flying Monkey", image: "flying_monkey.png", cost: 3 },
      { id: "golden_egg", name: "Golden Egg", image: "golden_egg.png", cost: 3 },
      { id: "jack", name: "Jack", image: "jack.png", cost: 3 },
      { id: "kanga", name: "Kanga", image: "kanga.png", cost: 3 },
      { id: "king_shahryar", name: "King Shahryar", image: "king_shahryar.png", cost: 3 },
      { id: "mummy", name: "Mummy", image: "mummy.png", cost: 1 },
      { id: "princess_aurora", name: "Princess Aurora", image: "princess_aurora.png", cost: 3 },
      { id: "scorpion", name: "Scorpion", image: "scorpion.png", cost: 3 },
      { id: "sea_witch", name: "Sea Witch", image: "sea_witch.png", cost: 3 },
      { id: "sheriff_of_nottingham", name: "Sheriff of Nottingham", image: "sheriff_of_nottingham.png", cost: 3 },
      { id: "shield_maiden", name: "Shield Maiden", image: "shield_maiden.png", cost: 3 },
      { id: "siren", name: "Siren", image: "siren.png", cost: 3 },
      { id: "stryga", name: "Stryga", image: "stryga.png", cost: 3 },
      { id: "wendy", name: "Wendy", image: "wendy.png", cost: 3 },
      { id: "zorro", name: "Zorro", image: "zorro.png", cost: 3 },
      { id: "dark_omen", name: "Dark Omen", image: "dark_omen.png", cost: 3, isSpell: true },
      { id: "en_passant", name: "En Passant", image: "en_passant.png", cost: 3, isSpell: true },
      { id: "its_alive", name: "It's Alive!", image: "its_alive.png", cost: 3, isSpell: true },
      { id: "lightning_strike", name: "Lightning Strike", image: "lightning_strike.png", cost: 3, isSpell: true },
      { id: "piggy_bank", name: "Piggy Bank", image: "piggy_bank.png", cost: 3, isSpell: true },
      
      // Cost 4 cards
      { id: "baba_yaga", name: "Baba Yaga", image: "baba_yaga.png", cost: 4 },
      { id: "beauty", name: "Beauty", image: "beauty.png", cost: 4 },
      { id: "christopher", name: "Christopher Robin", image: "christopher.png", cost: 4 },
      { id: "dracula", name: "Dracula", image: "dracula.png", cost: 4, isLegendary: true },
      { id: "glinda", name: "Glinda", image: "glinda.png", cost: 4 },
      { id: "imhotep", name: "Imhotep", image: "imhotep.png", cost: 4 },
      { id: "jekyll", name: "Jekyll", image: "jekyll.png", cost: 4 },
      { id: "lancelot", name: "Lancelot", image: "lancelot.png", cost: 4 },
      { id: "little_john", name: "Little John", image: "little_john.png", cost: 4 },
      { id: "marian", name: "Marian", image: "marian.png", cost: 4 },
      { id: "moby", name: "Moby", image: "moby.png", cost: 4 },
      { id: "queen_guinevere", name: "Queen Guinevere", image: "queen_guinevere.png", cost: 4 },
      { id: "sherlock", name: "Sherlock", image: "sherlock.png", cost: 4 },
      { id: "trojan_horse", name: "Trojan Horse", image: "trojan_horse.png", cost: 4 },
      { id: "wicked_witch_of_the_west", name: "Wicked Witch of the West", image: "wicked_witch_of_the_west.png", cost: 4 },
      { id: "wukong", name: "Sun Wukong", image: "wukong.png", cost: 4, isLegendary: true },
      
      // Cost 5 cards
      { id: "bridge_troll", name: "Bridge Troll", image: "bridge_troll.png", cost: 5 },
      { id: "death", name: "Death", image: "death.png", cost: 5, isLegendary: true },
      { id: "dorothy", name: "Dorothy", image: "dorothy.png", cost: 5, isLegendary: true },
      { id: "fairy_godmother", name: "Fairy Godmother", image: "fairy_godmother.png", cost: 5 },
      { id: "galahad", name: "Galahad", image: "galahad.png", cost: 5 },
      { id: "genie", name: "Genie", image: "genie.png", cost: 5 },
      { id: "grendel", name: "Grendel", image: "grendel.png", cost: 5 },
      { id: "headless_horseman", name: "Headless Horseman", image: "headless_horseman.png", cost: 5 },
      { id: "red", name: "Red", image: "red.png", cost: 5, isLegendary: true },
      { id: "the_green_knight", name: "The Green Knight", image: "the_green_knight.png", cost: 5 },
      { id: "three_musketeers", name: "Three Musketeers", image: "three_musketeers.png", cost: 5 },
      { id: "baloo", name: "Baloo", image: "baloo.png", cost: 5 },
      { id: "rain_of_arrows", name: "Rain of Arrows", image: "rain_of_arrows.png", cost: 5, isSpell: true },
      
      // Cost 6 cards
      { id: "mowgli", name: "Mowgli", image: "mowgli.png", cost: 6 },
      { id: "heroic_charge", name: "Heroic Charge", image: "heroic_charge.png", cost: 6, isSpell: true },
      { id: "merlin", name: "Merlin", image: "merlin.png", cost: 6, isLegendary: true },
      
      // Cost 7 cards
      { id: "giant", name: "Giant", image: "giant.png", cost: 7 },
      { id: "moriarty", name: "Moriarty", image: "moriarty.png", cost: 7 },
      { id: "robin_hood", name: "Robin Hood", image: "robin_hood.png", cost: 7, isLegendary: true },
      { id: "three_not_so_little_pigs", name: "Three Not So Little Pigs", image: "three_not_so_little_pigs.png", cost: 7, isLegendary: true },
      { id: "blow_the_house_down", name: "Blow the House Down", image: "blow_the_house_down.png", cost: 7, isSpell: true },
      { id: "king_arthur", name: "King Arthur", image: "king_arthur.png", cost: 7, isLegendary: true },
      { id: "legion_of_the_dead", name: "Legion of the Dead", image: "legion_of_the_dead.png", cost: 7, isLegendary: true },
      { id: "paul_bunyan", name: "Paul Bunyan", image: "paul_bunyan.png", cost: 7 },
      { id: "snow_white", name: "Snow White", image: "snow_white.png", cost: 7, isLegendary: true },
      
      // Cost 8+ cards
      { id: "bandersnatch", name: "Bandersnatch", image: "bandersnatch.png", cost: 8 },
      { id: "the_kraken", name: "The Kraken", image: "the_kraken.png", cost: 8 },
      
      // Cost 10+ cards
      { id: "phantom_coachman", name: "Phantom Coachman", image: "phantom_coachman.png", cost: 10 },
      { id: "brandy", name: "Brandy", image: "Brandy.png", cost: 10, isLegendary: true },
      
      // October 2025 New Cards
      { id: "baby_bear", name: "Baby Bear", image: "Baby_Bear.png", cost: 2 },
      { id: "hare", name: "Hare", image: "Hare.png", cost: 5 },
      { id: "tortoise", name: "Tortoise", image: "Tortoise.png", cost: 6 },
      { id: "drop_bear", name: "Drop Bear", image: "Drop_Bear.png", cost: 4 },
      { id: "babe_the_blue_ox", name: "Babe the Blue Ox", image: "Babe_the_blue_ox.png", cost: 7 },
      { id: "winnie_the_pooh", name: "Winnie the Pooh", image: "Winnie_the_pooh.png", cost: 5, isLegendary: true },
      { id: "goldi", name: "Goldilocks", image: "Goldi.png", cost: 4, isLegendary: true },
      { id: "piglet", name: "Piglet", image: "Piglet.png", cost: 0 },
      { id: "thumbelina", name: "Thumbelina", image: "Thumbelina.png", cost: 0 },
      { id: "mary", name: "Mary", image: "Mary.png", cost: 1 },
      { id: "sinbad", name: "Sinbad", image: "Sinbad.png", cost: 5 },
      { id: "butcher", name: "Butcher", image: "Butcher.png", cost: 5 },
      { id: "baker", name: "Baker", image: "Baker.png", cost: 5 },
      { id: "captain_ahab", name: "Captain Ahab", image: "Captain_Ahab.png", cost: 4 },
      { id: "bigfoot", name: "Bigfoot", image: "Bigfoot.png", cost: 7 },
      { id: "bagheera", name: "Bagheera", image: "Bagheera.png", cost: 3 },
      { id: "wicked_stepmother", name: "Wicked Stepmother", image: "Wicked_Stepmother.png", cost: 4 },
      { id: "impundulu", name: "Impundulu", image: "Impundulu.png", cost: 6 },
      { id: "sandman", name: "Sandman", image: "Sandman.png", cost: 6 },
      { id: "chimera", name: "Chimera", image: "Chimera.png", cost: 6 },
      { id: "koschei", name: "Koschei", image: "KOschei.png", cost: 6 },
      { id: "momotaro", name: "Momotaro", image: "Momotaro.png", cost: 2 },
      { id: "tinker_bell", name: "Tinker Bell", image: "Tinker_Bell.png", cost: 1 },
      { id: "flying_dutchman", name: "The Flying Dutchman", image: "Flying_Dutchman.png", cost: 5 },
      { id: "yuki_onna", name: "Yuki-onna", image: "Yuki_onna.png", cost: 2 },
      { id: "mothman", name: "Mothman", image: "Mothman.png", cost: 2 },
      { id: "cake", name: "Cake", image: "Cake.png", cost: 2, isItem: true },
      { id: "run_over", name: "Run Over", image: "Run_Over.png", cost: 1, isSpell: true },
      { id: "obliterate", name: "Obliterate", image: "Obliterate.png", cost: 10, isSpell: true },
      { id: "first_aid", name: "First Aid", image: "First_Aid.png", cost: 1, isSpell: true },
      { id: "mortal_coil", name: "Mortal Coil", image: "Mortal_Coil.png", cost: 1, isItem: true }
    ]

    const excludeIds = usedCardIds || []
    console.log('Used card IDs:', excludeIds)

    // Helper function to balance costs between two sides
    function balanceCosts(cards: Card[]): { creator: Card[], joiner: Card[] } {
      if (cards.length !== 4) {
        console.error(`balanceCosts error: Expected exactly 4 cards but got ${cards.length}`)
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
      
      console.log(`balanceCosts result: Creator gets ${bestDistribution.creator.length} cards, Joiner gets ${bestDistribution.joiner.length} cards`)
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
      { type: 'pool', description: 'Cost Pool (2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,3,3,3,4,4)' },
      { type: 'pool', description: 'Cost Pool (2,2,2,3,3,3,4,4)' },
      { type: 'range', range: [5, 6], description: 'Range (5-6)' },
      { type: 'range', range: [6, 10], description: 'Range (6-10)' }
    ]

    for (let roundIndex = 0; roundIndex < roundStructures.length; roundIndex++) {
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
        // Select 4 spells with cost balancing (excluding legendaries)
        const availableSpells = cardDatabase.filter(card => 
          card.isSpell && !card.isLegendary && !usedIds.has(card.id)
        )
        
        for (let i = 0; i < 4 && i < availableSpells.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableSpells.length)
          const selected = availableSpells.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
        
      } else if (structure.type === 'cost') {
        // Select 4 cards of specific cost (including spells, but not legendaries)
        const availableForCost = cardDatabase.filter(card => 
          !card.isLegendary && 
          card.cost === structure.cost && !usedIds.has(card.id)
        )
        
        console.log(`Round ${roundNum} (cost ${structure.cost}): Found ${availableForCost.length} available cards:`, 
          availableForCost.map(c => `${c.name}${c.isSpell ? ' (spell)' : ''}`))
        
        for (let i = 0; i < 4 && i < availableForCost.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableForCost.length)
          const selected = availableForCost.splice(randomIndex, 1)[0]
          roundCards.push(selected)
          usedIds.add(selected.id)
        }
        
      } else if (structure.type === 'pool') {
        // Select 4 cards from cost pool [2,2,2,3,3,3,4,4] (including spells, but not legendaries)
        const costPool = [2, 2, 2, 3, 3, 3, 4, 4]
        const shuffledPool = [...costPool].sort(() => Math.random() - 0.5)
        
        for (let i = 0; i < 4; i++) {
          const targetCost = shuffledPool[i]
          const availableForCost = cardDatabase.filter(card => 
            !card.isLegendary && 
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
        // Select 4 cards from cost range (including spells, but not legendaries)
        const [minCost, maxCost] = structure.range!
        const availableInRange = cardDatabase.filter(card => 
          !card.isLegendary && 
          card.cost && card.cost >= minCost && card.cost <= maxCost && 
          !usedIds.has(card.id)
        )
        
        console.log(`Round ${roundNum} (range ${minCost}-${maxCost}): Found ${availableInRange.length} available cards:`, 
          availableInRange.map(c => `${c.name}${c.isSpell ? ' (spell)' : ''}`))
        
        // If we don't have enough cards, add fallback cards from the range that appeared before but weren't selected
        if (availableInRange.length < 4) {
          console.log(`Only found ${availableInRange.length} cards in range ${minCost}-${maxCost}, filling with any available cards`)
          
          // Get all cards in range regardless of usage (fallback)
          const allCardsInRange = cardDatabase.filter(card => 
            !card.isLegendary && 
            card.cost && card.cost >= minCost && card.cost <= maxCost
          )
          
          // Add cards from the range that we haven't added yet
          for (const card of allCardsInRange) {
            if (roundCards.length < 4 && !roundCards.find(c => c.id === card.id)) {
              availableInRange.push(card)
            }
          }
        }
        
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

    // Handle different draft types
    if (draftType === 'triple') {
      // Generate all 13 triple draft choices with strict uniqueness and guaranteed length
      const tripleChoices = generateTripleDraftChoices(excludeIds, cardDatabase)
      console.log(`Triple draft: generated ${tripleChoices.length} choice sets`)
      
      if (!tripleChoices || tripleChoices.length < 13) {
        throw new Error(`Unable to generate triple draft choices (got ${tripleChoices?.length || 0})`)
      }
      
      const tripleCardsToInsert = []
      
      for (let roundNum = 1; roundNum <= 13; roundNum++) {
        const choice = tripleChoices[roundNum - 1]
        
        if (choice && choice.length >= 3) {
          // Only add the first 3 cards for each round
          for (let cardIndex = 0; cardIndex < 3; cardIndex++) {
            const card = choice[cardIndex]
            tripleCardsToInsert.push({
              room_id: roomId,
              round_number: roundNum,
              side: 'both', // Triple draft cards are available to both players
              card_id: card.id,
              card_name: card.name,
              card_image: card.image,
              is_legendary: card.isLegendary || false,
              selected_by: null,
              turn_order: cardIndex + 1
            })
          }
        } else {
          console.warn(`Triple draft: missing or incomplete choice for round ${roundNum}`)
        }
      }
      
      // Set first pick player randomly and set initial phase
      const firstPickPlayer = Math.random() < 0.5 ? 'creator' : 'joiner'
      
      await supabase
        .from('rooms')
        .update({ 
          first_pick_player: firstPickPlayer,
          current_phase: 'first_pick'
        })
        .eq('id', roomId)

      const { error } = await supabase
        .from('room_cards')
        .insert(tripleCardsToInsert)

      if (error) {
        console.error('Error inserting triple draft cards:', error)
        throw error
      }

      console.log(`Successfully generated triple draft with ${tripleCardsToInsert.length} cards, first pick: ${firstPickPlayer}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          draftType: 'triple',
          totalCards: tripleCardsToInsert.length,
          firstPickPlayer
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (draftType === 'mega') {
      // Generate 36 cards for mega draft
      const megaCards = generateMegaDraftCards(excludeIds, cardDatabase)
      
      if (!megaCards || megaCards.length === 0) {
        throw new Error('Unable to generate mega draft cards')
      }
      
      const megaCardsToInsert = megaCards.map((card, index) => ({
        room_id: roomId,
        round_number: 1, // All cards are in round 1 for mega draft
        side: 'both', // Mega draft cards are available to both players
        card_id: card.id,
        card_name: card.name,
        card_image: card.image,
        is_legendary: card.isLegendary || false,
        selected_by: null,
        turn_order: index + 1 // Track position in the 6x6 grid
      }))
      
      // Set first pick player randomly
      const firstPickPlayer = Math.random() < 0.5 ? 'creator' : 'joiner'
      
      await supabase
        .from('rooms')
        .update({ 
          first_pick_player: firstPickPlayer,
          mega_draft_turn_count: 0
        })
        .eq('id', roomId)
      
      const { error } = await supabase
        .from('room_cards')
        .insert(megaCardsToInsert)

      if (error) {
        console.error('Error inserting mega draft cards:', error)
        throw error
      }

      console.log(`Successfully generated mega draft with ${megaCards.length} cards, first pick: ${firstPickPlayer}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          draftType: 'mega',
          totalCards: megaCardsToInsert.length,
          firstPickPlayer
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If generating all rounds for default draft, insert all cards at once
    if (round === 'all') {
      // First, get all cards already used in this room to prevent duplicates
      const { data: existingRoomCards } = await supabase
        .from('room_cards')
        .select('card_id')
        .eq('room_id', roomId)
      
      const roomUsedIds = new Set(existingRoomCards?.map(c => c.card_id) || [])
      console.log(`Room ${roomId} already has ${roomUsedIds.size} used cards`)
      
      // Randomize round order for this room
      const shuffledRoundStructures = [...roundStructures]
      for (let i = shuffledRoundStructures.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledRoundStructures[i], shuffledRoundStructures[j]] = [shuffledRoundStructures[j], shuffledRoundStructures[i]]
      }
      
      // Assign costs to pool rounds
      const costPool = [2, 2, 2, 3, 3, 3, 4, 4]
      const shuffledCostPool = [...costPool].sort(() => Math.random() - 0.5)
      let poolCostIndex = 0
      
      // Update pool rounds with assigned costs
      shuffledRoundStructures.forEach(structure => {
        if (structure.type === 'pool') {
          const assignedCost = shuffledCostPool[poolCostIndex]
          structure.type = 'cost'
          structure.cost = assignedCost
          structure.description = `Cost ${assignedCost} (from pool)`
          poolCostIndex++
        }
      })
      
      console.log('Randomized round order:', shuffledRoundStructures.map(s => s.description))
      
      // Regenerate all rounds with randomized order and proper used card tracking
      const randomizedRoundsCards: Array<{ round: number, creator: Card[], joiner: Card[] }> = []
      const globalUsedIds = new Set([...excludeIds, ...roomUsedIds])

      for (let roundIndex = 0; roundIndex < 13; roundIndex++) {
        const roundNum = roundIndex + 1
        const structure = shuffledRoundStructures[roundIndex]
        const roundCards: Card[] = []

        console.log(`Generating round ${roundNum}: ${structure.description}`)

        const isLegendaryRound = structure.type === 'legendary'
        
        if (isLegendaryRound) {
          const availableLegendary = cardDatabase.filter(card => 
            card.isLegendary && !globalUsedIds.has(card.id)
          )
          
          console.log(`Round ${roundNum} (legendary choice): Found ${availableLegendary.length} available legendary cards:`, 
            availableLegendary.map(c => c.name))
          
          for (let i = 0; i < 4 && i < availableLegendary.length; i++) {
            const randomIndex = Math.floor(Math.random() * availableLegendary.length)
            const selected = availableLegendary.splice(randomIndex, 1)[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          }
          
        } else if (structure.type === 'spell') {
          const availableSpells = cardDatabase.filter(card => 
            card.isSpell && !card.isLegendary && !globalUsedIds.has(card.id)
          )
          
          console.log(`Round ${roundNum} (spell choice): Found ${availableSpells.length} available spells:`, 
            availableSpells.map(c => `${c.name} (${c.cost})`))
          
          for (let i = 0; i < 4 && i < availableSpells.length; i++) {
            const randomIndex = Math.floor(Math.random() * availableSpells.length)
            const selected = availableSpells.splice(randomIndex, 1)[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          }
          
        } else if (structure.type === 'cost') {
          const availableForCost = cardDatabase.filter(card => 
            !card.isLegendary && 
            card.cost === structure.cost && !globalUsedIds.has(card.id)
          )
          
          console.log(`Round ${roundNum} (cost ${structure.cost}): Found ${availableForCost.length} available cards:`, 
            availableForCost.map(c => `${c.name}${c.isSpell ? ' (spell)' : ''}`))
          
          for (let i = 0; i < 4 && i < availableForCost.length; i++) {
            const randomIndex = Math.floor(Math.random() * availableForCost.length)
            const selected = availableForCost.splice(randomIndex, 1)[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          }
          
        } else if (structure.type === 'range') {
          const [minCost, maxCost] = structure.range!
          const availableInRange = cardDatabase.filter(card => 
            !card.isLegendary && 
            card.cost && card.cost >= minCost && card.cost <= maxCost && 
            !globalUsedIds.has(card.id)
          )
          
          console.log(`Round ${roundNum} (range ${minCost}-${maxCost}): Found ${availableInRange.length} available cards:`, 
            availableInRange.map(c => `${c.name}${c.isSpell ? ' (spell)' : ''}`))
          
          for (let i = 0; i < 4 && i < availableInRange.length; i++) {
            const randomIndex = Math.floor(Math.random() * availableInRange.length)
            const selected = availableInRange.splice(randomIndex, 1)[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          }
        }
        
        // Progressive fallback strategy if we don't have 4 cards yet
        if (roundCards.length < 4) {
          console.log(`Round ${roundNum} only found ${roundCards.length} cards, using progressive fallback`)
          
          // First fallback: cost 3-5 range (respecting legendary filtering)
          const fallbackCards = cardDatabase.filter(card => 
            (isLegendaryRound || !card.isLegendary) && 
            card.cost && card.cost >= 3 && card.cost <= 5 && 
            !globalUsedIds.has(card.id)
          )
          
          while (roundCards.length < 4 && fallbackCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * fallbackCards.length)
            const selected = fallbackCards.splice(randomIndex, 1)[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          }
          
          // Second fallback: any available card (respecting legendary filtering)
          if (roundCards.length < 4) {
            console.log(`Round ${roundNum} needs more cards, using any available cards`)
            const anyCards = cardDatabase.filter(card => 
              (isLegendaryRound || !card.isLegendary) && 
              !globalUsedIds.has(card.id)
            )
            
            while (roundCards.length < 4 && anyCards.length > 0) {
              const randomIndex = Math.floor(Math.random() * anyCards.length)
              const selected = anyCards.splice(randomIndex, 1)[0]
              roundCards.push(selected)
              globalUsedIds.add(selected.id)
            }
          }
        }
        
        // CRITICAL: Emergency fallback if still no cards
        if (roundCards.length === 0) {
          console.error(`CRITICAL: Round ${roundNum} has no cards, using emergency fallback`)
          const emergencyCards = cardDatabase.filter(card => !globalUsedIds.has(card.id))
          if (emergencyCards.length > 0) {
            const selected = emergencyCards[0]
            roundCards.push(selected)
            globalUsedIds.add(selected.id)
          } else {
            console.error(`FATAL: No cards available at all for round ${roundNum}`)
          }
        }

        // Balance and distribute cards for this round
        if (roundCards.length >= 4) {
          if (structure.type === 'spell' || structure.type === 'range') {
            const balanced = balanceCosts(roundCards.slice(0, 4))
            console.log(`Round ${roundNum} balanced - Creator: ${balanced.creator.length} cards, Joiner: ${balanced.joiner.length} cards`)
            randomizedRoundsCards.push({
              round: roundNum,
              creator: balanced.creator,
              joiner: balanced.joiner
            })
          } else {
            const shuffled = [...roundCards.slice(0, 4)].sort(() => Math.random() - 0.5)
            console.log(`Round ${roundNum} shuffled - Creator: 2 cards, Joiner: 2 cards`)
            randomizedRoundsCards.push({
              round: roundNum,
              creator: [shuffled[0], shuffled[1]],
              joiner: [shuffled[2], shuffled[3]]
            })
          }
        }
        
        console.log(`Round ${roundNum} cards:`, roundCards.slice(0, 4).map(c => `${c.name} (${c.cost})`))
      }

      const allCardsToInsert = randomizedRoundsCards.flatMap(({ round: roundNum, creator, joiner }) => [
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

      console.log(`Successfully generated all ${randomizedRoundsCards.length} rounds with ${allCardsToInsert.length} total cards`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          roundsGenerated: randomizedRoundsCards.length,
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
    const { data: existingRoundCards } = await supabase
      .from('room_cards')
      .select('*')
      .eq('room_id', roomId)
      .eq('round_number', round)

    if (existingRoundCards && existingRoundCards.length > 0) {
      console.log(`Round ${round} already has ${existingRoundCards.length} cards, skipping insertion`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Round ${round} cards already exist`,
          existingCardsCount: existingRoundCards.length 
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
    // Ensure all variables are properly scoped
    let errorRound = 'unknown'
    try {
      if (typeof round !== 'undefined') {
        errorRound = round
      }
    } catch (scopeError) {
      // Fallback if round is not in scope
      errorRound = 'unknown'
    }
    
    console.error(`Round ${errorRound} generate cards function error:`, error)
    return new Response(
      JSON.stringify({ 
        error: `Round ${errorRound} failed: ${error?.message || 'Unknown error'}`,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})