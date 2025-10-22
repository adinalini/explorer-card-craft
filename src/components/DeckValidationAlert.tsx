import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { getDeckValidationIssues, groupCardChanges } from "@/utils/cardChanges"

interface DeckValidationAlertProps {
  deckPatch: string
  cardIds: string[]
}

function formatCardList(cards: string[]): string {
  if (cards.length === 1) return cards[0]
  if (cards.length === 2) return `${cards[0]} and ${cards[1]}`
  return `${cards.slice(0, -1).join(', ')} and ${cards[cards.length - 1]}`
}

export function DeckValidationAlert({ deckPatch, cardIds }: DeckValidationAlertProps) {
  const { invalidIssues, warningIssues } = getDeckValidationIssues(deckPatch, cardIds)

  if (invalidIssues.length === 0 && warningIssues.length === 0) {
    return null
  }

  const groupedInvalid = groupCardChanges(invalidIssues)
  const groupedWarnings = groupCardChanges(warningIssues)

  return (
    <div className="space-y-2">
      {/* Invalid Issues (Red) */}
      {groupedInvalid.map((group, index) => (
        <Alert key={`invalid-${index}`} variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-900 dark:text-red-100">
            <strong>{formatCardList(group.cardNames)}</strong> {group.description}
          </AlertDescription>
        </Alert>
      ))}

      {/* Warning Issues (Yellow/Orange) */}
      {groupedWarnings.map((group, index) => (
        <Alert key={`warning-${index}`} className="border-orange-500 bg-orange-50 dark:bg-orange-950/30">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-900 dark:text-orange-100">
            <strong>{formatCardList(group.cardNames)}</strong> {group.description}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export function isDecKValid(deckPatch: string, cardIds: string[]): boolean {
  const { invalidIssues } = getDeckValidationIssues(deckPatch, cardIds)
  return invalidIssues.length === 0
}
