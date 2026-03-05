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
 * Last generated: 2026-03-05
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
 * Pre-computed patch notes for all patches
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
      // Legendary status changes
      { cardId: 'goldi', name: 'Goldilocks', changeType: 'modified', statChanges: [{ field: 'legendary', oldValue: false, newValue: true }] },
      { cardId: 'the_kraken', name: 'The Kraken', changeType: 'modified', statChanges: [{ field: 'legendary', oldValue: true, newValue: false }] },
    ],
    newCards: [
      { cardId: 'cerberus', name: 'Cerberus' },
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
      { cardId: 'hercules', name: 'Hercules' },
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
    legendaryChanges: [],
  },
  'gdc-2026': {
    patchId: 'gdc-2026',
    displayName: 'GDC 2026',
    cardUpdates: [
      // Stat changes and manual overrides (alphabetical, before renames)
      { cardId: 'babe', newCardId: 'babe', name: 'Babe', formerName: 'Babe the Blue Ox', changeType: 'renamed', severity: 'some' },
      { cardId: 'bigfoot', name: 'Bigfoot', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 5, newValue: 6 }] },
      { cardId: 'billy', name: 'Billy', changeType: 'modified', severity: 'some' },
      { cardId: 'card_soldier', name: 'Card Soldier', changeType: 'modified', statChanges: [{ field: 'defense', oldValue: 2, newValue: 1 }] },
      { cardId: 'franks_monster', name: "Frank's Monster", changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 2, newValue: 6 }, { field: 'power', oldValue: 4, newValue: 5 }] },
      { cardId: 'glinda', name: 'Glinda', changeType: 'modified', severity: 'significant' },
      { cardId: 'guy_of_gisborne', name: 'Guy of Gisborne', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 2, newValue: 6 }, { field: 'power', oldValue: 2, newValue: 4 }, { field: 'defense', oldValue: 2, newValue: 5 }], severity: 'significant' },
      { cardId: 'jekyll', name: 'Dr. Jekyll', changeType: 'modified', statChanges: [{ field: 'defense', oldValue: 6, newValue: 5 }], severity: 'significant' },
      { cardId: 'king_arthur', name: 'King Arthur', changeType: 'modified', severity: 'significant' },
      { cardId: 'marian', name: 'Maid Marian', changeType: 'modified', severity: 'some' },
      { cardId: 'mary', name: 'Mary', changeType: 'modified', severity: 'some' },
      { cardId: 'morgan_le_fay', name: 'Morgan le Fay', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 4, newValue: 2 }, { field: 'power', oldValue: 4, newValue: 1 }, { field: 'defense', oldValue: 4, newValue: 3 }], severity: 'significant' },
      { cardId: 'moriarty', name: 'Professor Moriarty', changeType: 'modified', severity: 'some' },
      { cardId: 'mowgli', name: 'Mowgli', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 6, newValue: 5 }] },
      { cardId: 'pegasus', name: 'Pegasus', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 2, newValue: 5 }, { field: 'power', oldValue: 1, newValue: 2 }, { field: 'defense', oldValue: 3, newValue: 5 }] },
      { cardId: 'phantom_coachman', name: 'Phantom Coachman', changeType: 'modified', statChanges: [{ field: 'power', oldValue: 5, newValue: 8 }, { field: 'defense', oldValue: 5, newValue: 8 }], severity: 'significant' },
      { cardId: 'quasimodo', name: 'Quasimodo', changeType: 'modified', statChanges: [{ field: 'defense', oldValue: 4, newValue: 3 }] },
      { cardId: 'robinhood', name: 'Robin Hood', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 7, newValue: 8 }], severity: 'significant' },
      { cardId: 'soul_surge', name: 'Soul Surge', changeType: 'modified', severity: 'some' },
      { cardId: 'the_white_queen', name: 'White Queen', changeType: 'modified', statChanges: [{ field: 'cost', oldValue: 2, newValue: 4 }] },
      // Renames without stat changes (at the end)
      { cardId: 'asanbosam', newCardId: 'asanbosam', name: 'Asanbosam', formerName: 'Stryga', changeType: 'renamed' },
      { cardId: 'el_charro_negro', newCardId: 'el_charro_negro', name: 'El Charro Negro', formerName: 'Zorro', changeType: 'renamed' },
      { cardId: 'mind_palace', newCardId: 'mind_palace', name: 'Mind Palace', formerName: 'Concentrate', changeType: 'renamed' },
      { cardId: 'sleeping_beauty', newCardId: 'sleeping_beauty', name: 'Sleeping Beauty', formerName: 'Princess Aurora', changeType: 'renamed' },
      { cardId: 'stormalong', newCardId: 'stormalong', name: 'Stormalong', formerName: 'Popeye', changeType: 'renamed' },
      { cardId: 'the_firebird', newCardId: 'the_firebird', name: 'The Firebird', formerName: 'Ali Baba', changeType: 'renamed' },
    ],
    newCards: [
      { cardId: 'aladdin', name: 'Aladdin' },
      { cardId: 'beowulf', name: 'Beowulf' },
      { cardId: 'boogeyman', name: 'Boogeyman' },
      { cardId: 'cockatrice', name: 'Cockatrice' },
      { cardId: 'humpty', name: 'Humpty' },
      { cardId: 'poison_apple', name: 'Poison Apple' },
      { cardId: 'queen_of_hearts', name: 'Queen of Hearts' },
      { cardId: 'queen_of_the_night', name: 'Queen of the Night' },
      { cardId: 'stroke_of_midnight', name: 'Stroke of Midnight' },
      { cardId: 'toto', name: 'Toto' },
    ],
    removedCards: [
      { cardId: 'animated_broomstick', name: 'Animated Broomstick' },
      { cardId: 'baker', name: 'Baker' },
      { cardId: 'blow_the_house_down', name: 'Blow the House Down' },
      { cardId: 'brandy', name: 'Brandy' },
      { cardId: 'cake', name: 'Cake' },
      { cardId: 'cerberus', name: 'Cerberus' },
      { cardId: 'chimera', name: 'Chimera' },
      { cardId: 'dr_frank', name: 'Dr. Frankenstein' },
      { cardId: 'drop_bear', name: 'Drop Bear' },
      { cardId: 'flying_dutchman', name: 'The Flying Dutchman' },
      { cardId: 'goldi', name: 'Goldilocks' },
      { cardId: 'headless_horseman', name: 'Headless Horseman' },
      { cardId: 'hercules', name: 'Hercules' },
      
      { cardId: 'impundulu', name: 'Impundulu' },
      { cardId: 'jack', name: 'Jack' },
      { cardId: 'merlin', name: 'Merlin' },
      { cardId: 'momotaro', name: 'Momotaro' },
      { cardId: 'mortal_coil', name: 'Mortal Coil' },
      { cardId: 'morgiana', name: 'Morgiana' },
      { cardId: 'musketeer', name: 'Musketeer' },
      { cardId: 'red_cap', name: 'Redcap' },
      { cardId: 'scorpion', name: 'Scorpion' },
      { cardId: 'sea_witch', name: 'Sea Witch' },
      { cardId: 'sherlock', name: 'Sherlock Holmes' },
      { cardId: 'sinbad', name: 'Sinbad' },
      { cardId: 'siren', name: 'Siren' },
      { cardId: 'snow_white', name: 'Snow White' },
      
      { cardId: 'the_kraken', name: 'The Kraken' },
      { cardId: 'tinker_bell', name: 'Tinker Bell' },
      { cardId: 'trojan_horse', name: 'Trojan Horse' },
      { cardId: 'underworld_flare', name: 'Underworld Flare' },
      { cardId: 'watson', name: 'Watson' },
      { cardId: 'wukong', name: 'Sun Wukong' },
      { cardId: 'yuki_onna', name: 'Yuki-onna' },
    ],
    legendaryChanges: [
      { cardId: 'wicked_stepmother', name: 'Wicked Stepmother', becameLegendary: true },
    ],
  },
}
