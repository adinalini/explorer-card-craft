import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { getRandomCards, getCardById } from "@/utils/cardData"
import { ArrowLeft } from "lucide-react"

interface RandomCard {
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

const RandomDeck = () => {
  const navigate = useNavigate()
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
          // Get spell cards  
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => card.isSpell).slice(0, 4)
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

        // If we don't have enough cards, use fallback like backend (cost 3-5 range)
        if (roundCards.length < 4) {
          const allCards = getRandomCards(1000, [...usedCardIds, ...roundCards.map(c => c.id)])
          const fallbackCards = allCards.filter(card => 
            !card.isLegendary && card.cost >= 3 && card.cost <= 5
          )
          
          while (roundCards.length < 4 && fallbackCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * fallbackCards.length)
            const selected = fallbackCards.splice(randomIndex, 1)[0]
            roundCards.push(selected)
          }
        }

        // Randomly select 1 card from the 4 generated for this round
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
          console.error(`No cards available for round ${round}`)
        }
      }

      console.log('Generated deck with', deck.length, 'cards')
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Purple gradient background only until "Good luck have fun!" */}
      <div className="bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-foreground hover:bg-accent flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Button>
            <ThemeToggle className="text-foreground hover:bg-accent" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2 pb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[hsl(260_25%_8%)] dark:text-[hsl(0_0%_100%)] drop-shadow-2xl">
              Random Deck
            </h1>
            <p className="text-xl text-[hsl(260_25%_8%)] dark:text-[hsl(0_0%_100%)]">
              Good luck have fun!
            </p>
          </div>
        </div>
      </div>

      {/* White background for the rest - flex-1 to take remaining space with overflow */}
      <div className="bg-background flex-1 flex flex-col overflow-auto">
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col px-4 py-4">
          {/* Deck Display - takes available space with mobile scaling */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl transform scale-80 md:scale-100 origin-top">
              {randomDeck.length > 0 ? (
                <DeckDisplay
                  cards={randomDeck}
                  playerName="Random"
                  isOwn={true}
                  isDraftComplete={true}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  Generating random deck...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed button at bottom - always visible */}
      <div className="bg-background border-t border-border p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Button
            onClick={generateRandomDeck}
            disabled={isGenerating}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-semibold rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105"
          >
            {isGenerating ? "Generating..." : "Give me a random deck 🎲"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RandomDeck