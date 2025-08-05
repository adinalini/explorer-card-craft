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
    
    const { roomId, round, usedCardIds, roundType } = await req.json()
    
    if (!roomId || !round) {
      throw new Error('Missing required parameters')
    }

    // Import card database
    const cardDatabase: Card[] = [
      { id: "ali_baba", name: "Ali Baba", image: "ali_baba.png", cost: 3 },
      { id: "alice", name: "Alice", image: "alice.png", cost: 2 },
      { id: "axe_throw", name: "Axe Throw", image: "axe_throw.png", cost: 2, isSpell: true },
      { id: "baloo", name: "Baloo", image: "baloo.png", cost: 4 },
      { id: "bandersnatch", name: "Bandersnatch", image: "bandersnatch.png", cost: 7 },
      { id: "banshee", name: "Banshee", image: "banshee.png", cost: 5 },
      { id: "beast", name: "Beast", image: "beast.png", cost: 6 },
      { id: "beautiful_swan", name: "Beautiful Swan", image: "beautiful_swan.png", cost: 3 },
      { id: "big_bad_wolf", name: "Big Bad Wolf", image: "big_bad_wolf.png", cost: 5 },
      { id: "billy", name: "Billy", image: "billy.png", cost: 2 },
      { id: "black_knight", name: "Black Knight", image: "black_knight.png", cost: 6 },
      { id: "blow_the_house_down", name: "Blow the House Down", image: "blow_the_house_down.png", cost: 3, isSpell: true },
      { id: "bridge_troll", name: "Bridge Troll", image: "bridge_troll.png", cost: 5 },
      { id: "bullseye", name: "Bullseye", image: "bullseye.png", cost: 1, isSpell: true },
      { id: "card_soldier", name: "Card Soldier", image: "card_soldier.png", cost: 2 },
      { id: "cheshire", name: "Cheshire", image: "cheshire.png", cost: 3 },
      { id: "concentrate", name: "Concentrate", image: "concentrate.png", cost: 1, isSpell: true },
      { id: "cowardly_lion", name: "Cowardly Lion", image: "cowardly_lion.png", cost: 4 },
      { id: "dark_omen", name: "Dark Omen", image: "dark_omen.png", cost: 2, isSpell: true },
      { id: "death", name: "Death", image: "death.png", cost: 12, isLegendary: true },
      { id: "defense_matrix", name: "Defense Matrix", image: "defense_matrix.png", cost: 4, isSpell: true },
      { id: "don_quixote", name: "Don Quixote", image: "don_quixote.png", cost: 5 },
      { id: "dorothy", name: "Dorothy", image: "dorothy.png", cost: 3 },
      { id: "dr_frank", name: "Dr. Frank", image: "dr_frank.png", cost: 6 },
      { id: "dracula", name: "Dracula", image: "dracula.png", cost: 8 },
      { id: "en_passant", name: "En Passant", image: "en_passant.png", cost: 3, isSpell: true },
      { id: "fairy_godmother", name: "Fairy Godmother", image: "fairy_godmother.png", cost: 7 },
      { id: "flying_monkey", name: "Flying Monkey", image: "flying_monkey.png", cost: 3 },
      { id: "franks_monster", name: "Frank's Monster", image: "franks_monster.png", cost: 8 },
      { id: "freeze", name: "Freeze", image: "freeze.png", cost: 1, isSpell: true },
      { id: "friar_tuck", name: "Friar Tuck", image: "friar_tuck.png", cost: 4 },
      { id: "galahad", name: "Galahad", image: "galahad.png", cost: 6 },
      { id: "giant", name: "Giant", image: "giant.png", cost: 7 },
      { id: "glinda", name: "Glinda", image: "glinda.png", cost: 6 },
      { id: "golden_egg", name: "Golden Egg", image: "golden_egg.png", cost: 2 },
      { id: "golden_goose", name: "Golden Goose", image: "golden_goose.png", cost: 4 },
      { id: "goldilocks", name: "Goldilocks", image: "goldilocks.png", cost: 3 },
      { id: "grendel", name: "Grendel", image: "grendel.png", cost: 8 },
      { id: "guy_of_gisborne", name: "Guy of Gisborne", image: "guy_of_gisborne.png", cost: 5 },
      { id: "headless_horseman", name: "Headless Horseman", image: "headless_horseman.png", cost: 6 },
      { id: "heroic_charge", name: "Heroic Charge", image: "heroic_charge.png", cost: 4, isSpell: true },
      { id: "huntsman", name: "Huntsman", image: "huntsman.png", cost: 4 },
      { id: "hyde", name: "Hyde", image: "hyde.png", cost: 7 },
      { id: "imhotep", name: "Imhotep", image: "imhotep.png", cost: 9, isLegendary: true },
      { id: "its_alive", name: "It's Alive!", image: "its_alive.png", cost: 5, isSpell: true },
      { id: "jack", name: "Jack", image: "jack.png", cost: 3 },
      { id: "jack_in_the_box", name: "Jack in the Box", image: "jack_in_the_box.png", cost: 2 },
      { id: "jekyll", name: "Jekyll", image: "jekyll.png", cost: 4 },
      { id: "kanga", name: "Kanga", image: "kanga.png", cost: 5 },
      { id: "king_arthur", name: "King Arthur", image: "king_arthur.png", cost: 10, isLegendary: true },
      { id: "king_shahryar", name: "King Shahryar", image: "king_shahryar.png", cost: 8 },
      { id: "lady_of_the_lake", name: "Lady of the Lake", image: "lady_of_the_lake.png", cost: 7 },
      { id: "lancelot", name: "Lancelot", image: "lancelot.png", cost: 7 },
      { id: "legion_of_the_dead", name: "Legion of the Dead", image: "legion_of_the_dead.png", cost: 6, isSpell: true },
      { id: "lightning_strike", name: "Lightning Strike", image: "lightning_strike.png", cost: 3, isSpell: true },
      { id: "little_john", name: "Little John", image: "little_john.png", cost: 5 },
      { id: "mad_hatter", name: "Mad Hatter", image: "mad_hatter.png", cost: 4 },
      { id: "marian", name: "Marian", image: "marian.png", cost: 4 },
      { id: "merlin", name: "Merlin", image: "merlin.png", cost: 9, isLegendary: true },
      { id: "moby", name: "Moby", image: "moby.png", cost: 8 },
      { id: "morgiana", name: "Morgiana", image: "morgiana.png", cost: 3 },
      { id: "moriarty", name: "Moriarty", image: "moriarty.png", cost: 7 },
      { id: "mouse", name: "Mouse", image: "mouse.png", cost: 1 },
      { id: "mowgli", name: "Mowgli", image: "mowgli.png", cost: 3 },
      { id: "mummy", name: "Mummy", image: "mummy.png", cost: 5 },
      { id: "musketeer", name: "Musketeer", image: "musketeer.png", cost: 4 },
      { id: "not_so_little_pig", name: "Not So Little Pig", image: "not_so_little_pig.png", cost: 3 },
      { id: "ogre", name: "Ogre", image: "ogre.png", cost: 6 },
      { id: "pegasus", name: "Pegasus", image: "pegasus.png", cost: 6 },
      { id: "phantom_coachman", name: "Phantom Coachman", image: "phantom_coachman.png", cost: 5 },
      { id: "piggy_bank", name: "Piggy Bank", image: "piggy_bank.png", cost: 1 },
      { id: "prince_charming", name: "Prince Charming", image: "prince_charming.png", cost: 5 },
      { id: "princess_aurora", name: "Princess Aurora", image: "princess_aurora.png", cost: 6 },
      { id: "quasimodo", name: "Quasimodo", image: "quasimodo.png", cost: 5 },
      { id: "queen_guinevere", name: "Queen Guinevere", image: "queen_guinevere.png", cost: 6 },
      { id: "rain_of_arrows", name: "Rain of Arrows", image: "rain_of_arrows.png", cost: 5, isSpell: true },
      { id: "red", name: "Red", image: "red.png", cost: 3 },
      { id: "redcap", name: "Redcap", image: "redcap.png", cost: 4 },
      { id: "reinforcements", name: "Reinforcements", image: "reinforcements.png", cost: 6, isSpell: true },
      { id: "robin_hood", name: "Robin Hood", image: "robin_hood.png", cost: 6 },
      { id: "roo", name: "Roo", image: "roo.png", cost: 2 },
      { id: "rumple", name: "Rumple", image: "rumple.png", cost: 7 },
      { id: "scarecrow", name: "Scarecrow", image: "scarecrow.png", cost: 3 },
      { id: "scorpion", name: "Scorpion", image: "scorpion.png", cost: 2 },
      { id: "sea_witch", name: "Sea Witch", image: "sea_witch.png", cost: 6 },
      { id: "searing_light", name: "Searing Light", image: "searing_light.png", cost: 4, isSpell: true },
      { id: "sheriff_of_nottingham", name: "Sheriff of Nottingham", image: "sheriff_of_nottingham.png", cost: 5 },
      { id: "sherlock", name: "Sherlock", image: "sherlock.png", cost: 5 },
      { id: "shield_maiden", name: "Shield Maiden", image: "shield_maiden.png", cost: 4 },
      { id: "siren", name: "Siren", image: "siren.png", cost: 4 },
      { id: "snow_white", name: "Snow White", image: "snow_white.png", cost: 4 },
      { id: "soldier", name: "Soldier", image: "soldier.png", cost: 2 },
      { id: "soul_surge", name: "Soul Surge", image: "soul_surge.png", cost: 3, isSpell: true },
      { id: "striga", name: "Striga", image: "striga.png", cost: 6 },
      { id: "the_green_knight", name: "The Green Knight", image: "the_green_knight.png", cost: 7 },
      { id: "the_kraken", name: "The Kraken", image: "the_kraken.png", cost: 9, isLegendary: true },
      { id: "the_white_queen", name: "The White Queen", image: "the_white_queen.png", cost: 7 },
      { id: "three_blind_mice", name: "Three Blind Mice", image: "three_blind_mice.png", cost: 3 },
      { id: "three_musketeers", name: "Three Musketeers", image: "three_musketeers.png", cost: 7 },
      { id: "three_not_so_little_pigs", name: "Three Not So Little Pigs", image: "three_not_so_little_pigs.png", cost: 6 },
      { id: "tin_woodman", name: "Tin Woodman", image: "tin_woodman.png", cost: 4 },
      { id: "trash_for_treasure", name: "Trash for Treasure", image: "trash_for_treasure.png", cost: 2, isSpell: true },
      { id: "trojan_horse", name: "Trojan Horse", image: "trojan_horse.png", cost: 5 },
      { id: "twister_toss", name: "Twister Toss", image: "twister_toss.png", cost: 1, isSpell: true },
      { id: "ugly_duckling", name: "Ugly Duckling", image: "ugly_duckling.png", cost: 2 },
      { id: "underworld_flare", name: "Underworld Flare", image: "underworld_flare.png", cost: 7, isSpell: true },
      { id: "watson", name: "Watson", image: "watson.png", cost: 3 },
      { id: "white_rabbit", name: "White Rabbit", image: "white_rabbit.png", cost: 2 },
      { id: "wicked_witch_of_the_west", name: "Wicked Witch of the West", image: "wicked_witch_of_the_west.png", cost: 7 },
      { id: "zorro", name: "Zorro", image: "zorro.png", cost: 5 }
    ]

    // Generate cards based on round type
    let creatorCards: Card[] = []
    let joinerCards: Card[] = []
    const excludeIds = usedCardIds || []

    if (roundType?.isLegendary) {
      // Legendary round - 1 legendary card per side
      const availableLegendary = cardDatabase.filter(card => 
        card.isLegendary && !excludeIds.includes(card.id)
      )
      
      if (availableLegendary.length >= 2) {
        const shuffled = [...availableLegendary].sort(() => Math.random() - 0.5)
        creatorCards = [shuffled[0]]
        joinerCards = [shuffled[1]]
      }
    } else if (roundType?.isSpell) {
      // Spell round - balanced cost distribution with 1 card per side
      const availableSpells = cardDatabase.filter(card => 
        card.isSpell && !excludeIds.includes(card.id)
      )
      
      if (availableSpells.length >= 2) {
        const attempts = 100
        let bestCreatorCards: Card[] = []
        let bestJoinerCards: Card[] = []
        let minDifference = Infinity

        for (let attempt = 0; attempt < attempts; attempt++) {
          const shuffled = [...availableSpells].sort(() => Math.random() - 0.5)
          const tempCreatorCard = shuffled[0]
          const tempJoinerCard = shuffled[1]
          
          const difference = Math.abs((tempCreatorCard.cost || 0) - (tempJoinerCard.cost || 0))
          
          if (difference <= 2) {
            creatorCards = [tempCreatorCard]
            joinerCards = [tempJoinerCard]
            break
          }
          
          if (difference < minDifference) {
            minDifference = difference
            bestCreatorCards = [tempCreatorCard]
            bestJoinerCards = [tempJoinerCard]
          }
        }
        
        // Use best attempt if no perfect balance found
        if (creatorCards.length === 0) {
          creatorCards = bestCreatorCards
          joinerCards = bestJoinerCards
        }
      }
    } else {
      // Regular round - specific cost selection with 1 card per side
      // Cost progression: round 1=1cost, round 2=2cost, ..., round 12=12cost
      const targetCost = round
      
      const availableCards = cardDatabase.filter(card => 
        !card.isLegendary && 
        !card.isSpell && 
        !excludeIds.includes(card.id) &&
        card.cost === targetCost
      )
      
      if (availableCards.length >= 2) {
        const shuffled = [...availableCards].sort(() => Math.random() - 0.5)
        creatorCards = [shuffled[0]]
        joinerCards = [shuffled[1]]
      } else {
        // Fallback to nearby costs if exact cost not available
        const fallbackCosts = [targetCost - 1, targetCost + 1, targetCost - 2, targetCost + 2]
        for (const fallbackCost of fallbackCosts) {
          if (fallbackCost < 1 || fallbackCost > 12) continue
          
          const fallbackCards = cardDatabase.filter(card => 
            !card.isLegendary && 
            !card.isSpell && 
            !excludeIds.includes(card.id) &&
            card.cost === fallbackCost
          )
          
          if (fallbackCards.length >= 2) {
            const shuffled = [...fallbackCards].sort(() => Math.random() - 0.5)
            creatorCards = [shuffled[0]]
            joinerCards = [shuffled[1]]
            break
          }
        }
      }
    }

    if (creatorCards.length === 0 || joinerCards.length === 0) {
      console.error('Failed to generate cards:', { round, roundType, excludeIds, availableCards: cardDatabase.length })
      throw new Error(`Unable to generate sufficient cards for round ${round}. CreatorCards: ${creatorCards.length}, JoinerCards: ${joinerCards.length}`)
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