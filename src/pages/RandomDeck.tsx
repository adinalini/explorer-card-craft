import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DeckDisplay } from "@/components/DeckDisplay"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"
import { CardImage } from "@/components/CardImage"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cardDatabase, Card, getCardById } from "@/utils/cardData"
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
    
    try {
      // Use only cards from the latest patch (inDraftPool === true)
      const latestPatchCards = cardDatabase.filter(c => c.inDraftPool !== false && c.cost !== undefined)
      
      const shuffleArray = <T,>(arr: T[]): T[] => {
        const s = [...arr]
        for (let i = s.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [s[i], s[j]] = [s[j], s[i]]
        }
        return s
      }
      
      const getFromPool = (filter: (c: Card) => boolean, count: number, used: Set<string>): Card[] => {
        const available = shuffleArray(latestPatchCards.filter(c => !used.has(c.id) && filter(c)))
        return available.slice(0, count)
      }

      const usedIds = new Set<string>()
      const deck: RandomCard[] = []

      // 1. 1 random legendary
      const legendaries = getFromPool(c => c.isLegendary, 1, usedIds)
      legendaries.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: true, selection_order: deck.length + 1 }) })

      // 2. 1 spell/item (non-legendary)
      const spells = getFromPool(c => (c.isSpell || c.isItem) && !c.isLegendary, 1, usedIds)
      spells.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })

      // 3. Cost-based picks: 1 each from cost 1,2,3,4,5
      for (const cost of [1, 2, 3, 4, 5]) {
        const picks = getFromPool(c => c.cost === cost && !c.isLegendary, 1, usedIds)
        picks.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })
      }

      // 4. 1 from cost 5-6 range
      const midRange = getFromPool(c => c.cost! >= 5 && c.cost! <= 6 && !c.isLegendary, 1, usedIds)
      midRange.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })

      // 5. 1 from cost 7-10 range
      const highRange = getFromPool(c => c.cost! >= 7 && c.cost! <= 10 && !c.isLegendary, 1, usedIds)
      highRange.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })

      // 6. Fill remaining slots (up to 13) from cost pool [2,2,2,3,3,3,4,4] randomly
      const costPool = shuffleArray([2, 2, 2, 3, 3, 3, 4, 4])
      for (const cost of costPool) {
        if (deck.length >= 13) break
        const picks = getFromPool(c => c.cost === cost && !c.isLegendary, 1, usedIds)
        picks.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })
      }

      // Emergency fill if still < 13
      while (deck.length < 13) {
        const picks = getFromPool(c => !c.isLegendary, 1, usedIds)
        if (picks.length === 0) break
        picks.forEach(c => { usedIds.add(c.id); deck.push({ card_id: c.id, card_name: c.name, card_image: c.image, is_legendary: false, selection_order: deck.length + 1 }) })
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
