/**
 * Card Changes Tracking System
 * Tracks all card changes across patches for deck validation
 */

import { oldCardImages } from './oldCardImages'

export interface CardChange {
  cardId: string
  cardName: string
  patch: string
  changeType: 'invalid' | 'warning'
  description: string
  oldImagePath?: string
}

export const cardChanges: CardChange[] = [
  // v1.0.0.41 - REMOVED CARDS
  {
    cardId: 'tin_soldier',
    cardName: 'Tin Soldier',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'has been removed from the game, invalid deck'
  },
  {
    cardId: 'ogre',
    cardName: 'Ogre',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'has been removed from the game, invalid deck'
  },
  
  // v1.0.0.41 - TYPE CHANGES
  {
    cardId: 'the_kraken',
    cardName: 'The Kraken',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'is no longer legendary, invalid deck',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/the_kraken.png'
  },
  {
    cardId: 'goldi',
    cardName: 'Goldilocks',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'is now legendary, invalid deck',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/goldilocks.png'
  },
  
  // v1.0.0.41 - COST CHANGES
  {
    cardId: 'axe_throw',
    cardName: 'Axe Throw',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/axe_throw.png'
  },
  {
    cardId: 'beast',
    cardName: 'Beast',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beast.png'
  },
  {
    cardId: 'beauty',
    cardName: 'Beauty',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beauty.png'
  },
  {
    cardId: 'bullseye',
    cardName: 'Bullseye',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bullseye.png'
  },
  {
    cardId: 'cheshire',
    cardName: 'Cheshire Cat',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cheshire.png'
  },
  {
    cardId: 'dark_omen',
    cardName: 'Dark Omen',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/dark_omen.png'
  },
  {
    cardId: 'jacks_giant',
    cardName: "Jack's Giant",
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/giant.png'
  },
  {
    cardId: 'jack_in_the_box',
    cardName: 'Jack in the Box',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/jack_in_the_box.png'
  },
  {
    cardId: 'lady_of_the_lake',
    cardName: 'Lady of the Lake',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/lady_of_the_lake.png'
  },
  {
    cardId: 'rain_of_arrows',
    cardName: 'Rain of Arrows',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/rain_of_arrows.png'
  },
  {
    cardId: 'red',
    cardName: 'Little Red Riding Hood',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/red.png'
  },
  {
    cardId: 'robinhood',
    cardName: 'Robin Hood',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/robin_hood.png'
  },
  {
    cardId: 'tin_woodman',
    cardName: 'Tin Woodman',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "card's cost has been changed",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/tin_woodman.png'
  },
  
  // v1.0.0.41 - SOME CHANGES
  {
    cardId: 'blow_the_house_down',
    cardName: 'Blow the House Down',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/blow_the_house_down.png'
  },
  {
    cardId: 'bridge_troll',
    cardName: 'Bridge Troll',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bridge_troll.png'
  },
  {
    cardId: 'flying_monkey',
    cardName: 'Flying Monkey',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/flying_monkey.png'
  },
  {
    cardId: 'morgiana',
    cardName: 'Morgiana',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/morgiana.png'
  },
  {
    cardId: 'quasimodo',
    cardName: 'Quasimodo',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/quasimodo.png'
  },
  {
    cardId: 'red_cap',
    cardName: 'Redcap',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/redcap.png'
  },
  {
    cardId: 'sheriff_of_nottingham',
    cardName: 'Sheriff of Nottingham',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone some changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/sheriff_of_nottingham.png'
  },
  
  // v1.0.0.41 - SIGNIFICANT CHANGES
  {
    cardId: 'cowardly_lion',
    cardName: 'Cowardly Lion',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone significant changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cowardly_lion.png'
  },
  {
    cardId: 'tuck',
    cardName: 'Tuck',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone significant changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/friar_tuck.png'
  },
  {
    cardId: 'mummy',
    cardName: 'Mummy',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone significant changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/mummy.png'
  },
  {
    cardId: 'phantom_coachman',
    cardName: 'Phantom Coachman',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone significant changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/phantom_coachman.png'
  },
  {
    cardId: 'three_musketeers',
    cardName: 'Three Musketeers',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'card has undergone significant changes',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/three_musketeers.png'
  }
]

export function getDeckValidationIssues(deckPatch: string, cardIds: string[]): {
  invalidIssues: CardChange[]
  warningIssues: CardChange[]
} {
  const invalidIssues: CardChange[] = []
  const warningIssues: CardChange[] = []

  for (const change of cardChanges) {
    if (!cardIds.includes(change.cardId)) continue
    if (comparePatchVersions(change.patch, deckPatch) > 0) {
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

function comparePatchVersions(v1: string, v2: string): number {
  const parseVersion = (v: string) => {
    const match = v.match(/v?(\d+)\.(\d+)\.(\d+)\.(\d+)/)
    if (!match) return [0, 0, 0, 0]
    return [
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
      parseInt(match[4])
    ]
  }

  const [major1, minor1, patch1, build1] = parseVersion(v1)
  const [major2, minor2, patch2, build2] = parseVersion(v2)

  if (major1 !== major2) return major1 > major2 ? 1 : -1
  if (minor1 !== minor2) return minor1 > minor2 ? 1 : -1
  if (patch1 !== patch2) return patch1 > patch2 ? 1 : -1
  if (build1 !== build2) return build1 > build2 ? 1 : -1
  return 0
}

export function getOriginalCardImage(cardId: string, deckPatch: string, currentImage: string): string {
  const cardChangeHistory = cardChanges
    .filter(c => c.cardId === cardId && c.oldImagePath)
    .sort((a, b) => comparePatchVersions(b.patch, a.patch))

  for (const change of cardChangeHistory) {
    if (comparePatchVersions(change.patch, deckPatch) > 0 && change.oldImagePath) {
      // Return the actual imported image if available
      if (oldCardImages[cardId]) {
        return oldCardImages[cardId]
      }
      return change.oldImagePath
    }
  }

  return currentImage
}
