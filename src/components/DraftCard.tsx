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
}

export function DraftCard({ 
  cardId, 
  cardName, 
  cardImage, 
  isLegendary, 
  isSelected, 
  onSelect, 
  disabled = false 
}: DraftCardProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden",
        "hover:scale-105 hover:shadow-lg",
        isSelected && "ring-4 ring-purple-500 ring-opacity-60 shadow-lg shadow-purple-500/50",
        disabled && "opacity-50 cursor-not-allowed",
        "bg-white border-2 border-muted"
      )}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="aspect-[3/4] relative">
        <CardImage
          cardId={cardId}
          cardName={cardName}
          className="w-full h-full object-cover"
        />
        {isLegendary && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            LEGENDARY
          </div>
        )}
      </div>
      <div className="p-2 bg-white">
        <h3 className="text-sm font-semibold text-center text-black truncate">
          {cardName}
        </h3>
      </div>
    </div>
  )
}