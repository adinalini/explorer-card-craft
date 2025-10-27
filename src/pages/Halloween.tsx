import { useState } from "react"
import { SEOHead } from "@/components/SEOHead"
import { DeckDisplay } from "@/components/DeckDisplay"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"
import { Button } from "@/components/ui/button"
import { generateHalloweenDeck } from "@/utils/halloweenDeckGenerator"

interface DeckCard {
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

const Halloween = () => {
  const [deck, setDeck] = useState<DeckCard[]>(() => {
    const cards = generateHalloweenDeck()
    return cards.map((card, index) => ({
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      selection_order: index + 1
    }))
  })

  const handleReroll = () => {
    const cards = generateHalloweenDeck()
    setDeck(cards.map((card, index) => ({
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      selection_order: index + 1
    })))
  }

  return (
    <>
      <SEOHead 
        title="Halloween Event - Project O Zone"
        description="Special Halloween deck generator with spooky themed cards!"
        image="/og-images/deck-default.jpg"
        url="/halloween"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(25_100%_10%)] to-[hsl(0_100%_5%)]">
        {/* Halloween themed background */}
        <div className="absolute inset-0 bg-[url('/lovable-uploads/skull-arrows.png')] opacity-5 bg-repeat bg-center" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,119,0,0.5)]">
            🎃 Halloween Event 🎃
          </h1>
          
          <p className="text-2xl md:text-3xl text-center mb-8 text-orange-300 font-bold drop-shadow-lg">
            Are you EVIL enough?
          </p>

          <div className="max-w-6xl mx-auto">
            <DeckDisplay 
              cards={deck} 
              playerName="Halloween" 
              isOwn={true}
              isDraftComplete={true}
            />
            
            <div className="flex flex-col items-center gap-4 mt-8">
              <DeckCodeDisplay cards={deck} />
              
              <Button
                onClick={handleReroll}
                variant="orange"
                size="lg"
                className="text-lg font-bold shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                🎃 Give me more evil 🎃
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Halloween
