import { CardImage } from "@/components/CardImage"

interface Card {
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

interface DeckDisplayProps {
  cards: Card[]
  playerName: string
  isOwn: boolean
}

export function DeckDisplay({ cards, playerName, isOwn }: DeckDisplayProps) {
  // Sort cards by selection order
  const sortedCards = [...cards].sort((a, b) => a.selection_order - b.selection_order)
  
  // Separate legendary and normal cards
  const legendaryCard = sortedCards.find(card => card.is_legendary)
  const normalCards = sortedCards.filter(card => !card.is_legendary)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-primary">
        {isOwn ? "Your Deck" : `${playerName}'s Deck`}
      </h3>
      
      <div className="flex items-start gap-4">
        {/* Deck List - Left side for creator, Right side for joiner */}
        {isOwn && (
          <div className="w-32 space-y-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Deck List</h4>
            <div className="space-y-1 h-80 overflow-y-auto">
              {legendaryCard && (
                <div className="text-xs text-yellow-600 font-medium border-l-2 border-yellow-500 pl-2">
                  {legendaryCard.card_name}
                </div>
              )}
              {normalCards.map((card, index) => (
                <div key={index} className="text-xs text-muted-foreground border-l-2 border-muted pl-2">
                  {card.card_name}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 12 - normalCards.length }).map((_, index) => (
                <div key={`empty-${index}`} className="text-xs text-muted/50 border-l-2 border-dashed border-muted/50 pl-2">
                  —
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deck Visual */}
        <div className="space-y-3 flex-1">
          {/* Legendary card row */}
          <div className="flex justify-center">
            <div className="w-16 h-20 relative">
              {legendaryCard ? (
                <div className="w-full h-full bg-white border-2 border-yellow-500 rounded overflow-hidden">
                  <CardImage
                    cardId={legendaryCard.card_id}
                    cardName={legendaryCard.card_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full border-2 border-dashed border-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Legendary</span>
                </div>
              )}
            </div>
          </div>

          {/* Normal cards - 3 rows of 4 */}
          <div className="space-y-2">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex justify-center gap-1">
                {[0, 1, 2, 3].map((col) => {
                  const cardIndex = row * 4 + col
                  const card = normalCards[cardIndex]
                  
                  return (
                    <div key={col} className="w-12 h-16 relative">
                      {card ? (
                        <div className="w-full h-full bg-white border border-muted rounded overflow-hidden">
                          <CardImage
                            cardId={card.card_id}
                            cardName={card.card_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full border border-dashed border-muted rounded"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Deck List - Right side for joiner */}
        {!isOwn && (
          <div className="w-32 space-y-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Deck List</h4>
            <div className="space-y-1 h-80 overflow-y-auto">
              {legendaryCard && (
                <div className="text-xs text-yellow-600 font-medium border-l-2 border-yellow-500 pl-2">
                  {legendaryCard.card_name}
                </div>
              )}
              {normalCards.map((card, index) => (
                <div key={index} className="text-xs text-muted-foreground border-l-2 border-muted pl-2">
                  {card.card_name}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 12 - normalCards.length }).map((_, index) => (
                <div key={`empty-${index}`} className="text-xs text-muted/50 border-l-2 border-dashed border-muted/50 pl-2">
                  —
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}