import { Button } from "@/components/ui/button"
import { Copy, Check, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { encodeDeck } from "@/utils/deckCodeGenerator"
import { getCardKey } from "@/utils/cardKeyMapping"
import { isDecKValid } from "@/components/DeckValidationAlert"

interface DeckCodeDisplayProps {
  cards: Array<{
    card_id: string
    card_name: string
    card_image: string
    is_legendary: boolean
    selection_order: number
  }>
  deckPatch?: string
}

export function DeckCodeDisplay({ cards, deckPatch = 'v1.0.0.41 (latest)' }: DeckCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  
  const cardIds = cards.map(c => c.card_id)
  const isDeckValid = isDecKValid(deckPatch, cardIds)

  const generateDeckCode = async () => {
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

    return await encodeDeck(cardKeys)
  }

  const handleCopyDeckCode = async () => {
    if (!isDeckValid) {
      toast({
        title: "Cannot copy deck code",
        description: "This deck contains invalid cards due to patch changes. Please check the warnings above.",
        variant: "destructive"
      })
      return
    }
    
    const deckCode = await generateDeckCode()
    
    if (!deckCode) {
      return
    }

    try {
      await navigator.clipboard.writeText(deckCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Silent fail
    }
  }

  const [deckCode, setDeckCode] = useState<string | null>(null)

  // Generate deck code on component mount and when cards change
  useEffect(() => {
    generateDeckCode().then(setDeckCode)
  }, [cards])

  if (!deckCode) {
    return null
  }

  return (
    <Button
      variant={isDeckValid ? "orange" : "destructive"}
      size="sm"
      onClick={handleCopyDeckCode}
      className="flex items-center gap-2"
      disabled={!isDeckValid}
    >
      {!isDeckValid ? (
        <AlertCircle className="h-4 w-4" />
      ) : copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {!isDeckValid ? "Invalid Deck" : copied ? "Copied!" : "Copy Deck Code"}
    </Button>
  )
}