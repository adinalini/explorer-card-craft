import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
import { getRandomCards } from "@/utils/cardData"
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
    
    try {
      const deck: RandomCard[] = []
      let selectionOrder = 1

      // Generate cards for all 13 rounds
      for (let round = 1; round <= 13; round++) {
        // Get 2 random cards for this round (creator and joiner pools)
        const roundCards = getRandomCards(2, [])
        
        if (roundCards.length > 0) {
          // Randomly pick one of the two cards
          const selectedCard = roundCards[Math.floor(Math.random() * roundCards.length)]
          
          deck.push({
            card_id: selectedCard.id,
            card_name: selectedCard.name,
            card_image: selectedCard.image,
            is_legendary: selectedCard.isLegendary,
            selection_order: selectionOrder++
          })
        }
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