import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"
import { CardImage } from "@/components/CardImage"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { getRandomCards, getCardById } from "@/utils/cardData"
import { ArrowLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface RandomCard {
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

const RandomDeck = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [randomDeck, setRandomDeck] = useState<RandomCard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRandomDeck = async () => {
    setIsGenerating(true)
    console.log('Starting random deck generation using backend rules...')
    
    try {
      // Use the exact same round structures as the backend
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

      // Randomize the order just like the backend does for 'all' rounds
      const shuffledRoundStructures = [...roundStructures]
      for (let i = shuffledRoundStructures.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledRoundStructures[i], shuffledRoundStructures[j]] = [shuffledRoundStructures[j], shuffledRoundStructures[i]]
      }

      // Assign costs to pool rounds like the backend
      const costPool = [2, 2, 2, 3, 3, 3, 4, 4]
      const shuffledCostPool = [...costPool].sort(() => Math.random() - 0.5)
      let poolCostIndex = 0

      // Update pool rounds with assigned costs
      shuffledRoundStructures.forEach(structure => {
        if (structure.type === 'pool') {
          structure.type = 'cost'
          structure.cost = shuffledCostPool[poolCostIndex]
          poolCostIndex++
        }
      })

      const usedCardIds: string[] = []
      const deck: RandomCard[] = []

      // Generate cards for each round using the shuffled structure like backend
      for (let round = 1; round <= 13; round++) {
        const structure = shuffledRoundStructures[round - 1]
        let roundCards: any[] = []

        if (structure.type === 'legendary') {
          // Get legendary cards (not legendaries are excluded from other types)
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => card.isLegendary).slice(0, 4)
        } else if (structure.type === 'spell') {
          // Get spell cards (including items, excluding legendaries)
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => (card.isSpell || card.isItem) && !card.isLegendary).slice(0, 4)
        } else if (structure.type === 'cost') {
          // Get cards of exact cost (excluding legendaries like backend)
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => 
            !card.isLegendary && card.cost === structure.cost
          ).slice(0, 4)
        } else if (structure.type === 'range') {
          // Get cards within cost range (excluding legendaries)
          const allCards = getRandomCards(1000, usedCardIds)
          const [minCost, maxCost] = structure.range
          roundCards = allCards.filter(card => 
            !card.isLegendary && card.cost >= minCost && card.cost <= maxCost
          ).slice(0, 4)
        }

        // If we don't have enough cards, use progressive fallback strategy
        if (roundCards.length < 4) {
          console.log(`Round ${round} only found ${roundCards.length} cards, using fallback`)
          
          // First fallback: cost 3-5 range (excluding legendaries for non-legendary rounds)
          const allCards = getRandomCards(1000, [...usedCardIds, ...roundCards.map(c => c.id)])
          const isLegendaryRound = structure.type === 'legendary'
          const fallbackCards = allCards.filter(card => 
            (isLegendaryRound || !card.isLegendary) && card.cost >= 3 && card.cost <= 5
          )
          
          while (roundCards.length < 4 && fallbackCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * fallbackCards.length)
            const selected = fallbackCards.splice(randomIndex, 1)[0]
            roundCards.push(selected)
          }
          
          // Second fallback: any available card (excluding legendaries for non-legendary rounds)
          if (roundCards.length < 4) {
            console.log(`Round ${round} still needs more cards, using any available`)
            const anyCards = getRandomCards(1000, [...usedCardIds, ...roundCards.map(c => c.id)])
            const anyFallback = anyCards.filter(card => isLegendaryRound || !card.isLegendary)
            
            while (roundCards.length < 4 && anyFallback.length > 0) {
              const randomIndex = Math.floor(Math.random() * anyFallback.length)
              const selected = anyFallback.splice(randomIndex, 1)[0]
              roundCards.push(selected)
            }
          }
        }

        // CRITICAL: Always ensure we have at least 1 card for this round
        if (roundCards.length === 0) {
          console.error(`CRITICAL: No cards available for round ${round}, using emergency fallback`)
          // Emergency fallback: get ANY card that hasn't been used
          const emergencyCards = getRandomCards(1000, usedCardIds)
          if (emergencyCards.length > 0) {
            roundCards.push(emergencyCards[0])
          }
        }

        // Randomly select 1 card from the generated cards for this round
        if (roundCards.length > 0) {
          const selectedCard = roundCards[Math.floor(Math.random() * roundCards.length)]
          
          deck.push({
            card_id: selectedCard.id,
            card_name: selectedCard.name,
            card_image: selectedCard.image,
            is_legendary: selectedCard.isLegendary,
            selection_order: round
          })

          // Only mark the selected card as used
          usedCardIds.push(selectedCard.id)
        } else {
          console.error(`FATAL: Could not generate card for round ${round}`)
        }
      }

      console.log('Generated deck with', deck.length, 'cards')
      
      // Validation: Ensure exactly 13 cards
      if (deck.length !== 13) {
        console.error(`ERROR: Deck has ${deck.length} cards instead of 13!`)
      }
      
      // Validation: Check for duplicate legendaries
      const legendaryCards = deck.filter(card => card.is_legendary)
      if (legendaryCards.length > 1) {
        console.error(`ERROR: Deck has ${legendaryCards.length} legendary cards:`, 
          legendaryCards.map(c => c.card_name))
      }
      
      // Validation: Check for duplicate cards
      const cardIds = deck.map(card => card.card_id)
      const uniqueIds = new Set(cardIds)
      if (cardIds.length !== uniqueIds.size) {
        console.error('ERROR: Deck has duplicate cards!')
      }
      
      setRandomDeck(deck)
    } catch (error) {
      console.error('Error generating random deck:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    generateRandomDeck()
  }, [])

  // Separate legendary and normal cards
  const legendaryCard = randomDeck.find(card => card.is_legendary)
  const normalCardsRaw = randomDeck.filter(card => !card.is_legendary)
  
  // Sort normal cards by cost first, then alphabetically
  const normalCards = [...normalCardsRaw].sort((a, b) => {
    const cardAData = getCardById(a.card_id)
    const cardBData = getCardById(b.card_id)
    const costA = cardAData?.cost ?? 0
    const costB = cardBData?.cost ?? 0
    if (costA !== costB) return costA - costB
    return a.card_name.localeCompare(b.card_name)
  })

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      {/* Header - fixed at top */}
      <div className="relative z-10 flex-shrink-0 px-4 pt-4 pb-2">
        <div className="absolute top-4 left-4 z-20">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Back to Home</span>}
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle className="text-foreground hover:bg-accent" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 text-foreground drop-shadow-2xl">
          Random Deck
        </h1>
        
        <p className="text-2xl md:text-2xl text-center mb-2 text-muted-foreground font-bold drop-shadow-lg">
          Good luck have fun!
        </p>
      </div>

      {/* Content area - scrollable on mobile, conditional scroll on desktop */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4">
        <div className="max-w-7xl mx-auto py-4 md:py-2">
          {randomDeck.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Generating random deck...
            </div>
          ) : (
            <>
              {/* Mobile view - use DeckDisplay component */}
              <div className="md:hidden flex justify-center">
                <div className="w-full max-w-2xl transform scale-80 origin-top">
                  <DeckDisplay
                    cards={randomDeck}
                    playerName="Random"
                    isOwn={true}
                    isDraftComplete={true}
                    hideTitle={true}
                  />
                </div>
              </div>

              {/* Desktop view - Custom Deck Display */}
              <div className="hidden md:flex items-start gap-8">
                {/* Deck List - Left side */}
                <div className="space-y-1 w-56 flex-shrink-0">
                  <h4 className="font-semibold text-foreground mb-3 text-lg">Deck List</h4>
                  <div className="space-y-0.5 overflow-hidden">
                    {legendaryCard && (
                      <div className="text-yellow-400 font-medium border-l-2 border-yellow-500 pl-2 py-0.5 leading-tight text-sm">
                        {legendaryCard.card_name}
                      </div>
                    )}
                    {normalCards.map((card, index) => (
                      <div key={index} className="text-muted-foreground border-l-2 border-border pl-2 py-0.5 leading-tight text-sm">
                        {card.card_name}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <DeckCodeDisplay cards={randomDeck} />
                  </div>
                </div>

                {/* Deck Visual - Right side */}
                <div className="flex gap-6">
                  {/* Legendary Card - Vertically centered */}
                  <div className="flex-shrink-0 flex items-center">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 text-lg">Legendary</h4>
                      {legendaryCard && (
                        <div className="relative w-[200px] h-[280px]">
                          <div className="w-full h-full bg-white border-2 border-yellow-500 rounded-lg overflow-hidden shadow-lg shadow-yellow-500/30">
                            <CardImage
                              cardId={legendaryCard.card_id}
                              cardName={legendaryCard.card_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Normal Cards Grid */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Cards</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {normalCards.map((card, index) => (
                        <div key={index} className="relative w-[150px] h-[210px]">
                          <div className="w-full h-full bg-white border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <CardImage
                              cardId={card.card_id}
                              cardName={card.card_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Button - fixed at bottom */}
      <div className="relative z-10 flex-shrink-0 p-4 md:pb-4">
        <div className="flex justify-center">
          <Button
            onClick={generateRandomDeck}
            disabled={isGenerating}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            {isGenerating ? "Generating..." : "Give me a random deck 🎲"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RandomDeck
