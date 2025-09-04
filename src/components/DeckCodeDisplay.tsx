import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { generateDeckCodeFromCardIds } from "@/utils/deckCode"

interface DeckCodeDisplayProps {
  cardIds: string[]
  className?: string
}

export function DeckCodeDisplay({ cardIds, className = "" }: DeckCodeDisplayProps) {
  const [deckCode, setDeckCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const generateCode = async () => {
      if (cardIds.length === 0) return
      
      setGenerating(true)
      try {
        const code = await generateDeckCodeFromCardIds(cardIds)
        setDeckCode(code || "")
      } catch (error) {
        console.error("Failed to generate deck code:", error)
        toast({
          title: "Error",
          description: "Failed to generate deck code",
          variant: "destructive"
        })
      } finally {
        setGenerating(false)
      }
    }

    generateCode()
  }, [cardIds])

  const handleCopy = async () => {
    if (!deckCode) return
    
    try {
      await navigator.clipboard.writeText(deckCode)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Deck code copied to clipboard"
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Error", 
        description: "Failed to copy deck code",
        variant: "destructive"
      })
    }
  }

  if (generating) {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="text-sm font-medium text-muted-foreground">Deck Code</h3>
        <div className="flex gap-2">
          <Input 
            value="Generating deck code..." 
            readOnly 
            className="text-xs font-mono"
          />
          <Button disabled size="sm" variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (!deckCode) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">Deck Code</h3>
      <div className="flex gap-2">
        <Input 
          value={deckCode} 
          readOnly 
          className="text-xs font-mono"
        />
        <Button 
          onClick={handleCopy}
          size="sm" 
          variant="outline"
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Use this code to import your deck into the game
      </p>
    </div>
  )
}