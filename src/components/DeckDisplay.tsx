import { CardImage } from "@/components/CardImage"
import { getCardById } from "@/utils/cardData"
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay"

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
  isDraftComplete?: boolean
}

export function DeckDisplay({ cards, playerName, isOwn, isDraftComplete = false }: DeckDisplayProps) {
  // First separate legendary and normal cards
  const legendaryCard = cards.find(card => card.is_legendary)
  const normalCardsRaw = cards.filter(card => !card.is_legendary)
  
  // Sort normal cards by cost first, then alphabetically by name
  const normalCards = [...normalCardsRaw].sort((a, b) => {
    // Get cost from card data (we need to import and use getCardById)
    const cardAData = getCardById(a.card_id)
    const cardBData = getCardById(b.card_id)
    
    const costA = cardAData?.cost ?? 0
    const costB = cardBData?.cost ?? 0
    
    // Sort by cost first
    if (costA !== costB) {
      return costA - costB
    }
    
    // If costs are equal, sort alphabetically by name
    return a.card_name.localeCompare(b.card_name)
  })

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-primary">
        {isOwn ? "Your Deck" : `${playerName}'s Deck`}
      </h3>
      
      <div className="flex items-start gap-4">
        {/* Deck List - Left side for creator, Right side for opponent */}
        {isOwn && (
          <div className={`space-y-1 ${isDraftComplete ? 'w-40' : 'w-32'}`}>
            <h4 className={`font-semibold text-muted-foreground mb-2 ${isDraftComplete ? 'text-base' : 'text-sm'}`}>Deck List</h4>
            <div className={`relative space-y-0.5 ${isDraftComplete ? 'h-[calc(8.4rem+28.8rem)] max-h-[37.2rem]' : 'h-[calc(7rem+24rem)] max-h-[31rem]'}`}>
              {legendaryCard && (
                <div className={`text-yellow-600 font-medium border-l-2 border-yellow-500 pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                  {legendaryCard.card_name}
                </div>
              )}
                 {normalCards.map((card, index) => (
                  <div key={index} className={`text-muted-foreground border-l-2 border-muted pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                    {card.card_name}
                  </div>
                ))}
                {isOwn && isDraftComplete && cards.length > 0 && (
                  <div className={`absolute bottom-0 left-0 flex items-center gap-2 text-muted-foreground pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                    <span className="font-semibold">Deck Code</span>
                    <DeckCodeDisplay 
                      cardIds={cards.map(card => card.card_id)} 
                    />
                  </div>
                )}
                 {/* Empty slots */}
                 {Array.from({ length: 12 - normalCards.length }).map((_, index) => (
                   <div key={`empty-${index}`} className={`text-muted/50 border-l-2 border-dashed border-muted/50 pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                     —
                   </div>
                 ))}
               </div>
               
             </div>
           )}

           {/* Deck List - Left side for opponent (when viewing opponent) */}
           {!isOwn && (
             <div className={`space-y-1 ${isDraftComplete ? 'w-40' : 'w-32'}`}>
               <h4 className={`font-semibold text-muted-foreground mb-2 ${isDraftComplete ? 'text-base' : 'text-sm'}`}>Deck List</h4>
               <div className={`relative space-y-0.5 ${isDraftComplete ? 'h-[calc(8.4rem+28.8rem)] max-h-[37.2rem]' : 'h-[calc(7rem+24rem)] max-h-[31rem]'}`}>
                 {legendaryCard && (
                   <div className={`text-yellow-600 font-medium border-l-2 border-yellow-500 pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                     {legendaryCard.card_name}
                   </div>
                 )}
                  {normalCards.map((card, index) => (
                     <div key={index} className={`text-muted-foreground border-l-2 border-muted pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                       {card.card_name}
                     </div>
                   ))}
                   {/* Empty slots */}
                   {Array.from({ length: 12 - normalCards.length }).map((_, index) => (
                     <div key={`empty-${index}`} className={`text-muted/50 border-l-2 border-dashed border-muted/50 pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                       —
                     </div>
                   ))}
                   {isDraftComplete && cards.length > 0 && (
                     <div className={`absolute bottom-0 left-0 flex items-center gap-2 text-muted-foreground pl-2 py-0.5 leading-tight ${isDraftComplete ? 'text-xs' : 'text-[10px]'}`}>
                       <span className="font-semibold">Deck Code</span>
                       <DeckCodeDisplay 
                         cardIds={cards.map(card => card.card_id)} 
                       />
                     </div>
                   )}
                 </div>
               </div>
        )}

        {/* Deck Visual */}
        <div className="space-y-3 flex-1">
          {/* Legendary card row */}
          <div className="flex justify-center">
            <div className={`relative ${isDraftComplete ? 'w-24 h-[8.4rem]' : 'w-20 h-28'}`}>
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
                  <span className={`text-muted-foreground ${isDraftComplete ? 'text-sm' : 'text-xs'}`}>Legendary</span>
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
                    <div key={col} className={`relative ${isDraftComplete ? 'w-[4.8rem] h-24' : 'w-16 h-20'}`}>
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
      </div>
    </div>
  )
}