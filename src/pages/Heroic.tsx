import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { SEOHead } from "@/components/SEOHead"
import { CardImage } from "@/components/CardImage"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"
import { DeckDisplay } from "@/components/DeckDisplay"
import { Button } from "@/components/ui/button"
import { generateHeroicDeck } from "@/utils/heroicDeckGenerator"
import { getCardById } from "@/utils/cardData"
import { useIsMobile } from "@/hooks/use-mobile"

interface DeckCard {
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

const Heroic = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [deck, setDeck] = useState<DeckCard[]>(() => {
    const cards = generateHeroicDeck()
    return cards.map((card, index) => ({
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      selection_order: index + 1
    }))
  })

  const handleReroll = () => {
    const cards = generateHeroicDeck()
    setDeck(cards.map((card, index) => ({
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      selection_order: index + 1
    })))
  }

  const legendaryCard = deck.find(card => card.is_legendary)
  const normalCardsRaw = deck.filter(card => !card.is_legendary)
  
  const normalCards = [...normalCardsRaw].sort((a, b) => {
    const cardAData = getCardById(a.card_id)
    const cardBData = getCardById(b.card_id)
    const costA = cardAData?.cost ?? 0
    const costB = cardBData?.cost ?? 0
    if (costA !== costB) return costA - costB
    return a.card_name.localeCompare(b.card_name)
  })

  return (
    <>
      <SEOHead 
        title="World of Origins"
        description="Heroic deck generator with good-aligned cards for justice!"
        image="/og-images/deck-default.jpg"
        url="/heroic"
      />
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[hsl(210_100%_10%)] to-[hsl(45_100%_10%)]">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/skull-arrows.png')] opacity-5 bg-repeat bg-center" />
        
        <div className="relative z-10 flex-shrink-0 px-4 pt-4 pb-2">
          <div className="absolute top-4 left-4 z-20">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10"
            >
              <ArrowLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Back to Home</span>}
            </Button>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            ⚔️ Heroic Event ⚔️
          </h1>
          
          <p className="text-2xl md:text-2xl text-center mb-2 text-blue-300 font-bold drop-shadow-lg">
            Are you GOOD enough?
          </p>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-4">
          <div className="max-w-7xl mx-auto py-4 md:py-2">
            <div className="md:hidden flex justify-center">
              <div className="w-full max-w-2xl transform scale-80 origin-top">
                <DeckDisplay
                  cards={deck}
                  playerName="Heroic"
                  isOwn={true}
                  isDraftComplete={true}
                  hideTitle={true}
                />
              </div>
            </div>

            <div className="hidden md:flex items-start gap-8">
              <div className="space-y-1 w-56 flex-shrink-0">
                <h4 className="font-semibold text-blue-300 mb-3 text-lg">Deck List</h4>
                <div className="space-y-0.5 overflow-hidden">
                  {legendaryCard && (
                    <div className="text-yellow-400 font-medium border-l-2 border-yellow-500 pl-2 py-0.5 leading-tight text-sm">
                      {legendaryCard.card_name}
                    </div>
                  )}
                  {normalCards.map((card, index) => (
                    <div key={index} className="text-blue-200 border-l-2 border-blue-500/30 pl-2 py-0.5 leading-tight text-sm">
                      {card.card_name}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <DeckCodeDisplay cards={deck} />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 flex items-center">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-3 text-lg">Legendary</h4>
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

                <div className="flex-1">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">Cards</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {normalCards.map((card, index) => (
                      <div key={index} className="relative w-[150px] h-[210px]">
                        <div className="w-full h-full bg-white border border-blue-500/30 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
          </div>
        </div>

        <div className="relative z-10 flex-shrink-0 p-4 md:pb-4">
          <div className="flex justify-center">
            <Button
              onClick={handleReroll}
              size="lg"
              className="text-lg font-bold shadow-lg hover:shadow-blue-500/50 transition-all bg-blue-600/50 hover:bg-blue-600/70 text-white"
            >
              ⚔️ Give me something more heroic ⚔️
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Heroic
