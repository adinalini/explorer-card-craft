import { DraftCard } from "@/components/DraftCard"

interface TripleDraftCardsProps {
  cards: any[]
  selectedCard: string | null
  userRole: string
  isSelectionLocked: boolean
  onCardSelect: (cardId: string) => void
}

export function TripleDraftCards({ 
  cards, 
  selectedCard, 
  userRole, 
  isSelectionLocked, 
  onCardSelect 
}: TripleDraftCardsProps) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {cards
          .sort((a, b) => a.card_id.localeCompare(b.card_id))
          .map((card, index) => (
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
              disabled={isSelectionLocked || card.selected_by}
              isRevealing={isSelectionLocked}
              showUnselectedOverlay={isSelectionLocked && !card.selected_by}
            />
          ))}
      </div>
    </div>
  )
}