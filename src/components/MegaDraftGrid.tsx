import { DraftCard } from "@/components/DraftCard"

interface MegaDraftGridProps {
  cards: any[]
  selectedCard: string | null
  userRole: string
  isMyTurn: boolean
  isRevealPhase?: boolean
  onCardSelect: (cardId: string) => void
}

export function MegaDraftGrid({ 
  cards, 
  selectedCard, 
  userRole, 
  isMyTurn, 
  isRevealPhase = false,
  onCardSelect 
}: MegaDraftGridProps) {
  // Sort cards to maintain consistent positions (key fix for card position issue)
  const sortedCards = [...cards].sort((a, b) => {
    // First sort by legendary status (non-legendary first)
    if (a.is_legendary !== b.is_legendary) {
      return a.is_legendary ? 1 : -1
    }
    
    // Then by cost
    const costA = a.cost || 0
    const costB = b.cost || 0
    if (costA !== costB) {
      return costA - costB
    }
    
    // Finally by name for consistent ordering
    return a.card_name.localeCompare(b.card_name)
  })

  return (
    <div className="grid grid-cols-6 gap-2 max-w-6xl mx-auto mb-8">
      {sortedCards.map((card, index) => (
        <DraftCard
          key={card.card_id} // Use stable key to prevent position changes
          cardId={card.card_id}
          cardName={card.card_name}
          cardImage={card.card_image}
          isLegendary={card.is_legendary}
          isSelected={!!card.selected_by}
          onSelect={() => onCardSelect(card.card_id)}
          disabled={!isMyTurn || !!card.selected_by || isRevealPhase}
          isRevealing={isRevealPhase && !!card.selected_by}
          showUnselectedOverlay={(!isMyTurn && !card.selected_by) || (isRevealPhase && !card.selected_by)}
          showSelectedCross={card.selected_by && card.selected_by !== userRole}
          showSelectedTick={card.selected_by === userRole}
        />
      ))}
    </div>
  )
}