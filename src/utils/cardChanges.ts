/**
 * Card Changes Tracking System
 * Auto-generates deck validation warnings from card stats diffs.
 * Supports manual overrides for non-stat changes (some/significant).
 */

import { comparePatchOrder, getAllPatchesOrdered } from './patches'
import { computePatchDiff, cardIdRenames } from './cardStats'
import { patchNotesData } from './patchNotes'
import { getCardImageForPatch, cardImages } from '../components/CardImage'

export interface CardChange {
  cardId: string
  cardName: string
  patch: string         // patch ID where change happened
  changeType: 'invalid' | 'warning'
  description: string
  oldImagePath?: string
}

/**
 * Build all card changes automatically from stats diffs + manual notes.
 * Manual notes override automated stat-based warnings.
 */
function buildCardChanges(): CardChange[] {
  const changes: CardChange[] = []
  const patches = getAllPatchesOrdered()

  for (let i = 1; i < patches.length; i++) {
    const prevPatch = patches[i - 1]
    const currPatch = patches[i]
    const diffs = computePatchDiff(prevPatch.id, currPatch.id)
    const manualNotes = patchNotesData[currPatch.id]?.manualCardNotes || []
    const manualCardIds = new Set(manualNotes.map(n => n.cardId))

    for (const diff of diffs) {
      if (diff.changeType === 'removed') {
        changes.push({
          cardId: diff.cardId,
          cardName: diff.cardName,
          patch: currPatch.id,
          changeType: 'invalid',
          description: 'has been removed from the game, invalid deck',
        })
        continue
      }

      // Check for legendary status changes (these make decks invalid)
      const legendaryChange = diff.changes.find(c => c.field === 'legendary')
      if (legendaryChange) {
        if (legendaryChange.newValue === true) {
          changes.push({
            cardId: diff.cardId,
            cardName: diff.cardName,
            patch: currPatch.id,
            changeType: 'invalid',
            description: 'is now legendary, invalid deck',
          })
        } else {
          changes.push({
            cardId: diff.cardId,
            cardName: diff.cardName,
            patch: currPatch.id,
            changeType: 'invalid',
            description: 'is no longer legendary, invalid deck',
          })
        }
        continue
      }

      // If manual override exists for this card, use that instead
      if (manualCardIds.has(diff.cardId)) {
        continue // handled below
      }

      // Auto-generate warnings for stat changes only (NOT for renames without stat changes)
      if (diff.changes.length > 0) {
        const statFields = diff.changes.map(c => c.field)
        let description = ''
        if (statFields.includes('cost')) {
          description = "card's cost has been changed"
        } else if (statFields.length > 0) {
          description = 'card has undergone some changes'
        }
        if (description) {
          changes.push({
            cardId: diff.cardId,
            cardName: diff.cardName,
            patch: currPatch.id,
            changeType: 'warning',
            description,
          })
        }
      }
    }

    // Add manual notes as warnings (these override any automated ones)
    for (const note of manualNotes) {
      // Don't add if already handled as invalid (legendary/removed)
      const alreadyInvalid = changes.some(
        c => c.cardId === note.cardId && c.patch === currPatch.id && c.changeType === 'invalid'
      )
      if (alreadyInvalid) continue

      // Remove any automated warning for this card in this patch
      const autoIdx = changes.findIndex(
        c => c.cardId === note.cardId && c.patch === currPatch.id && c.changeType === 'warning'
      )
      if (autoIdx >= 0) changes.splice(autoIdx, 1)

      changes.push({
        cardId: note.cardId,
        cardName: note.cardName,
        patch: currPatch.id,
        changeType: 'warning',
        description: note.description,
      })
    }
  }

  return changes
}

// Build once and cache
export const cardChanges: CardChange[] = buildCardChanges()

/**
 * Build a complete reverse rename map: newId -> oldId across all patches
 */
function buildReverseRenames(): Record<string, string> {
  const reverseRenames: Record<string, string> = {}
  for (const [, renames] of Object.entries(cardIdRenames)) {
    for (const [oldId, newId] of Object.entries(renames)) {
      reverseRenames[newId] = oldId
    }
  }
  return reverseRenames
}

const reverseRenameMap = buildReverseRenames()

export function getDeckValidationIssues(deckPatch: string, cardIds: string[]): {
  invalidIssues: CardChange[]
  warningIssues: CardChange[]
} {
  const invalidIssues: CardChange[] = []
  const warningIssues: CardChange[] = []

  for (const change of cardChanges) {
    // Check if this change applies to any card in the deck
    // Either directly by cardId, or through a rename chain (deck has old ID, change uses new ID)
    const isAffected = cardIds.includes(change.cardId) ||
      (reverseRenameMap[change.cardId] && cardIds.includes(reverseRenameMap[change.cardId]))

    if (!isAffected) continue

    // If the change's patch is newer than the deck's patch, the deck is affected
    if (comparePatchOrder(change.patch, deckPatch) > 0) {
      if (change.changeType === 'invalid') {
        invalidIssues.push(change)
      } else {
        warningIssues.push(change)
      }
    }
  }

  // Deduplicate: keep only the latest patch's issue per card
  const latestWarningPerCard = new Map<string, CardChange>()
  for (const warning of warningIssues) {
    const existing = latestWarningPerCard.get(warning.cardId)
    if (!existing || comparePatchOrder(warning.patch, existing.patch) > 0) {
      latestWarningPerCard.set(warning.cardId, warning)
    }
  }

  const latestInvalidPerCard = new Map<string, CardChange>()
  for (const issue of invalidIssues) {
    const existing = latestInvalidPerCard.get(issue.cardId)
    if (!existing || comparePatchOrder(issue.patch, existing.patch) > 0) {
      latestInvalidPerCard.set(issue.cardId, issue)
    }
  }

  return {
    invalidIssues: Array.from(latestInvalidPerCard.values()),
    warningIssues: Array.from(latestWarningPerCard.values()),
  }
}

export function groupCardChanges(changes: CardChange[]): Array<{ cardNames: string[], description: string }> {
  const grouped = new Map<string, string[]>()
  
  changes.forEach(change => {
    const existing = grouped.get(change.description) || []
    existing.push(change.cardName)
    grouped.set(change.description, existing)
  })
  
  return Array.from(grouped.entries()).map(([description, cardNames]) => ({
    cardNames,
    description
  }))
}

/**
 * Get the image for a card as it appeared at a specific deck patch.
 * Uses patch-based image resolution (handles renames, image-only changes).
 */
export function getOriginalCardImage(cardId: string, deckPatch: string, currentImage: string): string {
  const patchImage = getCardImageForPatch(cardId, deckPatch)
  if (patchImage) return patchImage
  return currentImage
}

/**
 * Check if a card's image differs between a deck's patch and the current version.
 * Detects image-only changes (renames, new art) even without stat changes.
 */
export function hasImageChanged(cardId: string, deckPatch: string): boolean {
  const patchImage = getCardImageForPatch(cardId, deckPatch)
  const currentImage = cardImages[cardId]
  if (!patchImage || !currentImage) return false
  return patchImage !== currentImage
}

/**
 * Build a map of original (patch-era) images for all cards in a deck.
 * Includes ALL cards whose image differs from current, not just stat-changed ones.
 */
export function buildOriginalImagesMap(
  cards: Array<{ card_id: string }>,
  deckPatch: string
): Record<string, string> {
  const originalImages: Record<string, string> = {}
  for (const card of cards) {
    const patchImage = getCardImageForPatch(card.card_id, deckPatch)
    const currentImage = cardImages[card.card_id]
    if (patchImage && currentImage && patchImage !== currentImage) {
      originalImages[card.card_id] = patchImage
    }
  }
  return originalImages
}
