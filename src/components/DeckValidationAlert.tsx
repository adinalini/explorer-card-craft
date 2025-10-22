import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { getDeckValidationIssues, CardChange } from "@/utils/cardChanges"

interface DeckValidationAlertProps {
  deckPatch: string
  cardIds: string[]
}

export function DeckValidationAlert({ deckPatch, cardIds }: DeckValidationAlertProps) {
  const { invalidIssues, warningIssues } = getDeckValidationIssues(deckPatch, cardIds)

  if (invalidIssues.length === 0 && warningIssues.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Invalid Issues (Red) */}
      {invalidIssues.map((issue, index) => (
        <Alert key={`invalid-${index}`} variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-900 dark:text-red-100">
            <strong>{issue.cardName}:</strong> {issue.description}. This deck is <strong>invalid</strong>.
          </AlertDescription>
        </Alert>
      ))}

      {/* Warning Issues (Yellow/Orange) */}
      {warningIssues.map((issue, index) => (
        <Alert key={`warning-${index}`} className="border-orange-500 bg-orange-50 dark:bg-orange-950/30">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-900 dark:text-orange-100">
            <strong>{issue.cardName}:</strong> {issue.description}
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
