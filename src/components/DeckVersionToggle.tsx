import { Button } from "@/components/ui/button"
import { History } from "lucide-react"
import { useState } from "react"
import { getOriginalCardImage } from "@/utils/cardChanges"

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

  // Check if there are any cards with old versions
  const hasOldVersions = cards.some(card => {
    const originalImage = getOriginalCardImage(card.card_id, deckPatch, card.card_image)
    return originalImage !== card.card_image
  })

  if (!hasOldVersions) {
    return null
  }

  const handleToggle = () => {
    const newShowOriginal = !showOriginal
    setShowOriginal(newShowOriginal)

    if (newShowOriginal) {
      // Generate original images map
      const originalImages: Record<string, string> = {}
      cards.forEach(card => {
        const originalImage = getOriginalCardImage(card.card_id, deckPatch, card.card_image)
        if (originalImage !== card.card_image) {
          originalImages[card.card_id] = originalImage
        }
      })
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
