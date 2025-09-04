import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
      <Button disabled size="sm" variant="ghost" className={`shrink-0 text-muted-foreground hover:text-muted-foreground/80 ${className}`}>
        <Copy className="h-4 w-4" />
      </Button>
    )
  }

  if (!deckCode) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[12rem]">
        {deckCode}
      </span>
      <Button 
        onClick={handleCopy}
        size="sm" 
        variant="ghost"
        className="shrink-0 text-muted-foreground hover:text-muted-foreground/80"
        title="Copy deck code"
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