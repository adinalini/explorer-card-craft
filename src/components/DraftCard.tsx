import { cn } from "@/lib/utils"
import { CardImage } from "@/components/CardImage"

interface DraftCardProps {
  cardId: string
  cardName: string
  cardImage: string
  isLegendary: boolean
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
  isRevealing?: boolean
  showUnselectedOverlay?: boolean
  isOpponentCard?: boolean
  showSelectedCross?: boolean
  showSelectedTick?: boolean
}

export function DraftCard({ 
  cardId, 
  cardName, 
  cardImage, 
  isLegendary, 
  isSelected, 
  onSelect, 
  disabled = false,
  isRevealing = false,
  showUnselectedOverlay = false,
  isOpponentCard = false,
  showSelectedCross = false,
  showSelectedTick = false
}: DraftCardProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden",
        "hover:scale-105 hover:shadow-lg",
        // Show selection highlight during drafting (before reveal)
        isSelected && !isRevealing && "ring-4 ring-blue-500 ring-opacity-60 shadow-lg shadow-blue-500/50",
        // Show selection highlight during reveal phase
        isSelected && isRevealing && "ring-4 ring-purple-500 ring-opacity-60 shadow-lg shadow-purple-500/50",
        disabled && !isRevealing && "opacity-50 cursor-not-allowed",
        isRevealing && !isSelected && "opacity-30",
        "bg-white border-2 border-muted"
      )}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="aspect-[3/4] relative">
        {isOpponentCard ? (
          // Show card back for opponent selections during drafting
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-white text-4xl">🂠</div>
          </div>
        ) : (
          <CardImage
            cardId={cardId}
            cardName={cardName}
            className="w-full h-full object-cover"
          />
        )}
        {isLegendary && !isOpponentCard && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            LEGENDARY
          </div>
        )}
        {showUnselectedOverlay && isRevealing && !isSelected && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">✕</div>
          </div>
        )}
        {showSelectedCross && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">✕</div>
          </div>
        )}
        {showSelectedTick && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">✓</div>
          </div>
        )}
        {showUnselectedOverlay && !isRevealing && (
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        )}
      </div>
      <div className="p-2 bg-white">
        <h3 className="text-sm font-semibold text-center text-black truncate">
          {isOpponentCard ? "Hidden Card" : cardName}
        </h3>
      </div>
    </div>
  )
}