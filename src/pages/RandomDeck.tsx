import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
import { supabase } from "@/integrations/supabase/client"
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
    console.log('Starting random deck generation...')
    
    try {
      // Generate a temporary room ID for the random deck generation
      const tempRoomId = `random_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Calling backend with roomId:', tempRoomId)
      
      // Call the backend function to generate all 13 rounds of cards (4 cards per round)
      const { data, error } = await supabase.functions.invoke('generate-round-cards', {
        body: {
          roomId: tempRoomId,
          round: 'all',
          usedCardIds: [],
          roundType: 'default'
        }
      })

      console.log('Backend response:', { data, error })

      if (error) {
        console.error('Error calling generate-round-cards:', error)
        throw error
      }

      if (!data || !data.success) {
        throw new Error('Failed to generate cards from backend')
      }

      // The backend returns all cards for all rounds
      // Group them by round and randomly select 1 from each round
      const cardsByRound: { [key: number]: any[] } = {}
      
      // Group cards by round number
      data.cards?.forEach((card: any) => {
        const roundNum = card.round_number
        if (!cardsByRound[roundNum]) {
          cardsByRound[roundNum] = []
        }
        cardsByRound[roundNum].push(card)
      })

      const deck: RandomCard[] = []

      // For each round, randomly select 1 card from the 4 available
      for (let round = 1; round <= 13; round++) {
        const roundCards = cardsByRound[round] || []
        
        if (roundCards.length > 0) {
          // Randomly pick one card from this round
          const selectedCard = roundCards[Math.floor(Math.random() * roundCards.length)]
          
          deck.push({
            card_id: selectedCard.card_id,
            card_name: selectedCard.card_name,
            card_image: selectedCard.card_image,
            is_legendary: selectedCard.is_legendary,
            selection_order: round
          })
        } else {
          console.error(`No cards available for round ${round}`)
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