import { DraftCard } from "@/components/DraftCard"

interface MegaDraftGridProps {
  cards: any[]
  selectedCard: string | null
  userRole: string
  isMyTurn: boolean
  onCardSelect: (cardId: string) => void
}

export function MegaDraftGrid({ 
  cards, 
  selectedCard, 
  userRole, 
  isMyTurn, 
  onCardSelect 
}: MegaDraftGridProps) {
  return (
    <div className="grid grid-cols-6 gap-2 max-w-6xl mx-auto mb-8">
      {cards.map((card, index) => (
        <DraftCard
          key={`${card.card_id}-${index}`}
          cardId={card.card_id}
          cardName={card.card_name}
          cardImage={card.card_image}
          isLegendary={card.is_legendary}
          isSelected={card.selected_by === userRole}
          onSelect={() => onCardSelect(card.card_id)}
          disabled={!isMyTurn || !!card.selected_by}
          isRevealing={false}
          showUnselectedOverlay={!!card.selected_by}
        />
      ))}
    </div>
  )
}