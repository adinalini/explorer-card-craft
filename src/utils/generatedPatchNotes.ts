/**
 * PRE-COMPUTED PATCH NOTES
 * 
 * This file is the OUTPUT of running the patch diff engine.
 * It stores all computed card changes so the Patches page loads instantly.
 * 
 * To regenerate: Ask the AI to "regenerate patch notes" — it will run
 * computePatchDiff() and update this file with the results.
 * 
 * DO NOT EDIT MANUALLY — this is auto-generated from cardStats.ts diffs + patchNotes.ts overrides.
 * 
 * Last generated: 2026-03-04
 */

export interface PatchNoteCardUpdate {
  cardId: string
  newCardId?: string        // for renamed cards
  name: string
  formerName?: string       // for renamed cards
  changeType: 'modified' | 'renamed'
  statChanges?: Array<{ field: string; oldValue: any; newValue: any }>
  severity?: 'some' | 'significant'  // from manual overrides
}

export interface PatchNoteNewCard {
  cardId: string
  name: string
}

export interface PatchNoteRemovedCard {
  cardId: string
  name: string
}

export interface PatchNoteLegendaryChange {
  cardId: string
  name: string
  becameLegendary: boolean  // true = became legendary, false = lost legendary
}

export interface GeneratedPatchNote {
  patchId: string
  displayName: string
  cardUpdates: PatchNoteCardUpdate[]
  newCards: PatchNoteNewCard[]
  removedCards: PatchNoteRemovedCard[]
  legendaryChanges: PatchNoteLegendaryChange[]
}

/**
 * Pre-computed patch notes for Winter 2025 (diff from Summer 2025 → Winter 2025)
 */
export const generatedPatchNotes: Record<string, GeneratedPatchNote> = {
  'winter-2025': {
    patchId: 'winter-2025',
    displayName: 'Winter 2025',
    cardUpdates: [
      // Renamed cards
      { cardId: 'tuck', newCardId: 'tuck', name: 'Tuck', formerName: 'Friar Tuck', changeType: 'renamed', statChanges: [{ field: 'cost', oldValue: 1, newValue: 3 }, { field: 'power', oldValue: 1, newValue: 3 }, { field: 'defense', oldValue: 2, newValue: 3 }], severity: 'significant' },
      { cardId: 'jacks_giant', newCardId: 'jacks_giant', name: "Jack's Giant", formerName: 'Giant', changeType: 'renamed', statChanges: [{ field: 'cost', oldValue: 6, newValue: 7 }, { field: 'power', oldValue: 7, newValue: 8 }, { field: 'defense', oldValue: 7, newValue: 8 }] },
      // Modified cards (with manual severity overrides)
      { cardId: 'axe_throw', name: 'Axe Throw', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 3, newValue: 2 }] },
      { cardId: 'beast', name: 'Beast', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 3 }, { field: 'power', oldValue: 3, newValue: 2 }, { field: 'defense', oldValue: 4, newValue: 3 }] },
      { cardId: 'beauty', name: 'Beauty', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 3, newValue: 4 }] },
      { cardId: 'blow_the_house_down', name: 'Blow the House Down', changeType: 'modified', severity: 'some' },
      { cardId: 'bridge_troll', name: 'Bridge Troll', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 1, newValue: 4 }, { field: 'defense', oldValue: 5, newValue: 6 }], severity: 'some' },
      { cardId: 'bullseye', name: 'Bullseye', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 2, newValue: 1 }] },
      { cardId: 'cheshire', name: 'Cheshire', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 3 }, { field: 'defense', oldValue: 4, newValue: 2 }] },
      { cardId: 'cowardly_lion', name: 'Cowardly Lion', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 4, newValue: 2 }, { field: 'defense', oldValue: 4, newValue: 5 }], severity: 'significant' },
      { cardId: 'dark_omen', name: 'Dark Omen', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 3 }] },
      { cardId: 'flying_monkey', name: 'Flying Monkey', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 3, newValue: 2 }], severity: 'some' },
      { cardId: 'jack_in_the_box', name: 'Jack in the Box', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 3, newValue: 2 }] },
      { cardId: 'lady_of_the_lake', name: 'Lady of the Lake', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 2 }, { field: 'power', oldValue: 3, newValue: 2 }, { field: 'defense', oldValue: 4, newValue: 2 }] },
      { cardId: 'lancelot', name: 'Sir Lancelot', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 3, newValue: 2 }], severity: 'some' },
      { cardId: 'morgiana', name: 'Morgiana', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 1, newValue: 2 }, { field: 'defense', oldValue: 4, newValue: 2 }], severity: 'some' },
      { cardId: 'mummy', name: 'Mummy', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 3, newValue: 1 }, { field: 'power', oldValue: 3, newValue: 1 }] },
      { cardId: 'phantom_coachman', name: 'Phantom Coachman', changeType: 'modified', severity: 'significant' },
      { cardId: 'quasimodo', name: 'Quasimodo', changeType: 'modified', statChanges: [{ field: 'defense', oldValue: 3, newValue: 4 }], severity: 'some' },
      { cardId: 'rain_of_arrows', name: 'Rain of Arrows', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 5 }] },
      { cardId: 'red', name: 'Red', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 3, newValue: 5 }, { field: 'power', oldValue: 4, newValue: 5 }, { field: 'defense', oldValue: 3, newValue: 4 }] },
      { cardId: 'red_cap', name: 'Redcap', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 5, newValue: 4 }], severity: 'some' },
      { cardId: 'robinhood', name: 'Robin Hood', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 5, newValue: 7 }] },
      { cardId: 'searing_light', name: 'Searing Light', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 0, newValue: 1 }] },
      { cardId: 'sheriff_of_nottingham', name: 'Sheriff of Nottingham', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 3, newValue: 2 }], severity: 'some' },
      { cardId: 'three_musketeers', name: 'Three Musketeers', changeType: 'modified', severity: 'significant' },
      { cardId: 'tin_woodman', name: 'Tin Woodman', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 2 }, { field: 'power', oldValue: 3, newValue: 2 }, { field: 'defense', oldValue: 5, newValue: 1 }] },
    ],
    newCards: [
      { cardId: 'animated_broomstick', name: 'Animated Broomstick' },
      { cardId: 'babe_the_blue_ox', name: 'Babe the Blue Ox' },
      { cardId: 'baby_bear', name: 'Baby Bear' },
      { cardId: 'bagheera', name: 'Bagheera' },
      { cardId: 'baker', name: 'Baker' },
      { cardId: 'bigfoot', name: 'Bigfoot' },
      { cardId: 'brandy', name: 'Brandy' },
      { cardId: 'butcher', name: 'Butcher' },
      { cardId: 'cake', name: 'Cake' },
      { cardId: 'captain_ahab', name: 'Captain Ahab' },
      { cardId: 'chimera', name: 'Chimera' },
      { cardId: 'drop_bear', name: 'Drop Bear' },
      { cardId: 'first_aid', name: 'First Aid' },
      { cardId: 'flying_dutchman', name: 'Flying Dutchman' },
      { cardId: 'hare', name: 'Hare' },
      { cardId: 'huck_finn', name: 'Huck Finn' },
      { cardId: 'impundulu', name: 'Impundulu' },
      { cardId: 'koschei', name: 'Koschei' },
      { cardId: 'mary', name: 'Mary' },
      { cardId: 'momotaro', name: 'Momotaro' },
      { cardId: 'morgan_le_fay', name: 'Morgan le Fay' },
      { cardId: 'mortal_coil', name: 'Mortal Coil' },
      { cardId: 'mothman', name: 'Mothman' },
      { cardId: 'obliterate', name: 'Obliterate' },
      { cardId: 'piglet', name: 'Piglet' },
      { cardId: 'popeye', name: 'Popeye' },
      { cardId: 'run_over', name: 'Run Over' },
      { cardId: 'sandman', name: 'Sandman' },
      { cardId: 'shahrazad', name: 'Shahrazad' },
      { cardId: 'sinbad', name: 'Sinbad' },
      { cardId: 'thumbelina', name: 'Thumbelina' },
      { cardId: 'tinker_bell', name: 'Tinker Bell' },
      { cardId: 'tortoise', name: 'Tortoise' },
      { cardId: 'wicked_stepmother', name: 'Wicked Stepmother' },
      { cardId: 'winnie_the_pooh', name: 'Winnie the Pooh' },
      { cardId: 'yuki_onna', name: 'Yuki-onna' },
    ],
    removedCards: [
      { cardId: 'tin_soldier', name: 'Tin Soldier' },
      { cardId: 'ogre', name: 'Ogre' },
    ],
    legendaryChanges: [
      { cardId: 'goldi', name: 'Goldilocks', becameLegendary: true },
      { cardId: 'the_kraken', name: 'The Kraken', becameLegendary: false },
    ],
  },
  'gdc-2026': {
    patchId: 'gdc-2026',
    displayName: 'GDC 2026',
    cardUpdates: [],
    newCards: [],
    removedCards: [],
    legendaryChanges: [],
  },
}
