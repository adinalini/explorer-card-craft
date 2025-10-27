import { useState } from "react"
import { SEOHead } from "@/components/SEOHead"
import { CardImage } from "@/components/CardImage"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"
import { DeckDisplay } from "@/components/DeckDisplay"
import { Button } from "@/components/ui/button"
import { generateHalloweenDeck } from "@/utils/halloweenDeckGenerator"
import { getCardById } from "@/utils/cardData"

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

  // Separate legendary and normal cards
  const legendaryCard = deck.find(card => card.is_legendary)
  const normalCardsRaw = deck.filter(card => !card.is_legendary)
  
  // Sort normal cards by cost first, then alphabetically
  const normalCards = [...normalCardsRaw].sort((a, b) => {
    const cardAData = getCardById(a.card_id)
    const cardBData = getCardById(b.card_id)
    
    const costA = cardAData?.cost ?? 0
    const costB = cardBData?.cost ?? 0
    
    if (costA !== costB) {
      return costA - costB
    }
    
    return a.card_name.localeCompare(b.card_name)
  })

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
        
        <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,119,0,0.5)]">
            🎃 Halloween Event 🎃
          </h1>
          
          <p className="text-2xl md:text-3xl text-center mb-8 text-orange-300 font-bold drop-shadow-lg">
            Are you EVIL enough?
          </p>

          <div className="max-w-7xl mx-auto flex-1 flex flex-col">
            {/* Mobile view - use DeckDisplay component */}
            <div className="md:hidden flex justify-center mb-8">
              <div className="w-full max-w-2xl transform scale-80 origin-top">
                <DeckDisplay
                  cards={deck}
                  playerName="Halloween"
                  isOwn={true}
                  isDraftComplete={true}
                />
              </div>
            </div>

            {/* Desktop view - Custom Deck Display */}
            <div className="hidden md:flex items-start gap-8 mb-8">
              {/* Deck List - Left side */}
              <div className="space-y-1 w-56 flex-shrink-0">
                <h4 className="font-semibold text-orange-300 mb-3 text-lg">Deck List</h4>
                <div className="space-y-0.5 overflow-hidden">
                  {legendaryCard && (
                    <div className="text-yellow-400 font-medium border-l-2 border-yellow-500 pl-2 py-0.5 leading-tight text-sm">
                      {legendaryCard.card_name}
                    </div>
                  )}
                  {normalCards.map((card, index) => (
                    <div key={index} className="text-orange-200 border-l-2 border-orange-500/30 pl-2 py-0.5 leading-tight text-sm">
                      {card.card_name}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <DeckCodeDisplay cards={deck} />
                </div>
              </div>

              {/* Deck Visual - Right side */}
              <div className="flex gap-6">
                {/* Legendary Card - Vertically centered */}
                <div className="flex-shrink-0 flex items-center">
                  <div>
                    <h4 className="font-semibold text-orange-300 mb-3 text-lg">Legendary</h4>
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
                  <h4 className="font-semibold text-orange-300 mb-3 text-lg">Cards</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {normalCards.map((card, index) => (
                      <div key={index} className="relative w-[150px] h-[210px]">
                        <div className="w-full h-full bg-white border border-orange-500/30 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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

            {/* Button at bottom */}
            <div className="flex justify-center mt-auto pb-8">
              <Button
                onClick={handleReroll}
                variant="orange"
                size="lg"
                className="text-lg font-bold shadow-lg hover:shadow-orange-500/50 transition-all bg-orange-600/50 hover:bg-orange-600/70"
              >
                🎃 Give me something more evil 🎃
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Halloween
