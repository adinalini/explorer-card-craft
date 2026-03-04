/**
 * Patch Notes Data Structure
 * Each patch has a data file that describes what changed.
 * Automated sections (card updates, new cards, removed cards) are generated
 * from cardStats diffs. Manual sections (miscellaneous) are stored here.
 */

export interface ManualCardNote {
  cardId: string
  cardName: string
  description: string  // e.g., "card has undergone significant changes"
  severity: 'some' | 'significant'
}

export interface PatchNotesData {
  patchId: string
  // These are auto-generated from cardStats diffs when requested:
  // - newCards, removedCards, statChanges are computed via computePatchDiff()

  // Manual notes for changes that can't be auto-detected
  manualCardNotes: ManualCardNote[]

  // Miscellaneous updates (manual, freeform content)
  miscellaneous?: {
    bulletPoints: string[]
    sections: Array<{
      title: string
      content?: string
      images?: Array<{ src: string; alt: string }>
      videos?: Array<{ src: string; poster?: string; alt: string }>
    }>
  }
}

/**
 * Patch notes data indexed by patch ID.
 * Only patches that introduce changes from the previous patch need entries.
 */
export const patchNotesData: Record<string, PatchNotesData> = {
  'winter-2025': {
    patchId: 'winter-2025',
    manualCardNotes: [
      // Some changes
      { cardId: 'blow_the_house_down', cardName: 'Blow the House Down', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'bridge_troll', cardName: 'Bridge Troll', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'flying_monkey', cardName: 'Flying Monkey', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'morgiana', cardName: 'Morgiana', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'quasimodo', cardName: 'Quasimodo', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'red_cap', cardName: 'Redcap', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'sheriff_of_nottingham', cardName: 'Sheriff of Nottingham', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'lancelot', cardName: 'Lancelot', description: 'card has undergone some changes', severity: 'some' },
      // Significant changes
      { cardId: 'cowardly_lion', cardName: 'Cowardly Lion', description: 'card has undergone significant changes', severity: 'significant' },
      { cardId: 'tuck', cardName: 'Tuck', description: 'card has undergone significant changes', severity: 'significant' },
      { cardId: 'phantom_coachman', cardName: 'Phantom Coachman', description: 'card has undergone significant changes', severity: 'significant' },
      { cardId: 'three_musketeers', cardName: 'Three Musketeers', description: 'card has undergone significant changes', severity: 'significant' },
    ],
    miscellaneous: {
      bulletPoints: [
        'Hand size increased from 8 to 10.',
        'Deckbuilder has been updated ingame, you can now inspect cards and their variants.',
        '2 New mechanics: Graveyard play and First Reveal. Cards and abilities can now be used in/on graveyard (Destroyed/Discarded cards) and First Reveal always reveal first regardless of priority.',
      ],
      sections: [
        {
          title: 'New Locations',
          images: [
            { src: '/patches/october/miscellaneous/location_1.png', alt: 'New Locations Set 1' },
            { src: '/patches/october/miscellaneous/location_2.png', alt: 'New Locations Set 2' },
          ],
        },
        {
          title: 'New Mechanic (Legendary Powers)',
          content: 'Legendaries now have a one time effect at the start of the game, all legendaries will eventually have one.\n\nIn the first batch, these 5 legendaries got a power:',
          images: [],
          videos: [],
        },
      ],
    },
  },
}

/**
 * Get patch notes for a specific patch.
 */
export function getPatchNotes(patchId: string): PatchNotesData | undefined {
  return patchNotesData[patchId]
}
