import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { encodeDeck } from "@/utils/deckCodeGenerator"
import { getCardKey } from "@/utils/cardKeyMapping"

interface DeckCodeDisplayProps {
  cards: Array<{
    card_id: string
    card_name: string
    card_image: string
    is_legendary: boolean
    selection_order: number
  }>
}

export function DeckCodeDisplay({ cards }: DeckCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const generateDeckCode = () => {
    const cardKeys: string[] = []
    
    for (const card of cards) {
      const cardKey = getCardKey(card.card_id)
      if (cardKey) {
        cardKeys.push(cardKey)
      }
    }

    if (cardKeys.length === 0) {
      return null
    }

    return encodeDeck(cardKeys)
  }

  const handleCopyDeckCode = async () => {
    const deckCode = generateDeckCode()
    
    if (!deckCode) {
      toast({
        title: "Error",
        description: "Unable to generate deck code. Some cards are missing keys.",
        variant: "destructive"
      })
      return
    }

    try {
      await navigator.clipboard.writeText(deckCode)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Deck code copied to clipboard",
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy deck code to clipboard",
        variant: "destructive"
      })
    }
  }

  const deckCode = generateDeckCode()

  if (!deckCode) {
    return null
  }

  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyDeckCode}
        className="text-muted-foreground hover:text-muted-foreground/80 hover:bg-muted/20"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}