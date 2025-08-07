import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
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
      // Implement the same round structures as the backend
      const roundStructures = [
        { type: 'legendary', count: 2 },    // Round 1: 2 legendary cards
        { type: 'spell', count: 2 },        // Round 2: 2 spell cards
        { type: 'cost', min: 1, max: 3, count: 2 },     // Round 3: 2 low cost cards
        { type: 'cost', min: 4, max: 5, count: 2 },     // Round 4: 2 mid cost cards
        { type: 'cost', min: 6, max: 10, count: 2 },    // Round 5: 2 high cost cards
        { type: 'pool', count: 2 },         // Round 6-13: 2 random cards each
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 },
        { type: 'pool', count: 2 }
      ]

      const usedCardIds: string[] = []
      const deck: RandomCard[] = []

      // Generate cards for each round using the same logic as backend
      for (let round = 1; round <= 13; round++) {
        const structure = roundStructures[round - 1]
        let roundCards: any[] = []

        if (structure.type === 'legendary') {
          // Get legendary cards
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => card.isLegendary).slice(0, 4)
        } else if (structure.type === 'spell') {
          // Get spell cards  
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => card.isSpell).slice(0, 4)
        } else if (structure.type === 'cost') {
          // Get cards within cost range
          const allCards = getRandomCards(1000, usedCardIds)
          roundCards = allCards.filter(card => 
            card.cost >= structure.min && card.cost <= structure.max
          ).slice(0, 4)
        } else if (structure.type === 'pool') {
          // Get random cards
          roundCards = getRandomCards(4, usedCardIds)
        }

        // If we don't have enough cards, fill with any available cards as fallback
        if (roundCards.length < 4) {
          const additionalCards = getRandomCards(4 - roundCards.length, 
            [...usedCardIds, ...roundCards.map(c => c.id)])
          roundCards = [...roundCards, ...additionalCards]
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
    <div className="min-h-screen">
      {/* Purple gradient background only until "Good luck have fun!" */}
      <div className="bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] p-4 pb-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Title */}
          <div className="text-center space-y-4 pb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
              Random Deck
            </h1>
            <p className="text-xl text-white/80">
              Good luck have fun!
            </p>
          </div>
        </div>
      </div>

      {/* White background for the rest */}
      <div className="bg-white min-h-screen p-4 pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Deck Display */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {randomDeck.length > 0 ? (
                <DeckDisplay
                  cards={randomDeck}
                  playerName="Random"
                  isOwn={true}
                  isDraftComplete={true}
                />
              ) : (
                <div className="text-center text-gray-600">
                  Generating random deck...
                </div>
              )}
            </div>
          </div>

          {/* Generate button - responsive positioning */}
          <div className="flex justify-center pb-8">
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
    </div>
  )
}

export default RandomDeck