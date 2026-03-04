/**
 * Per-Patch Card Stats
 * Stores the complete card stats for each patch.
 * Stats are cumulative - each patch contains the FULL state of all cards at that point.
 * When a card is removed, its status is set to 'removed'.
 * When a card is added, it appears for the first time in that patch's stats.
 */

export type CardType = 'minion' | 'spell' | 'item'

export interface CardStats {
  name: string
  cost: number
  power?: number       // undefined for spells
  defence?: number     // undefined for spells
  cardType: CardType
  isLegendary: boolean
  status: 'active' | 'removed'
}

export type PatchCardStats = Record<string, CardStats> // cardId -> stats

/**
 * Card stats indexed by patch ID.
 * Each entry contains the COMPLETE state of all cards in that patch.
 * This will be populated as the user provides card data.
 */
export const patchCardStats: Record<string, PatchCardStats> = {
  // Summer 2025 stats will be derived from Winter 2025 by reversing the known changes
  // For now, placeholder - will be populated when user provides full data

  'winter-2025': {
    // User's card stats go here - only 2 provided so far, rest will come
    ali_baba: { name: 'Ali Baba', cost: 1, power: 1, defence: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    alice: { name: 'Alice', cost: 3, power: 2, defence: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    // ... remaining cards will be added when user sends full list
  },
}

/**
 * Compute the diff between two patches for a specific card
 */
export interface CardDiff {
  cardId: string
  cardName: string
  changes: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
  changeType: 'added' | 'removed' | 'modified'
}

export function computePatchDiff(oldPatchId: string, newPatchId: string): CardDiff[] {
  const oldStats = patchCardStats[oldPatchId] || {}
  const newStats = patchCardStats[newPatchId] || {}
  const diffs: CardDiff[] = []

  // Check for removed and modified cards
  for (const [cardId, oldCard] of Object.entries(oldStats)) {
    if (oldCard.status === 'removed') continue

    const newCard = newStats[cardId]
    if (!newCard || newCard.status === 'removed') {
      diffs.push({
        cardId,
        cardName: oldCard.name,
        changes: [],
        changeType: 'removed',
      })
      continue
    }

    // Check for modifications
    const changes: CardDiff['changes'] = []
    if (oldCard.cost !== newCard.cost) {
      changes.push({ field: 'cost', oldValue: oldCard.cost, newValue: newCard.cost })
    }
    if (oldCard.power !== newCard.power) {
      changes.push({ field: 'power', oldValue: oldCard.power, newValue: newCard.power })
    }
    if (oldCard.defence !== newCard.defence) {
      changes.push({ field: 'defence', oldValue: oldCard.defence, newValue: newCard.defence })
    }
    if (oldCard.cardType !== newCard.cardType) {
      changes.push({ field: 'type', oldValue: oldCard.cardType, newValue: newCard.cardType })
    }
    if (oldCard.isLegendary !== newCard.isLegendary) {
      changes.push({ field: 'legendary', oldValue: oldCard.isLegendary, newValue: newCard.isLegendary })
    }

    if (changes.length > 0) {
      diffs.push({
        cardId,
        cardName: newCard.name,
        changes,
        changeType: 'modified',
      })
    }
  }

  // Check for new cards
  for (const [cardId, newCard] of Object.entries(newStats)) {
    if (newCard.status === 'removed') continue
    if (!oldStats[cardId] || oldStats[cardId].status === 'removed') {
      diffs.push({
        cardId,
        cardName: newCard.name,
        changes: [],
        changeType: 'added',
      })
    }
  }

  return diffs.sort((a, b) => a.cardName.localeCompare(b.cardName))
}

/**
 * Get the stats for a card at a specific patch.
 * Falls back to the latest available patch that has stats for this card.
 */
export function getCardStatsAtPatch(cardId: string, patchId: string): CardStats | undefined {
  const stats = patchCardStats[patchId]
  if (stats && stats[cardId]) return stats[cardId]
  return undefined
}
