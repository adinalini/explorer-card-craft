/**
 * Patch Notes Data Structure
 * Manual card notes override automated diff-based notes.
 * Miscellaneous sections are always manual.
 */

export interface ManualCardNote {
  cardId: string
  cardName: string
  description: string  // e.g., "card has undergone significant changes"
  severity: 'some' | 'significant'
}

export interface PatchNotesData {
  patchId: string
  // Manual notes for changes that can't be auto-detected or that override auto
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
 */
export const patchNotesData: Record<string, PatchNotesData> = {
  'winter-2025': {
    patchId: 'winter-2025',
    manualCardNotes: [
      // Some changes (override automated stat warnings)
      { cardId: 'blow_the_house_down', cardName: 'Blow the House Down', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'bridge_troll', cardName: 'Bridge Troll', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'flying_monkey', cardName: 'Flying Monkey', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'morgiana', cardName: 'Morgiana', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'quasimodo', cardName: 'Quasimodo', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'red_cap', cardName: 'Redcap', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'sheriff_of_nottingham', cardName: 'Sheriff of Nottingham', description: 'card has undergone some changes', severity: 'some' },
      { cardId: 'lancelot', cardName: 'Sir Lancelot', description: 'card has undergone some changes', severity: 'some' },
      // Significant changes (override automated stat warnings)
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
  'gdc-2026': {
    patchId: 'gdc-2026',
    manualCardNotes: [],
  },
}

export function getPatchNotes(patchId: string): PatchNotesData | undefined {
  return patchNotesData[patchId]
}
