import { DraftCard } from "@/components/DraftCard"

interface TripleDraftCardsProps {
  cards: any[]
  selectedCard: string | null
  userRole: string
  isSelectionLocked: boolean
  isMyTurn: boolean
  onCardSelect: (cardId: string) => void
  currentPhase: 1 | 2
  firstPickPlayer: string
}

export function TripleDraftCards({ 
  cards, 
  selectedCard, 
  userRole, 
  isSelectionLocked, 
  isMyTurn,
  onCardSelect,
  currentPhase,
  firstPickPlayer
}: TripleDraftCardsProps) {
  // Filter to show only 3 cards for triple draft
  const displayCards = cards
    .sort((a, b) => a.card_id.localeCompare(b.card_id))
    .slice(0, 3) // Only show first 3 cards

  const selectedCards = displayCards.filter(card => card.selected_by)
  const isPhase1Complete = currentPhase === 2 || selectedCards.length >= 1
  const isPhase2Complete = selectedCards.length >= 2

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {displayCards.map((card, index) => {
          const isCardSelected = !!card.selected_by
          const isMySelection = card.selected_by === userRole
          const isFirstPickSelection = card.selected_by === firstPickPlayer
          const isSecondPickSelection = card.selected_by && card.selected_by !== firstPickPlayer
          
          // Determine card state based on phase
          let showSelectedTick = false
          let showSelectedCross = false
          let isDisabled = false
          let showOverlay = false
          
          if (currentPhase === 1 && !isSelectionLocked) {
            // Phase 1: Only first pick can select
            isDisabled = !isMyTurn || isCardSelected
            showOverlay = !isMyTurn
          } else if (currentPhase === 1 && isSelectionLocked) {
            // Phase 1 reveal: Only show for selected card
            if (isCardSelected) {
              showSelectedTick = isMySelection
              showSelectedCross = !isMySelection
            }
            isDisabled = true
          } else if (currentPhase === 2 && !isSelectionLocked) {
            // Phase 2: Show first pick as greyed with cross, others available for second pick
            if (isFirstPickSelection) {
              showSelectedCross = true
              isDisabled = true
            } else {
              isDisabled = !isMyTurn || isCardSelected
              showOverlay = !isMyTurn
            }
          } else if (currentPhase === 2 && isSelectionLocked) {
            // Phase 2 reveal: Show appropriate states
            if (isCardSelected) {
              if (isFirstPickSelection) {
                showSelectedCross = true
              } else {
                showSelectedTick = isMySelection
                showSelectedCross = !isMySelection
              }
            }
            isDisabled = true
          }
          
          return (
            <DraftCard
              key={`${card.id}-${index}`}
              cardId={card.card_id}
              cardName={card.card_name}
              cardImage={card.card_image}
              isLegendary={card.is_legendary}
              isSelected={
                isSelectionLocked 
                  ? isCardSelected
                  : selectedCard === card.card_id
              }
              onSelect={() => onCardSelect(card.card_id)}
              disabled={isDisabled}
              isRevealing={isSelectionLocked}
              showUnselectedOverlay={showOverlay}
              showSelectedCross={showSelectedCross}
              showSelectedTick={showSelectedTick}
              isOpponentCard={false}
            />
          )
        })}
      </div>
    </div>
  )
}