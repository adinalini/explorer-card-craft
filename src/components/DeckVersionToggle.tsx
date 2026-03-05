import { Button } from "@/components/ui/button"
import { History } from "lucide-react"
import { useState } from "react"
import { hasImageChanged, buildOriginalImagesMap } from "@/utils/cardChanges"

interface DeckVersionToggleProps {
  deckPatch: string
  cards: Array<{
    card_id: string
    card_image: string
    [key: string]: any
  }>
  onToggle: (showOriginal: boolean, originalImages: Record<string, string>) => void
}

export function DeckVersionToggle({ deckPatch, cards, onToggle }: DeckVersionToggleProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  // Check if ANY card has a different image at the deck's patch vs current
  const hasOldVersions = cards.some(card => hasImageChanged(card.card_id, deckPatch))

  if (!hasOldVersions) {
    return null
  }

  const handleToggle = () => {
    const newShowOriginal = !showOriginal
    setShowOriginal(newShowOriginal)

    if (newShowOriginal) {
      // Build original images for ALL cards with different images
      const originalImages = buildOriginalImagesMap(cards, deckPatch)
      onToggle(true, originalImages)
    } else {
      onToggle(false, {})
    }
  }

  return (
    <Button
      variant={showOriginal ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className="gap-2"
    >
      <History className="h-4 w-4" />
      {showOriginal ? "Current Version" : "Show Original"}
    </Button>
  )
}
