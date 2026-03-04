/**
 * Card Changes Tracking System
 * Tracks all card changes across patches for deck validation.
 * Uses the centralized patch registry from patches.ts.
 */

import { oldCardImages } from './oldCardImages'
import { comparePatchOrder, resolvePatch } from './patches'

export interface CardChange {
  cardId: string
  cardName: string
  patch: string         // patch ID where change happened (e.g., 'winter-2025')
  changeType: 'invalid' | 'warning'
  description: string
  oldImagePath?: string
}

export const cardChanges: CardChange[] = [
  // Winter 2025 - REMOVED CARDS
  {
    cardId: 'tin_soldier',
    cardName: 'Tin Soldier',
    patch: 'winter-2025',
    changeType: 'invalid',
    description: 'has been removed from the game, invalid deck'
  },
  {
    cardId: 'ogre',
    cardName: 'Ogre',
    patch: 'winter-2025',
    changeType: 'invalid',
    description: 'has been removed from the game, invalid deck'
  },
  
  // Winter 2025 - TYPE CHANGES
  {
    cardId: 'the_kraken',
    cardName: 'The Kraken',
    patch: 'winter-2025',
    changeType: 'invalid',
    description: 'is no longer legendary, invalid deck',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/the_kraken.png'
  },
  {
    cardId: 'goldi',
    cardName: 'Goldilocks',
    patch: 'winter-2025',
    changeType: 'invalid',
    description: 'is now legendary, invalid deck',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/goldilocks.png'
  },
  
  // Winter 2025 - COST CHANGES
  { cardId: 'axe_throw', cardName: 'Axe Throw', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/axe_throw.png' },
  { cardId: 'beast', cardName: 'Beast', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beast.png' },
  { cardId: 'beauty', cardName: 'Beauty', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beauty.png' },
  { cardId: 'bullseye', cardName: 'Bullseye', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bullseye.png' },
  { cardId: 'cheshire', cardName: 'Cheshire Cat', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cheshire.png' },
  { cardId: 'dark_omen', cardName: 'Dark Omen', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/dark_omen.png' },
  { cardId: 'jacks_giant', cardName: "Jack's Giant", patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/giant.png' },
  { cardId: 'giant', cardName: "Jack's Giant", patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/giant.png' },
  { cardId: 'jack_in_the_box', cardName: 'Jack in the Box', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/jack_in_the_box.png' },
  { cardId: 'lady_of_the_lake', cardName: 'Lady of the Lake', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/lady_of_the_lake.png' },
  { cardId: 'rain_of_arrows', cardName: 'Rain of Arrows', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/rain_of_arrows.png' },
  { cardId: 'red', cardName: 'Little Red Riding Hood', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/red.png' },
  { cardId: 'robinhood', cardName: 'Robin Hood', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/robin_hood.png' },
  { cardId: 'tin_woodman', cardName: 'Tin Woodman', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/tin_woodman.png' },
  { cardId: 'mummy', cardName: 'Mummy', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/mummy.png' },
  { cardId: 'searing_light', cardName: 'Searing Light', patch: 'winter-2025', changeType: 'warning', description: "card's cost has been changed", oldImagePath: '/src/assets/cards/Old/v1.0.0.40/searing_light.png' },
  
  // Winter 2025 - SOME CHANGES
  { cardId: 'blow_the_house_down', cardName: 'Blow the House Down', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/blow_the_house_down.png' },
  { cardId: 'bridge_troll', cardName: 'Bridge Troll', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bridge_troll.png' },
  { cardId: 'flying_monkey', cardName: 'Flying Monkey', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/flying_monkey.png' },
  { cardId: 'morgiana', cardName: 'Morgiana', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/morgiana.png' },
  { cardId: 'quasimodo', cardName: 'Quasimodo', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/quasimodo.png' },
  { cardId: 'red_cap', cardName: 'Redcap', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/redcap.png' },
  { cardId: 'redcap', cardName: 'Redcap', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/redcap.png' },
  { cardId: 'sheriff_of_nottingham', cardName: 'Sheriff of Nottingham', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/sheriff_of_nottingham.png' },
  
  // Winter 2025 - SIGNIFICANT CHANGES
  { cardId: 'cowardly_lion', cardName: 'Cowardly Lion', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone significant changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cowardly_lion.png' },
  { cardId: 'tuck', cardName: 'Tuck', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone significant changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/friar_tuck.png' },
  { cardId: 'friar_tuck', cardName: 'Friar Tuck', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone significant changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/friar_tuck.png' },
  { cardId: 'phantom_coachman', cardName: 'Phantom Coachman', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone significant changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/phantom_coachman.png' },
  { cardId: 'three_musketeers', cardName: 'Three Musketeers', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone significant changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/three_musketeers.png' },
  { cardId: 'lancelot', cardName: 'Lancelot', patch: 'winter-2025', changeType: 'warning', description: 'card has undergone some changes', oldImagePath: '/src/assets/cards/Old/v1.0.0.40/lancelot.png' },
]

export function getDeckValidationIssues(deckPatch: string, cardIds: string[]): {
  invalidIssues: CardChange[]
  warningIssues: CardChange[]
} {
  const invalidIssues: CardChange[] = []
  const warningIssues: CardChange[] = []

  for (const change of cardChanges) {
    if (!cardIds.includes(change.cardId)) continue
    // If the change's patch is newer than the deck's patch, the deck is affected
    if (comparePatchOrder(change.patch, deckPatch) > 0) {
      if (change.changeType === 'invalid') {
        invalidIssues.push(change)
      } else {
        warningIssues.push(change)
      }
    }
  }

  return { invalidIssues, warningIssues }
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

export function getOriginalCardImage(cardId: string, deckPatch: string, currentImage: string): string {
  const cardChangeHistory = cardChanges
    .filter(c => c.cardId === cardId && c.oldImagePath)
    .sort((a, b) => comparePatchOrder(b.patch, a.patch))

  for (const change of cardChangeHistory) {
    if (comparePatchOrder(change.patch, deckPatch) > 0 && change.oldImagePath) {
      if (oldCardImages[cardId]) {
        return oldCardImages[cardId]
      }
      return change.oldImagePath
    }
  }

  return currentImage
}
