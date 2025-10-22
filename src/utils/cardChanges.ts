/**
 * Card Changes Tracking System
 * Tracks all card changes across patches for deck validation
 */

export interface CardChange {
  cardId: string
  cardName: string
  patch: string // Patch where change occurred
  changeType: 'invalid' | 'warning' // Invalid = deck becomes invalid, warning = just notification
  description: string // Human-readable description of the change
  oldImagePath?: string // Path to old image in assets/cards/Old/{patch} folder
}

/**
 * All card changes tracked by patch
 * Add new changes here as patches are released
 */
export const cardChanges: CardChange[] = [
  // v1.0.0.41 changes
  {
    cardId: 'the_kraken',
    cardName: 'The Kraken',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'The Kraken is no longer legendary',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/the_kraken.png'
  },
  {
    cardId: 'goldi',
    cardName: 'Goldilocks',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'Goldilocks is now legendary',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/goldilocks.png'
  },
  {
    cardId: 'tin_soldier',
    cardName: 'Tin Soldier',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'Tin Soldier has been removed from the card pool'
  },
  {
    cardId: 'ogre',
    cardName: 'Ogre',
    patch: 'v1.0.0.41',
    changeType: 'invalid',
    description: 'Ogre has been removed from the card pool'
  },
  // Cards with major rework (warning level)
  {
    cardId: 'axe_throw',
    cardName: 'Axe Throw',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Axe Throw has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/axe_throw.png'
  },
  {
    cardId: 'beast',
    cardName: 'Beast',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Beast has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beast.png'
  },
  {
    cardId: 'beauty',
    cardName: 'Beauty',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Beauty has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/beauty.png'
  },
  {
    cardId: 'blow_the_house_down',
    cardName: 'Blow the House Down',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Blow the House Down has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/blow_the_house_down.png'
  },
  {
    cardId: 'bridge_troll',
    cardName: 'Bridge Troll',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Bridge Troll has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bridge_troll.png'
  },
  {
    cardId: 'bullseye',
    cardName: 'Bullseye',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Bullseye has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/bullseye.png'
  },
  {
    cardId: 'cheshire',
    cardName: 'Cheshire Cat',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Cheshire Cat has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cheshire.png'
  },
  {
    cardId: 'cowardly_lion',
    cardName: 'Cowardly Lion',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Cowardly Lion has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/cowardly_lion.png'
  },
  {
    cardId: 'dark_omen',
    cardName: 'Dark Omen',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Dark Omen has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/dark_omen.png'
  },
  {
    cardId: 'flying_monkey',
    cardName: 'Flying Monkey',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Flying Monkey has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/flying_monkey.png'
  },
  {
    cardId: 'tuck',
    cardName: 'Tuck',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Tuck (formerly Friar Tuck) has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/friar_tuck.png'
  },
  {
    cardId: 'jacks_giant',
    cardName: "Jack's Giant",
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: "Jack's Giant (formerly Giant) has undergone major rework",
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/giant.png'
  },
  {
    cardId: 'jack_in_the_box',
    cardName: 'Jack in the Box',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Jack in the Box has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/jack_in_the_box.png'
  },
  {
    cardId: 'lady_of_the_lake',
    cardName: 'Lady of the Lake',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Lady of the Lake has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/lady_of_the_lake.png'
  },
  {
    cardId: 'morgiana',
    cardName: 'Morgiana',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Morgiana has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/morgiana.png'
  },
  {
    cardId: 'mummy',
    cardName: 'Mummy',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Mummy has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/mummy.png'
  },
  {
    cardId: 'phantom_coachman',
    cardName: 'Phantom Coachman',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Phantom Coachman has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/phantom_coachman.png'
  },
  {
    cardId: 'quasimodo',
    cardName: 'Quasimodo',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Quasimodo has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/quasimodo.png'
  },
  {
    cardId: 'rain_of_arrows',
    cardName: 'Rain of Arrows',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Rain of Arrows has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/rain_of_arrows.png'
  },
  {
    cardId: 'red',
    cardName: 'Little Red Riding Hood',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Little Red Riding Hood has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/red.png'
  },
  {
    cardId: 'red_cap',
    cardName: 'Redcap',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Redcap has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/redcap.png'
  },
  {
    cardId: 'robinhood',
    cardName: 'Robin Hood',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Robin Hood has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/robin_hood.png'
  },
  {
    cardId: 'sheriff_of_nottingham',
    cardName: 'Sheriff of Nottingham',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Sheriff of Nottingham has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/sheriff_of_nottingham.png'
  },
  {
    cardId: 'three_musketeers',
    cardName: 'Three Musketeers',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Three Musketeers has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/three_musketeers.png'
  },
  {
    cardId: 'tin_woodman',
    cardName: 'Tin Woodman',
    patch: 'v1.0.0.41',
    changeType: 'warning',
    description: 'Tin Woodman has undergone major rework',
    oldImagePath: '/src/assets/cards/Old/v1.0.0.40/tin_woodman.png'
  }
]

/**
 * Get all changes that affect a deck based on its patch
 * Only returns changes that occurred AFTER the deck was created
 */
export function getDeckValidationIssues(deckPatch: string, cardIds: string[]): {
  invalidIssues: CardChange[]
  warningIssues: CardChange[]
} {
  const invalidIssues: CardChange[] = []
  const warningIssues: CardChange[] = []

  // Find changes that affect this deck's cards and occurred after deck creation
  for (const change of cardChanges) {
    // Check if this card is in the deck
    if (!cardIds.includes(change.cardId)) continue

    // Check if change occurred after deck was created
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

/**
 * Compare two patch versions
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
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

/**
 * Get the original image path for a card based on deck patch
 * Returns the closest old version image path or current image if no old version exists
 */
export function getOriginalCardImage(cardId: string, deckPatch: string, currentImage: string): string {
  // Find all changes for this card
  const cardChangeHistory = cardChanges
    .filter(c => c.cardId === cardId && c.oldImagePath)
    .sort((a, b) => comparePatchVersions(b.patch, a.patch)) // Sort descending

  // Find the earliest change that occurred after deck creation
  for (const change of cardChangeHistory) {
    if (comparePatchVersions(change.patch, deckPatch) > 0 && change.oldImagePath) {
      return change.oldImagePath
    }
  }

  // No old version found, return current image
  return currentImage
}
