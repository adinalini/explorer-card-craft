import { DraftCard } from "@/components/DraftCard"

interface TripleDraftCardsProps {
  cards: any[]
  selectedCard: string | null
  userRole: string
  isSelectionLocked: boolean
  isMyTurn: boolean
  onCardSelect: (cardId: string) => void
}

export function TripleDraftCards({ 
  cards, 
  selectedCard, 
  userRole, 
  isSelectionLocked, 
  isMyTurn,
  onCardSelect 
}: TripleDraftCardsProps) {
  // Filter to show only 3 cards for triple draft
  const displayCards = cards
    .sort((a, b) => a.card_id.localeCompare(b.card_id))
    .slice(0, 3) // Only show first 3 cards

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {displayCards.map((card, index) => (
          <DraftCard
            key={`${card.id}-${index}`}
            cardId={card.card_id}
            cardName={card.card_name}
            cardImage={card.card_image}
            isLegendary={card.is_legendary}
            isSelected={
              isSelectionLocked 
                ? !!card.selected_by
                : selectedCard === card.card_id
            }
            onSelect={() => onCardSelect(card.card_id)}
            disabled={isSelectionLocked || !isMyTurn || (card.selected_by && card.selected_by !== userRole)}
            isRevealing={isSelectionLocked}
            showUnselectedOverlay={(!isMyTurn && !isSelectionLocked) || (isSelectionLocked && !card.selected_by)}
            isOpponentCard={card.selected_by && card.selected_by !== userRole && !isSelectionLocked}
          />
        ))}
      </div>
    </div>
  )
}